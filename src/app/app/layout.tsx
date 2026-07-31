import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/app");

  return (
    <div className="site-shell py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-[var(--line)] bg-white/60 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">Workspace</p>
          <p className="font-semibold text-[var(--ink)]">Hi, {session.name}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/app/profile" className="btn btn-ghost !py-2 !text-[#3a2a28]">
            Profile
          </Link>
          <Link href="/app" className="btn btn-ghost !py-2 !text-[#3a2a28]">
            Agents home
          </Link>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
