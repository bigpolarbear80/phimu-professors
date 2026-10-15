import { NextResponse } from "next/server";
import { notionSchema } from "@/lib/config";
import { getPage, readFiles, isMockMode } from "@/lib/notion";

/**
 * Notion-hosted file URLs expire after about an hour, so we never link to them
 * directly. This route fetches the page fresh and redirects to a just-minted URL.
 * The password proxy protects it like every other route.
 */
export async function GET(_req: Request, ctx: RouteContext<"/api/file/[pageId]/[index]">) {
  const { pageId, index } = await ctx.params;
  if (isMockMode()) return NextResponse.json({ error: "No Notion connection" }, { status: 404 });
  if (!/^[0-9a-f]{32}$/.test(pageId)) return NextResponse.json({ error: "Bad id" }, { status: 400 });
  try {
    const page = await getPage(pageId);
    const file = readFiles(page, notionSchema.materials.file)[Number(index)];
    if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });
    return NextResponse.redirect(file.url, { status: 302 });
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 502 });
  }
}
