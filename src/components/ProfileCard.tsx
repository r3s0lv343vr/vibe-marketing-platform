import Link from "next/link";
import type { CohortProfile } from "@/data/profiles";

export function ProfileCard({ profile }: { profile: CohortProfile }) {
  if (!profile.public) {
    return (
      <div className="rounded-3xl border border-dashed border-[var(--line)] bg-white/40 p-6">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--ink-soft)]">Private</p>
        <h3 className="display mt-2 text-2xl">Profile hidden</h3>
        <p className="mt-2 text-[var(--ink-soft)]">This participant opted out of a public page.</p>
      </div>
    );
  }

  return (
    <Link
      href={`/profiles/${profile.slug}`}
      className="group block rounded-3xl border border-[var(--line)] bg-white/55 p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
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
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">{profile.campus}</p>
      <h3 className="display mt-1 text-2xl group-hover:text-[var(--rose-deep)]">{profile.name}</h3>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">{profile.role}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">{profile.bio}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {profile.skills.slice(0, 4).map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-[var(--line)] bg-white/70 px-2.5 py-1 text-xs"
          >
            {skill}
          </li>
        ))}
      </ul>
    </Link>
  );
}
