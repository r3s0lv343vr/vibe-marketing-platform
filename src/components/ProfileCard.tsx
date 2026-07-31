import Link from "next/link";
import type { CohortProfile } from "@/data/profiles";

export function ProfileCard({ profile }: { profile: CohortProfile }) {
  if (!profile.public) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] bg-white/50 p-6">
        <p className="eyebrow">Private</p>
        <h3 className="display mt-2 text-2xl">Profile hidden</h3>
        <p className="mt-2 text-[var(--ink-soft)]">This participant opted out of a public page.</p>
      </div>
    );
  }

  return (
    <Link
      href={`/profiles/${profile.slug}`}
      className="tile group !min-h-0 block"
    >
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-[var(--ink)] shadow-inner"
        style={{ background: profile.photoGradient }}
        aria-hidden
      >
        {profile.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </div>
      <p className="eyebrow">{profile.campus}</p>
      <h3 className="display mt-1 text-2xl group-hover:text-[var(--rose-deep)]">{profile.name}</h3>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">{profile.role}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">{profile.bio}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {profile.skills.slice(0, 4).map((skill) => (
          <li
            key={skill}
            className="chip !px-2.5 !py-1 text-xs"
          >
            {skill}
          </li>
        ))}
      </ul>
    </Link>
  );
}
