/**
 * Read-only PM platform snapshot for partner-facing status.
 * Source of truth remains the live PM apps; this JSON is refreshed for the showcase.
 * Updated: 2026-07-30
 */
export type PmProject = {
  id: string;
  name: string;
  owner: string;
  status: "on-track" | "at-risk" | "blocked" | "shipped";
  phase: string;
  progress: number;
  deployUrl?: string;
  repoUrl?: string;
  notes: string;
};

export const pmSnapshotMeta = {
  source: "Forth / participant PM platforms",
  forthUrl: "https://forth-bice.vercel.app",
  forthBuilder: "Calvin V. · CodingWCal",
  forthBuilderSlug: "codingwcal",
  participantPmUrl: "https://pm-r3s0lv343vr.vercel.app",
  refreshedAt: "2026-07-30T18:00:00Z",
  cohort: "Hult Cohort · Summer Pilot 2026",
  integration:
    "Static daily snapshot until ecosystem unification exposes a shared read API. Links open live PM surfaces.",
};

export const pmProjects: PmProject[] = [
  {
    id: "p1-pm",
    name: "Phase 1 · Project 1 — PM platforms",
    owner: "Calvin V. · Forth (Project 1 week winner)",
    status: "shipped",
    phase: "Review complete / merged submissions",
    progress: 100,
    deployUrl: "https://forth-bice.vercel.app",
    repoUrl: "https://github.com/CodingWCal/forth",
    notes:
      "Forth by Calvin V. won Project 1 week. Peer-reviewed PM builds live; Forth is the reference production surface.",
  },
  {
    id: "p2-comms",
    name: "Phase 1 · Project 2 — Comms platforms",
    owner: "Cohort (multi-operator)",
    status: "shipped",
    phase: "Review complete / merged submissions",
    progress: 100,
    deployUrl: "https://lnq-eight.vercel.app",
    repoUrl: "https://github.com/r3s0lv343vr/lnq",
    notes: "Async-first comms (streams + topics). Integration hooks designed for Forth.",
  },
  {
    id: "p3-showcase",
    name: "Phase 1 · Project 3 — Public showcase",
    owner: "r3s0lv343vr · NextMove",
    status: "on-track",
    phase: "Submission window",
    progress: 85,
    deployUrl: "https://nextmove-hult.vercel.app",
    repoUrl: "https://github.com/r3s0lv343vr/vibe-marketing-platform",
    notes: "Partner-facing vibe marketing showcase with profiles, intro requests, and PM snapshot.",
  },
  {
    id: "unification",
    name: "Phase 1 · Ecosystem unification",
    owner: "Operators (week 5)",
    status: "at-risk",
    phase: "Planning",
    progress: 15,
    notes: "Depends on shared identity + read APIs across winning PM / comms / showcase.",
  },
];
