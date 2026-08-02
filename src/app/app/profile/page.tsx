import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileBuilder } from "@/components/ProfileBuilder";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Profile builder",
  description: "Complete your student profile before accessing the agent workspace.",
};

export default async function ProfileBuilderPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/app/profile");

  return (
    <ProfileBuilder
      defaultName={session.name}
      email={session.email}
      github={session.github}
    />
  );
}
