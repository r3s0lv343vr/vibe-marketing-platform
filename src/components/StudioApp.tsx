"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { EXAMPLE_PROMPTS, runStudio, type StudioState } from "@/lib/studio";

const vibeLabels: Array<keyof StudioState["vibes"]> = [
  "trust",
  "luxury",
  "innovation",
  "authority",
  "community",
  "fun",
];

export function StudioApp() {
  const [input, setInput] = useState("What are we marketing today?");
  const [state, setState] = useState<StudioState | null>(null);

  useEffect(() => {
    setState(runStudio("Launching a neighborhood coffee shop"));
  }, []);

  const messages = useMemo(() => {
    if (!state) return [];
    return [
      {
        role: "pixie" as const,
        text: "What are we marketing today? Drop a launch, a channel, or a vibe — I’ll spin Brand DNA, assets, and a campaign starter.",
      },
      { role: "you" as const, text: state.prompt || "Launching a neighborhood coffee shop" },
      {
        role: "pixie" as const,
        text: `Locked goal: ${state.goal}. Brand DNA refreshed. Preview + feed updated — refine anything in plain English.`,
      },
    ];
  }, [state]);

  function generate(prompt: string) {
    setState(runStudio(prompt));
    setInput("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    generate(input.trim());
  }

  if (!state) {
    return (
      <div className="rounded-[2rem] border border-[var(--line)] bg-white/50 p-8 text-[var(--ink-soft)]">
        Warming the ovens…
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_300px] xl:grid-rows-[minmax(520px,1fr)_auto]">
      <section className="flex min-h-[420px] flex-col rounded-[2rem] border border-[var(--line)] bg-white/60 p-4 xl:row-span-1">
        <h2 className="display text-2xl">Conversation</h2>
        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`max-w-[95%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                m.role === "you"
                  ? "ml-auto bg-[var(--ink)] text-[var(--cream)]"
                  : "bg-white/80 text-[var(--ink)]"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => generate(example)}
              className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-left text-xs hover:bg-white"
            >
              {example}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-full border border-[var(--line)] bg-white/80 px-4 py-3 text-sm"
            placeholder="Adjust tone, swap assets, or pick a new goal…"
          />
          <button type="submit" className="btn btn-primary !px-4 !py-3 text-sm">
            Bake
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white/50 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3 text-sm">
          <span className="font-medium">Live preview · {state.goal}</span>
          <span className="text-[var(--ink-soft)]">Conversational website builder</span>
        </div>
        <div
          className="min-h-[360px] bg-[var(--cream)] p-3 sm:p-5"
          dangerouslySetInnerHTML={{ __html: state.previewHtml }}
        />
      </section>

      <aside className="space-y-4 xl:row-span-1">
        <section className="rounded-[2rem] border border-[var(--line)] bg-white/60 p-4">
          <h2 className="display text-2xl">Brand DNA</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-[var(--ink-soft)]">Personality</dt>
              <dd>{state.brand.personality}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink-soft)]">Tone</dt>
              <dd>{state.brand.tone}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink-soft)]">Audience</dt>
              <dd>{state.brand.audience}</dd>
            </div>
            <div>
              <dt className="text-[var(--ink-soft)]">Typography</dt>
              <dd>{state.brand.typography}</dd>
            </div>
            <div>
              <dt className="mb-2 text-[var(--ink-soft)]">Colors</dt>
              <dd className="flex gap-2">
                {(state.brand.colors ?? []).map((c) => (
                  <span
                    key={c}
                    title={c}
                    className="h-8 w-8 rounded-full border border-white shadow"
                    style={{ background: c }}
                  />
                ))}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-[2rem] border border-[var(--line)] bg-white/60 p-4">
          <h2 className="display text-2xl">Vibe Meter</h2>
          <ul className="mt-3 space-y-3">
            {vibeLabels.map((key) => (
              <li key={key}>
                <div className="mb-1 flex justify-between text-xs uppercase tracking-[0.14em]">
                  <span>{key}</span>
                  <span>{state.vibes[key]}</span>
                </div>
                <div className="meter">
                  <span style={{ width: `${state.vibes[key]}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[2rem] border border-[var(--line)] bg-white/60 p-4">
          <h2 className="display text-2xl">Mood Board</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {state.mood.map((item) => (
              <li
                key={item}
                className="rounded-full border border-[var(--line)] bg-[linear-gradient(120deg,rgba(247,182,200,.45),rgba(243,217,164,.55),rgba(159,214,194,.45))] px-3 py-1.5 text-xs"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <section className="rounded-[2rem] border border-[var(--line)] bg-white/60 p-4 xl:col-span-3">
        <h2 className="display text-2xl">Marketing feed</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {state.feed.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[var(--line)] bg-white/75 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">{item.kind}</p>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
