"use client";

import { FormEvent, useState } from "react";
import { publicProfiles } from "@/data/profiles";

export function RequestIntroForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = {
      partnerName: String(form.get("partnerName") || ""),
      company: String(form.get("company") || ""),
      email: String(form.get("email") || ""),
      students: form.getAll("students").map(String),
      note: String(form.get("note") || ""),
    };

    try {
      const res = await fetch("/api/request-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus("sent");
        setMessage(data.message || "Intro request received.");
        event.currentTarget.reset();
        return;
      }
      throw new Error("API unavailable");
    } catch {
      // Static / Pages fallback — open mail client for placement lead
      const students = payload.students.join(", ") || "(none selected)";
      const subject = encodeURIComponent(
        `Pixie Dust Cheesecake intro request — ${payload.company}`,
      );
      const body = encodeURIComponent(
        [
          `Partner: ${payload.partnerName}`,
          `Company: ${payload.company}`,
          `Email: ${payload.email}`,
          `Students: ${students}`,
          "",
          payload.note,
        ].join("\n"),
      );
      window.location.href = `mailto:placement@hult-cohort.local?subject=${subject}&body=${body}`;
      setStatus("sent");
      setMessage(
        "Opened your mail client with the intro request. If nothing opened, email the placement lead directly.",
      );
      event.currentTarget.reset();
    }
  }

  return (
    <form
      id="request-intro"
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-[var(--line)] bg-white/65 p-6 shadow-[var(--shadow)] sm:p-8"
    >
      <h2 className="display text-3xl">Request an intro</h2>
      <p className="mt-2 max-w-xl text-[var(--ink-soft)]">
        Tell us who you want to meet. Placement lead is notified; expect acknowledgment within 24
        hours.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span>Your name</span>
          <input
            required
            name="partnerName"
            className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3"
            placeholder="Alex Partner"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span>Company</span>
          <input
            required
            name="company"
            className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3"
            placeholder="Acme Labs"
          />
        </label>
        <label className="grid gap-1 text-sm sm:col-span-2">
          <span>Work email</span>
          <input
            required
            type="email"
            name="email"
            className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3"
            placeholder="alex@acme.com"
          />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium">Students of interest</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {publicProfiles().map((profile) => (
            <label
              key={profile.slug}
              className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/70 px-3 py-2 text-sm"
            >
              <input type="checkbox" name="students" value={profile.slug} />
              {profile.name}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 grid gap-1 text-sm">
        <span>Message</span>
        <textarea
          required
          name="note"
          rows={4}
          className="rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3"
          placeholder="Roles, timeline, and what GitHub signal you care about…"
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-primary mt-6 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send intro request"}
      </button>

      {message ? (
        <p
          className={`mt-4 text-sm ${status === "error" ? "text-red-700" : "text-[var(--mint)]"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
