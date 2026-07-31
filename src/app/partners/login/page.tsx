import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Partner log in",
  description: "Sign in to the Partners showcase for hiring managers, employers, and investors.",
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function PartnerLoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/partners") ? next : "/partners/home";
  return (
    <div className="site-shell py-16">
      <AuthForm mode="login" audience="partner" nextPath={nextPath} />
    </div>
  );
}
