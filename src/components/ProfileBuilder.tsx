"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fileToDataUrl } from "@/lib/image";
import {
  PROFILE_STORAGE_KEY,
  cryptoRandomId,
  emptyProfile,
  isProfileComplete,
  splitTags,
  type StudentProfile,
  type StudentProject,
} from "@/lib/profile";

function loadLocal(defaultName: string): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudentProfile;
    return {
      ...emptyProfile(defaultName),
      ...parsed,
      displayName: parsed.displayName || defaultName,
      projects:
        parsed.projects?.length > 0
          ? parsed.projects
          : emptyProfile(defaultName).projects,
    };
  } catch {
    return null;
  }
}

function isBlankProfile(profile: StudentProfile) {
  return (
    !profile.bio.trim() &&
    profile.skills.length === 0 &&
    profile.universities.length === 0 &&
    !profile.avatarDataUrl &&
    !profile.projects.some(
      (p) => p.title.trim() || p.websiteUrl.trim() || p.githubUrl.trim(),
    )
  );
}

export function ProfileBuilder({
  defaultName,
  email,
  github,
}: {
  defaultName: string;
  email: string;
  github?: string;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile>(() => emptyProfile(defaultName));
  const [skillsInput, setSkillsInput] = useState("");
  const [uniInput, setUniInput] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  function applyImportedProfile(next: StudentProfile, sourceLabel: string) {
    setProfile(next);
    setSkillsInput(next.skills.join(", "));
    setUniInput(next.universities.join(", "));
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
    setNotice(sourceLabel);
  }

  async function downloadFromGithub(opts?: { silent?: boolean }) {
    if (!github) {
      if (!opts?.silent) {
        setError("This account has no GitHub handle. Sign up again with your GitHub username.");
      }
      return false;
    }
    setImporting(true);
    setError("");
    try {
      const res = await fetch("/api/profile/from-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "GitHub download failed");
      applyImportedProfile(
        data.profile as StudentProfile,
        data.fromRoster
          ? `Loaded cohort roster data for @${data.handle}, refreshed from GitHub.`
          : `Downloaded public GitHub profile for @${data.handle}.`,
      );
      return true;
    } catch (err) {
      if (!opts?.silent) {
        setError(err instanceof Error ? err.message : "GitHub download failed");
      }
      return false;
    } finally {
      setImporting(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = loadLocal(defaultName);
      if (local && !isBlankProfile(local)) {
        if (cancelled) return;
        setProfile(local);
        setSkillsInput(local.skills.join(", "));
        setUniInput(local.universities.join(", "));
        setHydrated(true);
        return;
      }

      if (github) {
        const ok = await downloadFromGithub({ silent: true });
        if (cancelled) return;
        if (!ok) {
          const fallback = emptyProfile(defaultName);
          setProfile(fallback);
          setSkillsInput("");
          setUniInput("");
        }
        setHydrated(true);
        return;
      }

      if (cancelled) return;
      const empty = emptyProfile(defaultName);
      setProfile(empty);
      setSkillsInput("");
      setUniInput("");
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
    // Intentionally run once on mount for this signed-in student.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultName, github]);

  const complete = useMemo(() => isProfileComplete(profile), [profile]);

  function updateProject(id: string, patch: Partial<StudentProject>) {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }

  function addProject() {
    setProfile((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: cryptoRandomId(),
          title: "",
          websiteUrl: "",
          githubUrl: "",
          imageDataUrl: "",
        },
      ],
    }));
  }

  function removeProject(id: string) {
    setProfile((prev) => ({
      ...prev,
      projects:
        prev.projects.length <= 1
          ? prev.projects
          : prev.projects.filter((p) => p.id !== id),
    }));
  }

  async function onAvatarChange(file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file, { maxWidth: 480 });
      setProfile((prev) => ({ ...prev, avatarDataUrl: dataUrl }));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read image");
    }
  }

  async function onProjectImageChange(id: string, file: File | null) {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file, { maxWidth: 960 });
      updateProject(id, { imageDataUrl: dataUrl });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read image");
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const next: StudentProfile = {
      ...profile,
      displayName: profile.displayName.trim(),
      bio: profile.bio.trim(),
      skills: splitTags(skillsInput),
      universities: splitTags(uniInput),
      projects: profile.projects.map((p) => ({
        ...p,
        title: p.title.trim(),
        websiteUrl: p.websiteUrl.trim(),
        githubUrl: p.githubUrl.trim(),
      })),
      updatedAt: new Date().toISOString(),
    };

    setProfile(next);

    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save profile");
      router.push(data.next || "/app");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  async function continueAnyway() {
    setSaving(true);
    setError("");
    const next: StudentProfile = {
      ...profile,
      displayName: profile.displayName.trim() || defaultName,
      bio: profile.bio.trim(),
      skills: splitTags(skillsInput),
      universities: splitTags(uniInput),
      projects: profile.projects.map((p) => ({
        ...p,
        title: p.title.trim(),
        websiteUrl: p.websiteUrl.trim(),
        githubUrl: p.githubUrl.trim(),
      })),
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not continue");
      router.push("/app");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue");
      setSaving(false);
    }
  }

  if (!hydrated) {
    return (
      <div className="panel p-8 text-[var(--ink-soft)]">
        {importing
          ? "Downloading your public GitHub profile into the builder…"
          : "Loading your profile builder…"}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <header className="max-w-3xl">
        <p className="eyebrow">Profile builder</p>
        <h1 className="display mt-3 text-4xl sm:text-5xl">Build your student profile</h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--ink-soft)]">
          We pull the same public GitHub data used for the Partners directory — name, avatar, bio,
          skills, repos, and live project links — so you can develop your forward-facing profile.
          Edit anything, then continue to{" "}
          <strong className="text-[var(--ink)]">What do you want to do today?</strong>
        </p>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Signed in as {github ? `@${github}` : email}
        </p>
        {github ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn btn-secondary !py-2"
              disabled={importing || saving}
              onClick={() => downloadFromGithub()}
            >
              {importing ? "Downloading…" : "Re-download from GitHub"}
            </button>
            <span className="text-sm text-[var(--ink-soft)]">
              Overwrites the builder with a fresh public GitHub pull.
            </span>
          </div>
        ) : null}
        {notice ? (
          <p className="mt-3 text-sm font-medium text-[var(--rose-deep)]" role="status">
            {notice}
          </p>
        ) : null}
      </header>

      <section className="panel-solid p-6 sm:p-8">
        <h2 className="display text-3xl">About you</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <div
              className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--cream)] text-sm text-[var(--ink-soft)]"
              style={
                profile.avatarDataUrl
                  ? {
                      backgroundImage: `url(${profile.avatarDataUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              {!profile.avatarDataUrl ? "Photo" : null}
            </div>
            <label className="label mt-3">
              <span>Upload PNG or JPEG</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="block w-full text-xs"
                onChange={(e) => onAvatarChange(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="grid gap-4">
            <label className="label">
              <span>Display name</span>
              <input
                value={profile.displayName}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, displayName: e.target.value }))
                }
                className="field"
                placeholder="Your name"
              />
            </label>
            <label className="label">
              <span>Bio</span>
              <textarea
                rows={5}
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                className="field"
                placeholder="Tell partners who you are, what you ship, and what you're looking for (hire, invest, collab)…"
              />
              <span className="text-xs font-normal text-[var(--ink-soft)]">
                {profile.bio.trim().length}/40+ characters
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="panel-solid p-6 sm:p-8">
        <h2 className="display text-3xl">Universities</h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          Separate schools with a comma or semicolon.
        </p>
        <input
          value={uniInput}
          onChange={(e) => {
            setUniInput(e.target.value);
            setProfile((prev) => ({ ...prev, universities: splitTags(e.target.value) }));
          }}
          className="field mt-4"
          placeholder="Hult International Business School; MIT"
        />
        <ul className="mt-4 flex flex-wrap gap-2">
          {splitTags(uniInput).map((uni) => (
            <li key={uni} className="chip">
              {uni}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-solid p-6 sm:p-8">
        <h2 className="display text-3xl">Skills</h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          List skills separated by comma or semicolon. Each becomes a searchable tag for employers,
          clients, and investors.
        </p>
        <input
          value={skillsInput}
          onChange={(e) => {
            setSkillsInput(e.target.value);
            setProfile((prev) => ({ ...prev, skills: splitTags(e.target.value) }));
          }}
          className="field mt-4"
          placeholder="Next.js, TypeScript, Product design; Firebase"
        />
        <ul className="mt-4 flex flex-wrap gap-2">
          {splitTags(skillsInput).map((skill) => (
            <li key={skill} className="chip chip-accent">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-solid p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="display text-3xl">Projects</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Add a project website, GitHub repo, and optional PNG/JPEG screenshot.
            </p>
          </div>
          <button type="button" onClick={addProject} className="btn btn-ghost">
            Add project
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {profile.projects.map((project, index) => (
            <article
              key={project.id}
              className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--cream)] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">Project {index + 1}</h3>
                {profile.projects.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeProject(project.id)}
                    className="text-sm font-medium text-[var(--accent-deep)]"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label className="label lg:col-span-2">
                  <span>Title</span>
                  <input
                    value={project.title}
                    onChange={(e) => updateProject(project.id, { title: e.target.value })}
                    className="field"
                    placeholder="NextMove"
                  />
                </label>
                <label className="label">
                  <span>Project website</span>
                  <input
                    type="url"
                    value={project.websiteUrl}
                    onChange={(e) => updateProject(project.id, { websiteUrl: e.target.value })}
                    className="field"
                    placeholder="https://your-app.vercel.app"
                  />
                </label>
                <label className="label">
                  <span>GitHub repo</span>
                  <input
                    type="url"
                    value={project.githubUrl}
                    onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                    className="field"
                    placeholder="https://github.com/you/repo"
                  />
                </label>
                <label className="label lg:col-span-2">
                  <span>Project image (PNG or JPEG)</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="block w-full text-xs font-normal"
                    onChange={(e) =>
                      onProjectImageChange(project.id, e.target.files?.[0] || null)
                    }
                  />
                </label>
                {project.imageDataUrl ? (
                  <div
                    className="h-36 rounded-[var(--radius)] border border-[var(--line)] bg-cover bg-center lg:col-span-2"
                    style={{ backgroundImage: `url(${project.imageDataUrl})` }}
                    role="img"
                    aria-label={`${project.title || "Project"} preview`}
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-6">
        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save & continue to agents"}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={continueAnyway}
          className="btn btn-secondary disabled:opacity-60"
        >
          Skip for now
        </button>
        <p className="text-sm text-[var(--ink-soft)]">
          {complete
            ? "Profile looks complete."
            : "Partial profiles are allowed during testing."}
        </p>
      </div>
    </form>
  );
}
