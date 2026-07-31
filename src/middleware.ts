import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "pixie_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (pathname.startsWith("/partners/home")) {
    if (!session) {
      const login = new URL("/partners/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  // Temporary: allow unfinished profiles into the agent workspace.
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/partners/home", "/partners/home/:path*"],
};
