import Link from "next/link";

const links = [
  { href: "/partners/directory", label: "Directory" },
  { href: "/partners", label: "Partners" },
  { href: "/cohort", label: "Cohort" },
  { href: "/signup", label: "Student sign up" },
  { href: "/login", label: "Student log in" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,248,244,0.9)] backdrop-blur-md">
      <div className="h-1 w-full bg-[linear-gradient(90deg,var(--rose-deep),var(--rose),var(--gold),var(--mint))]" />
      <div className="site-shell flex items-center justify-between gap-4 py-3.5">
        <Link href="/" className="display text-lg font-semibold tracking-tight sm:text-xl">
          Pixie Dust <span className="brand-mark">Cheesecake</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--ink-soft)] lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[var(--rose-deep)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/partners/directory" className="btn btn-primary !px-4 !py-2 text-sm">
          Directory
        </Link>
      </div>
      <nav className="site-shell flex gap-4 overflow-x-auto pb-3 text-sm font-medium text-[var(--ink-soft)] lg:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap transition-colors hover:text-[var(--rose-deep)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
