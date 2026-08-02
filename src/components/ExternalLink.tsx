import type { ReactNode } from "react";
import { isAllowedExternalHref } from "@/lib/urls";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Accessible label prefix when children are not descriptive enough */
  ariaLabel?: string;
};

/** Safe external link: https-only, new tab, external indicator for screen readers. */
export function ExternalLink({ href, children, className, ariaLabel }: Props) {
  if (!isAllowedExternalHref(href)) {
    return (
      <span className={className} title="Link unavailable">
        {children}
        <span className="sr-only"> (unavailable)</span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel ? `${ariaLabel} (opens in a new tab)` : undefined}
    >
      {children}
      <span aria-hidden className="ml-1 inline-block text-[0.85em]">
        ↗
      </span>
      {!ariaLabel ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}
