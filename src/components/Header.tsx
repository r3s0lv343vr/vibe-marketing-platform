import Link from "next/link";

const links = [
  { href: "/#marketing", label: "Product" },
  { href: "/signup", label: "Sign up" },
  { href: "/login", label: "Log in" },
];

export function Header() {
  return (
    <header className="site-shell sticky top-0 z-40 pt-4">
      <div className="flex items-center justify-between gap-4 rounded-full border border-[var(--line)] bg-white/55 px-4 py-3 backdrop-blur-md sm:px-6">
        <Link href="/" className="display text-lg font-semibold tracking-tight sm:text-xl">
          Pixie Dust <span className="text-[var(--rose-deep)]">Cheesecake</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-[var(--ink-soft)] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--ink)]">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/signup" className="btn btn-primary !px-4 !py-2 text-sm">
          Sign up
        </Link>
      </div>
      <nav className="mt-3 flex gap-3 overflow-x-auto pb-1 text-sm font-medium text-[var(--ink-soft)] md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-full border border-[var(--line)] bg-white/50 px-3 py-1.5"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
