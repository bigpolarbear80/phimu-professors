import { Header } from "@/components/Header";
import { site } from "@/lib/config";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        {site.name}. For sisters only, please don’t share the password.
      </footer>
    </>
  );
}
