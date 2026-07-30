import type { Metadata } from "next";
import Link from "next/link";
import { TASKS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "AI Agents",
  description: "Choose what to create today — web pages, images, or video with AI agents.",
};

const tiles = [TASKS.web, TASKS.image, TASKS.video];

export default function AppHomePage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">AI Agents</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">What do you want to do today?</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--ink-soft)]">
        Pick a task tile. Coordinated AI agents will take you into web creation, image generation,
        or video creation.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {tiles.map((tile) => (
          <Link
            key={tile.slug}
            href={tile.href}
            className="group flex min-h-[220px] flex-col justify-between rounded-[2rem] border border-[var(--line)] bg-white/65 p-6 shadow-[var(--shadow)] transition hover:-translate-y-1 hover:border-[#c45d78]"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                Agent task
              </p>
              <h2 className="display mt-3 text-3xl group-hover:text-[var(--rose-deep)]">
                {tile.title}
              </h2>
              <p className="mt-3 text-[var(--ink-soft)]">{tile.blurb}</p>
            </div>
            <p className="mt-6 text-sm font-semibold text-[#3a2a28]">Begin →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
