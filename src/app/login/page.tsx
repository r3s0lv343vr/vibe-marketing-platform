import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in with your GitHub handle or email to open your profile builder and AI agent workspace.",
};

type Props = { searchParams: Promise<{ next?: string; method?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next, method } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/app/profile";
  const identity = method === "email" ? "email" : "github";
  return (
    <div className="site-shell py-16">
      <AuthForm mode="login" identity={identity} nextPath={nextPath} />
    </div>
  );
}
