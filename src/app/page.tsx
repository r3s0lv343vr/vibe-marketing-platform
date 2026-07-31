import Link from "next/link";
import { ProjectShowcaseSlider } from "@/components/ProjectShowcaseSlider";
import { getRosterShowcaseSlides } from "@/lib/roster";

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
  const slides = getRosterShowcaseSlides();

  return (
    <>
      <section className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden">
        <div
          className="absolute inset-0 grain animate-fade"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(43,36,32,0.55), rgba(196,93,120,0.32)), url('https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="site-shell relative flex min-h-[calc(100svh-4.5rem)] flex-col justify-end pb-16 pt-28 text-[var(--cream)]">
          <h1 className="display animate-rise max-w-4xl text-5xl sm:text-7xl">
            <span className="shine-text">Pixie Dust Cheesecake</span>
          </h1>
          <p className="animate-rise-delay mt-5 max-w-xl rounded-[var(--radius-lg)] bg-[rgba(255,248,244,0.92)] px-4 py-3 text-lg text-[#3a2a28] sm:text-xl">
            An AI marketing platform that builds your brand, creates content, designs websites, and
            launches campaigns — from one conversation.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className="btn btn-primary">
              Sign up
            </Link>
            <Link href="/login" className="btn btn-secondary">
              Log in
            </Link>
          </div>
        </div>
      </section>

      <section id="marketing" className="site-shell mt-24">
        <div className="max-w-3xl">
          <p className="eyebrow">Product</p>
          <h2 className="display mt-3 text-4xl sm:text-5xl">Marketing, redesigned.</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
            <p>Stop juggling tools.</p>
            <p>
              <strong className="font-semibold text-[var(--ink)]">Pixie Dust Cheesecake</strong> is
              a vibe marketing platform where students list and showcase digital projects — then use
              AI agents to optimize how hiring partners and investors discover them.
            </p>
            <p>
              Stakeholders get a forward-facing showcase of real work. The cohort gets a private
              workspace to build assets, polish social profiles, and track what the market wants —
              so every project is easier to hire for or invest in.
            </p>
            <p className="display text-2xl font-semibold text-[var(--rose-deep)] sm:text-3xl">
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
            Sign up to begin
          </Link>
        </div>
        <div className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {capabilities.map((item, index) => (
            <div
              key={item.title}
              className="grid gap-2 py-6 sm:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.2fr)] sm:items-start sm:gap-8"
            >
              <span className="display text-sm font-semibold text-[var(--gold)] sm:pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display text-2xl text-[var(--ink)]">{item.title}</h3>
              <p className="leading-relaxed text-[var(--ink-soft)]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="showcase" className="site-shell mt-24">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">For partners & investors</p>
            <h2 className="display mt-3 text-4xl">Project homepages</h2>
            <p className="mt-3 text-[var(--ink-soft)]">
              Skim live cohort builds in a slider — open any homepage or jump to the builder.
            </p>
          </div>
          <Link href="/partners#showcase" className="btn btn-ghost">
            Full partner view
          </Link>
        </div>
        <ProjectShowcaseSlider slides={slides} />
      </section>

      <section className="site-shell mt-24 mb-4">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(105deg, rgba(43,36,32,0.78), rgba(196,93,120,0.45)), url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative max-w-xl px-8 py-14 text-[var(--cream)] sm:px-12 sm:py-16">
            <h2 className="display text-4xl">Ready when you are</h2>
            <p className="mt-4 leading-relaxed text-white/90">
              Create an account, open your agent workspace, and choose what to market today.
            </p>
            <Link href="/signup" className="btn btn-secondary mt-8">
              Sign up free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
