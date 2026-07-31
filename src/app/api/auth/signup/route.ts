import { NextResponse } from "next/server";
import { encodeSession, sessionCookieOptions, type UserRole } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  const role: UserRole = body.role === "partner" ? "partner" : "student";

  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Name, email, and password (6+ chars) are required." },
      { status: 400 },
    );
  }

  // MVP: cookie session only (no external auth API / database required).
  const token = encodeSession({ name, email, role });
  const response = NextResponse.json({ ok: true, user: { name, email, role } });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}
