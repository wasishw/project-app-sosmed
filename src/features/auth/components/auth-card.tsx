import type { ReactNode } from "react";

import { Logo } from "@/components/shared/logo";

/** Glass card from the Figma Login/Register frames (446px, blur 20, radius 16). */
export function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full max-w-[446px] flex-col items-center gap-3xl rounded-2xl border border-neutral-900 bg-base-black/20 px-xl py-4xl backdrop-blur-[20px] md:px-3xl md:py-5xl">
      <Logo href={null} />
      <h1 className="text-xl font-bold text-neutral-25 md:text-display-xs">{title}</h1>
      {children}
    </section>
  );
}
