import Link from "next/link";
import { Logo } from "./Logo";

const nav = [
  { href: "/", label: "Professors" },
  { href: "/updates", label: "Updates & Resources" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav className="flex items-center gap-1 text-sm font-medium">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-1.5 text-rose-900 hover:bg-rose-100"
            >
              {n.label}
            </Link>
          ))}
          <form action="/api/logout" method="post">
            <button type="submit" className="rounded-lg px-3 py-1.5 text-muted hover:bg-rose-100">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
