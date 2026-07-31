import { NextResponse } from "next/server";
import { encodeSession, sessionCookieOptions, type UserRole } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string; name?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  const role: UserRole = body.role === "partner" ? "partner" : "student";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // MVP demo auth: any valid email/password pair receives a session.
  const name = body.name?.trim() || email.split("@")[0] || "Creator";
  const token = encodeSession({ name, email, role });
  const response = NextResponse.json({ ok: true, user: { name, email, role } });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}
