"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AgentRunner } from "@/components/AgentRunner";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/SocialIcons";
import { TASKS } from "@/lib/agents";
import {
  SOCIAL_DRAFTS_KEY,
  SOCIAL_LINKS_KEY,
  SOCIAL_PLATFORMS,
  craftSocialDraft,
  emptyDraft,
  exportDraftText,
  type SocialDraft,
  type SocialLink,
  type SocialPlatform,
} from "@/lib/social";

function platformIcon(platform: SocialPlatform, className = "h-5 w-5") {
  if (platform === "facebook") return <FacebookIcon className={className} />;
  if (platform === "instagram") return <InstagramIcon className={className} />;
  return <LinkedInIcon className={className} />;
}

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function SocialMarketingStudio() {
  const [active, setActive] = useState<SocialPlatform>("linkedin");
  const [links, setLinks] = useState<Record<SocialPlatform, SocialLink | null>>({
    facebook: null,
    instagram: null,
    linkedin: null,
  });
  const [drafts, setDrafts] = useState<Record<SocialPlatform, SocialDraft>>({
    facebook: emptyDraft("facebook"),
    instagram: emptyDraft("instagram"),
    linkedin: emptyDraft("linkedin"),
  });
  const [subject, setSubject] = useState("my shipped cohort project");
  const [proofUrl, setProofUrl] = useState("");
  const [status, setStatus] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const meta = SOCIAL_PLATFORMS.find((p) => p.id === active)!;
  const link = links[active];
  const draft = drafts[active];

  useEffect(() => {
    const savedLinks = loadJson<Partial<Record<SocialPlatform, SocialLink>>>(SOCIAL_LINKS_KEY, {});
    const savedDrafts = loadJson<Partial<Record<SocialPlatform, SocialDraft>>>(SOCIAL_DRAFTS_KEY, {});
    setLinks({
      facebook: savedLinks.facebook || null,
      instagram: savedLinks.instagram || null,
      linkedin: savedLinks.linkedin || null,
    });
    setDrafts({
      facebook: savedDrafts.facebook || emptyDraft("facebook"),
      instagram: savedDrafts.instagram || emptyDraft("instagram"),
      linkedin: savedDrafts.linkedin || emptyDraft("linkedin"),
    });
    setHydrated(true);
  }, []);

  function persistLinks(next: Record<SocialPlatform, SocialLink | null>) {
    setLinks(next);
    localStorage.setItem(SOCIAL_LINKS_KEY, JSON.stringify(next));
  }

  function persistDrafts(next: Record<SocialPlatform, SocialDraft>) {
    setDrafts(next);
    localStorage.setItem(SOCIAL_DRAFTS_KEY, JSON.stringify(next));
  }

  function updateDraft(patch: Partial<SocialDraft>) {
    const next = {
      ...drafts,
      [active]: { ...draft, ...patch, updatedAt: new Date().toISOString() },
    };
    persistDrafts(next);
  }

  function onLinkSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const profileUrl = String(form.get("profileUrl") || "").trim();
    const handle = String(form.get("handle") || "").trim();
    if (!profileUrl) {
      setStatus("Add a profile or page URL to link this account.");
      return;
    }
    try {
      const u = new URL(profileUrl);
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("bad protocol");
    } catch {
      setStatus("Use a full http(s) profile URL.");
      return;
    }

    const entry: SocialLink = {
      platform: active,
      profileUrl,
      handle,
      pageOrCompany: String(form.get("pageOrCompany") || "").trim(),
      notes: String(form.get("notes") || "").trim(),
      linkedAt: new Date().toISOString(),
      mode: "manual",
    };
    persistLinks({ ...links, [active]: entry });
    setStatus(`${meta.label} linked manually. Drafts will export with this account.`);
  }

  function unlinkAccount() {
    persistLinks({ ...links, [active]: null });
    setStatus(`${meta.label} unlinked.`);
  }

  function craftDraft() {
    const crafted = craftSocialDraft(active, {
      subject,
      goal: draft.goal,
      audience: draft.audience,
      tone: draft.tone,
      cta: draft.cta,
      proofUrl,
    });
    persistDrafts({ ...drafts, [active]: crafted });
    setStatus(`${meta.label} draft crafted. Preview below — copy or export anytime.`);
  }

  async function copyDraft() {
    const text = exportDraftText(draft, link);
    try {
      await navigator.clipboard.writeText(text);
      setStatus(`${meta.label} draft copied to clipboard.`);
    } catch {
      setStatus("Could not copy automatically — use Export instead.");
    }
  }

  function exportDraft() {
    const text = exportDraftText(draft, link);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nextmove-${active}-draft.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus(`${meta.label} draft exported as .txt.`);
  }

  const linkedCount = useMemo(
    () => SOCIAL_PLATFORMS.filter((p) => links[p.id]).length,
    [links],
  );

  if (!hydrated) {
    return <div className="panel p-8 text-[var(--ink-soft)]">Loading social terminals…</div>;
  }

  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow">Social marketing terminals</p>
          <div className="flex items-center gap-2 text-[var(--aurora)]" aria-hidden>
            <FacebookIcon className="h-5 w-5" />
            <InstagramIcon className="h-5 w-5" />
            <LinkedInIcon className="h-5 w-5" />
          </div>
        </div>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Craft. Preview. Ship later.</h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--ink-soft)]">
          Phase 1 terminals for Facebook, Instagram, and LinkedIn — generate hire-ready posts,
          preview them, copy/export, and manually link your accounts. Live API publishing can plug
          in later without changing this workflow.
        </p>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          {linkedCount}/3 accounts linked · publishing stays manual until Meta/LinkedIn apps are
          connected
        </p>
      </header>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Social platforms"
      >
        {SOCIAL_PLATFORMS.map((platform) => {
          const selected = active === platform.id;
          const isLinked = Boolean(links[platform.id]);
          return (
            <button
              key={platform.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(platform.id)}
              className={`inline-flex items-center gap-2 rounded-[var(--radius)] border px-4 py-2.5 text-sm font-semibold transition-colors ${
                selected
                  ? "border-[var(--aurora)] bg-[rgba(62,255,176,0.14)] text-[var(--aurora)]"
                  : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
              }`}
            >
              <span style={{ color: selected ? undefined : platform.color }}>
                {platformIcon(platform.id)}
              </span>
              {platform.label}
              <span className="text-xs font-medium opacity-80">
                {isLinked ? "linked" : "not linked"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="panel-solid p-6 sm:p-8">
          <div className="flex items-center gap-2" style={{ color: meta.color }}>
            {platformIcon(active, "h-6 w-6")}
            <h2 className="display text-3xl text-[var(--ink)]">Link {meta.label}</h2>
          </div>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">{meta.tips}</p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Manual link stores your profile/page URL in this browser so drafts stay attached to the
            right account. API OAuth connect can replace this later.
          </p>

          {link ? (
            <div className="mt-5 rounded-[var(--radius)] border border-[var(--line)] bg-[rgba(62,255,176,0.08)] p-4">
              <p className="text-sm font-semibold text-[var(--aurora)]">Linked (manual)</p>
              <p className="mt-1 break-all text-sm text-[var(--ink)]">{link.profileUrl}</p>
              {link.handle ? (
                <p className="mt-1 text-sm text-[var(--ink-soft)]">Handle: {link.handle}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={link.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost !py-2"
                >
                  Open profile
                </a>
                <button type="button" className="btn btn-secondary !py-2" onClick={unlinkAccount}>
                  Unlink
                </button>
              </div>
            </div>
          ) : null}

          <form onSubmit={onLinkSubmit} className="mt-6 grid gap-4">
            <label className="label">
              <span>Profile / page URL</span>
              <input
                name="profileUrl"
                className="field"
                placeholder={meta.placeholderUrl}
                defaultValue={link?.profileUrl || ""}
                required
              />
            </label>
            <label className="label">
              <span>Handle / username</span>
              <input
                name="handle"
                className="field"
                placeholder={meta.placeholderHandle}
                defaultValue={link?.handle || ""}
              />
            </label>
            <label className="label">
              <span>Page or company name (optional)</span>
              <input
                name="pageOrCompany"
                className="field"
                placeholder="NextMove builders"
                defaultValue={link?.pageOrCompany || ""}
              />
            </label>
            <label className="label">
              <span>Notes (optional)</span>
              <input
                name="notes"
                className="field"
                placeholder="Personal brand page · hiring-focused"
                defaultValue={link?.notes || ""}
              />
            </label>
            <button type="submit" className="btn btn-primary">
              {link ? `Update ${meta.label} link` : `Link ${meta.label} account`}
            </button>
          </form>
        </section>

        <section className="panel-solid p-6 sm:p-8">
          <div className="flex items-center gap-2" style={{ color: meta.color }}>
            {platformIcon(active, "h-6 w-6")}
            <h2 className="display text-3xl text-[var(--ink)]">{meta.label} terminal</h2>
          </div>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            Craft a post, preview it, then copy or export. No platform API required for Phase 1.
          </p>

          <div className="mt-6 grid gap-4">
            <label className="label">
              <span>Project / subject</span>
              <input
                className="field"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Forth PM platform"
              />
            </label>
            <label className="label">
              <span>Live proof URL (optional)</span>
              <input
                className="field"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://your-app.vercel.app"
              />
            </label>
            <label className="label">
              <span>Goal</span>
              <input
                className="field"
                value={draft.goal}
                onChange={(e) => updateDraft({ goal: e.target.value })}
              />
            </label>
            <label className="label">
              <span>Audience</span>
              <input
                className="field"
                value={draft.audience}
                onChange={(e) => updateDraft({ audience: e.target.value })}
              />
            </label>
            <label className="label">
              <span>Tone</span>
              <input
                className="field"
                value={draft.tone}
                onChange={(e) => updateDraft({ tone: e.target.value })}
              />
            </label>
            <label className="label">
              <span>CTA</span>
              <input
                className="field"
                value={draft.cta}
                onChange={(e) => updateDraft({ cta: e.target.value })}
              />
            </label>
            <button type="button" className="btn btn-primary" onClick={craftDraft}>
              Craft {meta.label} draft
            </button>
          </div>
        </section>
      </div>

      <section className="panel-solid p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Preview</p>
            <h2 className="display mt-2 text-3xl">{meta.label} post preview</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary !py-2" onClick={copyDraft}>
              Copy
            </button>
            <button type="button" className="btn btn-ghost !py-2" onClick={exportDraft}>
              Export .txt
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <label className="label">
            <span>Editable post</span>
            <textarea
              className="field min-h-[220px]"
              value={draft.content}
              onChange={(e) => updateDraft({ content: e.target.value })}
              placeholder={`Craft a ${meta.label} draft to preview it here.`}
            />
          </label>
          <div
            className="rounded-[var(--radius-lg)] border border-[var(--line)] p-5"
            style={{ background: "rgba(255,255,255,0.78)", color: "#0a0a0a" }}
          >
            <div className="flex items-center gap-2" style={{ color: meta.color }}>
              {platformIcon(active)}
              <p className="font-semibold">
                {link?.pageOrCompany || link?.handle || `Your ${meta.label}`}
              </p>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
              {draft.content || "Your crafted post will preview here."}
            </p>
            {draft.hashtags ? (
              <p className="mt-4 text-sm font-medium" style={{ color: meta.color }}>
                {draft.hashtags}
              </p>
            ) : null}
            <label className="mt-4 block text-xs font-medium text-black/70">
              Hashtags
              <input
                className="field mt-1 !bg-white !text-black"
                value={draft.hashtags}
                onChange={(e) => updateDraft({ hashtags: e.target.value })}
              />
            </label>
          </div>
        </div>

        {status ? (
          <p className="mt-4 text-sm font-medium text-[var(--aurora)]" role="status">
            {status}
          </p>
        ) : null}
      </section>

      <section>
        <p className="eyebrow">AI agents</p>
        <h2 className="display mt-2 text-3xl">Deeper social rewrite</h2>
        <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">
          Optional: run the coordinated LinkedIn / Instagram / Facebook agents for a fuller package,
          then paste the best lines into the terminals above.
        </p>
        <div className="mt-6">
          <AgentRunner
            task="social"
            title={TASKS.social.title}
            agents={[...TASKS.social.agents]}
            placeholder="Example: I’m shipping a PM platform + comms app; help me upgrade LinkedIn, Instagram, and Facebook for hiring partners"
          />
        </div>
      </section>
    </div>
  );
}
