import Link from "next/link";
import { Logo } from "./Logo";

const nav = [
  { href: "/", label: "Professors", short: "Professors" },
  { href: "/materials", label: "Material Bank", short: "Materials" },
  { href: "/updates", label: "Updates & Resources", short: "Updates" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:py-3">
        <Logo className="shrink-0" />
        <nav className="-mx-2 flex w-full items-center justify-between gap-1 overflow-x-auto text-sm font-medium sm:mx-0 sm:w-auto sm:justify-end">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-lg px-2 py-1.5 text-rose-900 hover:bg-rose-100 sm:px-3"
            >
              <span className="sm:hidden">{n.short}</span>
              <span className="hidden sm:inline">{n.label}</span>
            </Link>
          ))}
          <form action="/api/logout" method="post">
            <button type="submit" className="whitespace-nowrap rounded-lg px-2 py-1.5 text-muted hover:bg-rose-100 sm:px-3">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
