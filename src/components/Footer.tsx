import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--line)] bg-[rgba(16,185,129,0.06)]">
      <div className="site-shell flex flex-col gap-8 py-12 text-sm text-[var(--ink-soft)] sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="display text-2xl text-[var(--ink)]">
            Next<span className="brand-mark">Move</span>
          </p>
          <p className="mt-3 max-w-md leading-relaxed">
            AI marketing platform for student builders — create brands, websites, images, and
            campaigns with coordinated agents.
          </p>
          <p className="mt-3 text-xs font-semibold tracking-[0.12em] uppercase text-[var(--aurora)]">
            Create. Launch. Grow.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <p className="eyebrow">Navigate</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
            <Link href="/partners" className="hover:text-[var(--aurora)]">
              Partners
            </Link>
            <Link href="/partners/login" className="hover:text-[var(--aurora)]">
              Partner log in
            </Link>
            <Link href="/signup" className="hover:text-[var(--aurora)]">
              Student sign up
            </Link>
            <Link href="/cohort" className="hover:text-[var(--aurora)]">
              Cohort
            </Link>
            <Link href="/app" className="hover:text-[var(--aurora)]">
              Agents
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
