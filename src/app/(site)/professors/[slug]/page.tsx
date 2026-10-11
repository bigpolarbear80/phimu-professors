import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RatingStars } from "@/components/RatingStars";
import { ReviewCard } from "@/components/ReviewCard";
import { StatBlock } from "@/components/StatBlock";
import { getProfessorBySlug, getProfessors } from "@/lib/data";

export async function generateStaticParams() {
  const professors = await getProfessors();
  return professors.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/professors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const prof = await getProfessorBySlug(slug);
  return { title: prof?.name ?? "Professor" };
}

export default function ProfessorPage({ params }: PageProps<"/professors/[slug]">) {
  return (
    <div>
      <Link href="/" className="text-sm text-rose-700 hover:underline">← All professors</Link>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfessorDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProfessorDetail({ params }: { params: PageProps<"/professors/[slug]">["params"] }) {
  const { slug } = await params;
  const prof = await getProfessorBySlug(slug);
  if (!prof) notFound();
  const { stats } = prof;

  return (
    <>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-rose-900">{prof.name}</h1>
          <p className="mt-1 text-muted">{[prof.department, prof.college].filter(Boolean).join(" · ")}</p>
          {prof.courses.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {prof.courses.map((c) => (
                <span key={c} className="chip">{c}</span>
              ))}
            </div>
          )}
          {prof.bio && <p className="mt-3 max-w-prose text-sm text-ink">{prof.bio}</p>}
        </div>
        <div className="text-right">
          <div className="text-5xl font-semibold leading-none text-rose-900">
            {stats.averageRating == null ? "–" : stats.averageRating.toFixed(1)}
          </div>
          <div className="mt-1"><RatingStars value={stats.averageRating} size={18} /></div>
          <div className="mt-1 text-xs text-muted">overall rating</div>
        </div>
      </div>

      <div className={`mt-6 grid grid-cols-2 gap-3 ${stats.averageDifficulty == null ? "sm:grid-cols-3" : "sm:grid-cols-4"}`}>
        <StatBlock label="Reviews" value={String(stats.reviewCount)} />
        <StatBlock
          label="Would take again"
          value={stats.wouldTakeAgainPercent == null ? "–" : `${stats.wouldTakeAgainPercent}%`}
          hint="counts only “Yes” answers"
        />
        {stats.averageDifficulty != null && (
          <StatBlock
            label="Difficulty"
            value={`${stats.averageDifficulty.toFixed(1)}/5`}
            hint="1 easy · 5 hard"
          />
        )}
        <StatBlock label="Courses" value={String(prof.courses.length)} />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-rose-900">Reviews</h2>
      {prof.reviews.length === 0 ? (
        <div className="card mt-3 p-8 text-center text-sm text-muted">
          No approved reviews yet. Be the first to submit one.
        </div>
      ) : (
        <div className="mt-3 grid gap-3">
          {prof.reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mt-3 grid gap-3" aria-busy="true">
      <div className="card h-24 animate-pulse bg-rose-50" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-20 animate-pulse bg-rose-50" />
        ))}
      </div>
    </div>
  );
}
