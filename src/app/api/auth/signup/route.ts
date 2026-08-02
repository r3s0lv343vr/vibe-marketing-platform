import { NextResponse } from "next/server";
import { encodeSession, sessionCookieOptions, type UserRole } from "@/lib/auth";
import { githubIdentityEmail, normalizeGithubHandle } from "@/lib/githubHandle";
import {
  downloadGithubStudentProfile,
  getRosterByGithub,
  studentProfileFromRoster,
} from "@/lib/githubProfileImport";
import { emptyProfile } from "@/lib/profile";
import { grantAiAccessCookies } from "@/lib/profileAccess";

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    github?: string;
    identity?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = body.password?.trim();
  const role: UserRole = body.role === "partner" ? "partner" : "student";
  const preferEmail =
    body.identity === "email" || (!body.github && looksLikeEmail(body.email || ""));

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Password (6+ characters) is required." },
      { status: 400 },
    );
  }

  if (role === "student" && !preferEmail) {
    const handle = normalizeGithubHandle(body.github || body.email);
    if (!handle) {
      return NextResponse.json(
        { error: "A valid GitHub handle is required to create a student account." },
        { status: 400 },
      );
    }

    let importedProfile = emptyProfile(body.name?.trim() || handle);
    let name = body.name?.trim() || "";
    let fromRoster = false;

    try {
      const imported = await downloadGithubStudentProfile(handle);
      importedProfile = imported.profile;
      name = imported.name || name || handle;
      fromRoster = imported.fromRoster;
    } catch {
      const roster = getRosterByGithub(handle);
      if (roster) {
        importedProfile = studentProfileFromRoster(roster);
        name = roster.name;
        fromRoster = true;
      } else {
        name = name || handle;
        importedProfile = emptyProfile(name);
      }
    }

    if (!importedProfile.displayName) {
      importedProfile.displayName = name;
    }

    const email = githubIdentityEmail(handle);
    const token = encodeSession({ name, email, role, github: handle });
    const response = NextResponse.json({
      ok: true,
      user: { name, email, role, github: handle },
      profile: importedProfile,
      fromRoster,
      linked: true,
      aiAccess: true,
      // Land on linked profile form; AI tools are already unlocked.
      next: "/app/profile?linked=1",
    });
    response.cookies.set(sessionCookieOptions(token));
    grantAiAccessCookies(response, email, importedProfile);
    return response;
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  if (!name || !email || !looksLikeEmail(email)) {
    return NextResponse.json(
      { error: "Name, email, and password (6+ chars) are required." },
      { status: 400 },
    );
  }

  const token = encodeSession({ name, email, role });
  const seed = emptyProfile(name);
  const response = NextResponse.json({
    ok: true,
    user: { name, email, role },
    profile: role === "student" ? seed : undefined,
    aiAccess: role === "student",
    next: role === "partner" ? "/partners/home" : "/app/profile",
  });
  response.cookies.set(sessionCookieOptions(token));
  if (role === "student") {
    grantAiAccessCookies(response, email, seed);
  }
  return response;
}
