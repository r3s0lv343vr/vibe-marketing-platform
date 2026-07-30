"use client";

import { FormEvent, useState } from "react";
import type { AgentRole, AgentRunResult } from "@/lib/agents";

export function AgentRunner({
  task,
  title,
  agents,
  placeholder,
}: {
  task: "web" | "image" | "video";
  title: string;
  agents: AgentRole[];
  placeholder: string;
}) {
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AgentRunResult | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, brief }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Agent run failed");
      setResult(data.result as AgentRunResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-[2rem] border border-[var(--line)] bg-white/65 p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">AI agents</p>
        <h1 className="display mt-2 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
          Specialized agents coordinate this task. Describe what you want — they draft the next
          step together.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="grid gap-2 text-sm">
            <span className="font-medium">Brief</span>
            <textarea
              required
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={5}
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
              placeholder={placeholder}
            />
          </label>
          <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-60">
            {loading ? "Agents working…" : "Run agents"}
          </button>
        </form>

        {error ? (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--cream)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                {result.mode} mode
              </p>
              <h2 className="display mt-1 text-3xl">{result.output.headline}</h2>
              <p className="mt-2 text-[var(--ink-soft)]">{result.output.summary}</p>
              <p className="mt-3 text-sm text-[var(--ink-soft)]">{result.apiNote}</p>
            </div>

            <ul className="space-y-2">
              {result.steps.map((step) => (
                <li
                  key={step.agentId}
                  className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3"
                >
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-sm text-[var(--ink-soft)]">{step.detail}</p>
                </li>
              ))}
            </ul>

            <div className="grid gap-3 sm:grid-cols-2">
              {result.output.artifacts.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-[var(--line)] bg-white/80 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed">{item.content}</p>
                </article>
              ))}
            </div>

            {result.output.previewHtml ? (
              <div
                className="overflow-hidden rounded-2xl border border-[var(--line)]"
                dangerouslySetInnerHTML={{ __html: result.output.previewHtml }}
              />
            ) : null}
          </div>
        ) : null}
      </section>

      <aside className="h-fit rounded-[2rem] border border-[var(--line)] bg-white/60 p-5">
        <h2 className="display text-2xl">Agent roster</h2>
        <ul className="mt-4 space-y-3">
          {agents.map((agent) => (
            <li key={agent.id} className="rounded-2xl border border-[var(--line)] bg-white/80 p-3">
              <p className="font-semibold">{agent.name}</p>
              <p className="text-sm text-[var(--ink-soft)]">{agent.specialty}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
