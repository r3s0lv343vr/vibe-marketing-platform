import {
  chatLLM,
  extractJsonObject,
  generateImageOpenAI,
  llmAvailability,
} from "@/lib/llm";

export type AgentRole = {
  id: string;
  name: string;
  specialty: string;
};

export type AgentStep = {
  agentId: string;
  title: string;
  detail: string;
  status: "queued" | "running" | "done";
};

export type AgentRunResult = {
  mode: "demo" | "live";
  provider?: string;
  steps: AgentStep[];
  output: {
    headline: string;
    summary: string;
    artifacts: Array<{ label: string; content: string }>;
    previewHtml?: string;
    imagePrompt?: string;
    imageUrl?: string;
    videoBrief?: string;
  };
  apiNote: string;
};

export const TASKS = {
  web: {
    slug: "web",
    title: "AI Web Page Creation",
    blurb: "Conversation-first project pages that hiring partners and investors can inspect.",
    href: "/app/web",
    group: "create" as const,
    agents: [
      { id: "strategist", name: "Brand Strategist", specialty: "Positioning & offer" },
      { id: "copy", name: "Copywriter", specialty: "Headlines & sections" },
      { id: "layout", name: "Layout Architect", specialty: "Structure & CTA flow" },
    ] satisfies AgentRole[],
  },
  image: {
    slug: "image",
    title: "AI Image Generation",
    blurb: "Campaign visuals and social-ready stills tied to your project story.",
    href: "/app/image",
    group: "create" as const,
    agents: [
      { id: "art", name: "Art Director", specialty: "Visual direction" },
      { id: "prompt", name: "Prompt Engineer", specialty: "Generation prompts" },
      { id: "style", name: "Style Critic", specialty: "Brand consistency" },
    ] satisfies AgentRole[],
  },
  video: {
    slug: "video",
    title: "AI Video Creation",
    blurb: "Demo scripts and shot lists that make your build easy to share.",
    href: "/app/video",
    group: "create" as const,
    agents: [
      { id: "script", name: "Scriptwriter", specialty: "Hooks & narration" },
      { id: "shots", name: "Shot Planner", specialty: "Scenes & pacing" },
      { id: "motion", name: "Motion Director", specialty: "Style & delivery" },
    ] satisfies AgentRole[],
  },
  social: {
    slug: "social",
    title: "Social Media Marketing",
    blurb:
      "Facebook, Instagram, and LinkedIn terminals — craft, preview, copy/export, and link accounts.",
    href: "/app/social",
    group: "career" as const,
    agents: [
      { id: "linkedin", name: "LinkedIn Coach", specialty: "Headline, about, featured" },
      { id: "instagram", name: "Instagram Editor", specialty: "Bio, highlights, cadence" },
      { id: "facebook", name: "Facebook Strategist", specialty: "Page voice & posts" },
    ] satisfies AgentRole[],
  },
  market: {
    slug: "market",
    title: "Employer & Market Pulse",
    blurb: "What employers want now — buzzwords, project themes, and market sentiment.",
    href: "/app/market",
    group: "career" as const,
    agents: [
      { id: "employer", name: "Employer Scout", specialty: "Hiring signal scan" },
      { id: "buzz", name: "Buzzword Analyst", specialty: "Language that lands" },
      { id: "sentiment", name: "Market Sentiment", specialty: "Themes & momentum" },
    ] satisfies AgentRole[],
  },
} as const;

export type TaskKey = keyof typeof TASKS;

function baseSteps(task: TaskKey, subject: string, details?: string[]): AgentStep[] {
  const pack = TASKS[task];
  return pack.agents.map((agent, index) => ({
    agentId: agent.id,
    title: `${agent.name} · ${agent.specialty}`,
    detail:
      details?.[index] ||
      (index === 0
        ? `Framed the brief around “${subject}”.`
        : index === 1
          ? `Drafted core assets for ${pack.title.toLowerCase()}.`
          : `Checked consistency against career goals and audience fit.`),
    status: "done" as const,
  }));
}

function demoResult(task: TaskKey, brief: string): AgentRunResult {
  const subject = brief.trim() || "a student digital project";
  const avail = llmAvailability();

  if (task === "web") {
    return {
      mode: "demo",
      steps: baseSteps(task, subject),
      output: {
        headline: subject,
        summary: `Demo agents drafted a project showcase page for “${subject}”.`,
        artifacts: [
          { label: "Hero", content: `${subject} — shipped proof, not a résumé claim.` },
          { label: "CTA", content: "View live demo · Inspect GitHub · Request intro" },
          { label: "Sections", content: "Problem → Build → Proof links → Skills → Ask" },
        ],
        previewHtml: `<section style="font-family:Georgia,serif;padding:2rem;background:linear-gradient(160deg,#f7b6c8,#f3d9a4);color:#2b2420"><p style="letter-spacing:.16em;text-transform:uppercase;font-size:.7rem">NextMove · Demo</p><h1 style="font-size:2rem;margin:.5rem 0 1rem">${subject}</h1><p>Student project showcase preview.</p></section>`,
      },
      apiNote: avail.any
        ? "Live keys found but demo fallback used."
        : "Demo mode. Add OPENAI_API_KEY and/or KIMI_API_KEY for live agents.",
    };
  }

  if (task === "image") {
    const imagePrompt = `Editorial campaign still for student project “${subject}”, soft bakery light, rose sugar and champagne gold palette, shallow depth of field, no text overlay`;
    return {
      mode: "demo",
      steps: baseSteps(task, subject),
      output: {
        headline: `Visual system for ${subject}`,
        summary: "Demo agents produced a generation-ready brief.",
        artifacts: [
          { label: "Primary prompt", content: imagePrompt },
          { label: "Formats", content: "1:1 feed · 4:5 story · 16:9 hero" },
        ],
        imagePrompt,
      },
      apiNote: "Demo mode. OPENAI_API_KEY enables DALL·E image generation.",
    };
  }

  if (task === "video") {
    return {
      mode: "demo",
      steps: baseSteps(task, subject),
      output: {
        headline: `Motion brief for ${subject}`,
        summary: "Demo agents aligned a launch clip plan.",
        artifacts: [
          { label: "Hook", content: `What if ${subject} marketed itself overnight?` },
          { label: "Shot list", content: "1) Detail 2) Reaction 3) Product UI 4) Logo" },
        ],
        videoBrief: `15s opener for “${subject}”.`,
      },
      apiNote: "Demo mode for scripts. Real rendered video needs Runway/Replicate later.",
    };
  }

  if (task === "social") {
    return {
      mode: "demo",
      steps: baseSteps(task, subject),
      output: {
        headline: `Professional presence for ${subject}`,
        summary: "Demo social agents drafted LinkedIn, Instagram, and Facebook upgrades.",
        artifacts: [
          { label: "LinkedIn", content: `Headline + about focused on ${subject} with live proof links.` },
          { label: "Instagram", content: "Bio, highlights, and 3x/week cadence." },
          { label: "Facebook", content: "Pinned launch post + weekly shipping updates." },
        ],
      },
      apiNote: "Demo mode. Live rewrite uses OPENAI_API_KEY or KIMI_API_KEY.",
    };
  }

  return {
    mode: "demo",
    steps: baseSteps(task, subject),
    output: {
      headline: `Pulse check for ${subject}`,
      summary: "Demo market agents listed employer signals and buzzwords.",
      artifacts: [
        { label: "Employers want", content: "Live deploys, GitHub proof, clear ownership." },
        { label: "Buzzwords", content: "production-ready · agent orchestration · measurable outcomes" },
        { label: "Sentiment", content: "AI-native builders with real products beat slide decks." },
      ],
    },
    apiNote: "Demo mode. Live pulse uses OPENAI_API_KEY or KIMI_API_KEY.",
  };
}

type LiveJson = {
  headline?: string;
  summary?: string;
  artifacts?: Array<{ label: string; content: string }>;
  previewHtml?: string;
  imagePrompt?: string;
  videoBrief?: string;
  stepDetails?: string[];
};

async function liveTextTask(task: TaskKey, brief: string): Promise<AgentRunResult> {
  const subject = brief.trim() || "a student digital project";
  const pack = TASKS[task];

  const system = `You are the orchestrator for NextMove, a vibe marketing platform where students showcase digital projects to hiring partners and investors.
Coordinate these agents: ${pack.agents.map((a) => `${a.name} (${a.specialty})`).join("; ")}.
Return ONLY valid JSON with keys:
headline (string), summary (string), artifacts (array of {label, content}), stepDetails (array of 3 short strings, one per agent),
previewHtml (string, only for web — a small self-contained HTML snippet),
imagePrompt (string, only for image),
videoBrief (string, only for video).
Tone: warm, professional, concrete. No markdown fences.`;

  const user = `Task: ${pack.title}
Student brief: ${subject}
Audience: hiring partners and investors.
Produce channel-ready, actionable output.`;

  const chat = await chatLLM(system, user);
  const parsed = extractJsonObject<LiveJson>(chat.text);

  return {
    mode: "live",
    provider: `${chat.provider}:${chat.model}`,
    steps: baseSteps(task, subject, parsed.stepDetails),
    output: {
      headline: parsed.headline || subject,
      summary: parsed.summary || `Live agents completed ${pack.title}.`,
      artifacts: parsed.artifacts?.length
        ? parsed.artifacts.slice(0, 6)
        : [{ label: "Output", content: chat.text.slice(0, 1200) }],
      previewHtml: parsed.previewHtml,
      imagePrompt: parsed.imagePrompt,
      videoBrief: parsed.videoBrief,
    },
    apiNote: `Live via ${chat.provider} (${chat.model}).`,
  };
}

async function liveImageTask(brief: string): Promise<AgentRunResult> {
  const subject = brief.trim() || "a student digital project";
  const text = await liveTextTask("image", brief);
  const prompt =
    text.output.imagePrompt ||
    `Editorial campaign still for student project “${subject}”, soft bakery light, rose sugar and champagne gold palette, shallow depth of field, no text overlay, premium product photography`;

  if (!llmAvailability().openai) {
    return {
      ...text,
      output: { ...text.output, imagePrompt: prompt },
      apiNote: `${text.apiNote} Image pixels need OPENAI_API_KEY (DALL·E). Prompt ready.`,
    };
  }

  try {
    const imageUrl = await generateImageOpenAI(prompt);
    return {
      ...text,
      mode: "live",
      output: {
        ...text.output,
        imagePrompt: prompt,
        imageUrl,
        artifacts: [
          ...(text.output.artifacts || []),
          { label: "Generated image", content: imageUrl },
        ],
      },
      apiNote: `${text.apiNote} Image generated with OpenAI DALL·E.`,
    };
  } catch (err) {
    return {
      ...text,
      output: { ...text.output, imagePrompt: prompt },
      apiNote: `Text agents live; image generation failed: ${
        err instanceof Error ? err.message : "unknown error"
      }`,
    };
  }
}

export async function runAgents(task: TaskKey, brief: string): Promise<AgentRunResult> {
  const avail = llmAvailability();
  if (!avail.any) {
    return demoResult(task, brief);
  }

  try {
    if (task === "image") {
      return await liveImageTask(brief);
    }
    return await liveTextTask(task, brief);
  } catch (err) {
    const fallback = demoResult(task, brief);
    return {
      ...fallback,
      apiNote: `Live providers failed (${
        err instanceof Error ? err.message : "error"
      }). Showing demo fallback.`,
    };
  }
}
