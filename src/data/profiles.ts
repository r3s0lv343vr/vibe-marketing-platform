export type PortfolioLink = {
  label: string;
  href: string;
  kind: "pm" | "comms" | "showcase" | "repo" | "pr" | "other";
};

export type CohortProfile = {
  slug: string;
  name: string;
  github: string;
  campus: string;
  role: string;
  skills: string[];
  bio: string;
  public: boolean;
  /** Fallback when avatarUrl is missing */
  photoGradient: string;
  /** GitHub avatar or other portrait URL */
  avatarUrl?: string;
  /** Cohort / project pull request URLs */
  prUrls?: string[];
  /** Live project homepage URLs (Vercel, custom domains, etc.) */
  homepageUrls?: string[];
  portfolio: PortfolioLink[];
  highlight?: string;
};

/** Placeholder roster — still filling for Summer Pilot 2026. */
export const profiles: CohortProfile[] = [
  {
    slug: "r3s0lv343vr",
    name: "Craig Ferguson",
    github: "r3s0lv343vr",
    campus: "Boston",
    role: "Builder · Operator",
    skills: ["Next.js", "TypeScript", "Firebase", "Prisma", "Vercel"],
    bio: "Shipping production cohort tools with agent-assisted velocity. Built Lnq (comms) and NextMove (showcase) — each deployed, reviewed, and wired for ecosystem unification.",
    public: true,
    avatarUrl: "https://avatars.githubusercontent.com/r3s0lv343vr",
    photoGradient: "linear-gradient(135deg, #f7b6c8 0%, #f3d9a4 45%, #9fd6c2 100%)",
    highlight: "Operator of NextMove",
    homepageUrls: [
      "https://lnq-eight.vercel.app",
      "https://nextmove-hult.vercel.app",
    ],
    prUrls: [
      "https://github.com/rogerSuperBuilderAlpha/hult-cohort-program/pull/185",
    ],
    portfolio: [
      {
        label: "PM build repo",
        href: "https://github.com/r3s0lv343vr/pm-r3s0lv343vr",
        kind: "repo",
      },
      {
        label: "Lnq · Comms",
        href: "https://lnq-eight.vercel.app",
        kind: "comms",
      },
      {
        label: "NextMove",
        href: "https://nextmove-hult.vercel.app",
        kind: "showcase",
      },
      {
        label: "Project 3 submission PR",
        href: "https://github.com/rogerSuperBuilderAlpha/hult-cohort-program/pull/185",
        kind: "pr",
      },
    ],
  },
  {
    slug: "codingwcal",
    name: "Calvin V.",
    github: "CodingWCal",
    campus: "Boston, MA",
    role: "Builder · Developer Advocate",
    skills: ["TypeScript", "Next.js", "Full-stack", "AI"],
    bio: "Hey! My name is Calvin and I'm a Developer Advocate and full-stack software engineer with an AI focus in Resilient Coders and 100Devs. Built Forth (PM) — winner of the first project week.",
    public: true,
    avatarUrl: "https://avatars.githubusercontent.com/u/200448977?v=4",
    photoGradient: "linear-gradient(160deg, #f3d9a4 0%, #f7b6c8 40%, #b8d4f0 100%)",
    highlight: "Forth · Project 1 week winner",
    homepageUrls: ["https://forth-bice.vercel.app/"],
    portfolio: [
      {
        label: "Forth · PM platform (Project 1 winner)",
        href: "https://forth-bice.vercel.app/",
        kind: "pm",
      },
      {
        label: "Forth · repo",
        href: "https://github.com/CodingWCal/forth",
        kind: "repo",
      },
    ],
  },
  {
    slug: "maya-sugarveil",
    name: "Maya Sugarveil",
    github: "maya-sugarveil",
    campus: "London",
    role: "Full-stack · Design systems",
    skills: ["React", "Tailwind", "Design tokens", "Accessibility"],
    bio: "Placeholder profile while the Summer 26 roster finalizes. Maya prototypes partner-ready UI systems and documents review trails on GitHub.",
    public: true,
    photoGradient: "linear-gradient(140deg, #f8c8d8 0%, #ffe8c8 50%, #d8f0e8 100%)",
    portfolio: [
      {
        label: "PM build (placeholder)",
        href: "https://github.com/rogerSuperBuilderAlpha/hult-cohort-program",
        kind: "pm",
      },
      {
        label: "Comms build (placeholder)",
        href: "https://github.com/rogerSuperBuilderAlpha/hult-cohort-program",
        kind: "comms",
      },
    ],
  },
  {
    slug: "jordan-crumbtrail",
    name: "Jordan Crumbtrail",
    github: "jordan-crumbtrail",
    campus: "San Francisco",
    role: "Backend · Integrations",
    skills: ["Node", "Postgres", "Webhooks", "Auth"],
    bio: "Placeholder builder focused on PM ↔ comms ↔ showcase integration hooks. Real GitHub handle and deploys land as enrollment completes.",
    public: true,
    photoGradient: "linear-gradient(145deg, #cfe8de 0%, #f7d7b8 55%, #f2b7c8 100%)",
    portfolio: [
      {
        label: "Integration notes",
        href: "https://github.com/rogerSuperBuilderAlpha/hult-cohort-program",
        kind: "other",
      },
      {
        label: "Showcase stub",
        href: "https://github.com/rogerSuperBuilderAlpha/hult-cohort-program",
        kind: "showcase",
      },
    ],
  },
  {
    slug: "aisha-glaze",
    name: "Aisha Glaze",
    github: "aisha-glaze",
    campus: "Dubai",
    role: "Product · Growth",
    skills: ["Experimentation", "Copy", "Analytics", "Next.js"],
    bio: "Placeholder profile for a growth-minded builder. Will link Phase 1 repos and live apps once peer submission merges land.",
    public: true,
    photoGradient: "linear-gradient(160deg, #f3d9a4 0%, #f7b6c8 40%, #b8d4f0 100%)",
    portfolio: [
      {
        label: "PM build (placeholder)",
        href: "https://github.com/rogerSuperBuilderAlpha/hult-cohort-program",
        kind: "pm",
      },
    ],
  },
  {
    slug: "private-opt-out",
    name: "Private Builder",
    github: "private-opt-out",
    campus: "Remote",
    role: "—",
    skills: [],
    bio: "This participant opted out of a public profile.",
    public: false,
    photoGradient: "linear-gradient(135deg, #d9d2cc 0%, #ebe6e1 100%)",
    portfolio: [],
  },
];

export function getProfile(slug: string) {
  return profiles.find((p) => p.slug === slug);
}

export function publicProfiles() {
  return profiles.filter((p) => p.public);
}

export type ShowcaseSlide = {
  id: string;
  title: string;
  href: string;
  builderName: string;
  builderSlug: string;
  github: string;
  avatarUrl?: string;
  kind: PortfolioLink["kind"];
};
