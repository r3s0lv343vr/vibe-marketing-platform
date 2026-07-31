export type LlmProvider = "openai" | "kimi";

export type ChatResult = {
  text: string;
  provider: LlmProvider;
  model: string;
};

function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function hasKimi() {
  return Boolean(process.env.KIMI_API_KEY?.trim());
}

export function llmAvailability() {
  return {
    openai: hasOpenAI(),
    kimi: hasKimi(),
    any: hasOpenAI() || hasKimi(),
  };
}

async function chatOpenAI(system: string, user: string): Promise<ChatResult> {
  const key = process.env.OPENAI_API_KEY!.trim();
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `OpenAI chat failed (${res.status})`);
  }
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenAI returned an empty response.");
  return { text, provider: "openai", model };
}

async function chatKimi(system: string, user: string): Promise<ChatResult> {
  const key = process.env.KIMI_API_KEY!.trim();
  const base = (process.env.KIMI_BASE_URL?.trim() || "https://api.moonshot.ai/v1").replace(
    /\/$/,
    "",
  );
  const model = process.env.KIMI_MODEL?.trim() || "moonshot-v1-8k";
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Kimi chat failed (${res.status})`);
  }
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Kimi returned an empty response.");
  return { text, provider: "kimi", model };
}

/** Prefer OpenAI, fall back to Kimi. */
export async function chatLLM(system: string, user: string): Promise<ChatResult> {
  const errors: string[] = [];
  if (hasOpenAI()) {
    try {
      return await chatOpenAI(system, user);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "OpenAI failed");
    }
  }
  if (hasKimi()) {
    try {
      return await chatKimi(system, user);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Kimi failed");
    }
  }
  throw new Error(errors.join(" · ") || "No LLM API keys configured.");
}

export async function generateImageOpenAI(prompt: string): Promise<string> {
  if (!hasOpenAI()) {
    throw new Error("OPENAI_API_KEY is required for image generation.");
  }
  const key = process.env.OPENAI_API_KEY!.trim();
  const model = process.env.OPENAI_IMAGE_MODEL?.trim() || "dall-e-3";
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: prompt.slice(0, 3500),
      n: 1,
      size: "1024x1024",
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `OpenAI image failed (${res.status})`);
  }
  const url = data?.data?.[0]?.url as string | undefined;
  if (!url) throw new Error("OpenAI image response missing url.");
  return url;
}

export function extractJsonObject<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] || text).trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return JSON.");
  }
  return JSON.parse(candidate.slice(start, end + 1)) as T;
}
