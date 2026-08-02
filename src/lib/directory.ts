import generated from "@/data/directory.generated.json";
import { profiles as seedProfiles } from "@/data/profiles";
import {
  normalizeGithubProfileUrl,
  normalizeGithubRepoUrl,
  normalizeHttpsUrl,
} from "@/lib/urls";

export type DirectoryProject = {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  liveUrl?: string;
  languages: string[];
  category: string;
  location: string;
};

export type DirectoryParticipant = {
  slug: string;
  name: string;
  github: string;
  githubUrl: string;
  avatarUrl?: string;
  bio: string;
  campus: string;
  technologies: string[];
  projects: DirectoryProject[];
  photoGradient: string;
};

type RawParticipant = {
  slug?: string;
  name?: string;
  github?: string;
  avatarUrl?: string;
  bio?: string;
  campus?: string;
  technologies?: string[];
  projects?: Array<{
    id?: string;
    name?: string;
    description?: string;
    repoUrl?: string;
    liveUrl?: string;
    languages?: string[];
    category?: string;
    location?: string;
  }>;
  photoGradient?: string;
};

function sanitizeText(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  // Strip any accidental HTML-like tags from external text (never render as HTML).
  return value.replace(/<[^>]*>/g, "").trim() || fallback;
}

function sanitizeProject(raw: NonNullable<RawParticipant["projects"]>[number], github: string): DirectoryProject | null {
  const name = sanitizeText(raw.name);
  if (!name) return null;
  const repoUrl = normalizeGithubRepoUrl(raw.repoUrl);
  if (!repoUrl) return null;
  const liveUrl = normalizeHttpsUrl(raw.liveUrl) || undefined;
  const languages = Array.isArray(raw.languages)
    ? raw.languages.map((l) => sanitizeText(l)).filter(Boolean).slice(0, 12)
    : [];
  const category = sanitizeText(raw.category, "repo") || "repo";
  const location =
    sanitizeText(raw.location) ||
    (liveUrl ? safeHostname(liveUrl) : `github.com/${github}/${name}`);

  return {
    id: sanitizeText(raw.id, `${github}-${name}`.toLowerCase()),
    name,
    description: sanitizeText(raw.description, "No description provided."),
    repoUrl,
    liveUrl,
    languages,
    category,
    location,
  };
}

function safeHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Live site";
  }
}

function normalizeParticipant(raw: RawParticipant): DirectoryParticipant | null {
  const github = sanitizeText(raw.github).replace(/^@/, "");
  const githubUrl = normalizeGithubProfileUrl(github);
  if (!github || !githubUrl) return null;

  const slug = sanitizeText(raw.slug) || github.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const name = sanitizeText(raw.name, github);
  const projects = (raw.projects || [])
    .map((p) => sanitizeProject(p, github))
    .filter((p): p is DirectoryProject => Boolean(p));

  // Deduplicate projects by repoUrl
  const seen = new Set<string>();
  const uniqueProjects: DirectoryProject[] = [];
  for (const project of projects) {
    if (seen.has(project.repoUrl)) continue;
    seen.add(project.repoUrl);
    uniqueProjects.push(project);
  }

  const technologies = Array.from(
    new Set([
      ...(Array.isArray(raw.technologies)
        ? raw.technologies.map((t) => sanitizeText(t)).filter(Boolean)
        : []),
      ...uniqueProjects.flatMap((p) => p.languages),
    ]),
  ).slice(0, 24);

  return {
    slug,
    name,
    github,
    githubUrl,
    avatarUrl: normalizeHttpsUrl(raw.avatarUrl) || undefined,
    bio: sanitizeText(raw.bio, `${name} — Hult Cohort builder (@${github}).`),
    campus: sanitizeText(raw.campus, "TBD"),
    technologies,
    projects: uniqueProjects,
    photoGradient:
      sanitizeText(raw.photoGradient) ||
      "linear-gradient(135deg, #f7b6c8 0%, #f3d9a4 45%, #9fd6c2 100%)",
  };
}

/** Attach curated https live URLs from seed profiles when GitHub homepage is missing. */
function enrichWithSeed(participant: DirectoryParticipant): DirectoryParticipant {
  const seed = seedProfiles.find(
    (p) => p.github.toLowerCase() === participant.github.toLowerCase(),
  );
  if (!seed) return participant;

  const liveFromSeed = (seed.homepageUrls || [])
    .map((u) => normalizeHttpsUrl(u))
    .filter((u): u is string => Boolean(u));

  if (!liveFromSeed.length) return participant;

  const projects = participant.projects.map((project) => {
    if (project.liveUrl) return project;
    // Heuristic: match seed live URL hostname fragment to project name
    const match = liveFromSeed.find((url) => {
      const host = safeHostname(url).toLowerCase();
      const name = project.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      return name && host.includes(name.slice(0, Math.min(6, name.length)));
    });
    if (!match) return project;
    return {
      ...project,
      liveUrl: match,
      location: safeHostname(match),
      category: project.category === "repo" ? "showcase" : project.category,
    };
  });

  // Add curated live projects that still have no repo match (as showcase cards)
  const existingLives = new Set(projects.map((p) => p.liveUrl).filter(Boolean));
  for (const live of liveFromSeed) {
    if (existingLives.has(live)) continue;
    const seedLive = seed.portfolio.find((p) => normalizeHttpsUrl(p.href) === live);
    const label = seedLive?.label || safeHostname(live);
    const relatedRepo =
      seed.portfolio
        .map((p) => ({ ...p, href: normalizeGithubRepoUrl(p.href) }))
        .find((p) => p.kind === "repo" && p.href)?.href ||
      projects[0]?.repoUrl ||
      null;
    if (!relatedRepo) continue;
    projects.push({
      id: `${participant.github}-live-${safeHostname(live)}`.toLowerCase(),
      name: label,
      description: sanitizeText(seed.bio, "Live cohort project."),
      repoUrl: relatedRepo,
      liveUrl: live,
      languages: participant.technologies.slice(0, 4),
      category: seedLive?.kind === "pm" || seedLive?.kind === "comms" ? seedLive.kind : "showcase",
      location: safeHostname(live),
    });
  }

  return { ...participant, projects };
}

export function getDirectoryParticipants(): DirectoryParticipant[] {
  const rawList = (generated as { participants?: RawParticipant[] }).participants || [];
  const byGithub = new Map<string, DirectoryParticipant>();

  for (const raw of rawList) {
    const normalized = normalizeParticipant(raw);
    if (!normalized) continue;
    const key = normalized.github.toLowerCase();
    if (byGithub.has(key)) continue; // validation: remove duplicate participants
    byGithub.set(key, enrichWithSeed(normalized));
  }

  return [...byGithub.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getDirectoryParticipant(slug: string): DirectoryParticipant | null {
  return getDirectoryParticipants().find((p) => p.slug === slug) || null;
}

export function getDirectoryFilterOptions(participants: DirectoryParticipant[]) {
  const technologies = new Set<string>();
  const categories = new Set<string>();
  for (const p of participants) {
    p.technologies.forEach((t) => technologies.add(t));
    p.projects.forEach((proj) => {
      if (proj.category) categories.add(proj.category);
      proj.languages.forEach((l) => technologies.add(l));
    });
  }
  return {
    technologies: [...technologies].sort((a, b) => a.localeCompare(b)),
    categories: [...categories].sort((a, b) => a.localeCompare(b)),
  };
}

export function filterDirectoryParticipants(
  participants: DirectoryParticipant[],
  query: {
    search?: string;
    technology?: string;
    category?: string;
  },
): DirectoryParticipant[] {
  const search = (query.search || "").trim().toLowerCase();
  const technology = (query.technology || "").trim().toLowerCase();
  const category = (query.category || "").trim().toLowerCase();

  return participants.filter((p) => {
    if (technology) {
      const hay = [
        ...p.technologies,
        ...p.projects.flatMap((proj) => proj.languages),
      ].map((t) => t.toLowerCase());
      if (!hay.includes(technology)) return false;
    }
    if (category) {
      if (!p.projects.some((proj) => proj.category.toLowerCase() === category)) return false;
    }
    if (!search) return true;
    const blob = [
      p.name,
      p.github,
      p.bio,
      p.campus,
      ...p.technologies,
      ...p.projects.flatMap((proj) => [
        proj.name,
        proj.description,
        proj.location,
        ...proj.languages,
        proj.category,
      ]),
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(search);
  });
}
