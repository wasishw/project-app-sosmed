"use client";

import { forwardRef, type ComponentProps } from "react";

import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<ComponentProps<"input">, "onChange" | "value"> {
  value: string;
  onValueChange: (value: string) => void;
}

/** Figma "Search" (Off / On): pill, neutral-950, search icon, grey clear dot when filled. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onValueChange, className, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center gap-sm rounded-full border border-neutral-900 bg-neutral-950 px-xl md:h-12",
        className,
      )}
    >
      <Icon name="search" className="size-5 text-neutral-500" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="Search"
        className="h-full min-w-0 flex-1 bg-transparent text-sm tracking-minus-2 text-neutral-25 outline-none placeholder:text-neutral-600 [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          className="flex size-5 cursor-pointer items-center justify-center"
          aria-label="Clear search"
        >
          <span className="size-3.5 rounded-full bg-neutral-600" />
        </button>
      )}
    </div>
  );
});
