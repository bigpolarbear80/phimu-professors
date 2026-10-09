import { Suspense } from "react";
import Image from "next/image";
import { site } from "@/lib/config";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="card w-full max-w-sm p-8">
        <div className="flex justify-center">
          <Image src={site.logoPath} alt={site.name} width={160} height={40} priority className="h-10 w-auto" />
        </div>
        <h1 className="mt-5 text-center text-xl font-semibold text-rose-900">{site.name}</h1>
        <p className="mt-1 text-center text-sm text-muted">Enter the chapter password to continue.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
