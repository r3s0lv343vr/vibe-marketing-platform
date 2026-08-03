import type { Metadata } from "next";
import { SocialMarketingStudio } from "@/components/SocialMarketingStudio";

export const metadata: Metadata = {
  title: "Social Media Marketing",
  description:
    "Facebook, Instagram, and LinkedIn terminals — craft, preview, copy/export, and manually link accounts.",
};

export default function SocialAgentPage() {
  return <SocialMarketingStudio />;
}
