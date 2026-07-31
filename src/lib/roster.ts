import type { CohortProfile, PortfolioLink, ShowcaseSlide } from "@/data/profiles";
import { profiles as seedProfiles } from "@/data/profiles";
import generated from "@/data/profiles.generated.json";

type GeneratedFile = {
  profiles?: Array<Partial<CohortProfile> & { slug: string; github: string; name: string }>;
};

/** Merge hand-curated seed profiles with GitHub import output. Seed wins on copy; import fills gaps. */
export function getRoster(): CohortProfile[] {
  const imported = ((generated as GeneratedFile).profiles || []).map(normalizeImported);
  const bySlug = new Map<string, CohortProfile>();

  for (const profile of seedProfiles) {
    bySlug.set(profile.slug, profile);
  }
  for (const profile of imported) {
    const existing = bySlug.get(profile.slug);
    bySlug.set(profile.slug, existing ? enrichProfile(existing, profile) : profile);
  }

  return [...bySlug.values()];
}

export function getRosterProfile(slug: string) {
  return getRoster().find((p) => p.slug === slug);
}

export function publicRoster() {
  return getRoster().filter((p) => p.public);
}

/** Live project homepages for the partner/investor slider (skips plain GitHub links). */
export function getRosterShowcaseSlides(): ShowcaseSlide[] {
  const slides: ShowcaseSlide[] = [];

  for (const profile of publicRoster()) {
    const homepageSet = new Set(
      (profile.homepageUrls || []).filter((url) => !isGithubHost(url)),
    );

    for (const item of profile.portfolio) {
      if (isGithubHost(item.href)) continue;
      if (item.kind === "pr" || item.kind === "repo") continue;
      homepageSet.add(item.href);
    }

    for (const href of homepageSet) {
      const fromPortfolio = profile.portfolio.find((p) => p.href === href);
      slides.push({
        id: `${profile.slug}-${href}`,
        title: fromPortfolio?.label || hostnameLabel(href),
        href,
        builderName: profile.name,
        builderSlug: profile.slug,
        github: profile.github,
        avatarUrl: profile.avatarUrl,
        kind: fromPortfolio?.kind || "showcase",
      });
    }
  }

  return slides;
}

function enrichProfile(seed: CohortProfile, imported: CohortProfile): CohortProfile {
  return {
    ...seed,
    avatarUrl: seed.avatarUrl || imported.avatarUrl,
    homepageUrls: uniqueStrings([...(seed.homepageUrls || []), ...(imported.homepageUrls || [])]),
    prUrls: uniqueStrings([...(seed.prUrls || []), ...(imported.prUrls || [])]),
    portfolio: mergePortfolio(seed.portfolio, imported.portfolio),
    bio: seed.bio || imported.bio,
    role: seed.role || imported.role,
    campus: seed.campus === "TBD" ? imported.campus : seed.campus,
    skills: seed.skills.length ? seed.skills : imported.skills,
    highlight: seed.highlight || imported.highlight,
  };
}

function mergePortfolio(seed: PortfolioLink[], imported: PortfolioLink[]) {
  const out: PortfolioLink[] = [];
  const seen = new Set<string>();
  for (const item of [...seed, ...imported]) {
    const key = `${item.kind}:${item.href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeImported(
  row: Partial<CohortProfile> & { slug: string; github: string; name: string },
): CohortProfile {
  return {
    slug: row.slug,
    name: row.name,
    github: row.github,
    campus: row.campus || "TBD",
    role: row.role || "Builder",
    skills: row.skills || [],
    bio: row.bio || `Imported from GitHub @${row.github}.`,
    public: row.public ?? true,
    photoGradient:
      row.photoGradient ||
      "linear-gradient(135deg, #f7b6c8 0%, #f3d9a4 45%, #9fd6c2 100%)",
    avatarUrl: row.avatarUrl,
    homepageUrls: row.homepageUrls || [],
    prUrls: row.prUrls || [],
    portfolio: row.portfolio || [],
    highlight: row.highlight,
  };
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
