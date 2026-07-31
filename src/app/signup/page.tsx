import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Pixie Dust Cheesecake account and start marketing with AI agents.",
};

export default function SignupPage() {
  return (
    <div className="site-shell py-16">
      <AuthForm mode="signup" nextPath="/app/profile" />
    </div>
  );
}
