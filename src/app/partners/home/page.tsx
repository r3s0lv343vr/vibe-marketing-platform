import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { PartnerFeed } from "@/components/PartnerFeed";
import { getSession } from "@/lib/auth";
import { getRosterShowcaseSlides, publicRoster } from "@/lib/roster";

export const metadata: Metadata = {
  title: "Partners home",
  description: "Signed-in Partners showcase — cohort portal feed and builder directory.",
};

export default async function PartnersHomePage() {
  const session = await getSession();
  if (!session) redirect("/partners/login?next=/partners/home");
  if (session.role !== "partner") redirect("/partners/login?next=/partners/home");

  const slides = getRosterShowcaseSlides();
  const builders = publicRoster();

  return (
    <div className="pb-16">
      <div className="border-b border-[var(--line)] bg-[rgba(255,248,244,0.85)]">
        <div className="site-shell flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="eyebrow">Partners</p>
            <h1 className="display mt-1 text-3xl sm:text-4xl">Welcome, {session.name}</h1>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">
              Live cohort projects · builders · hiring evidence
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/partners/directory" className="btn btn-primary !py-2">
              Directory
            </Link>
            <Link href="/cohort" className="btn btn-ghost !py-2">
              Cohort
            </Link>
            <Link href="/partners#request-intro" className="btn btn-ghost !py-2">
              Request intro
            </Link>
            <LogoutButton redirectTo="/partners" />
          </div>
        </div>
      </div>

      <section className="site-shell pt-6">
        <PartnerFeed builders={builders} slides={slides} />
      </section>
    </div>
  );
}
