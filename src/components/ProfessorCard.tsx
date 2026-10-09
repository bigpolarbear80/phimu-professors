import Link from "next/link";
import type { ProfessorWithStats } from "@/lib/types";
import { RatingStars } from "./RatingStars";

export function ProfessorCard({ professor: p }: { professor: ProfessorWithStats }) {
  const { stats } = p;
  return (
    <Link href={`/professors/${p.slug}`} className="card block p-4 transition hover:border-rose-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-rose-900">{p.name}</h3>
          <p className="truncate text-sm text-muted">
            {[p.department, p.college].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xl font-semibold leading-none text-rose-900">
            {stats.averageRating == null ? "–" : stats.averageRating.toFixed(1)}
          </div>
          <RatingStars value={stats.averageRating} size={12} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.courses.slice(0, 5).map((c) => (
          <span key={c} className="chip">{c}</span>
        ))}
        {p.courses.length > 5 && <span className="chip">+{p.courses.length - 5}</span>}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>{stats.reviewCount} {stats.reviewCount === 1 ? "review" : "reviews"}</span>
        <span>
          {stats.wouldTakeAgainPercent == null ? "" : `${stats.wouldTakeAgainPercent}% would take again`}
        </span>
      </div>
    </Link>
  );
}
