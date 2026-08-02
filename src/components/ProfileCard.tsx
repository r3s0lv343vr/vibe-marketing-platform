import Link from "next/link";
import type { CohortProfile } from "@/data/profiles";

function Initials({ name }: { name: string }) {
  return (
    <>
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </>
  );
}

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

  const liveCount = (profile.homepageUrls || []).length;
  const prCount = (profile.prUrls || []).length;

  return (
    <Link href={`/profiles/${profile.slug}`} className="tile tile-student group !min-h-0 block">
      {profile.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatarUrl}
          alt=""
          className="mb-5 h-16 w-16 rounded-full object-cover shadow-inner"
        />
      ) : (
        <div
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-black shadow-inner"
          style={{ background: profile.photoGradient }}
          aria-hidden
        >
          <Initials name={profile.name} />
        </div>
      )}
      <p className="eyebrow text-black">{profile.campus}</p>
      <h3 className="display mt-1 text-2xl text-black">{profile.name}</h3>
      <p className="mt-1 text-sm text-black">{profile.role}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black">{profile.bio}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {profile.skills.slice(0, 4).map((skill) => (
          <li key={skill} className="chip !px-2.5 !py-1 text-xs text-black">
            {skill}
          </li>
        ))}
      </ul>
      {(liveCount > 0 || prCount > 0) && (
        <p className="mt-4 text-xs font-medium text-black">
          {liveCount > 0 ? `${liveCount} live project${liveCount === 1 ? "" : "s"}` : null}
          {liveCount > 0 && prCount > 0 ? " · " : null}
          {prCount > 0 ? `${prCount} PR${prCount === 1 ? "" : "s"}` : null}
        </p>
      )}
    </Link>
  );
}
