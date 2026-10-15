"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { Material } from "@/lib/types";
import { MaterialCard } from "./MaterialCard";

export function MaterialDirectory({ materials }: { materials: Material[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());

  const subjects = useMemo(() => [...new Set(materials.map((m) => m.subject).filter(Boolean))].sort(), [materials]);
  const types = useMemo(() => [...new Set(materials.map((m) => m.type).filter(Boolean))].sort(), [materials]);

  const results = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().replace(/[\s-]+/g, "");
    const nq = norm(q);
    return materials.filter((m) => {
      if (subject && m.subject !== subject) return false;
      if (type && m.type !== type) return false;
      if (!nq) return true;
      return [m.title, m.course, m.professor, m.description].some((v) => norm(v).includes(nq));
    });
  }, [materials, q, subject, type]);

  const hasFilters = query || subject || type;

  return (
    <div>
      <div className="card p-4">
        <label className="sr-only" htmlFor="material-search">Search</label>
        <input
          id="material-search"
          className="input text-base"
          placeholder="Search by course code, professor, or title (e.g. ACCT 201)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <select className="input" value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject">
            <option value="">Browse by subject: all</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span>{results.length} {results.length === 1 ? "item" : "items"}</span>
        {hasFilters && (
          <button
            type="button"
            onClick={() => { setQuery(""); setSubject(""); setType(""); }}
            className="font-medium text-rose-700 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="card mt-4 p-8 text-center text-muted">
          <p className="font-medium text-rose-900">Nothing here yet.</p>
          <p className="mt-1 text-sm">Try another course code, or be the first to add something.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {results.map((m) => (
            <MaterialCard key={m.id} material={m} />
          ))}
        </div>
      )}
    </div>
  );
}
