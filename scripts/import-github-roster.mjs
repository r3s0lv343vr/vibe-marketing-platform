#!/usr/bin/env node
/**
 * Bulk-import cohort builders from GitHub handles for the Partners directory.
 *
 * Fetches (server-side only — never expose tokens to the client):
 * - display name + avatar
 * - public repos (non-fork), descriptions, languages
 * - production / Vercel homepage URLs
 * - optional cohort PR URLs
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx node scripts/import-github-roster.mjs data/handles.txt --write
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const COHORT_REPO =
  process.env.COHORT_REPO || "rogerSuperBuilderAlpha/hult-cohort-program";
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const args = process.argv.slice(2);
const write = args.includes("--write");
const inputPath = args.find((a) => !a.startsWith("--"));

if (!inputPath) {
  console.error(
    "Usage: node scripts/import-github-roster.mjs <handles.txt|csv> [--write]",
  );
  process.exit(1);
}

const gradients = [
  "linear-gradient(135deg, #f7b6c8 0%, #f3d9a4 45%, #9fd6c2 100%)",
  "linear-gradient(140deg, #f8c8d8 0%, #ffe8c8 50%, #d8f0e8 100%)",
  "linear-gradient(145deg, #cfe8de 0%, #f7d7b8 55%, #f2b7c8 100%)",
  "linear-gradient(160deg, #f3d9a4 0%, #f7b6c8 40%, #b8d4f0 100%)",
];

function parseHandles(raw) {
  const seen = new Set();
  const rows = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [githubRaw, name = "", campus = ""] = trimmed
      .split(",")
      .map((s) => s.trim());
    const github = githubRaw
      .replace(/^@/, "")
      .replace(/https?:\/\/github\.com\//i, "")
      .replace(/\/$/, "")
      .split("/")[0];
    const key = github.toLowerCase();
    if (!github || seen.has(key)) continue;
    seen.add(key);
    rows.push({ github, name, campus });
  }
  return rows;
}

async function gh(path, query = "") {
  const url = `https://api.github.com${path}${query}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "pixie-dust-cheesecake-roster-import",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${path}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

/** Only accept safe https URLs; reject malformed / javascript: / data: etc. */
function normalizeHttpsUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  let value = raw.trim();
  if (!value) return null;
  if (value.startsWith("//")) value = `https:${value}`;
  if (/^http:\/\//i.test(value)) value = value.replace(/^http:/i, "https:");
  if (!/^https:\/\//i.test(value)) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "https:") return null;
    if (!u.hostname || u.hostname.includes(" ")) return null;
    // strip credentials if present
    u.username = "";
    u.password = "";
    return u.toString().replace(/\/$/, "") === `${u.origin}${u.pathname}`.replace(/\/$/, "")
      ? u.toString()
      : u.toString();
  } catch {
    return null;
  }
}

function normalizeGithubRepoUrl(raw, fallbackOwner, fallbackRepo) {
  const https = normalizeHttpsUrl(raw);
  if (https) {
    try {
      const u = new URL(https);
      if (u.hostname !== "github.com") return null;
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length < 2) return null;
      return `https://github.com/${parts[0]}/${parts[1]}`;
    } catch {
      return null;
    }
  }
  if (fallbackOwner && fallbackRepo) {
    return `https://github.com/${fallbackOwner}/${fallbackRepo}`;
  }
  return null;
}

function isLiveHomepage(url) {
  const https = normalizeHttpsUrl(url);
  if (!https) return null;
  try {
    const u = new URL(https);
    if (u.hostname === "github.com") return null;
    return https;
  } catch {
    return null;
  }
}

function slugify(handle) {
  return handle.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

function inferCategory(repo, liveUrl) {
  const blob = `${repo.name} ${repo.description || ""} ${liveUrl || ""}`.toLowerCase();
  if (blob.includes("pm") || blob.includes("ticket") || blob.includes("forth")) return "pm";
  if (blob.includes("comms") || blob.includes("chat") || blob.includes("lnq")) return "comms";
  if (blob.includes("showcase") || blob.includes("portfolio") || blob.includes("marketing"))
    return "showcase";
  if (liveUrl) return "showcase";
  return "repo";
}

async function importOne({ github, name, campus }, index) {
  const user = await gh(`/users/${encodeURIComponent(github)}`);
  const repos = await gh(
    `/users/${encodeURIComponent(github)}/repos?per_page=100&sort=updated&type=owner`,
  );

  let prUrls = [];
  try {
    const q = encodeURIComponent(`type:pr author:${github} repo:${COHORT_REPO}`);
    const prSearch = await gh(`/search/issues?q=${q}&per_page=5`);
    prUrls = (prSearch.items || [])
      .map((item) => normalizeHttpsUrl(item.html_url))
      .filter(Boolean);
  } catch (err) {
    console.warn(`PR search skipped for ${github}:`, err.message);
  }

  const ownRepos = (repos || []).filter((repo) => !repo.fork && !repo.archived);
  // Prefer repos with a homepage (often Vercel), then recently updated
  const ranked = [...ownRepos].sort((a, b) => {
    const ah = isLiveHomepage(a.homepage) ? 1 : 0;
    const bh = isLiveHomepage(b.homepage) ? 1 : 0;
    if (ah !== bh) return bh - ah;
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  const featured = ranked.slice(0, 8);
  const projects = [];
  const techSet = new Set();
  const homepageUrls = [];
  const portfolio = [];

  const blog = isLiveHomepage(user.blog);
  if (blog) homepageUrls.push(blog);

  for (const repo of featured) {
    const repoUrl = normalizeGithubRepoUrl(repo.html_url, github, repo.name);
    if (!repoUrl) continue;

    let languages = [];
    if (repo.language) languages.push(repo.language);
    try {
      const langMap = await gh(
        `/repos/${encodeURIComponent(github)}/${encodeURIComponent(repo.name)}/languages`,
      );
      languages = Object.keys(langMap || {}).slice(0, 8);
      await new Promise((r) => setTimeout(r, 80));
    } catch {
      // keep primary language only
    }
    for (const lang of languages) techSet.add(lang);

    const liveUrl = isLiveHomepage(repo.homepage);
    if (liveUrl) homepageUrls.push(liveUrl);

    const category = inferCategory(repo, liveUrl);
    const description = (repo.description || "").trim() || "No description provided.";

    projects.push({
      id: `${github}-${repo.name}`.toLowerCase(),
      name: repo.name,
      description,
      repoUrl,
      liveUrl: liveUrl || undefined,
      languages,
      category,
      location: liveUrl
        ? new URL(liveUrl).hostname
        : `github.com/${github}/${repo.name}`,
    });

    portfolio.push({
      label: repo.name,
      href: repoUrl,
      kind: "repo",
    });
    if (liveUrl) {
      portfolio.push({
        label: `${repo.name} · live`,
        href: liveUrl,
        kind: category === "repo" ? "showcase" : category,
      });
    }
  }

  for (const pr of prUrls) {
    portfolio.push({
      label: "Cohort submission PR",
      href: pr,
      kind: "pr",
    });
  }

  const uniqueHomes = [...new Set(homepageUrls.map(normalizeHttpsUrl).filter(Boolean))];
  const uniquePortfolio = [];
  const seen = new Set();
  for (const item of portfolio) {
    const href = normalizeHttpsUrl(item.href);
    if (!href) continue;
    const key = `${item.kind}:${href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniquePortfolio.push({ ...item, href });
  }

  const displayName = (name || user.name || github).trim();
  const bio =
    (user.bio || "").trim() ||
    `${displayName} — Hult Cohort builder (@${github}).`;

  return {
    slug: slugify(github),
    name: displayName,
    github,
    campus: campus || user.location || "TBD",
    role: "Builder",
    skills: [...techSet].slice(0, 16),
    bio,
    public: true,
    avatarUrl: normalizeHttpsUrl(user.avatar_url) || undefined,
    photoGradient: gradients[index % gradients.length],
    homepageUrls: uniqueHomes,
    prUrls,
    portfolio: uniquePortfolio.slice(0, 20),
    projects,
    technologies: [...techSet].slice(0, 16),
    highlight: uniqueHomes[0] ? `Live: ${uniqueHomes[0]}` : undefined,
  };
}

const handles = parseHandles(readFileSync(resolve(root, inputPath), "utf8"));
if (!handles.length) {
  console.error("No handles found in input file.");
  process.exit(1);
}

if (!token) {
  console.warn(
    "Warning: no GITHUB_TOKEN set — unauthenticated rate limits are low (60/hr).",
  );
}

const imported = [];
for (let i = 0; i < handles.length; i++) {
  const row = handles[i];
  process.stderr.write(`[${i + 1}/${handles.length}] Fetching @${row.github}…\n`);
  try {
    imported.push(await importOne(row, i));
    await new Promise((r) => setTimeout(r, token ? 250 : 1000));
  } catch (err) {
    console.error(`Failed @${row.github}:`, err.message);
  }
}

const out = {
  generatedAt: new Date().toISOString(),
  cohortRepo: COHORT_REPO,
  count: imported.length,
  profiles: imported,
};

if (write) {
  const outDir = resolve(root, "src/data");
  mkdirSync(outDir, { recursive: true });
  const rosterFile = resolve(outDir, "profiles.generated.json");
  writeFileSync(rosterFile, `${JSON.stringify(out, null, 2)}\n`);
  const directoryFile = resolve(outDir, "directory.generated.json");
  writeFileSync(
    directoryFile,
    `${JSON.stringify(
      {
        generatedAt: out.generatedAt,
        count: imported.length,
        participants: imported.map((p) => ({
          slug: p.slug,
          name: p.name,
          github: p.github,
          avatarUrl: p.avatarUrl,
          bio: p.bio,
          campus: p.campus,
          technologies: p.technologies || p.skills || [],
          projects: p.projects || [],
          photoGradient: p.photoGradient,
        })),
      },
      null,
      2,
    )}\n`,
  );
  console.error(`Wrote ${imported.length} profiles → ${rosterFile}`);
  console.error(`Wrote directory → ${directoryFile}`);
} else {
  console.log(JSON.stringify(out, null, 2));
}
