"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ShowcaseSlide } from "@/data/profiles";

export function ProjectShowcaseSlider({ slides }: { slides: ShowcaseSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="panel-solid p-8 text-[var(--ink-soft)]">
        No live project homepages yet. Import classmate GitHub handles to populate this slider.
      </div>
    );
  }

  const slide = slides[index];
  const go = (next: number) => {
    setIndex((next + slides.length) % slides.length);
  };

  return (
    <div className="panel-solid overflow-hidden">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[280px] bg-[var(--cream)] lg:min-h-[360px]">
          <div className="flex items-center gap-2 border-b border-[var(--line)] bg-white/80 px-3 py-2 text-xs text-[var(--ink-soft)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--rose)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--mint)]" />
            <span className="ml-2 truncate">{slide.href}</span>
          </div>
          <iframe
            key={slide.href}
            title={`${slide.title} preview`}
            src={slide.href}
            className="absolute inset-0 top-9 h-[calc(100%-2.25rem)] w-full border-0 bg-white"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <p className="eyebrow">Live projects</p>
            <h3 className="display mt-3 text-3xl sm:text-4xl">{slide.title}</h3>
            <p className="mt-3 text-[var(--ink-soft)]">
              Built by{" "}
              <Link
                href={`/profiles/${slide.builderSlug}`}
                className="font-semibold text-[var(--ink)] underline underline-offset-2"
              >
                {slide.builderName}
              </Link>
            </p>
            <p className="mt-1 text-sm text-[var(--ink-soft)]">@{slide.github}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={slide.href}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Open homepage
              </a>
              <Link href={`/profiles/${slide.builderSlug}`} className="btn btn-ghost">
                View builder
              </Link>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost !px-3 !py-2" onClick={() => go(index - 1)}>
                ←
              </button>
              <button type="button" className="btn btn-ghost !px-3 !py-2" onClick={() => go(index + 1)}>
                →
              </button>
            </div>
            <p className="text-sm text-[var(--ink-soft)]">
              {index + 1} / {slides.length}
            </p>
          </div>

          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
            {slides.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show ${item.title}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-8 shrink-0 rounded-full transition ${
                  i === index ? "bg-[var(--rose-deep)]" : "bg-[var(--line-strong)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
