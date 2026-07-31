import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth";
import { PROFILE_COMPLETE_COOKIE, PROFILE_INDEX_COOKIE } from "@/lib/profile";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const clear = {
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  };
  response.cookies.set({ name: COOKIE, ...clear });
  response.cookies.set({ name: PROFILE_COMPLETE_COOKIE, ...clear });
  response.cookies.set({ name: PROFILE_INDEX_COOKIE, ...clear });
  return response;
}
