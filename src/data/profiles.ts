export type PortfolioLink = {
  label: string;
  href: string;
  kind: "pm" | "comms" | "showcase" | "other";
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
  photoGradient: string;
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
    bio: "Shipping production cohort tools with agent-assisted velocity. Built Forth (PM), Lnq (comms), and Pixie Dust Cheesecake (showcase) — each deployed, reviewed, and wired for ecosystem unification.",
    public: true,
    photoGradient: "linear-gradient(135deg, #f7b6c8 0%, #f3d9a4 45%, #9fd6c2 100%)",
    highlight: "Operator of Pixie Dust Cheesecake",
    portfolio: [
      {
        label: "Forth · PM platform",
        href: "https://forth-bice.vercel.app",
        kind: "pm",
      },
      {
        label: "PM build repo",
        href: "https://github.com/r3s0lv343vr/pm-r3s0lv343vr",
        kind: "pm",
      },
      {
        label: "Lnq · Comms",
        href: "https://lnq-eight.vercel.app",
        kind: "comms",
      },
      {
        label: "Pixie Dust Cheesecake",
        href: "https://pixie-dust-cheesecake.vercel.app",
        kind: "showcase",
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
        label: "PM snapshot (placeholder)",
        href: "https://forth-bice.vercel.app",
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
