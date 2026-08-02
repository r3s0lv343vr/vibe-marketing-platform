import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nextmove-hult.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NextMove · Hult Cohort Showcase",
    template: "%s · NextMove",
  },
  description:
    "NextMove is the vibe marketing platform for the Hult Cohort Developer Program Summer Pilot 2026 — cohort profiles, partner intros, and an AI brand studio that helps hiring partners move on evidence.",
  openGraph: {
    title: "NextMove · Hult Cohort Showcase",
    description:
      "Don't trust our word — inspect their GitHub. Browse builders, request intros, and open the brand studio.",
    url: siteUrl,
    siteName: "NextMove",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextMove",
    description:
      "Vibe marketing for the Hult Cohort Summer Pilot 2026 — profiles, partners, and Brand DNA studio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${figtree.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
