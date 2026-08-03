import type { Metadata } from "next";
import { pmProjects, pmSnapshotMeta } from "@/data/pm-snapshot";

export const metadata: Metadata = {
  title: "PM Status",
  description:
    "Read-only PM platform snapshot for the Hult Cohort Summer Pilot — project status from Forth and participant PM surfaces.",
};

const statusColor: Record<string, string> = {
  shipped: "bg-[var(--mint)]",
  "on-track": "bg-[var(--gold)]",
  "at-risk": "bg-[var(--rose)]",
  blocked: "bg-[var(--rose-deep)]",
};

export default function StatusPage() {
  return (
    <div className="site-shell py-14">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]">
        PM integration
      </p>
      <h1 className="display mt-3 text-5xl">Cohort project status</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--ink-soft)]">
        {pmSnapshotMeta.integration}
      </p>
      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <dt className="text-[var(--ink-soft)]">Cohort</dt>
          <dd className="mt-1 font-medium">{pmSnapshotMeta.cohort}</dd>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <dt className="text-[var(--ink-soft)]">Snapshot</dt>
          <dd className="mt-1 font-medium">
            {new Date(pmSnapshotMeta.refreshedAt).toLocaleString("en-US", {
              timeZone: "America/New_York",
            })}{" "}
            ET
          </dd>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <dt className="text-[var(--ink-soft)]">Forth · Project 1 winner</dt>
          <dd className="mt-1 font-medium">
            <a href={pmSnapshotMeta.forthUrl} target="_blank" rel="noreferrer" className="underline">
              Open live PM
            </a>
            <span className="mt-1 block text-xs text-[var(--ink-soft)]">
              Built by{" "}
              <a href={`/profiles/${pmSnapshotMeta.forthBuilderSlug}`} className="underline">
                {pmSnapshotMeta.forthBuilder}
              </a>
            </span>
          </dd>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <dt className="text-[var(--ink-soft)]">Participant PM</dt>
          <dd className="mt-1 font-medium">
            <a
              href={pmSnapshotMeta.participantPmUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              pm-r3s0lv343vr
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-10 space-y-4">
        {pmProjects.map((project) => (
          <article
            key={project.id}
            className="panel-solid p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="display text-3xl">{project.name}</h2>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">
                  Owner: {project.owner} · Phase: {project.phase}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)] ${statusColor[project.status]}`}
              >
                {project.status}
              </span>
            </div>
            <div className="meter mt-5">
              <span style={{ width: `${project.progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-[var(--ink-soft)]">{project.progress}% complete</p>
            <p className="mt-4 text-[var(--ink-soft)]">{project.notes}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {project.deployUrl ? (
                <a
                  href={project.deployUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost !py-2"
                >
                  Deploy
                </a>
              ) : null}
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost !py-2"
                >
                  Repo
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
