import Link from "next/link";

const capabilities = [
  {
    title: "AI Web Page Creation",
    body: "Draft project showcase pages hiring partners and investors can inspect in minutes.",
  },
  {
    title: "AI Image Generation",
    body: "Campaign visuals and social stills that support your project story.",
  },
  {
    title: "AI Video Creation",
    body: "Demo scripts and shot lists that make your build easy to share.",
  },
  {
    title: "Social Profile Studio",
    body: "Professionally manage Facebook, Instagram, and LinkedIn for hireability.",
  },
  {
    title: "Employer & Market Pulse",
    body: "Buzzwords, project themes, and sentiment — what employers are looking for now.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="site-shell relative min-h-[78vh] pt-16 pb-20 sm:pt-24">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[rgba(62,255,176,0.12)] blur-3xl animate-fade" />
        <div className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-[rgba(56,189,248,0.1)] blur-3xl animate-fade" />

        <p className="eyebrow animate-rise">Hult Cohort Summer Pilot</p>
        <h1 className="display mt-4 max-w-4xl text-6xl tracking-tight text-[var(--ink)] sm:text-7xl lg:text-8xl animate-rise-delay">
          Next<span className="brand-mark shine-text">Move</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-soft)] sm:text-xl animate-rise-delay-2">
          Showcase shipped work. Let GitHub tell the story. Help hiring partners move on evidence —
          not résumés.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 animate-rise-delay-2">
          <Link href="/signup" className="btn btn-primary">
            Sign up with GitHub
          </Link>
          <Link href="/partners/directory" className="btn btn-ghost">
            Browse directory
          </Link>
        </div>
      </section>

      <section id="marketing" className="site-shell mt-6">
        <div className="max-w-3xl">
          <p className="eyebrow">Product</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">Marketing, redesigned.</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            <p>Stop juggling tools.</p>
            <p>
              <strong className="font-semibold text-[var(--ink)]">NextMove</strong> is a vibe
              marketing platform where students list and showcase digital projects — then use AI
              agents to optimize how hiring partners and investors discover them.
            </p>
            <p>
              Stakeholders use the{" "}
              <Link href="/partners" className="font-semibold text-[var(--aurora)] underline">
                Partners
              </Link>{" "}
              side. The cohort gets a private workspace to build assets, polish social profiles, and
              track what the market wants.
            </p>
            <p className="display text-2xl font-semibold text-[var(--aurora)] sm:text-3xl">
              Create. Launch. Grow.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <div className="band-brand">
          <div className="site-shell py-14 sm:py-16">
            <p className="eyebrow">Why teams stay</p>
            <h2 className="display mt-3 max-w-2xl text-4xl text-[var(--cream)] sm:text-5xl">
              Bright tools. Clear workflow. Real momentum.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/88">
              From first brief to polished assets, agents keep the energy high and the process
              professional — so builders keep shipping instead of switching tabs.
            </p>
          </div>
        </div>
      </section>

      <section className="site-shell mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Capabilities</p>
            <h2 className="display mt-3 text-4xl">What agents can build</h2>
            <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
              After you sign up, pick a task and coordinated AI agents start the work.
            </p>
          </div>
          <Link href="/signup" className="btn btn-ghost">
            Sign up with GitHub
          </Link>
        </div>
        <div className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {capabilities.map((item, index) => (
            <div
              key={item.title}
              className="grid gap-2 py-6 sm:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.2fr)] sm:items-start sm:gap-8"
            >
              <span className="display text-sm font-semibold text-[var(--aurora)] sm:pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display text-2xl text-[var(--ink)]">{item.title}</h3>
              <p className="leading-relaxed text-[var(--ink-soft)]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-shell mt-24 mb-4">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(105deg, rgba(3,16,36,0.88), rgba(16,185,129,0.35)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative grid gap-8 px-8 py-14 text-[var(--cream)] sm:px-12 sm:py-16 lg:grid-cols-2">
            <div>
              <h2 className="display text-4xl">Students</h2>
              <p className="mt-4 leading-relaxed text-white/90">
                Create an account with your GitHub handle, build your profile, and open the agent
                workspace.
              </p>
              <Link href="/signup" className="btn btn-secondary mt-8">
                Student sign up
              </Link>
            </div>
            <div>
              <h2 className="display text-4xl">Partners</h2>
              <p className="mt-4 leading-relaxed text-white/90">
                Hiring managers, employers, and investors — sign in for the full showcase feed.
              </p>
              <Link href="/partners/signup" className="btn btn-secondary mt-8">
                Partner sign up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
