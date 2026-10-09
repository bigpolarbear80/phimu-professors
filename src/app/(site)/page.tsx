import { ProfessorDirectory } from "@/components/ProfessorDirectory";
import { site } from "@/lib/config";
import { getFilterOptions, getProfessors } from "@/lib/data";

export default async function HomePage() {
  const [professors, filters] = await Promise.all([getProfessors(), getFilterOptions()]);
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-rose-900">Find a professor</h1>
          <p className="text-sm text-muted">{site.tagline}</p>
        </div>
        {site.submitReviewUrl && (
          <a href={site.submitReviewUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
            Submit a review
          </a>
        )}
      </div>
      <ProfessorDirectory professors={professors} filters={filters} />
    </div>
  );
}
