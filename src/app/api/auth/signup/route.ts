import { NextResponse } from "next/server";
import { encodeSession, sessionCookieOptions, type UserRole } from "@/lib/auth";
import { githubIdentityEmail, normalizeGithubHandle } from "@/lib/githubHandle";
import { downloadGithubStudentProfile, getRosterByGithub } from "@/lib/githubProfileImport";

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    github?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = body.password?.trim();
  const role: UserRole = body.role === "partner" ? "partner" : "student";

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Password (6+ characters) is required." },
      { status: 400 },
    );
  }

  if (role === "student") {
    const handle = normalizeGithubHandle(body.github || body.email);
    if (!handle) {
      return NextResponse.json(
        { error: "A valid GitHub handle is required to create a student account." },
        { status: 400 },
      );
    }

    let name = body.name?.trim() || "";
    const roster = getRosterByGithub(handle);
    if (roster?.name) name = roster.name;

    if (!name) {
      try {
        const imported = await downloadGithubStudentProfile(handle);
        name = imported.name;
      } catch {
        name = handle;
      }
    }

    const email = githubIdentityEmail(handle);
    const token = encodeSession({ name, email, role, github: handle });
    const response = NextResponse.json({
      ok: true,
      user: { name, email, role, github: handle },
      next: "/app/profile",
    });
    response.cookies.set(sessionCookieOptions(token));
    return response;
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  if (!name || !email) {
    return NextResponse.json(
      { error: "Name, email, and password (6+ chars) are required." },
      { status: 400 },
    );
  }

  const token = encodeSession({ name, email, role });
  const response = NextResponse.json({ ok: true, user: { name, email, role } });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}
