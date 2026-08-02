import type { Metadata } from "next";
import Link from "next/link";
import { EmailSignupChooser } from "@/components/EmailSignupChooser";

export const metadata: Metadata = {
  title: "Sign up with email",
  description:
    "Create a NextMove account with email — choose Student or Partner, then continue into your workspace.",
};

type Props = { searchParams: Promise<{ role?: string }> };

export default async function EmailSignupPage({ searchParams }: Props) {
  const { role } = await searchParams;
  const initialAudience = role === "partner" ? "partner" : "student";

  return (
    <div className="site-shell py-16">
      <div className="mx-auto mb-8 max-w-md text-center">
        <p className="eyebrow">Email enrollment</p>
        <h1 className="display mt-3 text-4xl">Choose your path</h1>
        <p className="mt-3 text-[var(--ink-soft)]">
          Prefer GitHub?{" "}
          <Link href="/signup" className="font-semibold text-[var(--aurora)] underline underline-offset-2">
            Sign up with GitHub handle
          </Link>
        </p>
      </div>
      <EmailSignupChooser initialAudience={initialAudience} />
    </div>
  );
}
