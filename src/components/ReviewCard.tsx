import type { Review } from "@/lib/types";
import { RatingStars } from "./RatingStars";

export function ReviewCard({ review: r }: { review: Review }) {
  return (
    <article className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {r.course && <span className="chip">{r.course}</span>}
          {r.semester && <span className="text-xs text-muted">{r.semester}</span>}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted">
          {r.difficulty != null && <span>Difficulty {r.difficulty}/5</span>}
          {r.wouldTakeAgainLabel && (
            <span className={r.wouldTakeAgain ? "text-rose-700" : ""}>
              Would take again: {r.wouldTakeAgainLabel}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <RatingStars value={r.rating} />
        <span className="text-sm font-semibold text-rose-900">{r.rating}/5</span>
      </div>
      {r.comment && <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">{r.comment}</p>}
      {r.submittedAt && (
        <p className="mt-2 text-xs text-muted">{formatDate(r.submittedAt)}</p>
      )}
    </article>
  );
}

export function formatDate(iso: string) {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
