import Link from "next/link";

export default function HomePage() {
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
            An AI marketing platform that builds your brand, creates content, designs websites, and
            launches campaigns — from one conversation.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="btn border border-[#3a2a28] bg-[#3a2a28] text-[#fff8f4] hover:bg-[#c45d78] hover:border-[#c45d78]"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="btn border border-[#3a2a28] bg-[#fff8f4] !text-[#3a2a28] hover:bg-white hover:!text-[#3a2a28]"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      <section id="marketing" className="site-shell mt-20">
        <div className="max-w-3xl">
          <h2 className="display text-4xl sm:text-5xl">Marketing, redesigned.</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            <p>Stop juggling tools.</p>
            <p>
              <strong className="font-semibold text-[var(--ink)]">Pixie Dust Cheesecake</strong> is
              an AI marketing platform that builds your brand, creates your content, designs your
              website, and launches campaigns—all from a simple conversation.
            </p>
            <p>
              Powered by intelligent AI agents, it helps businesses create consistent,
              high-performing marketing faster than ever before.
            </p>
            <p className="display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
              Create. Launch. Grow.
            </p>
          </div>
        </div>
      </section>

      <section className="site-shell mt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="display text-4xl">What agents can build</h2>
            <p className="mt-2 text-[var(--ink-soft)]">
              After you sign up, pick a tile and coordinated AI agents start the work.
            </p>
          </div>
          <Link href="/signup" className="btn btn-ghost !text-[#3a2a28]">
            Sign up to begin
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "AI Web Page Creation",
              body: "Brand Strategist, Copywriter, and Layout Architect draft a live page preview from your brief.",
            },
            {
              title: "AI Image Generation",
              body: "Art Director, Prompt Engineer, and Style Critic produce generation-ready campaign visuals.",
            },
            {
              title: "AI Video Creation",
              body: "Scriptwriter, Shot Planner, and Motion Director align a launch clip you can produce next.",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-[2rem] border border-[var(--line)] bg-white/55 p-6"
            >
              <h3 className="display text-2xl">{card.title}</h3>
              <p className="mt-3 text-[var(--ink-soft)]">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-shell mt-20">
        <div className="grid gap-6 overflow-hidden rounded-[2.5rem] border border-[var(--line)] bg-white/50 md:grid-cols-2">
          <div className="p-8 sm:p-10">
            <h2 className="display text-4xl">Ready when you are</h2>
            <p className="mt-4 text-[var(--ink-soft)]">
              Create an account, open your agent workspace, and choose what to market today.
            </p>
            <Link href="/signup" className="btn btn-primary mt-8">
              Sign up free
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
