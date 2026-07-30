import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-shell mt-24 border-t border-[var(--line)] py-10 text-sm text-[var(--ink-soft)]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="display text-2xl text-[var(--ink)]">Pixie Dust Cheesecake</p>
          <p className="mt-2 max-w-md">
            AI marketing platform — create brands, websites, images, and campaigns with coordinated
            agents. Create. Launch. Grow.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/signup">Sign up</Link>
          <Link href="/login">Log in</Link>
          <Link href="/app">Agents</Link>
          <Link href="/studio">Studio demo</Link>
        </div>
      </div>
    </footer>
  );
}
