"use client";

import { useMemo, useState } from "react";
import { AuthForm } from "@/components/AuthForm";

type Audience = "student" | "partner";

export function EmailSignupChooser({
  initialAudience = "student",
}: {
  initialAudience?: Audience;
}) {
  const [audience, setAudience] = useState<Audience>(initialAudience);

  const copy = useMemo(
    () =>
      audience === "partner"
        ? {
            label: "Partner",
            blurb:
              "Hiring managers, employers, and investors — create an email account for the Partners directory and showcase feed.",
          }
        : {
            label: "Student",
            blurb:
              "Builders and cohort members — create an email account, then develop your profile for partners.",
          },
    [audience],
  );

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="panel-solid mb-4 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--aurora)]">
          Sign up with email
        </p>
        <div
          className="mt-3 grid grid-cols-2 gap-2"
          role="tablist"
          aria-label="Account type"
        >
          {(
            [
              { id: "student", label: "Student" },
              { id: "partner", label: "Partner" },
            ] as const
          ).map((option) => {
            const active = audience === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`rounded-[var(--radius)] border px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "border-[var(--aurora)] bg-[rgba(62,255,176,0.14)] text-[var(--aurora)]"
                    : "border-[var(--line)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
                }`}
                onClick={() => setAudience(option.id)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">{copy.blurb}</p>
      </div>

      <AuthForm
        key={audience}
        mode="signup"
        audience={audience}
        identity="email"
        nextPath={audience === "partner" ? "/partners/home" : "/app/profile"}
      />
    </div>
  );
}
