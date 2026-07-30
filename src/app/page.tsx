import Link from "next/link";
import { ProfileCard } from "@/components/ProfileCard";
import { publicProfiles } from "@/data/profiles";

export default function HomePage() {
  const featured = publicProfiles().slice(0, 3);

  return (
    <>
      <section className="relative min-h-[calc(100svh-5.5rem)] overflow-hidden">
        <div
          className="absolute inset-0 grain"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(43,36,32,0.55), rgba(196,93,120,0.28)), url('https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="site-shell relative flex min-h-[calc(100svh-5.5rem)] flex-col justify-end pb-16 pt-28 text-[var(--cream)]">
          <p className="animate-rise text-xs uppercase tracking-[0.28em] text-white/80">
            Hult Cohort · Summer Pilot 2026
          </p>
          <h1 className="display animate-rise-delay mt-4 max-w-4xl text-5xl leading-[0.95] sm:text-7xl">
            <span className="shine-text">Pixie Dust Cheesecake</span>
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-xl rounded-2xl bg-[rgba(255,248,244,0.92)] px-4 py-3 text-lg text-[#3a2a28] sm:text-xl">
            The vibe marketing studio that plates cohort proof for hiring partners — Brand DNA,
            live profiles, and intros you can taste.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/cohort"
              className="btn border border-[#3a2a28] bg-[#3a2a28] text-[#fff8f4] hover:bg-[#c45d78] hover:border-[#c45d78]"
            >
              Meet the cohort
            </Link>
            <Link
              href="/studio"
              className="btn border border-[#3a2a28] bg-[#fff8f4] text-[#3a2a28] hover:bg-white"
            >
              Open the studio
            </Link>
          </div>
        </div>
      </section>

      <section className="site-shell mt-20">
        <div className="max-w-3xl">
          <h2 className="display text-4xl sm:text-5xl">A public slice of the loop</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            <p>
              Pixie Dust Cheesecake is the outward-facing marketing surface for the Hult Cohort
              Developer Program Summer Pilot 2026. Hiring partners should not have to decode
              Slack threads or trust a résumé — they should open a profile, click through to
              production apps, and watch GitHub tell the story. This platform is that tasting
              menu: cohort narrative, student portfolios, partner pathways, and a live PM status
              snapshot wired to the Phase 1 build trail.
            </p>
            <p>
              The brand is deliberately sensorial. Soft rose sugar, champagne gold, and mint
              frosting signal warmth without softness of standards. Under the glaze sits an AI
              Brand Designer studio — one prompt (“What are we marketing today?”) spins Brand DNA,
              Vibe Meter gauges, a dynamic mood board, campaign starters, and a conversational
              website preview. Agents coordinate copy, visuals, and channel strategy so the same
              identity can ship websites, Instagram, Facebook, email, and lifecycle campaigns
              without losing the crumb trail of consistency.
            </p>
            <p>
              For partners, the ask is simple: browse builders, filter by signal, request an
              intro. For the cohort, the promise is visibility with dignity — public by default,
              private when opted out, always linked to real deploys. Pixie Dust Cheesecake does
              not invent achievement; it plates it. Come for the vibe. Stay for the GitHub.
            </p>
          </div>
        </div>
      </section>

      <section className="site-shell mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display text-4xl">Featured builders</h2>
            <p className="mt-2 text-[var(--ink-soft)]">
              Sample profiles while the roster finishes filling — placeholders marked clearly.
            </p>
          </div>
          <Link href="/cohort" className="btn btn-ghost">
            View full cohort
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((profile) => (
            <ProfileCard key={profile.slug} profile={profile} />
          ))}
        </div>
      </section>

      <section className="site-shell mt-20">
        <div className="grid gap-6 overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-white/50 md:grid-cols-2">
          <div className="p-8 sm:p-10">
            <h2 className="display text-4xl">Partner pathway</h2>
            <p className="mt-4 text-[var(--ink-soft)]">
              Evaluate on shipped work. Request intros. Fee model: ~25% of first-year base on
              successful hire, with a 90-day clawback — details on the partners page.
            </p>
            <Link href="/partners" className="btn btn-primary mt-8">
              Hire from this cohort
            </Link>
          </div>
          <div
            className="min-h-[240px] animate-float bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1400&q=80')",
            }}
            role="img"
            aria-label="Layered celebration cake with berries"
          />
        </div>
      </section>
    </>
  );
}
