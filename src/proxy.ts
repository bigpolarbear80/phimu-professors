import { NextResponse, type NextRequest } from "next/server";
import { isValidSession } from "@/lib/auth";
import { site } from "@/lib/config";

const PUBLIC_PATHS = ["/login", "/api/login", "/api/logout"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }
  const ok = await isValidSession(request.cookies.get(site.sessionCookie)?.value);
  if (ok) return NextResponse.next();

  const login = new URL("/login", request.url);
  const next = pathname + search;
  if (next !== "/") login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}

export const config = {
  // Everything except Next internals and static files (anything with a dot).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
