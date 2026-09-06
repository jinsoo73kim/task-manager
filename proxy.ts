import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Must match SESSION_COOKIE_NAME in services/auth.service.ts.
// Duplicated intentionally: proxy.ts must never import auth.service.ts,
// which pulls in Prisma/bcrypt/next-headers — proxy only does an optimistic
// cookie-presence check here. The authoritative check happens server-side
// via services/auth.service.ts's requireUser().
const SESSION_COOKIE_NAME = "session_token";

export function proxy(request: NextRequest) {
  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
