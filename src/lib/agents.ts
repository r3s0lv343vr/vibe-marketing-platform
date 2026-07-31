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
  steps: AgentStep[];
  output: {
    headline: string;
    summary: string;
    artifacts: Array<{ label: string; content: string }>;
    previewHtml?: string;
    imagePrompt?: string;
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
    title: "Social Profile Studio",
    blurb: "Professionally manage Facebook, Instagram, and LinkedIn presence for hireability.",
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

export function runAgents(task: TaskKey, brief: string): AgentRunResult {
  const subject = brief.trim() || "a student digital project";
  const pack = TASKS[task];
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasImage = Boolean(process.env.OPENAI_API_KEY || process.env.REPLICATE_API_TOKEN);
  const hasVideo = Boolean(process.env.RUNWAY_API_KEY || process.env.REPLICATE_API_TOKEN);

  const steps: AgentStep[] = pack.agents.map((agent, index) => ({
    agentId: agent.id,
    title: `${agent.name} · ${agent.specialty}`,
    detail:
      index === 0
        ? `Framed the brief around “${subject}”.`
        : index === 1
          ? `Drafted core assets for ${pack.title.toLowerCase()}.`
          : `Checked consistency against career goals and audience fit.`,
    status: "done",
  }));

  if (task === "web") {
    return {
      mode: hasOpenAI ? "live" : "demo",
      steps,
      output: {
        headline: subject,
        summary: `Three agents drafted a project showcase page for “${subject}” that stakeholders can review.`,
        artifacts: [
          { label: "Hero", content: `${subject} — shipped proof, not a résumé claim.` },
          { label: "CTA", content: "View live demo · Inspect GitHub · Request intro" },
          {
            label: "Sections",
            content: "Problem → Build → Proof links → Skills → Ask (hire / invest)",
          },
        ],
        previewHtml: `<section style="font-family:Georgia,serif;padding:2rem;background:linear-gradient(160deg,#f7b6c8,#f3d9a4);color:#2b2420"><p style="letter-spacing:.16em;text-transform:uppercase;font-size:.7rem">Pixie Dust · Web Agent</p><h1 style="font-size:2rem;margin:.5rem 0 1rem">${subject}</h1><p>Student project showcase — optimized for hiring partners and investors.</p><a style="display:inline-block;margin-top:1rem;padding:.75rem 1.2rem;border-radius:999px;background:#2b2420;color:#fff8f4;text-decoration:none">View proof</a></section>`,
      },
      apiNote: hasOpenAI
        ? "OPENAI_API_KEY detected — wire live LLM rewrite in a follow-up."
        : "Demo agents active. Optional: set OPENAI_API_KEY for live copy generation.",
    };
  }

  if (task === "image") {
    const imagePrompt = `Editorial campaign still for student project “${subject}”, soft bakery light, rose sugar and champagne gold palette, shallow depth of field, no text overlay, premium product photography`;
    return {
      mode: hasImage ? "live" : "demo",
      steps,
      output: {
        headline: `Visual system for ${subject}`,
        summary: "Art Director + Prompt Engineer + Style Critic produced a generation-ready brief.",
        artifacts: [
          { label: "Primary prompt", content: imagePrompt },
          { label: "Formats", content: "1:1 feed · 4:5 story · 16:9 hero" },
          { label: "Negative", content: "No watermarks, no cluttered backgrounds, no distorted hands" },
        ],
        imagePrompt,
      },
      apiNote: hasImage
        ? "Image provider key detected — connect generation endpoint next."
        : "Demo agents active. Real pixels need OPENAI_API_KEY (DALL·E) or REPLICATE_API_TOKEN.",
    };
  }

  if (task === "video") {
    const videoBrief = `15s opener for “${subject}”: hook (0–3s), product moment (3–10s), CTA (10–15s). Warm rose/gold grade, handheld intimacy, end card Create. Launch. Grow.`;
    return {
      mode: hasVideo ? "live" : "demo",
      steps,
      output: {
        headline: `Motion brief for ${subject}`,
        summary: "Scriptwriter + Shot Planner + Motion Director aligned a launch clip plan.",
        artifacts: [
          { label: "Hook", content: `What if ${subject} marketed itself overnight?` },
          { label: "Shot list", content: "1) Detail macro 2) Human reaction 3) UI/product 4) Logo lockup" },
          { label: "Delivery", content: "Vertical 9:16 first, crop to 1:1 and 16:9" },
        ],
        videoBrief,
      },
      apiNote: hasVideo
        ? "Video provider key detected — connect render pipeline next."
        : "Demo agents active. Real video needs RUNWAY_API_KEY or REPLICATE_API_TOKEN.",
    };
  }

  if (task === "social") {
    return {
      mode: hasOpenAI ? "live" : "demo",
      steps,
      output: {
        headline: `Professional presence for ${subject}`,
        summary:
          "LinkedIn, Instagram, and Facebook agents drafted channel-specific profile upgrades so employers and investors see a coherent story.",
        artifacts: [
          {
            label: "LinkedIn",
            content: `Headline: Builder of ${subject} · shipping production apps with AI-assisted velocity. About: lead with problem solved, live URL, GitHub proof, ask (hire/intro). Featured: demo + repo + case study.`,
          },
          {
            label: "Instagram",
            content: `Bio: “Shipping ${subject} in public.” Highlights: Build log · Demo · Stack. Cadence: 3x/week — process reel, UI still, proof post with link in bio.`,
          },
          {
            label: "Facebook",
            content: `Page voice: clear, professional, lightly warm. Pin a launch post with live demo. Weekly update: what shipped, what learned, who it’s for.`,
          },
        ],
      },
      apiNote: hasOpenAI
        ? "OPENAI_API_KEY detected — connect live social rewrite next."
        : "Demo agents active. Optional OPENAI_API_KEY for live rewrites. Official Meta/LinkedIn posting APIs can connect later for publish.",
    };
  }

  // market
  return {
    mode: hasOpenAI ? "live" : "demo",
    steps,
    output: {
      headline: `Pulse check for ${subject}`,
      summary:
        "Employer Scout, Buzzword Analyst, and Market Sentiment mapped what to emphasize so your project reads as hireable and investable right now.",
      artifacts: [
        {
          label: "Employers want",
          content:
            "Production deploys, readable GitHub history, peer reviews, clear ownership, and proof you can ship with AI tools without losing engineering judgment.",
        },
        {
          label: "Buzzwords that land (use honestly)",
          content:
            "Agent orchestration · production-ready · multi-user · observability · integration-ready · portfolio of live apps · measurable outcomes",
        },
        {
          label: "Themes & sentiment",
          content:
            "Strong interest in AI-native builders who show real products (not slide decks), open collaboration, and projects that connect to hiring/ops workflows. Lead with live URL + what a partner can do in 2 minutes.",
        },
      ],
    },
    apiNote: hasOpenAI
      ? "OPENAI_API_KEY detected — connect live market scan next."
      : "Demo pulse active. Optional OPENAI_API_KEY / news APIs later for live employer and trend feeds.",
  };
}
