export type SocialPlatform = "facebook" | "instagram" | "linkedin";

export type SocialLink = {
  platform: SocialPlatform;
  profileUrl: string;
  handle: string;
  pageOrCompany?: string;
  notes?: string;
  linkedAt: string;
  mode: "manual" | "api-ready";
};

export type SocialDraft = {
  platform: SocialPlatform;
  goal: string;
  audience: string;
  tone: string;
  cta: string;
  content: string;
  hashtags: string;
  updatedAt: string;
};

export const SOCIAL_LINKS_KEY = "nextmove_social_links";
export const SOCIAL_DRAFTS_KEY = "nextmove_social_drafts";

export const SOCIAL_PLATFORMS: Array<{
  id: SocialPlatform;
  label: string;
  color: string;
  placeholderUrl: string;
  placeholderHandle: string;
  tips: string;
}> = [
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    placeholderUrl: "https://facebook.com/your-page",
    placeholderHandle: "your-page",
    tips: "Best for pinned launch posts, community updates, and page voice.",
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#E1306C",
    placeholderUrl: "https://instagram.com/yourhandle",
    placeholderHandle: "@yourhandle",
    tips: "Best for bio, highlights, carousels, and a 3x/week shipping cadence.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    placeholderUrl: "https://linkedin.com/in/your-name",
    placeholderHandle: "your-name",
    tips: "Best for headline, About, Featured links, and hire-ready posts.",
  },
];

export function emptyDraft(platform: SocialPlatform): SocialDraft {
  return {
    platform,
    goal: "Attract hiring partners with shipped proof",
    audience: "Hiring managers and investors",
    tone: "Confident, specific, evidence-first",
    cta: "View live project",
    content: "",
    hashtags: "",
    updatedAt: new Date().toISOString(),
  };
}

export function craftSocialDraft(
  platform: SocialPlatform,
  input: {
    subject: string;
    goal: string;
    audience: string;
    tone: string;
    cta: string;
    proofUrl?: string;
  },
): SocialDraft {
  const subject = input.subject.trim() || "my shipped project";
  const proof = input.proofUrl?.trim();
  const base = emptyDraft(platform);
  base.goal = input.goal.trim() || base.goal;
  base.audience = input.audience.trim() || base.audience;
  base.tone = input.tone.trim() || base.tone;
  base.cta = input.cta.trim() || base.cta;

  if (platform === "linkedin") {
    base.content = [
      `Shipping in public: ${subject}.`,
      "",
      `Built for ${base.audience.toLowerCase()} who want evidence, not slide decks.`,
      proof ? `Live proof → ${proof}` : "Live proof linked in comments / Featured.",
      "",
      `Tone: ${base.tone}.`,
      `${base.cta} — happy to walk through the repo, PRs, and deploy trail.`,
    ].join("\n");
    base.hashtags = "#BuildInPublic #SoftwareEngineering #Hiring #NextMove";
  } else if (platform === "instagram") {
    base.content = [
      `${subject} — shipped, reviewable, live.`,
      "",
      `For ${base.audience.toLowerCase()}.`,
      proof ? `🔗 ${proof}` : "🔗 Link in bio",
      "",
      `${base.cta}.`,
      "Save this if you’re tracking real builders this season.",
    ].join("\n");
    base.hashtags = "#buildinpublic #devtools #portfolio #hultcohort #nextmove";
  } else {
    base.content = [
      `Launch update: ${subject} is live.`,
      "",
      `We built this so ${base.audience.toLowerCase()} can inspect real work — GitHub, deploys, and outcomes.`,
      proof ? `Open it here: ${proof}` : "Open the live project from our page links.",
      "",
      `${base.cta}. Follow for weekly shipping notes.`,
    ].join("\n");
    base.hashtags = "#BuildInPublic #TechCareers #StudentBuilders #NextMove";
  }

  base.updatedAt = new Date().toISOString();
  return base;
}

export function exportDraftText(draft: SocialDraft, link?: SocialLink | null) {
  return [
    `NextMove · ${draft.platform.toUpperCase()} draft`,
    `Updated: ${draft.updatedAt}`,
    link?.profileUrl ? `Account: ${link.profileUrl}` : "Account: not linked yet",
    "",
    `Goal: ${draft.goal}`,
    `Audience: ${draft.audience}`,
    `Tone: ${draft.tone}`,
    `CTA: ${draft.cta}`,
    "",
    "--- POST ---",
    draft.content,
    "",
    draft.hashtags ? `Hashtags: ${draft.hashtags}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
