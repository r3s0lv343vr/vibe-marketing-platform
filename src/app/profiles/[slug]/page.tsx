import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile, profiles } from "@/data/profiles";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return profiles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) return { title: "Profile" };
  if (!profile.public) {
    return {
      title: "Private profile",
      description: "This Hult Cohort participant opted out of a public profile.",
    };
  }
  return {
    title: profile.name,
    description: profile.bio,
    openGraph: {
      title: `${profile.name} · Pixie Dust Cheesecake`,
      description: profile.bio,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) notFound();

  if (!profile.public) {
    return (
      <div className="site-shell py-20">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">Privacy</p>
        <h1 className="display mt-3 text-5xl">Private profile</h1>
        <p className="mt-4 max-w-xl text-lg text-[var(--ink-soft)]">
          This participant opted out of a public page. Partners can still request a general intro
          via the partners form.
        </p>
        <Link href="/partners#request-intro" className="btn btn-primary mt-8">
          Request intro
        </Link>
      </div>
    );
  }

  return (
    <div className="site-shell py-14">
      <Link href="/cohort" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
        ← Cohort
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <div
            className="flex h-40 w-40 items-center justify-center rounded-[var(--radius-lg)] text-4xl font-semibold shadow-[var(--shadow)]"
            style={{ background: profile.photoGradient }}
          >
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
            {profile.campus}
          </p>
          <h1 className="display mt-2 text-5xl">{profile.name}</h1>
          <p className="mt-2 text-[var(--ink-soft)]">{profile.role}</p>
          {profile.highlight ? (
            <p className="mt-4 rounded-2xl border border-[var(--line)] bg-white/60 px-3 py-2 text-sm">
              {profile.highlight}
            </p>
          ) : null}
          <a
            href={`https://github.com/${profile.github}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost mt-6"
          >
            GitHub @{profile.github}
          </a>
        </aside>

        <div>
          <h2 className="display text-3xl">Bio</h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--ink-soft)]">
            {profile.bio}
          </p>

          <h2 className="display mt-10 text-3xl">Skills</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-sm"
              >
                {skill}
              </li>
            ))}
          </ul>

          <h2 className="display mt-10 text-3xl">Portfolio & evidence</h2>
          <ul className="mt-4 space-y-3">
            {profile.portfolio.map((item) => (
              <li key={`${item.label}-${item.href}`}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white/65 px-4 py-3 transition hover:shadow-[var(--shadow)]"
                >
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                      {item.kind}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </span>
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>

          <Link href="/partners#request-intro" className="btn btn-primary mt-10">
            Request intro with {profile.name.split(" ")[0]}
          </Link>
        </div>
      </div>
    </div>
  );
}
