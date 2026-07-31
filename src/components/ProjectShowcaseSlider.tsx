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
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setDirection("next");
      setIndex((current) => (current + 1) % slides.length);
      setAnimKey((k) => k + 1);
    }, autoPlayMs);
    return () => window.clearInterval(id);
  }, [slides.length, autoPlayMs]);

  if (!slides.length) {
    return (
      <div className="panel-solid mx-auto w-full max-w-5xl p-8 text-[var(--ink-soft)]">
        No live project homepages yet. Import classmate GitHub handles to populate this slider.
      </div>
    );
  }

  const slide = slides[index];

  function go(delta: number) {
    setDirection(delta >= 0 ? "next" : "prev");
    setIndex((current) => (current + delta + slides.length) % slides.length);
    setAnimKey((k) => k + 1);
  }

  const frameHeight =
    size === "hero"
      ? "min-h-[56vh] lg:min-h-[620px]"
      : size === "large"
        ? "min-h-[40vh] lg:min-h-[460px]"
        : "min-h-[280px] lg:min-h-[360px]";

  const widthClass = size === "hero" ? "max-w-5xl" : "max-w-[56rem]";
  const slideAnim = direction === "next" ? "animate-slide-rtl" : "animate-slide-ltr";

  const details = (
    <div className="flex flex-col items-center px-4 py-6 text-center sm:px-8 sm:py-7">
      {slide.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={slide.avatarUrl}
          alt=""
          className="h-14 w-14 rounded-full object-cover shadow-[var(--shadow-sm)]"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--champagne,#f7e7ce)] text-base font-semibold shadow-[var(--shadow-sm)]">
          {slide.builderName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>
      )}

      <p className="eyebrow mt-4">{slide.kind}</p>
      <h3 className="display mt-2 max-w-2xl text-3xl sm:text-4xl">{slide.title}</h3>
      <p className="mt-2 text-base text-[var(--ink-soft)]">
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

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
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
        <button type="button" className="btn btn-ghost !px-3 !py-2" onClick={() => go(-1)} aria-label="Previous slide">
          ←
        </button>
        <button type="button" className="btn btn-ghost !px-3 !py-2" onClick={() => go(1)} aria-label="Next slide">
          →
        </button>
      </div>
    </div>
  );

  const preview = (
    <div className={`relative overflow-hidden ${frameHeight} bg-[var(--cream)]`}>
      <div className="flex items-center gap-2 border-b border-[var(--line)] bg-white/85 px-3 py-2 text-xs text-[var(--ink-soft)]">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--rose)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--gold)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--mint)]" />
        <span className="ml-2 truncate">{slide.href}</span>
      </div>
      <div key={animKey} className={`absolute inset-0 top-9 ${slideAnim}`}>
        <iframe
          title={`${slide.title} preview`}
          src={slide.href}
          className="h-full w-full border-0 bg-white"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );

  if (variant === "split") {
    return (
      <div className={`panel-solid mx-auto w-full ${widthClass} overflow-hidden`}>
        <div className="grid lg:grid-cols-[1.35fr_0.85fr]">
          {preview}
          <div className="flex flex-col justify-center border-t border-[var(--line)] lg:border-l lg:border-t-0">
            {details}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`panel-solid mx-auto w-full ${widthClass} overflow-hidden`}>
      {detailsPosition === "top" ? (
        <>
          <div className="border-b border-[var(--line)] bg-white/70">{details}</div>
          {preview}
        </>
      ) : (
        <>
          {preview}
          <div className="border-t border-[var(--line)] bg-white/70">{details}</div>
        </>
      )}
    </div>
  );
}
