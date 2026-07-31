import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/LogoutButton";
import { getSession } from "@/lib/auth";
import { PROFILE_COMPLETE_COOKIE } from "@/lib/profile";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/app/profile");

  const jar = await cookies();
  const complete = jar.get(PROFILE_COMPLETE_COOKIE)?.value === "1";

  return (
    <div className="site-shell py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-[var(--line)] bg-white/60 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-soft)]">
            {complete ? "Workspace" : "Onboarding"}
          </p>
          <p className="font-semibold text-[var(--ink)]">Hi, {session.name}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/app/profile" className="btn btn-ghost !py-2 !text-[#3a2a28]">
            Profile
          </Link>
          {complete ? (
            <Link href="/app" className="btn btn-ghost !py-2 !text-[#3a2a28]">
              Agents home
            </Link>
          ) : null}
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
