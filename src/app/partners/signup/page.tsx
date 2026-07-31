import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Partner sign up",
  description: "Create a Partners account to access the cohort showcase feed.",
};

export default function PartnerSignupPage() {
  return (
    <div className="site-shell py-16">
      <AuthForm mode="signup" audience="partner" nextPath="/partners/home" />
    </div>
  );
}
