"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import type { DirectoryParticipant } from "@/lib/directory";
import { filterDirectoryParticipants, getDirectoryFilterOptions } from "@/lib/directory";
import { ExternalLink } from "@/components/ExternalLink";

type Props = {
  participants: DirectoryParticipant[];
  initialError?: string | null;
};

export function PartnerDirectory({ participants, initialError = null }: Props) {
  const searchId = useId();
  const techId = useId();
  const categoryId = useId();
  const [search, setSearch] = useState("");
  const [technology, setTechnology] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(initialError);

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 280);
    return () => window.clearTimeout(id);
  }, []);

  const options = useMemo(
    () => getDirectoryFilterOptions(participants),
    [participants],
  );

  const results = useMemo(
    () => filterDirectoryParticipants(participants, { search, technology, category }),
    [participants, search, technology, category],
  );

  if (error) {
    return (
      <div
        className="panel-solid p-8 text-[var(--ink-soft)]"
        role="alert"
      >
        <h2 className="display text-2xl text-[var(--ink)]">Directory unavailable</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel-solid p-8" aria-busy="true" aria-live="polite">
        <p className="eyebrow">Directory</p>
        <p className="mt-3 text-[var(--ink-soft)]">Loading cohort builders…</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-[var(--radius-lg)] border border-[var(--line)] bg-white/70"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <form
        className="panel-solid grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto] lg:items-end"
        onSubmit={(e) => e.preventDefault()}
        role="search"
        aria-label="Search cohort directory"
      >
        <label className="label" htmlFor={searchId}>
          <span>Search</span>
          <input
            id={searchId}
            type="search"
            className="field"
            placeholder="Name, GitHub handle, project, or technology"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </label>

        <label className="label" htmlFor={techId}>
          <span>Technology</span>
          <select
            id={techId}
            className="field"
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            disabled={options.technologies.length < 2}
          >
            <option value="">All technologies</option>
            {options.technologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </label>

        <label className="label" htmlFor={categoryId}>
          <span>Category</span>
          <select
            id={categoryId}
            className="field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={options.categories.length < 2}
          >
            <option value="">All categories</option>
            {options.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="btn btn-ghost !py-3"
          onClick={() => {
            setSearch("");
            setTechnology("");
            setCategory("");
          }}
        >
          Clear
        </button>
      </form>

      <p className="mt-5 text-sm font-medium text-[var(--ink-soft)]" aria-live="polite">
        Showing <span className="text-[var(--ink)]">{results.length}</span> of{" "}
        {participants.length} participants
      </p>

      {!results.length ? (
        <div className="panel-solid mt-6 p-8 text-[var(--ink-soft)]">
          <h2 className="display text-2xl text-[var(--ink)]">No matches</h2>
          <p className="mt-2">
            Try a different name, GitHub handle, project name, or technology — or clear filters.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {results.map((person) => (
            <li key={person.slug} className="min-w-0">
              <DirectoryTile person={person} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DirectoryTile({ person }: { person: DirectoryParticipant }) {
  const featured =
    person.projects.find((p) => p.liveUrl) || person.projects[0] || null;
  const techPreview = person.technologies.slice(0, 3);

  return (
    <Link
      href={`/partners/directory/${person.slug}`}
      className="tile tile-student group h-full !min-h-[260px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--aurora)]"
    >
      <div>
        {person.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.avatarUrl}
            alt={`Profile photo of ${person.name}`}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-black"
            style={{ background: person.photoGradient }}
            aria-hidden
          >
            {person.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        <h2 className="display mt-4 text-2xl text-black">
          {person.name}
        </h2>
        <p className="mt-1 text-sm text-black">@{person.github}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-black">
          {featured
            ? featured.name
            : "No public projects listed yet."}
        </p>
        {techPreview.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {techPreview.map((tech) => (
              <li key={tech} className="chip !px-2 !py-1 text-xs text-black">
                {tech}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-xs text-black">Technologies unavailable</p>
        )}
      </div>
      <p className="mt-6 text-sm font-semibold text-black">
        View profile →
      </p>
    </Link>
  );
}

export function ParticipantProfile({ person }: { person: DirectoryParticipant }) {
  return (
    <article>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {person.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.avatarUrl}
            alt={`Profile photo of ${person.name}`}
            className="h-28 w-28 rounded-[var(--radius-lg)] object-cover shadow-[var(--shadow-sm)]"
          />
        ) : (
          <div
            className="flex h-28 w-28 items-center justify-center rounded-[var(--radius-lg)] text-3xl font-semibold shadow-[var(--shadow-sm)]"
            style={{ background: person.photoGradient }}
            aria-hidden
          >
            {person.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Cohort participant</p>
          <h1 className="display mt-2 text-4xl sm:text-5xl">{person.name}</h1>
          <p className="mt-2 text-[var(--ink-soft)]">
            <ExternalLink href={person.githubUrl} ariaLabel={`GitHub profile for ${person.name}`}>
              @{person.github}
            </ExternalLink>
            {person.campus && person.campus !== "TBD" ? (
              <>
                <span className="mx-2">·</span>
                <span>{person.campus}</span>
              </>
            ) : null}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--ink-soft)]">{person.bio}</p>
          {person.technologies.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {person.technologies.map((tech) => (
                <li key={tech} className="chip chip-accent">
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="display text-3xl">Projects</h2>
        {!person.projects.length ? (
          <p className="mt-4 text-[var(--ink-soft)]">
            No public repositories were available for this participant.
          </p>
        ) : (
          <ul className="mt-6 grid list-none gap-4 p-0">
            {person.projects.map((project) => (
              <li
                key={project.id}
                className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">{project.category}</p>
                    <h3 className="display mt-1 text-2xl">{project.name}</h3>
                  </div>
                  <p className="text-sm text-[var(--ink-soft)]">{project.location}</p>
                </div>
                <p className="mt-3 leading-relaxed text-[var(--ink-soft)]">
                  {project.description}
                </p>
                {project.languages.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.languages.map((lang) => (
                      <li key={lang} className="chip !text-xs">
                        {lang}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-[var(--ink-soft)]">
                    Technology tags unavailable
                  </p>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  <ExternalLink
                    href={project.repoUrl}
                    className="btn btn-ghost !py-2"
                    ariaLabel={`Repository for ${project.name}`}
                  >
                    Repository
                  </ExternalLink>
                  {project.liveUrl ? (
                    <ExternalLink
                      href={project.liveUrl}
                      className="btn btn-primary !py-2"
                      ariaLabel={`Live project for ${project.name}`}
                    >
                      Live project
                    </ExternalLink>
                  ) : (
                    <span className="btn btn-ghost !cursor-not-allowed !py-2 opacity-50">
                      Live project unavailable
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
