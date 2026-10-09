import { NextResponse } from "next/server";
import { site } from "@/lib/config";

export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  res.cookies.set(site.sessionCookie, "", { path: "/", maxAge: 0 });
  return res;
}
