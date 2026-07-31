"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ShowcaseSlide } from "@/data/profiles";

type Props = {
  slides: ShowcaseSlide[];
  /** stacked = preview full-width with details above/below; split = side panel */
  variant?: "stacked" | "split";
  detailsPosition?: "top" | "bottom";
  size?: "default" | "large" | "hero";
  autoPlayMs?: number;
  showOpenActions?: boolean;
};

export function ProjectShowcaseSlider({
  slides,
  variant = "stacked",
  detailsPosition = "bottom",
  size = "large",
  autoPlayMs = 6500,
  showOpenActions = true,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [slides.length, autoPlayMs]);

  if (!slides.length) {
    return (
      <div className="panel-solid p-8 text-[var(--ink-soft)]">
        No live project homepages yet. Import classmate GitHub handles to populate this slider.
      </div>
    );
  }

  const slide = slides[index];
  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  const frameHeight =
    size === "hero" ? "min-h-[70vh] lg:min-h-[78vh]" : size === "large" ? "min-h-[52vh] lg:min-h-[620px]" : "min-h-[320px] lg:min-h-[420px]";

  const details = (
    <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-start gap-3">
        {slide.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slide.avatarUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--champagne,#f7e7ce)] text-sm font-semibold">
            {slide.builderName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        <div className="min-w-0">
          <p className="eyebrow">{slide.kind}</p>
          <h3 className="display mt-1 truncate text-2xl sm:text-3xl">{slide.title}</h3>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">
            <Link
              href={`/profiles/${slide.builderSlug}`}
              className="font-semibold text-[var(--ink)] underline underline-offset-2"
            >
              {slide.builderName}
            </Link>
            <span className="mx-2 text-[var(--line-strong)]">·</span>
            <a
              href={`https://github.com/${slide.github}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--rose-deep)]"
            >
              @{slide.github}
            </a>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showOpenActions ? (
          <>
            <a href={slide.href} target="_blank" rel="noreferrer" className="btn btn-primary !py-2">
              Open homepage
            </a>
            <Link href={`/profiles/${slide.builderSlug}`} className="btn btn-ghost !py-2">
              Profile
            </Link>
          </>
        ) : null}
        <button type="button" className="btn btn-ghost !px-3 !py-2" onClick={() => go(index - 1)}>
          ←
        </button>
        <button type="button" className="btn btn-ghost !px-3 !py-2" onClick={() => go(index + 1)}>
          →
        </button>
        <span className="text-sm text-[var(--ink-soft)]">
          {index + 1}/{slides.length}
        </span>
      </div>
    </div>
  );

  const preview = (
    <div className={`relative ${frameHeight} bg-[var(--cream)]`}>
      <div className="flex items-center gap-2 border-b border-[var(--line)] bg-white/85 px-3 py-2 text-xs text-[var(--ink-soft)]">
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
  );

  const dots = (
    <div className="flex gap-1.5 overflow-x-auto px-4 pb-4 sm:px-6">
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
  );

  if (variant === "split") {
    return (
      <div className="panel-solid overflow-hidden">
        <div className="grid lg:grid-cols-[1.35fr_0.85fr]">
          {preview}
          <div className="flex flex-col justify-between border-t border-[var(--line)] lg:border-l lg:border-t-0">
            {details}
            {dots}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-solid overflow-hidden">
      {detailsPosition === "top" ? (
        <>
          <div className="border-b border-[var(--line)] bg-white/70">{details}</div>
          {preview}
          {dots}
        </>
      ) : (
        <>
          {preview}
          <div className="border-t border-[var(--line)] bg-white/70">{details}</div>
          {dots}
        </>
      )}
    </div>
  );
}
