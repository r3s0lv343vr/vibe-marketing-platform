import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Pixie Dust Cheesecake and open your AI agent workspace.",
};

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/app/profile";
  return (
    <div className="site-shell py-16">
      <AuthForm mode="login" nextPath={nextPath} />
    </div>
  );
}
