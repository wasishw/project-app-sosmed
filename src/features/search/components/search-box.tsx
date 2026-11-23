"use client";

import { useEffect, useRef, useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { SearchInput } from "./search-input";
import { SearchResults } from "./search-results";

/** Desktop header search with the results dropdown from the Figma "Search" frames. */
export function SearchBox() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const keyword = useDebouncedValue(value.trim(), 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    setValue("");
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[491px]">
      <SearchInput
        value={value}
        onValueChange={(v) => {
          setValue(v);
          setOpen(Boolean(v.trim()));
        }}
        onFocus={() => setOpen(Boolean(value.trim()))}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        aria-label="Search users"
        aria-expanded={open}
      />
      {open && keyword && (
        <div className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 max-h-[420px] overflow-y-auto rounded-2xl border border-neutral-900 bg-neutral-950 p-xl shadow-lg">
          <SearchResults keyword={keyword} onNavigate={close} emptyClassName="py-3xl" />
        </div>
      )}
    </div>
  );
}
