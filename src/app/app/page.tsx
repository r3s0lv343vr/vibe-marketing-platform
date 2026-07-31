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
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tiles.map((tile) => (
        <Link key={tile.slug} href={tile.href} className="tile group">
          <div>
            <p className="eyebrow">Agent task</p>
            <h2 className="display mt-3 text-3xl transition-colors group-hover:text-[var(--brand-deep)]">
              {tile.title}
            </h2>
            <p className="mt-3 text-[var(--ink-soft)] leading-relaxed">{tile.blurb}</p>
          </div>
          <p className="mt-6 text-sm font-semibold text-[var(--ink)]">Begin →</p>
        </Link>
      ))}
    </div>
  );
}

export default function AppHomePage() {
  return (
    <div>
      <p className="eyebrow">Cohort workspace</p>
      <h1 className="display mt-3 text-4xl sm:text-5xl">What do you want to do today?</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--ink-soft)]">
        Use AI agents to showcase your digital projects and optimize how hiring partners and
        investors see you. Creative tiles build assets; career tiles polish social presence and
        surface market demand.
      </p>

      <section className="mt-14">
        <h2 className="display text-3xl">Create & showcase</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Build the public proof — pages, images, and video for your projects.
        </p>
        <TileGrid tiles={createTiles} />
      </section>

      <section className="mt-16">
        <h2 className="display text-3xl">Career & visibility</h2>
        <p className="mt-2 text-[var(--ink-soft)]">
          Manage professional profiles and stay aligned with what employers are scanning for.
        </p>
        <TileGrid tiles={careerTiles} />
      </section>
    </div>
  );
}
