import Link from "next/link";

const links = [
  { href: "/#marketing", label: "Product" },
  { href: "/signup", label: "Sign up" },
  { href: "/login", label: "Log in" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(247,252,251,0.9)] backdrop-blur-md">
      <div className="h-1 w-full bg-[linear-gradient(90deg,var(--brand),var(--mint),var(--accent))]" />
      <div className="site-shell flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="display text-lg font-semibold tracking-tight sm:text-xl">
          Pixie Dust <span className="brand-mark">Cheesecake</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[var(--ink-soft)] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[var(--brand-deep)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/signup" className="btn btn-primary !px-4 !py-2 text-sm">
          Sign up
        </Link>
      </div>
      <nav className="site-shell flex gap-4 overflow-x-auto pb-3 text-sm font-medium text-[var(--ink-soft)] md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap transition-colors hover:text-[var(--brand-deep)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
