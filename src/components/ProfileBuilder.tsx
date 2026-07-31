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

function loadLocal(defaultName: string): StudentProfile {
  if (typeof window === "undefined") return emptyProfile(defaultName);
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return emptyProfile(defaultName);
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
    return emptyProfile(defaultName);
  }
}

export function ProfileBuilder({
  defaultName,
  email,
}: {
  defaultName: string;
  email: string;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile>(() => emptyProfile(defaultName));
  const [skillsInput, setSkillsInput] = useState("");
  const [uniInput, setUniInput] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const local = loadLocal(defaultName);
    setProfile(local);
    setSkillsInput(local.skills.join(", "));
    setUniInput(local.universities.join(", "));
    setHydrated(true);
  }, [defaultName]);

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
      <div className="rounded-[2rem] border border-[var(--line)] bg-white/60 p-8 text-[var(--ink-soft)]">
        Loading your profile builder…
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">
          Profile builder
        </p>
        <h1 className="display mt-3 text-5xl">Build your student profile</h1>
        <p className="mt-4 text-lg text-[var(--ink-soft)]">
          Add what you can now — bio, universities, skills, and projects. For this testing phase you
          can save a partial profile and continue to{" "}
          <strong className="text-[var(--ink)]">What do you want to do today?</strong>
        </p>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">Signed in as {email}</p>
      </header>

      <section className="rounded-[2rem] border border-[var(--line)] bg-white/65 p-6 shadow-[var(--shadow)] sm:p-8">
        <h2 className="display text-3xl">About you</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <div
              className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--cream)] text-sm text-[var(--ink-soft)]"
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
            <label className="mt-3 block text-sm">
              <span className="font-medium">Upload PNG or JPEG</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="mt-2 block w-full text-xs"
                onChange={(e) => onAvatarChange(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              <span>Display name</span>
              <input
                value={profile.displayName}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, displayName: e.target.value }))
                }
                className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                placeholder="Your name"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Bio</span>
              <textarea
                rows={5}
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                placeholder="Tell partners who you are, what you ship, and what you're looking for (hire, invest, collab)…"
              />
              <span className="text-xs text-[var(--ink-soft)]">
                {profile.bio.trim().length}/40+ characters
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--line)] bg-white/65 p-6 shadow-[var(--shadow)] sm:p-8">
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
          className="mt-4 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          placeholder="Hult International Business School; MIT"
        />
        <ul className="mt-4 flex flex-wrap gap-2">
          {splitTags(uniInput).map((uni) => (
            <li
              key={uni}
              className="rounded-full border border-[var(--line)] bg-[var(--cream)] px-3 py-1.5 text-sm text-[#3a2a28]"
            >
              {uni}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[2rem] border border-[var(--line)] bg-white/65 p-6 shadow-[var(--shadow)] sm:p-8">
        <h2 className="display text-3xl">Skills</h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">
          List skills separated by comma or semicolon. Each becomes a searchable bubble for
          employers, clients, and investors.
        </p>
        <input
          value={skillsInput}
          onChange={(e) => {
            setSkillsInput(e.target.value);
            setProfile((prev) => ({ ...prev, skills: splitTags(e.target.value) }));
          }}
          className="mt-4 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          placeholder="Next.js, TypeScript, Product design; Firebase"
        />
        <ul className="mt-4 flex flex-wrap gap-2">
          {splitTags(skillsInput).map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-[#c45d78]/40 bg-white px-3 py-1.5 text-sm font-medium text-[#3a2a28]"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[2rem] border border-[var(--line)] bg-white/65 p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="display text-3xl">Projects</h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Add a project website, GitHub repo, and optional PNG/JPEG screenshot.
            </p>
          </div>
          <button type="button" onClick={addProject} className="btn btn-ghost !text-[#3a2a28]">
            Add project
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {profile.projects.map((project, index) => (
            <article
              key={project.id}
              className="rounded-[1.5rem] border border-[var(--line)] bg-white/80 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">Project {index + 1}</h3>
                {profile.projects.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeProject(project.id)}
                    className="text-sm text-[var(--rose-deep)]"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label className="grid gap-1 text-sm lg:col-span-2">
                  <span>Title</span>
                  <input
                    value={project.title}
                    onChange={(e) => updateProject(project.id, { title: e.target.value })}
                    className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                    placeholder="Pixie Dust Cheesecake"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span>Project website</span>
                  <input
                    type="url"
                    value={project.websiteUrl}
                    onChange={(e) => updateProject(project.id, { websiteUrl: e.target.value })}
                    className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                    placeholder="https://your-app.vercel.app"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span>GitHub repo</span>
                  <input
                    type="url"
                    value={project.githubUrl}
                    onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                    className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                    placeholder="https://github.com/you/repo"
                  />
                </label>
                <label className="grid gap-1 text-sm lg:col-span-2">
                  <span>Project image (PNG or JPEG)</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="block w-full text-xs"
                    onChange={(e) =>
                      onProjectImageChange(project.id, e.target.files?.[0] || null)
                    }
                  />
                </label>
                {project.imageDataUrl ? (
                  <div
                    className="h-36 rounded-2xl border border-[var(--line)] bg-cover bg-center lg:col-span-2"
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

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Save & continue to agents"}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={continueAnyway}
          className="btn border border-[#3a2a28] bg-[#fff8f4] !text-[#3a2a28] hover:bg-white disabled:opacity-60"
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
