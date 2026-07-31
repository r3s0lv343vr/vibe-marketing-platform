import type { Metadata } from "next";
import Link from "next/link";
import { TASKS } from "@/lib/agents";

export const metadata: Metadata = {
  title: "AI Agents",
  description:
    "Student workspace — create project assets, polish social profiles, and track employer market signals.",
};

const createTiles = [TASKS.web, TASKS.image, TASKS.video];
const careerTiles = [TASKS.social, TASKS.market];

function TileGrid({
  tiles,
}: {
  tiles: Array<(typeof TASKS)[keyof typeof TASKS]>;
}) {
  return (
    <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
  );
}

export default function AppHomePage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">
        Cohort workspace
      </p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">What do you want to do today?</h1>
      <p className="mt-4 max-w-3xl text-lg text-[var(--ink-soft)]">
        Use AI agents to showcase your digital projects and optimize how hiring partners and
        investors see you. Creative tiles build assets; career tiles polish social presence and
        surface market demand. Later, these will bind to each student&apos;s listed projects.
      </p>

      <section className="mt-12">
        <h2 className="display text-3xl">Create & showcase</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Build the public proof — pages, images, and video for your projects.
        </p>
        <TileGrid tiles={createTiles} />
      </section>

      <section className="mt-14">
        <h2 className="display text-3xl">Career & visibility</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Manage professional profiles and stay aligned with what employers are scanning for.
        </p>
        <TileGrid tiles={careerTiles} />
      </section>
    </div>
  );
}
