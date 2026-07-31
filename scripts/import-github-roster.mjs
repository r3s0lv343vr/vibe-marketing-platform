#!/usr/bin/env node
/**
 * Bulk-import cohort builders from GitHub handles.
 *
 * Reads handles (one per line, or CSV: github,name,campus) and fetches:
 * - display name + avatar
 * - public repos + homepage URLs
 * - PRs authored in the cohort program repo (optional)
 *
 * Usage:
 *   GITHUB_TOKEN=ghp_xxx node scripts/import-github-roster.mjs data/handles.txt
 *   node scripts/import-github-roster.mjs data/handles.txt --write
 *
 * Without --write, prints JSON preview to stdout.
 * With --write, merges into src/data/profiles.generated.json (safe merge file).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
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
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [github, name = "", campus = ""] = line.split(",").map((s) => s.trim());
      return {
        github: github.replace(/^@/, "").replace(/https?:\/\/github\.com\//i, ""),
        name,
        campus,
      };
    });
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

function isLiveHomepage(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (u.hostname === "github.com") return false;
    return /^https?:$/.test(u.protocol);
  } catch {
    return false;
  }
}

function slugify(handle) {
  return handle.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

async function importOne({ github, name, campus }, index) {
  const user = await gh(`/users/${encodeURIComponent(github)}`);
  const repos = await gh(
    `/users/${encodeURIComponent(github)}/repos?per_page=100&sort=updated`,
  );

  let prUrls = [];
  try {
    const q = encodeURIComponent(
      `type:pr author:${github} repo:${COHORT_REPO}`,
    );
    const prSearch = await gh(`/search/issues?q=${q}&per_page=10`);
    prUrls = (prSearch.items || []).map((item) => item.html_url);
  } catch (err) {
    console.warn(`PR search skipped for ${github}:`, err.message);
  }

  const homepageUrls = [];
  if (isLiveHomepage(user.blog)) homepageUrls.push(user.blog);

  const portfolio = [];
  for (const repo of repos) {
    if (repo.fork) continue;
    portfolio.push({
      label: repo.name,
      href: repo.html_url,
      kind: "repo",
    });
    if (isLiveHomepage(repo.homepage)) {
      homepageUrls.push(repo.homepage);
      portfolio.push({
        label: `${repo.name} · live`,
        href: repo.homepage,
        kind: "showcase",
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

  const uniqueHomes = [...new Set(homepageUrls)];
  const uniquePortfolio = [];
  const seen = new Set();
  for (const item of portfolio) {
    const key = `${item.kind}:${item.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniquePortfolio.push(item);
  }

  return {
    slug: slugify(github),
    name: name || user.name || github,
    github,
    campus: campus || "TBD",
    role: "Builder",
    skills: [],
    bio: user.bio || `${name || user.name || github} — imported from GitHub @${github}.`,
    public: true,
    avatarUrl: user.avatar_url,
    photoGradient: gradients[index % gradients.length],
    homepageUrls: uniqueHomes,
    prUrls,
    portfolio: uniquePortfolio.slice(0, 12),
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
  process.stderr.write(`Fetching @${row.github}…\n`);
  try {
    imported.push(await importOne(row, i));
    // gentle pacing
    await new Promise((r) => setTimeout(r, token ? 200 : 900));
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
  const outFile = resolve(outDir, "profiles.generated.json");
  writeFileSync(outFile, `${JSON.stringify(out, null, 2)}\n`);
  console.error(`Wrote ${imported.length} profiles → ${outFile}`);
  console.error(
    "Next: merge into src/data/profiles.ts (or wire the generated JSON into the app).",
  );
} else {
  console.log(JSON.stringify(out, null, 2));
}

if (existsSync(resolve(root, "data/handles.example.txt")) === false) {
  // no-op: example file created separately
}
