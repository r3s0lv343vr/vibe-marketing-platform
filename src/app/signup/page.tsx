import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a student account with your GitHub handle and download your public profile into the Profile Builder.",
};

export default function SignupPage() {
  return (
    <div className="site-shell py-16">
      <AuthForm mode="signup" nextPath="/app/profile" />
    </div>
  );
}
