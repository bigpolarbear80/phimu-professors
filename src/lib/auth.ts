/**
 * Shared-password auth. One password for the whole site; the cookie holds an
 * HMAC of that password so changing SITE_PASSWORD logs everyone out. Uses Web
 * Crypto so it runs in both the proxy and route handlers.
 */

export async function sessionToken(): Promise<string> {
  const password = process.env.SITE_PASSWORD ?? "";
  const secret = process.env.SESSION_SECRET ?? "dev-secret-change-me";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`site:${password}`));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isValidSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await sessionToken();
  return timingSafeEqual(cookieValue, expected);
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.SITE_PASSWORD ?? "";
  if (!expected) return false;
  return timingSafeEqual(input, expected);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
