import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  PROFILE_COMPLETE_COOKIE,
  PROFILE_INDEX_COOKIE,
  isProfileComplete,
  toSearchIndex,
  type StudentProfile,
} from "@/lib/profile";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  // Full profile (with images) lives client-side; server keeps searchable index cookie.
  return NextResponse.json({
    ok: true,
    email: session.email,
    name: session.name,
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: { profile?: StudentProfile };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const profile = body.profile;
  if (!profile) {
    return NextResponse.json({ error: "profile is required." }, { status: 400 });
  }

  const complete = isProfileComplete(profile);
  const index = toSearchIndex(session.email, profile);

  // Store compact search index for employers/investors later (no heavy images).
  const indexValue = Buffer.from(JSON.stringify(index), "utf8").toString("base64url");
  if (indexValue.length > 3500) {
    return NextResponse.json(
      { error: "Profile index too large. Shorten bio or reduce project links." },
      { status: 400 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    complete,
    index,
    next: complete ? "/app" : "/app/profile",
  });

  response.cookies.set({
    name: PROFILE_COMPLETE_COOKIE,
    value: complete ? "1" : "0",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  response.cookies.set({
    name: PROFILE_INDEX_COOKIE,
    value: indexValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  return response;
}
