import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/app");

  return (
    <div className="site-shell py-10">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--line)] bg-white px-4 py-4 shadow-[var(--shadow-sm)]">
        <div>
          <p className="eyebrow">Workspace</p>
          <p className="mt-1 text-lg font-semibold text-[var(--ink)]">Hi, {session.name}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/app/profile" className="btn btn-ghost !py-2">
            Profile
          </Link>
          <Link href="/app" className="btn btn-ghost !py-2">
            Agents home
          </Link>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
