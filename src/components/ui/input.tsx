import * as React from "react";

import { cn } from "@/lib/utils";

/** Figma "Input Field" control: 48px, neutral-950, 12px radius, error border #B41759. */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-xl border border-neutral-900 bg-neutral-950 px-xl py-md text-md font-semibold tracking-minus-2 text-neutral-25 outline-none transition-colors placeholder:font-regular placeholder:text-neutral-600 focus-visible:border-primary-200 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
