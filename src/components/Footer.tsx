import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--line)] bg-[rgba(255,255,255,0.35)]">
      <div className="site-shell flex flex-col gap-8 py-12 text-sm text-[var(--ink-soft)] sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="display text-2xl text-[var(--ink)]">Pixie Dust Cheesecake</p>
          <p className="mt-3 max-w-md leading-relaxed">
            AI marketing platform for student builders — create brands, websites, images, and
            campaigns with coordinated agents.
          </p>
          <p className="mt-3 text-xs font-medium tracking-[0.12em] uppercase text-[var(--ink)]">
            Create. Launch. Grow.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <p className="eyebrow">Navigate</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            <Link href="/signup" className="hover:text-[var(--ink)]">
              Sign up
            </Link>
            <Link href="/login" className="hover:text-[var(--ink)]">
              Log in
            </Link>
            <Link href="/app" className="hover:text-[var(--ink)]">
              Agents
            </Link>
            <Link href="/studio" className="hover:text-[var(--ink)]">
              Studio demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
