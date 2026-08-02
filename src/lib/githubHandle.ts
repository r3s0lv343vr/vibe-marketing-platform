/** Normalize and validate public GitHub usernames for student auth. */

export function normalizeGithubHandle(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let value = raw.trim();
  if (!value) return null;
  value = value.replace(/^@/, "");
  value = value.replace(/^https?:\/\/(www\.)?github\.com\//i, "");
  value = value.split(/[/?#]/)[0] || "";
  value = value.replace(/\/+$/, "");
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(value)) {
    return null;
  }
  return value;
}

/** Stable synthetic email so existing email-keyed cookies/indexes keep working. */
export function githubIdentityEmail(handle: string): string {
  return `${handle.toLowerCase()}@users.noreply.github.com`;
}
