export type BrandDna = {
  personality: string;
  tone: string;
  audience: string;
  colors: string[];
  typography: string;
  mission: string;
  positioning: string;
};

export type VibeScores = {
  trust: number;
  luxury: number;
  innovation: number;
  authority: number;
  community: number;
  fun: number;
};

export type FeedItem = {
  id: string;
  kind: "copy" | "visual" | "campaign" | "insight";
  title: string;
  body: string;
  createdAt: string;
};

export type StudioState = {
  prompt: string;
  brand: BrandDna;
  vibes: VibeScores;
  mood: string[];
  goal: string;
  feed: FeedItem[];
  previewHtml: string;
};

const GOALS = [
  "Website",
  "Instagram Campaign",
  "Facebook Ads",
  "Email Campaign",
  "Blog",
  "Flyer",
  "Video Script",
] as const;

function hash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

function score(seed: number, offset: number) {
  return 45 + ((seed >> offset) % 50);
}

export function detectGoal(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("instagram")) return "Instagram Campaign";
  if (p.includes("facebook") || p.includes("meta ad")) return "Facebook Ads";
  if (p.includes("email")) return "Email Campaign";
  if (p.includes("blog") || p.includes("seo")) return "Blog";
  if (p.includes("flyer") || p.includes("print")) return "Flyer";
  if (p.includes("video") || p.includes("youtube") || p.includes("script"))
    return "Video Script";
  if (p.includes("website") || p.includes("landing") || p.includes("site"))
    return "Website";
  return pick([...GOALS], hash(prompt));
}

export function inventBrand(prompt: string): BrandDna {
  const seed = hash(prompt || "pixie dust");
  const personalities = [
    "Warm host with a mischievous sparkle",
    "Quiet luxury with playful crumbs",
    "Neighborhood bakery meets midnight laboratory",
    "Optimistic operator who ships dessert first",
  ];
  const tones = [
    "conversational + polished",
    "witty without sarcasm",
    "sensorial and precise",
    "confident, lightly magical",
  ];
  const audiences = [
    "hiring partners evaluating GitHub-native builders",
    "founders who want brand systems, not slide decks",
    "operators launching local-to-digital food brands",
    "creators packaging a personal brand for sponsors",
  ];
  const palettes = [
    ["#F7B6C8", "#F3D9A4", "#9FD6C2", "#2B2420"],
    ["#E8A598", "#FFE8C8", "#7EB8A8", "#1F2A24"],
    ["#D4A373", "#FAEDCD", "#CCD5AE", "#3A2E28"],
    ["#F2C6DE", "#DBCDF0", "#C9E4DE", "#2D2A32"],
  ];
  const typePairs = [
    "Fraunces + Figtree",
    "Cormorant + Sora",
    "Literata + Manrope",
    "Newsreader + Outfit",
  ];

  const subject = prompt.trim() || "a new brand";
  return {
    personality: pick(personalities, seed),
    tone: pick(tones, seed >> 3),
    audience: pick(audiences, seed >> 5),
    colors: pick(palettes, seed >> 7),
    typography: pick(typePairs, seed >> 9),
    mission: `Make ${subject} feel inevitable — memorable in one glance, trustworthy in one click.`,
    positioning: `The brand system that turns “${subject}” into a hireable, shareable story.`,
  };
}

export function inventVibes(prompt: string): VibeScores {
  const seed = hash(prompt || "vibe");
  return {
    trust: score(seed, 1),
    luxury: score(seed, 3),
    innovation: score(seed, 5),
    authority: score(seed, 7),
    community: score(seed, 9),
    fun: score(seed, 11),
  };
}

export function inventMood(prompt: string): string[] {
  const seed = hash(prompt || "mood");
  const bank = [
    "sugar crust light",
    "berry glaze reflections",
    "linen table texture",
    "champagne foil lettering",
    "mint frosting geometry",
    "candlelit counter",
    "macaron stack rhythm",
    "soft focus storefront",
    "handwritten menu cards",
    "golden hour crumbs",
  ];
  return [0, 1, 2, 3, 4].map((i) => pick(bank, seed + i * 17));
}

export function buildPreview(prompt: string, brand: BrandDna, goal: string): string {
  const title = prompt.trim() || "What are we marketing today?";
  return [
    `<section style="font-family:Georgia,serif;padding:2rem;background:linear-gradient(160deg,${brand.colors[0]},${brand.colors[1]});color:${brand.colors[3] || "#2B2420"}">`,
    `<p style="letter-spacing:.18em;text-transform:uppercase;font-size:.7rem;opacity:.8">NextMove · ${goal}</p>`,
    `<h1 style="font-size:2.2rem;line-height:1.1;margin:.6rem 0 1rem">${title}</h1>`,
    `<p style="max-width:36ch;font-family:system-ui,sans-serif;font-size:1rem">${brand.mission}</p>`,
    `<p style="margin-top:1.5rem;font-family:system-ui,sans-serif;font-size:.85rem"><strong>Tone:</strong> ${brand.tone} · <strong>Type:</strong> ${brand.typography}</p>`,
    `</section>`,
  ].join("");
}

export function buildFeed(prompt: string, brand: BrandDna, goal: string): FeedItem[] {
  const now = new Date().toISOString();
  const subject = prompt.trim() || "your launch";
  return [
    {
      id: "1",
      kind: "copy",
      title: "Tagline",
      body: `${subject}: plated with proof, finished with sparkle.`,
      createdAt: now,
    },
    {
      id: "2",
      kind: "campaign",
      title: `${goal} starter`,
      body: `Audience: ${brand.audience}. Lead with GitHub-visible proof, then invite a tasting (demo). CTA: Request intro / Book a slice.`,
      createdAt: now,
    },
    {
      id: "3",
      kind: "visual",
      title: "Image prompt",
      body: `Editorial photo of ${subject}, berry glaze + champagne dust, shallow depth, no text overlays, soft bakery window light.`,
      createdAt: now,
    },
    {
      id: "4",
      kind: "insight",
      title: "AI insight",
      body: `Lean into ${brand.personality.toLowerCase()}. Keep copy ${brand.tone}; partners skim for proof, not hype.`,
      createdAt: now,
    },
  ];
}

export function runStudio(prompt: string): StudioState {
  const brand = inventBrand(prompt);
  const vibes = inventVibes(prompt);
  const mood = inventMood(prompt);
  const goal = detectGoal(prompt);
  return {
    prompt,
    brand,
    vibes,
    mood,
    goal,
    feed: buildFeed(prompt, brand, goal),
    previewHtml: buildPreview(prompt, brand, goal),
  };
}

export const EXAMPLE_PROMPTS = [
  "Launching a neighborhood coffee shop",
  "Promoting a B2B SaaS for ops teams",
  "Building a personal brand for hiring partners",
  "Launching a YouTube channel about AI shipping",
  "Selling handmade ceramic dessert plates",
];
