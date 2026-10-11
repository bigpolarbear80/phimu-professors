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
          <Image src="/logo.png" alt={site.name} width={1028} height={864} priority className="h-28 w-auto" />
        </div>
        <h1 className="sr-only">{site.name}</h1>
        <p className="mt-1 text-center text-sm text-muted">Enter the chapter password to continue.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
