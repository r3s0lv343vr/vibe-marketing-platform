import { NextResponse } from "next/server";
import { encodeSession, sessionCookieOptions, type UserRole } from "@/lib/auth";
import { githubIdentityEmail, normalizeGithubHandle } from "@/lib/githubHandle";
import { getRosterByGithub } from "@/lib/githubProfileImport";

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: {
    email?: string;
    password?: string;
    name?: string;
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
    body.identity === "email" ||
    looksLikeEmail(body.email || "") ||
    role === "partner";

  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  if (role === "student" && !preferEmail) {
    const handle = normalizeGithubHandle(body.github || body.email);
    if (!handle) {
      return NextResponse.json(
        { error: "Enter your GitHub handle to sign in." },
        { status: 400 },
      );
    }

    const roster = getRosterByGithub(handle);
    const name = body.name?.trim() || roster?.name || handle;
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
  if (!email || !looksLikeEmail(email)) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const name = body.name?.trim() || email.split("@")[0] || (role === "partner" ? "Partner" : "Student");
  const token = encodeSession({ name, email, role });
  const response = NextResponse.json({
    ok: true,
    user: { name, email, role },
    next: role === "partner" ? "/partners/home" : "/app/profile",
  });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}
