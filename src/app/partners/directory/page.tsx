import type { Metadata } from "next";
import Link from "next/link";
import { PartnerDirectory } from "@/components/PartnerDirectory";
import { getDirectoryParticipants } from "@/lib/directory";

export const metadata: Metadata = {
  title: "Partner directory",
  description:
    "Searchable directory of Hult Cohort builders for partners — names, GitHub handles, projects, technologies, and live Vercel links.",
};

export default function PartnerDirectoryPage() {
  const participants = getDirectoryParticipants();
  const error =
    participants.length === 0
      ? "No directory data is available yet. Run the GitHub roster import and redeploy."
      : null;

  return (
    <div className="site-shell !w-[min(1280px,calc(100%-2rem))] py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--ink-soft)]">
        <Link href="/partners" className="hover:text-[var(--rose-deep)]">
          Partners
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-[var(--ink)]">Directory</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">Forward-facing partners</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Cohort directory</h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--ink-soft)]">
          Browse participants by name, GitHub handle, project, or technology. Open a tile for the
          full profile, repository, and live Vercel project when available.
        </p>
      </header>

      <div className="mt-10">
        <PartnerDirectory participants={participants} initialError={error} />
      </div>
    </div>
  );
}
