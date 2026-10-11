/**
 * Minimal Notion REST client plus tolerant property readers.
 * We use plain fetch rather than the SDK so the whole thing stays light and
 * the caching story is just the `use cache` layer in data.ts.
 */

const NOTION_VERSION = "2022-06-28";
const BASE = "https://api.notion.com/v1";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NotionPage = { id: string; created_time?: string; properties: Record<string, any> };

export function notionConfigured() {
  return Boolean(
    process.env.NOTION_TOKEN &&
      process.env.NOTION_PROFESSORS_DB &&
      process.env.NOTION_REVIEWS_DB,
  );
}

export function isMockMode() {
  if (process.env.USE_MOCK_DATA === "true") return true;
  if (process.env.USE_MOCK_DATA === "false") return false;
  return !notionConfigured();
}

async function notionFetch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Notion ${res.status} on ${path}: ${text.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

/** Query every page of a database (handles Notion's 100-row pagination). */
export async function queryAll(
  databaseId: string,
  filter?: unknown,
  sorts?: unknown[],
): Promise<NotionPage[]> {
  const results: NotionPage[] = [];
  let cursor: string | undefined;
  do {
    const page = await notionFetch<{
      results: NotionPage[];
      has_more: boolean;
      next_cursor: string | null;
    }>(`/databases/${databaseId}/query`, {
      page_size: 100,
      start_cursor: cursor,
      filter,
      sorts,
    });
    results.push(...page.results);
    cursor = page.has_more && page.next_cursor ? page.next_cursor : undefined;
  } while (cursor);
  return results;
}

/* ---------- tolerant property readers --------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Prop = any;

function prop(page: NotionPage, name: string): Prop | undefined {
  if (!name) return undefined;
  if (page.properties[name]) return page.properties[name];
  // case-insensitive fallback so "Would take again" still matches
  const key = Object.keys(page.properties).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return key ? page.properties[key] : undefined;
}

function richToText(arr: Prop): string {
  if (!Array.isArray(arr)) return "";
  return arr.map((t) => t?.plain_text ?? "").join("").trim();
}

export function readText(page: NotionPage, name: string): string {
  const p = prop(page, name);
  if (!p) return "";
  switch (p.type) {
    case "title":
      return richToText(p.title);
    case "rich_text":
      return richToText(p.rich_text);
    case "select":
      return p.select?.name ?? "";
    case "status":
      return p.status?.name ?? "";
    case "multi_select":
      return (p.multi_select ?? []).map((s: Prop) => s.name).join(", ");
    case "email":
      return p.email ?? "";
    case "url":
      return p.url ?? "";
    case "phone_number":
      return p.phone_number ?? "";
    case "number":
      return p.number == null ? "" : String(p.number);
    case "date":
      return p.date?.start ?? "";
    case "formula":
      return p.formula?.string ?? (p.formula?.number != null ? String(p.formula.number) : "");
    case "rollup": {
      const arr = p.rollup?.array ?? [];
      return arr.map((x: Prop) => readText({ id: "", properties: { x } }, "x")).filter(Boolean).join(", ");
    }
    default:
      return "";
  }
}

export function readList(page: NotionPage, name: string): string[] {
  const p = prop(page, name);
  if (!p) return [];
  if (p.type === "multi_select") return (p.multi_select ?? []).map((s: Prop) => s.name);
  return readText(page, name)
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function readNumber(page: NotionPage, name: string): number | null {
  const p = prop(page, name);
  if (!p) return null;
  let v: unknown = null;
  switch (p.type) {
    case "number": v = p.number; break;
    case "select": v = p.select?.name; break;
    case "formula": v = p.formula?.number ?? p.formula?.string; break;
    case "rollup": v = p.rollup?.number; break;
    case "rich_text": v = richToText(p.rich_text); break;
    default: return null;
  }
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

export function readBool(page: NotionPage, name: string): boolean | null {
  const p = prop(page, name);
  if (!p) return null;
  switch (p.type) {
    case "checkbox": return Boolean(p.checkbox);
    case "formula":
      if (typeof p.formula?.boolean === "boolean") return p.formula.boolean;
      return yesNo(p.formula?.string);
    case "select": return yesNo(p.select?.name);
    case "status": return yesNo(p.status?.name);
    case "rich_text": return yesNo(richToText(p.rich_text));
    default: return null;
  }
}

function yesNo(s: unknown): boolean | null {
  if (typeof s !== "string") return null;
  const v = s.trim().toLowerCase();
  if (["yes", "y", "true", "1", "would take again"].includes(v)) return true;
  if (["no", "n", "false", "0", "maybe", "would not take again"].includes(v)) return false;
  return null;
}

export function readDate(page: NotionPage, name: string): string | null {
  const p = prop(page, name);
  if (!p) return null;
  switch (p.type) {
    case "date": return p.date?.start ?? null;
    case "created_time": return p.created_time ?? null;
    case "last_edited_time": return p.last_edited_time ?? null;
    case "formula": return p.formula?.date?.start ?? null;
    default: return null;
  }
}

export function readRelationIds(page: NotionPage, name: string): string[] {
  let p = prop(page, name);
  if (!p || p.type !== "relation") {
    // Fall back to the first relation property on the page.
    p = Object.values(page.properties).find((v: Prop) => v?.type === "relation");
  }
  if (!p || p.type !== "relation") return [];
  return (p.relation ?? []).map((r: Prop) => normalizeId(r.id));
}

export function normalizeId(id: string) {
  return id.replace(/-/g, "");
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
