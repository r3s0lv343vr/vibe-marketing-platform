import type { Metadata } from "next";
import { RequestIntroForm } from "@/components/RequestIntroForm";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Hire from the Hult Cohort Summer Pilot 2026 via Pixie Dust Cheesecake — browse proof, request intros, understand the fee model.",
};

export default function PartnersPage() {
  return (
    <div className="site-shell py-14">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">Hiring partners</p>
      <h1 className="display mt-3 max-w-3xl text-5xl">Evaluate on GitHub. Hire with confidence.</h1>
      <p className="mt-5 max-w-2xl text-lg text-[var(--ink-soft)]">
        We produce developers you can evaluate entirely on public work — every review, deployment,
        and merged PR is inspectable. You pay only when you hire.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Browse",
            body: "Open cohort profiles, filter by campus and skills, click through to live PM, comms, and showcase apps.",
          },
          {
            title: "Request intro",
            body: "Tell us who you want to meet. Placement lead is notified; acknowledge within 24 hours.",
          },
          {
            title: "Hire",
            body: "Your interview process, your bar. Referral fee is ~25% of first-year base salary on start date.",
          },
        ].map((step) => (
          <article
            key={step.title}
            className="rounded-[2rem] border border-[var(--line)] bg-white/55 p-6"
          >
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
        <p className="mt-4 text-sm text-[var(--ink-soft)]">
          Full partner terms live in the cohort program docs (
          <code>partnerships/hiring-partners.md</code>).
        </p>
      </section>

      <section className="mt-14">
        <RequestIntroForm />
      </section>
    </div>
  );
}
