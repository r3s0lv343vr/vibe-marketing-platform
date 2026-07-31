import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "pixie_session";
const PROFILE_COMPLETE_COOKIE = "pixie_profile_complete";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const profileComplete = request.cookies.get(PROFILE_COMPLETE_COOKIE)?.value === "1";
  const onProfileBuilder = pathname === "/app/profile" || pathname.startsWith("/app/profile/");

  // Incomplete profiles must finish the builder before agent workspace pages.
  if (!profileComplete && !onProfileBuilder) {
    return NextResponse.redirect(new URL("/app/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
