"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { ProfessorWithStats } from "@/lib/types";
import { ProfessorCard } from "./ProfessorCard";

type FilterOption = { college: string; departments: string[] };

export function ProfessorDirectory({
  professors,
  filters,
}: {
  professors: ProfessorWithStats[];
  filters: FilterOption[];
}) {
  const [query, setQuery] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [sort, setSort] = useState<"name" | "rating" | "reviews">("name");
  const q = useDeferredValue(query.trim().toLowerCase());

  const departments = useMemo(() => {
    if (college) return filters.find((f) => f.college === college)?.departments ?? [];
    return [...new Set(filters.flatMap((f) => f.departments))].sort();
  }, [filters, college]);

  const results = useMemo(() => {
    const norm = (s: string) => s.toLowerCase().replace(/[\s-]+/g, "");
    const nq = norm(q);
    const list = professors.filter((p) => {
      if (college && p.college !== college) return false;
      if (department && p.department !== department) return false;
      if (!nq) return true;
      return (
        norm(p.name).includes(nq) ||
        p.courses.some((c) => norm(c).includes(nq)) ||
        norm(p.department).includes(nq)
      );
    });
    return list.sort((a, b) => {
      if (sort === "rating") return (b.stats.averageRating ?? -1) - (a.stats.averageRating ?? -1);
      if (sort === "reviews") return b.stats.reviewCount - a.stats.reviewCount;
      return a.name.localeCompare(b.name);
    });
  }, [professors, q, college, department, sort]);

  const clear = () => {
    setQuery("");
    setCollege("");
    setDepartment("");
  };
  const hasFilters = query || college || department;

  return (
    <div>
      <div className="card p-4">
        <label className="sr-only" htmlFor="search">Search</label>
        <input
          id="search"
          className="input text-base"
          placeholder="Search by professor name or course code (e.g. ACCT 201)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <select
            className="input"
            value={college}
            onChange={(e) => {
              setCollege(e.target.value);
              setDepartment("");
            }}
            aria-label="College"
          >
            <option value="">All colleges</option>
            {filters.map((f) => (
              <option key={f.college} value={f.college}>{f.college}</option>
            ))}
          </select>
          <select
            className="input"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            aria-label="Department"
          >
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            className="input"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            aria-label="Sort"
          >
            <option value="name">Sort: Name A–Z</option>
            <option value="rating">Sort: Highest rated</option>
            <option value="reviews">Sort: Most reviewed</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted">
        <span>
          {results.length} {results.length === 1 ? "professor" : "professors"}
        </span>
        {hasFilters && (
          <button type="button" onClick={clear} className="font-medium text-rose-700 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="card mt-4 p-8 text-center text-muted">
          <p className="font-medium text-rose-900">No professors match that yet.</p>
          <p className="mt-1 text-sm">Try a different spelling, or search a course code like “BIOL 101”.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {results.map((p) => (
            <ProfessorCard key={p.id} professor={p} />
          ))}
        </div>
      )}
    </div>
  );
}
