"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";
type Audience = "student" | "partner";

export function AuthForm({
  mode,
  audience = "student",
  nextPath,
}: {
  mode: Mode;
  audience?: Audience;
  nextPath?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const resolvedNext =
    nextPath || (audience === "partner" ? "/partners/home" : "/app/profile");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      role: audience,
    };

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      router.push(resolvedNext);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const isPartner = audience === "partner";

  return (
    <form onSubmit={onSubmit} className="panel-solid mx-auto w-full max-w-md p-7 sm:p-9">
      <p className="eyebrow">{isPartner ? "Partners" : "Pixie Dust Cheesecake"}</p>
      <h1 className="display mt-3 text-4xl">
        {mode === "signup"
          ? isPartner
            ? "Create a partner account"
            : "Create your account"
          : isPartner
            ? "Partner sign in"
            : "Welcome back"}
      </h1>
      <p className="mt-3 leading-relaxed text-[var(--ink-soft)]">
        {isPartner
          ? mode === "signup"
            ? "Access the cohort showcase — live projects, builders, and evidence for hiring or investing."
            : "Sign in to open the Partners showcase feed."
          : mode === "signup"
            ? "Start building brands, pages, images, and campaigns with AI agents."
            : "Log in to open your AI agent workspace."}
      </p>

      <div className="mt-8 grid gap-4">
        {mode === "signup" ? (
          <label className="label">
            <span>Name</span>
            <input
              required
              name="name"
              className="field"
              placeholder={isPartner ? "Alex Partner" : "Jordan Lee"}
            />
          </label>
        ) : null}
        <label className="label">
          <span>Email</span>
          <input
            required
            type="email"
            name="email"
            className="field"
            placeholder={isPartner ? "you@company.com" : "you@brand.com"}
          />
        </label>
        <label className="label">
          <span>Password</span>
          <input
            required
            type="password"
            name="password"
            minLength={6}
            className="field"
            placeholder="••••••••"
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
        {loading ? "Working…" : mode === "signup" ? "Sign up" : "Log in"}
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
            <Link href="/login" className="font-semibold text-[var(--ink)] underline underline-offset-2">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="font-semibold text-[var(--ink)] underline underline-offset-2">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
