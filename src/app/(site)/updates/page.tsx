import type { Metadata } from "next";
import { formatDate } from "@/components/ReviewCard";
import { getUpdates } from "@/lib/data";

export const metadata: Metadata = { title: "Updates & Resources" };

export default async function UpdatesPage() {
  const updates = await getUpdates();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-rose-900">Updates & Resources</h1>
      <p className="text-sm text-muted">Important dates, links, and announcements from the chapter.</p>

      {updates.length === 0 ? (
        <div className="card mt-5 p-8 text-center text-sm text-muted">Nothing posted yet. Check back soon.</div>
      ) : (
        <div className="mt-5 grid gap-3">
          {updates.map((u) => (
            <article key={u.id} className={`card p-5 ${u.pinned ? "border-rose-300 bg-rose-50" : ""}`}>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                {u.pinned && <span className="chip">Pinned</span>}
                {u.category && <span className="chip">{u.category}</span>}
                {u.date && <time dateTime={u.date}>{formatDate(u.date)}</time>}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-rose-900">{u.title}</h2>
              {u.body && <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{u.body}</p>}
              {u.link && (
                <a href={u.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-rose-700 hover:underline">
                  Open link ↗
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
