import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ParticipantProfile } from "@/components/PartnerDirectory";
import { getDirectoryParticipant, getDirectoryParticipants } from "@/lib/directory";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getDirectoryParticipants().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = getDirectoryParticipant(slug);
  if (!person) return { title: "Participant" };
  return {
    title: `${person.name} · Directory`,
    description: person.bio,
  };
}

export default async function PartnerDirectoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const person = getDirectoryParticipant(slug);
  if (!person) notFound();

  return (
    <div className="site-shell py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--ink-soft)]">
        <Link href="/partners" className="hover:text-[var(--rose-deep)]">
          Partners
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <Link href="/partners/directory" className="hover:text-[var(--rose-deep)]">
          Directory
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-[var(--ink)]">{person.name}</span>
      </nav>

      <div className="mt-8">
        <ParticipantProfile person={person} />
      </div>

      <div className="mt-12">
        <Link href="/partners/directory" className="btn btn-ghost">
          ← Back to directory
        </Link>
      </div>
    </div>
  );
}
