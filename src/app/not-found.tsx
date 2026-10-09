import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-rose-900">Page not found</h1>
      <p className="text-sm text-muted">That professor or page doesn’t exist.</p>
      <Link href="/" className="btn btn-ghost">Back to professors</Link>
    </main>
  );
}
