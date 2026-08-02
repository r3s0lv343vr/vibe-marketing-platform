/**
 * Safe URL helpers for partner-facing directory.
 * Only https:// links are rendered in the UI.
 */

export function normalizeHttpsUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let value = raw.trim();
  if (!value) return null;
  if (value.startsWith("//")) value = `https:${value}`;
  if (/^http:\/\//i.test(value)) value = value.replace(/^http:/i, "https:");
  if (!/^https:\/\//i.test(value)) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "https:") return null;
    if (!u.hostname) return null;
    u.username = "";
    u.password = "";
    return u.toString();
  } catch {
    return null;
  }
}

export function normalizeGithubProfileUrl(handle: string): string | null {
  const clean = handle.replace(/^@/, "").trim();
  if (!/^[A-Za-z0-9-]{1,39}$/.test(clean)) return null;
  return `https://github.com/${clean}`;
}

export function normalizeGithubRepoUrl(raw: unknown): string | null {
  const https = normalizeHttpsUrl(raw);
  if (!https) return null;
  try {
    const u = new URL(https);
    if (u.hostname !== "github.com") return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return `https://github.com/${parts[0]}/${parts[1]}`;
  } catch {
    return null;
  }
}

export function isAllowedExternalHref(href: string): boolean {
  return Boolean(normalizeHttpsUrl(href));
}
