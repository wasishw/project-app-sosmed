import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

/** shadcn Button with the Figma "Button" variants (Primary / Secondary, Desktop / Mobile). */
const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-md whitespace-nowrap rounded-full font-bold text-neutral-25 transition-colors outline-none select-none focus-visible:shadow-focus-ring disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-primary-300 hover:bg-primary-200",
        secondary: "border border-neutral-900 bg-transparent hover:bg-neutral-900",
        ghost: "hover:bg-neutral-900",
        danger: "bg-neutral-900 text-destructive hover:bg-neutral-800",
        link: "rounded-none p-0 text-primary-200 hover:underline",
      },
      size: {
        default: "h-10 px-md text-sm tracking-minus-1 md:h-12 md:text-md md:tracking-minus-2",
        sm: "h-10 px-xl text-sm tracking-minus-1",
        icon: "size-10 md:size-12",
        none: "",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
