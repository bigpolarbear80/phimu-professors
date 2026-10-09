import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/config";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`} aria-label={site.name}>
      <Image src={site.logoPath} alt="" width={160} height={40} priority className="h-9 w-auto" />
      <span className="sr-only">{site.name}</span>
    </Link>
  );
}
