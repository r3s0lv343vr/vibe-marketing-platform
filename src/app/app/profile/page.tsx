import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileBuilder } from "@/components/ProfileBuilder";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Profile builder",
  description:
    "Link your GitHub profile into the student form, edit anything you need, and open AI tools immediately.",
};

type Props = { searchParams: Promise<{ linked?: string }> };

export default async function ProfileBuilderPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session) redirect("/login?next=/app/profile");

  const { linked } = await searchParams;

  return (
    <ProfileBuilder
      defaultName={session.name}
      email={session.email}
      github={session.github}
      linked={linked === "1" || Boolean(session.github)}
      immediateAiAccess
    />
  );
}
