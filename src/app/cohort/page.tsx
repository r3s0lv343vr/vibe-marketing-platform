import type { Metadata } from "next";
import { ProfileCard } from "@/components/ProfileCard";
import { getRoster } from "@/lib/roster";

export const metadata: Metadata = {
  title: "Cohort",
  description:
    "Browse Hult Cohort Summer Pilot 2026 builders on NextMove — public profiles with GitHub and portfolio links.",
};

export default function CohortPage() {
  const profiles = getRoster();

  return (
    <div className="site-shell py-14">
      <p className="eyebrow">Directory</p>
      <h1 className="display mt-3 text-5xl">The cohort</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--ink-soft)]">
        Public by default. Opt-out profiles show as private. Import classmate GitHub handles to fill
        avatars, live project homepages, and cohort PR links in bulk.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard key={profile.slug} profile={profile} />
        ))}
      </div>
    </div>
  );
}
