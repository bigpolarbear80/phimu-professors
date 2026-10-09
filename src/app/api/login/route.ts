import { NextResponse } from "next/server";
import { passwordMatches, sessionToken } from "@/lib/auth";
import { site } from "@/lib/config";

export async function POST(request: Request) {
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !passwordMatches(password)) {
    // Small delay blunts brute-force guessing on a single shared password.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "That password is not right." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(site.sessionCookie, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: site.sessionMaxAge,
  });
  return res;
}
