import type { NextResponse } from "next/server";
import {
  PROFILE_COMPLETE_COOKIE,
  PROFILE_INDEX_COOKIE,
  toSearchIndex,
  type StudentProfile,
} from "@/lib/profile";

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 180,
};

/** Unlock AI workspace immediately for a student (skip / keep / edit all allowed). */
export function grantAiAccessCookies(
  response: NextResponse,
  email: string,
  profile: StudentProfile,
) {
  const index = toSearchIndex(email, profile);
  let indexValue = Buffer.from(JSON.stringify(index), "utf8").toString("base64url");
  if (indexValue.length > 3500) {
    // Keep access even if index is oversized — trim bio for the cookie only.
    const trimmed = toSearchIndex(email, {
      ...profile,
      bio: profile.bio.slice(0, 280),
      projects: profile.projects.slice(0, 3),
    });
    indexValue = Buffer.from(JSON.stringify(trimmed), "utf8").toString("base64url");
  }

  response.cookies.set({
    name: PROFILE_COMPLETE_COOKIE,
    value: "1",
    ...cookieBase,
  });
  response.cookies.set({
    name: PROFILE_INDEX_COOKIE,
    value: indexValue.slice(0, 3500),
    ...cookieBase,
  });
}
