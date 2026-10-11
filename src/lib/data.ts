import { cacheLife } from "next/cache";
import { notionSchema } from "./config";
import { mockProfessors, mockReviews, mockUpdates } from "./mock-data";
import {
  normalizeId,
  queryAll,
  readBool,
  readDate,
  readList,
  readNumber,
  readRelationIds,
  readText,
  slugify,
  isMockMode,
  type NotionPage,
} from "./notion";
import type {
  Professor,
  ProfessorProfile,
  ProfessorStats,
  ProfessorWithStats,
  Review,
  Update,
} from "./types";

/* ---------- raw loaders (Notion or mock) -------------------------------- */

async function loadProfessors(): Promise<Professor[]> {
  if (isMockMode()) return mockProfessors;
  const s = notionSchema.professors;
  const pages = await queryAll(process.env.NOTION_PROFESSORS_DB!, undefined, [
    { property: s.name, direction: "ascending" },
  ]);
  const seen = new Map<string, number>();
  return pages
    .map((page): Professor => {
      const name = readText(page, s.name);
      const base = slugify(name) || normalizeId(page.id).slice(0, 8);
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return {
        id: normalizeId(page.id),
        slug: n === 0 ? base : `${base}-${normalizeId(page.id).slice(0, 6)}`,
        name,
        college: readText(page, s.college),
        department: readText(page, s.department),
        courses: readList(page, s.courses).map(normalizeCourse),
        bio: readText(page, s.bio),
        email: readText(page, s.email),
      };
    })
    .filter((p) => p.name);
}

async function loadReviews(): Promise<Review[]> {
  if (isMockMode()) return mockReviews;
  const s = notionSchema.reviews;
  // Only approved rows ever leave Notion. If the Status column is a "status"
  // type instead of "select", swap the filter key below.
  const filter =
    s.statusType === "checkbox"
      ? { property: s.status, checkbox: { equals: true } }
      : s.statusType === "status"
        ? { property: s.status, status: { equals: s.approvedValue } }
        : { property: s.status, select: { equals: s.approvedValue } };
  const pages: NotionPage[] = await queryAll(process.env.NOTION_REVIEWS_DB!, filter);
  return pages
    .map((page): Review | null => {
      const professorId = readRelationIds(page, s.professor)[0];
      const rating = readNumber(page, s.rating);
      if (!professorId || rating == null) return null;
      return {
        id: normalizeId(page.id),
        professorId,
        course: normalizeCourse(readText(page, s.course)),
        rating: clamp(rating, 1, 5),
        difficulty: clampOrNull(readNumber(page, s.difficulty)),
        wouldTakeAgain: readBool(page, s.wouldTakeAgain),
        wouldTakeAgainLabel: readText(page, s.wouldTakeAgain),
        comment: readText(page, s.comment),
        semester: readText(page, s.semester),
        submittedAt: readDate(page, s.submitted) ?? page.created_time?.slice(0, 10) ?? null,
      };
    })
    .filter((r): r is Review => r !== null);
}

async function loadUpdates(): Promise<Update[]> {
  if (isMockMode()) return mockUpdates;
  if (!process.env.NOTION_UPDATES_DB) return [];
  const s = notionSchema.updates;
  const pages = await queryAll(process.env.NOTION_UPDATES_DB, undefined, [
    { property: s.date, direction: "descending" },
  ]).catch(() => queryAll(process.env.NOTION_UPDATES_DB!));
  return pages
    .map((page): Update => ({
      id: normalizeId(page.id),
      title: readText(page, s.title),
      date: readDate(page, s.date),
      body: readText(page, s.body),
      link: readText(page, s.link),
      category: readText(page, s.category),
      pinned: readBool(page, s.pinned) ?? false,
    }))
    .filter((u) => u.title)
    .filter((u, i) => {
      const published = readBool(pages[i], s.published);
      return published !== false; // column missing => show
    });
}

/* ---------- cached public API ------------------------------------------ */

export async function getProfessors(): Promise<ProfessorWithStats[]> {
  "use cache";
  cacheLife("minutes");
  const [professors, reviews] = await Promise.all([loadProfessors(), loadReviews()]);
  const byProf = groupBy(reviews, (r) => r.professorId);
  return professors
    .map((p) => {
      const rs = byProf.get(p.id) ?? [];
      const courses = new Set([...p.courses, ...rs.map((r) => r.course).filter(Boolean)]);
      return { ...p, courses: [...courses].sort(), stats: computeStats(rs) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProfessorBySlug(slug: string): Promise<ProfessorProfile | null> {
  "use cache";
  cacheLife("minutes");
  const professors = await getProfessors();
  const prof = professors.find((p) => p.slug === slug);
  if (!prof) return null;
  const reviews = (await loadReviews())
    .filter((r) => r.professorId === prof.id)
    .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""));
  return { ...prof, reviews };
}

export async function getUpdates(): Promise<Update[]> {
  "use cache";
  cacheLife("minutes");
  const updates = await loadUpdates();
  return updates.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (b.date ?? "").localeCompare(a.date ?? "");
  });
}

export async function getFilterOptions() {
  "use cache";
  cacheLife("minutes");
  const professors = await getProfessors();
  const colleges = new Map<string, Set<string>>();
  for (const p of professors) {
    if (!p.college) continue;
    if (!colleges.has(p.college)) colleges.set(p.college, new Set());
    if (p.department) colleges.get(p.college)!.add(p.department);
  }
  return [...colleges.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([college, depts]) => ({ college, departments: [...depts].sort() }));
}

/* ---------- helpers ----------------------------------------------------- */

export function computeStats(reviews: Review[]): ProfessorStats {
  const n = reviews.length;
  if (n === 0) {
    return { reviewCount: 0, averageRating: null, averageDifficulty: null, wouldTakeAgainPercent: null };
  }
  const avg = (xs: number[]) => (xs.length ? round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);
  const wta = reviews.filter((r) => r.wouldTakeAgain !== null);
  return {
    reviewCount: n,
    averageRating: avg(reviews.map((r) => r.rating)),
    averageDifficulty: avg(reviews.map((r) => r.difficulty).filter((d): d is number => d !== null)),
    wouldTakeAgainPercent: wta.length
      ? Math.round((100 * wta.filter((r) => r.wouldTakeAgain).length) / wta.length)
      : null,
  };
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}
function clampOrNull(n: number | null) {
  return n == null ? null : clamp(n, 1, 5);
}
function normalizeCourse(s: string) {
  // "acct201" / "ACCT-201" / "Acct 201" -> "ACCT 201"
  const m = s.trim().match(/^([A-Za-z]{2,5})[\s-]*(\d{3,4}[A-Za-z]?)$/);
  return m ? `${m[1].toUpperCase()} ${m[2].toUpperCase()}` : s.trim();
}
function groupBy<T>(xs: T[], key: (x: T) => string) {
  const m = new Map<string, T[]>();
  for (const x of xs) {
    const k = key(x);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(x);
  }
  return m;
}
