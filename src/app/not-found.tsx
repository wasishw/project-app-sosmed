import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3xl px-xl py-10xl text-center">
      <Logo />
      <div className="flex flex-col gap-xs">
        <h1 className="text-display-xs font-bold text-neutral-25">Page not found</h1>
        <p className="text-md text-neutral-400">The page you are looking for doesn&apos;t exist.</p>
      </div>
      <Button asChild className="w-[200px]">
        <Link href="/">Back to Home</Link>
      </Button>
    </main>
  );
}
