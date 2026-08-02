import { NextResponse } from "next/server";
import { encodeSession, sessionCookieOptions, type UserRole } from "@/lib/auth";
import { githubIdentityEmail, normalizeGithubHandle } from "@/lib/githubHandle";
import { getRosterByGithub } from "@/lib/githubProfileImport";

export async function POST(request: Request) {
  let body: {
    email?: string;
    password?: string;
    name?: string;
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

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  if (role === "student") {
    const handle = normalizeGithubHandle(body.github || body.email);
    if (!handle) {
      return NextResponse.json(
        { error: "Enter your GitHub handle to sign in." },
        { status: 400 },
      );
    }

    const roster = getRosterByGithub(handle);
    const name =
      body.name?.trim() ||
      roster?.name ||
      handle;
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

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // MVP demo auth: any valid email/password pair receives a partner session.
  const name = body.name?.trim() || email.split("@")[0] || "Partner";
  const token = encodeSession({ name, email, role });
  const response = NextResponse.json({ ok: true, user: { name, email, role } });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}
