import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-shell mt-24 border-t border-[var(--line)] py-10 text-sm text-[var(--ink-soft)]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="display text-2xl text-[var(--ink)]">Pixie Dust Cheesecake</p>
          <p className="mt-2 max-w-md">
            Vibe marketing for the Hult Cohort Developer Program · Summer Pilot 2026.
            Inspect the work on GitHub — then request an intro.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/cohort">Cohort</Link>
          <Link href="/studio">Studio</Link>
          <Link href="/partners">Partners</Link>
          <Link href="/status">PM Status</Link>
          <a
            href="https://github.com/rogerSuperBuilderAlpha/hult-cohort-program"
            target="_blank"
            rel="noreferrer"
          >
            Cohort repo
          </a>
        </div>
      </div>
      <p className="mt-8 text-xs opacity-70">
        Built by @r3s0lv343vr · Profiles default to public; opt-out shows as private.
      </p>
    </footer>
  );
}
