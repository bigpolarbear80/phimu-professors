import type { Metadata } from "next";
import { MaterialDirectory } from "@/components/MaterialDirectory";
import { site } from "@/lib/config";
import { getMaterials } from "@/lib/data";

export const metadata: Metadata = { title: "Material Bank" };

export default async function MaterialsPage() {
  const materials = await getMaterials();
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-rose-900">Material Bank</h1>
          <p className="text-sm text-muted">Syllabi, notes, study guides, and practice tests shared by sisters.</p>
        </div>
        {site.submitMaterialUrl && (
          <a href={site.submitMaterialUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
            Add to the bank
          </a>
        )}
      </div>
      <MaterialDirectory materials={materials} />
    </div>
  );
}
