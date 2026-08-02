import type { Metadata } from "next";
import Link from "next/link";
import { RequestIntroForm } from "@/components/RequestIntroForm";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Partners portal for hiring managers, employers, and investors evaluating Hult Cohort Summer Pilot builders.",
};

export default async function PartnersPage() {
  const session = await getSession();
  const isPartner = session?.role === "partner";

  return (
    <div className="site-shell py-14">
      <p className="eyebrow">Partners</p>
      <h1 className="display mt-3 max-w-3xl text-5xl">
        Hire and invest on evidence — not résumés.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">
        The Partners side is for hiring partners, employers, and investors. Start with the searchable
        cohort directory — names, GitHub handles, technologies, repositories, and live Vercel
        projects.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/partners/directory" className="btn btn-primary">
          Open directory
        </Link>
        {isPartner ? (
          <Link href="/partners/home" className="btn btn-secondary">
            Partners home
          </Link>
        ) : (
          <>
            <Link href="/partners/signup" className="btn btn-secondary">
              Partner sign up
            </Link>
            <Link href="/partners/login" className="btn btn-ghost">
              Partner log in
            </Link>
          </>
        )}
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Browse",
            body: "Open cohort profiles, scan campuses and skills, and click through to live apps.",
          },
          {
            title: "Request intro",
            body: "Tell us who you want to meet. Placement lead is notified within 24 hours.",
          },
          {
            title: "Hire",
            body: "Your interview process, your bar. Referral fee is ~25% of first-year base salary on start date.",
          },
        ].map((step) => (
          <article key={step.title} className="panel-solid p-6">
            <h2 className="display text-3xl">{step.title}</h2>
            <p className="mt-3 text-[var(--ink-soft)]">{step.body}</p>
          </article>
        ))}
      </div>

      <section className="mt-14 max-w-3xl">
        <h2 className="display text-4xl">Fee model (summary)</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--ink-soft)]">
          <li>25% of first-year base salary (signing bonus excluded unless &gt;20% of total comp)</li>
          <li>Triggered when the candidate starts employment; invoice Net 30</li>
          <li>100% clawback if terminated for cause / leaves within 90 days</li>
          <li>No exclusivity — students may receive multiple offers</li>
        </ul>
      </section>

      <section className="mt-14" id="request-intro">
        <RequestIntroForm />
      </section>
    </div>
  );
}
