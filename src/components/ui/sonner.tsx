"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

import { Icon } from "@/components/shared/icon";

/**
 * Toasts = Figma "Alert" (Success #079455 / Danger #D9206E): white semibold
 * text, × on the right, no leading icon.
 */
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="top-right"
      closeButton
      duration={3000}
      icons={{ close: <Icon name="close" className="size-4" /> }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "relative flex w-[calc(100vw-32px)] items-center gap-md rounded-md px-lg py-md text-sm font-semibold tracking-minus-2 text-base-white shadow-lg sm:w-[360px]",
          success: "bg-accent-green",
          error: "bg-accent-red",
          info: "bg-neutral-900",
          title: "pr-6 leading-7",
          icon: "hidden!",
          closeButton:
            "absolute! top-1/2! right-lg! left-auto! size-4! -translate-y-1/2! transform-none! border-0! bg-transparent! text-base-white!",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
