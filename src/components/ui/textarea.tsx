import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[101px] w-full resize-none rounded-xl border border-neutral-900 bg-neutral-950 px-xl py-md text-md font-regular tracking-minus-2 text-neutral-25 outline-none transition-colors placeholder:text-neutral-600 focus-visible:border-primary-200 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
