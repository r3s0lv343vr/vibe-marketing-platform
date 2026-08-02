import Link from "next/link";
import type { CohortProfile, ShowcaseSlide } from "@/data/profiles";

type Props = {
  builders: CohortProfile[];
  slides: ShowcaseSlide[];
};

/** Dense MSN-style portal grid for signed-in Partners home. */
export function PartnerFeed({ builders, slides }: Props) {
  const featured = slides.slice(0, 1)[0];
  const secondary = slides.slice(1, 5);
  const moreProjects = slides.slice(5, 11);
  const byCampus = groupByCampus(builders);
  const spotlight = builders.slice(0, 6);

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-5">
          {featured ? (
            <article className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-white">
              <div
                className="relative min-h-[220px] bg-cover bg-center sm:min-h-[280px]"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(43,36,32,0.15), rgba(43,36,32,0.72)), url(${featured.avatarUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"})`,
                }}
              >
                <div className="absolute inset-x-0 bottom-0 p-5 text-[var(--cream)] sm:p-6">
                  <p className="eyebrow !text-white/75">Top story</p>
                  <h2 className="display mt-2 text-3xl sm:text-4xl">{featured.title}</h2>
                  <p className="mt-2 text-sm text-white/85">
                    {featured.builderName} · @{featured.github}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 p-4">
                <a href={featured.href} target="_blank" rel="noreferrer" className="btn btn-primary !py-2">
                  Open project
                </a>
                <Link href={`/profiles/${featured.builderSlug}`} className="btn btn-ghost !py-2">
                  Builder profile
                </Link>
              </div>
            </article>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            {secondary.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-white"
              >
                <div className="flex gap-3 p-4">
                  {item.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.avatarUrl}
                      alt=""
                      className="h-14 w-14 rounded-[0.6rem] object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-[0.6rem] bg-[var(--champagne,#f7e7ce)] text-sm font-semibold">
                      {item.builderName.slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--rose-deep)]">
                      {item.kind}
                    </p>
                    <h3 className="mt-1 line-clamp-2 font-semibold leading-snug">{item.title}</h3>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">
                      {item.builderName} · @{item.github}
                    </p>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-[var(--ink)] underline underline-offset-2"
                    >
                      Visit homepage
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-5">
            <h2 className="display text-2xl">Top builders</h2>
            <ul className="mt-4 divide-y divide-[var(--line)]">
              {spotlight.map((builder) => (
                <li key={builder.slug} className="flex items-center gap-3 py-3">
                  {builder.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={builder.avatarUrl}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold"
                      style={{ background: builder.photoGradient }}
                    >
                      {builder.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/profiles/${builder.slug}`}
                      className="font-semibold hover:text-[var(--rose-deep)]"
                    >
                      {builder.name}
                    </Link>
                    <p className="truncate text-xs text-[var(--ink-soft)]">
                      @{builder.github} · {builder.campus}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/cohort" className="btn btn-ghost mt-4 w-full !py-2">
              Browse full cohort
            </Link>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-5">
            <h2 className="display text-2xl">By campus</h2>
            <ul className="mt-4 space-y-3">
              {byCampus.map(([campus, count]) => (
                <li
                  key={campus}
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <span>{campus}</span>
                  <span className="rounded-full bg-[var(--cream)] px-2.5 py-1 text-[var(--ink-soft)]">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">More to explore</p>
            <h2 className="display mt-2 text-3xl">Project wire</h2>
          </div>
          <Link href="/partners#request-intro" className="btn btn-ghost !py-2">
            Request intro
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {moreProjects.map((item) => (
            <article
              key={item.id}
              className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                {item.kind}
              </p>
              <h3 className="mt-2 font-semibold leading-snug">{item.title}</h3>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                {item.builderName} · @{item.github}
              </p>
              <div className="mt-3 flex gap-3 text-sm font-semibold">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  Homepage
                </a>
                <Link href={`/profiles/${item.builderSlug}`} className="underline underline-offset-2">
                  Profile
                </Link>
              </div>
            </article>
          ))}
          {!moreProjects.length
            ? secondary.slice(0, 3).map((item) => (
                <article
                  key={`fallback-${item.id}`}
                  className="rounded-[var(--radius)] border border-[var(--line)] bg-white p-4"
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">@{item.github}</p>
                </article>
              ))
            : null}
        </div>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-5 sm:p-6">
        <p className="eyebrow">Evidence first</p>
        <h2 className="display mt-2 text-3xl">How partners evaluate</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Inspect GitHub",
              body: "Open PRs, repos, and review trails — no résumé theater.",
            },
            {
              title: "Click live apps",
              body: "Open production homepages from the directory and project links in seconds.",
            },
            {
              title: "Request an intro",
              body: "When a builder fits, send an intro request. You pay only if you hire.",
            },
          ].map((card) => (
            <article key={card.title} className="rounded-[var(--radius)] bg-[var(--cream)] p-4">
              <h3 className="font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function groupByCampus(builders: CohortProfile[]) {
  const map = new Map<string, number>();
  for (const builder of builders) {
    map.set(builder.campus, (map.get(builder.campus) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}
