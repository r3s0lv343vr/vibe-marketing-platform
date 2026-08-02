"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PROFILE_STORAGE_KEY, type StudentProfile } from "@/lib/profile";

type Mode = "login" | "signup";
type Audience = "student" | "partner";
type Identity = "github" | "email";

export function AuthForm({
  mode,
  audience = "student",
  identity,
  nextPath,
}: {
  mode: Mode;
  audience?: Audience;
  identity?: Identity;
  nextPath?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isPartner = audience === "partner";
  const useEmail = isPartner || identity === "email";
  const resolvedNext =
    nextPath || (isPartner ? "/partners/home" : "/app/profile");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = useEmail
      ? {
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          password: String(form.get("password") || ""),
          role: audience,
          identity: "email" as const,
        }
      : {
          name: String(form.get("name") || ""),
          github: String(form.get("github") || ""),
          password: String(form.get("password") || ""),
          role: audience,
          identity: "github" as const,
        };

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      // Seed Profile Builder with the same GitHub/roster fields returned by auth.
      if (data.profile && typeof window !== "undefined") {
        try {
          localStorage.setItem(
            PROFILE_STORAGE_KEY,
            JSON.stringify(data.profile as StudentProfile),
          );
          sessionStorage.setItem("pixie_profile_linked", data.linked ? "1" : "0");
          if (data.fromRoster) sessionStorage.setItem("pixie_profile_from_roster", "1");
        } catch {
          // localStorage may be unavailable; builder can still re-fetch from GitHub.
        }
      }

      router.push(data.next || resolvedNext);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="panel-solid mx-auto w-full max-w-md p-7 sm:p-9">
      <p className="eyebrow">{isPartner ? "Partners" : "NextMove"}</p>
      <h1 className="display mt-3 text-4xl">
        {mode === "signup"
          ? isPartner
            ? "Create a partner account"
            : useEmail
              ? "Create your student account"
              : "Create your student account"
          : isPartner
            ? "Partner sign in"
            : "Welcome back"}
      </h1>
      <p className="mt-3 leading-relaxed text-[var(--ink-soft)]">
        {isPartner
          ? mode === "signup"
            ? "Access the cohort showcase — live projects, builders, and evidence for hiring or investing."
            : "Sign in to open the Partners showcase feed."
          : useEmail
            ? mode === "signup"
              ? "Sign up with email to open your profile builder and AI agent workspace."
              : "Log in with email to open your profile builder and AI agent workspace."
            : mode === "signup"
              ? "Use your GitHub handle to enroll. We’ll download your public GitHub profile into the Profile Builder so you can develop it for partners."
              : "Sign in with your GitHub handle to open your profile builder and AI agent workspace."}
      </p>

      <div className="mt-8 grid gap-4">
        {mode === "signup" ? (
          <label className="label">
            <span>{useEmail ? "Name" : "Display name (optional)"}</span>
            <input
              required={useEmail}
              name="name"
              className="field"
              placeholder={isPartner ? "Alex Partner" : "Jordan Lee"}
              autoComplete="name"
            />
          </label>
        ) : null}

        {useEmail ? (
          <label className="label">
            <span>Email</span>
            <input
              required
              type="email"
              name="email"
              className="field"
              placeholder={isPartner ? "you@company.com" : "you@school.edu"}
              autoComplete="email"
            />
          </label>
        ) : (
          <label className="label">
            <span>GitHub handle</span>
            <input
              required
              name="github"
              className="field"
              placeholder="your-github-handle"
              autoComplete="username"
              pattern="@?[A-Za-z0-9-]{1,39}"
              title="GitHub username (letters, numbers, hyphens)"
            />
            <span className="text-xs font-normal text-[var(--ink-soft)]">
              Existing cohort builders and new enrollees both use their GitHub username.
            </span>
          </label>
        )}

        <label className="label">
          <span>Password</span>
          <input
            required
            type="password"
            name="password"
            minLength={6}
            className="field"
            placeholder="••••••••"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </label>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary mt-7 w-full disabled:opacity-60"
      >
        {loading
          ? "Working…"
          : mode === "signup"
            ? useEmail
              ? isPartner
                ? "Sign up as partner"
                : "Sign up as student"
              : "Sign up with GitHub handle"
            : "Log in"}
      </button>

      <p className="mt-6 text-center text-sm text-[var(--ink-soft)]">
        {isPartner ? (
          mode === "signup" ? (
            <>
              Already a partner?{" "}
              <Link
                href="/partners/login"
                className="font-semibold text-[var(--ink)] underline underline-offset-2"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              New partner?{" "}
              <Link
                href="/partners/signup"
                className="font-semibold text-[var(--ink)] underline underline-offset-2"
              >
                Create account
              </Link>
            </>
          )
        ) : mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link
              href={useEmail ? "/login?method=email" : "/login"}
              className="font-semibold text-[var(--ink)] underline underline-offset-2"
            >
              Log in
            </Link>
            {!useEmail ? (
              <>
                {" · "}
                <Link
                  href="/signup/email"
                  className="font-semibold text-[var(--ink)] underline underline-offset-2"
                >
                  Sign up with email
                </Link>
              </>
            ) : (
              <>
                {" · "}
                <Link
                  href="/signup"
                  className="font-semibold text-[var(--ink)] underline underline-offset-2"
                >
                  Use GitHub handle
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="font-semibold text-[var(--ink)] underline underline-offset-2">
              Sign up with GitHub handle
            </Link>
            {" · "}
            <Link
              href="/signup/email"
              className="font-semibold text-[var(--ink)] underline underline-offset-2"
            >
              Sign up with email
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
