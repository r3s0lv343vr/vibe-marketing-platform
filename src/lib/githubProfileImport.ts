import type { CohortProfile } from "@/data/profiles";
import {
  cryptoRandomId,
  emptyProfile,
  type StudentProfile,
  type StudentProject,
} from "@/lib/profile";
import { getRoster } from "@/lib/roster";
import { normalizeGithubHandle } from "@/lib/githubHandle";
import { normalizeHttpsUrl } from "@/lib/urls";

export type GithubImportResult = {
  handle: string;
  name: string;
  fromRoster: boolean;
  profile: StudentProfile;
  source: "roster" | "github-api" | "merged";
};

export function getRosterByGithub(handle: string): CohortProfile | undefined {
  const key = handle.toLowerCase();
  return getRoster().find((p) => p.github.toLowerCase() === key);
}

/** Map a roster / directory cohort row into Profile Builder fields. */
export function studentProfileFromRoster(row: CohortProfile): StudentProfile {
  const projects = projectsFromRoster(row);
  return {
    ...emptyProfile(row.name),
    displayName: row.name,
    bio: row.bio || "",
    universities: row.campus && row.campus !== "TBD" ? [row.campus] : [],
    skills: row.skills || [],
    avatarDataUrl: row.avatarUrl || "",
    projects: projects.length
      ? projects
      : [
          {
            id: cryptoRandomId(),
            title: "",
            websiteUrl: "",
            githubUrl: `https://github.com/${row.github}`,
            imageDataUrl: "",
          },
        ],
    updatedAt: new Date().toISOString(),
  };
}

function projectsFromRoster(row: CohortProfile): StudentProject[] {
  const projects: StudentProject[] = [];
  const seen = new Set<string>();

  for (const href of row.homepageUrls || []) {
    const live = normalizeHttpsUrl(href);
    if (!live || isGithubHost(live)) continue;
    const key = `live:${live}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const label =
      row.portfolio.find((p) => p.href === live)?.label || hostnameLabel(live);
    projects.push({
      id: cryptoRandomId(),
      title: label,
      websiteUrl: live,
      githubUrl: "",
      imageDataUrl: "",
    });
  }

  for (const item of row.portfolio) {
    if (item.kind === "pr") continue;
    const href = normalizeHttpsUrl(item.href);
    if (!href) continue;
    if (isGithubHost(href)) {
      const key = `repo:${href}`;
      if (seen.has(key)) continue;
      seen.add(key);
      // Prefer attaching repo URL onto an existing live project with same name prefix
      const match = projects.find(
        (p) => !p.githubUrl && p.title.toLowerCase().includes(item.label.toLowerCase().slice(0, 12)),
      );
      if (match) {
        match.githubUrl = href;
      } else {
        projects.push({
          id: cryptoRandomId(),
          title: item.label,
          websiteUrl: "",
          githubUrl: href,
          imageDataUrl: "",
        });
      }
    } else {
      const key = `live:${href}`;
      if (seen.has(key)) continue;
      seen.add(key);
      projects.push({
        id: cryptoRandomId(),
        title: item.label,
        websiteUrl: href,
        githubUrl: "",
        imageDataUrl: "",
      });
    }
  }

  return projects.slice(0, 8);
}

/**
 * Download public GitHub profile + repos for Profile Builder
 * (same data path as `npm run import:roster`, single-user, runtime-safe).
 */
export async function downloadGithubStudentProfile(
  rawHandle: string,
): Promise<GithubImportResult> {
  const handle = normalizeGithubHandle(rawHandle);
  if (!handle) {
    throw new Error("Enter a valid GitHub handle.");
  }

  const roster = getRosterByGithub(handle);
  let apiDraft: StudentProfile | null = null;
  let apiName: string | null = null;

  try {
    apiDraft = await fetchGithubApiDraft(handle);
    apiName = apiDraft.displayName;
  } catch {
    // Public API can rate-limit; fall back to roster when available.
  }

  if (roster && apiDraft) {
    return {
      handle,
      name: roster.name || apiName || handle,
      fromRoster: true,
      source: "merged",
      profile: mergeStudentProfiles(studentProfileFromRoster(roster), apiDraft),
    };
  }

  if (roster) {
    return {
      handle,
      name: roster.name,
      fromRoster: true,
      source: "roster",
      profile: studentProfileFromRoster(roster),
    };
  }

  if (apiDraft) {
    return {
      handle,
      name: apiDraft.displayName || handle,
      fromRoster: false,
      source: "github-api",
      profile: apiDraft,
    };
  }

  throw new Error(
    `Could not load @${handle} from GitHub. Check the handle and try again.`,
  );
}

async function fetchGithubApiDraft(handle: string): Promise<StudentProfile> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "pixie-dust-cheesecake-student-import",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(handle)}`, {
    headers,
    cache: "no-store",
  });
  if (userRes.status === 404) {
    throw new Error(`GitHub user @${handle} was not found.`);
  }
  if (!userRes.ok) {
    throw new Error(`GitHub lookup failed (${userRes.status}).`);
  }
  const user = (await userRes.json()) as {
    login?: string;
    name?: string | null;
    bio?: string | null;
    avatar_url?: string;
    blog?: string | null;
    company?: string | null;
    location?: string | null;
  };

  const reposRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(handle)}/repos?per_page=100&sort=updated&type=owner`,
    { headers, cache: "no-store" },
  );
  const repos = reposRes.ok
    ? ((await reposRes.json()) as Array<{
        name: string;
        description?: string | null;
        html_url: string;
        homepage?: string | null;
        language?: string | null;
        fork?: boolean;
        archived?: boolean;
        updated_at?: string;
      }>)
    : [];

  const own = repos.filter((r) => !r.fork && !r.archived);
  const ranked = [...own].sort((a, b) => {
    const ah = liveHomepage(a.homepage) ? 1 : 0;
    const bh = liveHomepage(b.homepage) ? 1 : 0;
    if (ah !== bh) return bh - ah;
    return (
      new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
    );
  });

  const skills = new Set<string>();
  const projects: StudentProject[] = [];
  const blog = liveHomepage(user.blog);
  if (blog) {
    projects.push({
      id: cryptoRandomId(),
      title: hostnameLabel(blog),
      websiteUrl: blog,
      githubUrl: `https://github.com/${handle}`,
      imageDataUrl: "",
    });
  }

  for (const repo of ranked.slice(0, 8)) {
    if (repo.language) skills.add(repo.language);
    const live = liveHomepage(repo.homepage);
    projects.push({
      id: cryptoRandomId(),
      title: repo.name,
      websiteUrl: live || "",
      githubUrl: normalizeHttpsUrl(repo.html_url) || `https://github.com/${handle}/${repo.name}`,
      imageDataUrl: "",
    });
  }

  const displayName = (user.name || handle).trim();
  const uniHints: string[] = [];
  if (user.company?.trim()) uniHints.push(user.company.trim());
  if (user.location?.trim()) uniHints.push(user.location.trim());

  return {
    displayName,
    bio:
      (user.bio || "").trim() ||
      `${displayName} — Hult Cohort builder (@${handle}).`,
    universities: uniHints.slice(0, 3),
    skills: [...skills].slice(0, 12),
    avatarDataUrl: user.avatar_url || `https://avatars.githubusercontent.com/${handle}`,
    projects: projects.length
      ? projects
      : [
          {
            id: cryptoRandomId(),
            title: "GitHub profile",
            websiteUrl: "",
            githubUrl: `https://github.com/${handle}`,
            imageDataUrl: "",
          },
        ],
    updatedAt: new Date().toISOString(),
  };
}

function mergeStudentProfiles(base: StudentProfile, incoming: StudentProfile): StudentProfile {
  return {
    displayName: base.displayName || incoming.displayName,
    bio: base.bio.length >= incoming.bio.length ? base.bio : incoming.bio,
    universities: uniqueNonEmpty([...base.universities, ...incoming.universities]),
    skills: uniqueNonEmpty([...base.skills, ...incoming.skills]),
    avatarDataUrl: base.avatarDataUrl || incoming.avatarDataUrl,
    projects: mergeProjects(base.projects, incoming.projects),
    updatedAt: new Date().toISOString(),
  };
}

function mergeProjects(a: StudentProject[], b: StudentProject[]): StudentProject[] {
  const out: StudentProject[] = [];
  const seen = new Set<string>();
  for (const project of [...a, ...b]) {
    const key = `${project.githubUrl}|${project.websiteUrl}|${project.title}`.toLowerCase();
    if (!project.title && !project.githubUrl && !project.websiteUrl) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...project, id: project.id || cryptoRandomId() });
  }
  return out.slice(0, 8);
}

function uniqueNonEmpty(values: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(trimmed);
  }
  return out;
}

function liveHomepage(raw: unknown): string | null {
  const https = normalizeHttpsUrl(raw);
  if (!https || isGithubHost(https)) return null;
  return https;
}

function isGithubHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "") === "github.com";
  } catch {
    return url.includes("github.com");
  }
}

function hostnameLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
