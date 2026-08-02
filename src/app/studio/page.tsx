import type { Metadata } from "next";
import { StudioApp } from "@/components/StudioApp";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "NextMove AI Brand Designer — conversational Brand DNA, Vibe Meter, mood board, and campaign builder.",
};

export default function StudioPage() {
  return (
    <div className="site-shell py-14">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">
        AI Brand Designer
      </p>
      <h1 className="display mt-3 text-5xl">What are we marketing today?</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--ink-soft)]">
        One conversation creates Brand DNA, assets, and campaign starters — then refine tone,
        channels, and previews in plain English. Demo engine runs client-side for review week;
        pathway stubs exist for Email, Facebook, and Instagram handoff.
      </p>
      <div className="mt-10">
        <StudioApp />
      </div>
    </div>
  );
}
