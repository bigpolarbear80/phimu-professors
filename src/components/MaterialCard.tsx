import type { Material } from "@/lib/types";
import { formatDate } from "./ReviewCard";

export function MaterialCard({ material: m }: { material: Material }) {
  return (
    <article className="card flex flex-col p-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {m.type && <span className="chip">{m.type}</span>}
        {m.course && <span className="chip">{m.course}</span>}
        {m.subject && <span className="text-xs text-muted">{m.subject}</span>}
      </div>
      <h3 className="mt-2 text-base font-semibold text-rose-900">{m.title}</h3>
      {m.professor && <p className="text-sm text-muted">{m.professor}</p>}
      {m.description && <p className="mt-2 text-sm leading-relaxed">{m.description}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {m.files.map((f, i) => (
          <a
            key={i}
            href={f.kind === "notion" ? `/api/file/${m.id}/${i}` : f.url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary !px-3 !py-1.5 text-xs"
            title={f.name}
          >
            Download{m.files.length > 1 ? ` ${i + 1}` : ""}
          </a>
        ))}
        {m.link && (
          <a href={m.link} target="_blank" rel="noreferrer" className="btn btn-ghost !px-3 !py-1.5 text-xs">
            Open link ↗
          </a>
        )}
      </div>
      {m.submittedAt && <p className="mt-3 text-xs text-muted">Added {formatDate(m.submittedAt)}</p>}
    </article>
  );
}
