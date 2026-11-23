"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Icon } from "@/components/shared/icon";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

import { SearchInput } from "./search-input";
import { SearchResults } from "./search-results";

/** /search — the mobile "Search" frame (also usable on desktop). Keyword kept in `?q=`. */
export function SearchView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const keyword = useDebouncedValue(value.trim(), 300);

  useEffect(() => {
    const qs = keyword ? `?q=${encodeURIComponent(keyword)}` : "";
    router.replace(`${pathname}${qs}`, { scroll: false });
  }, [keyword, pathname, router]);

  const close = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col">
      <div className="sticky top-0 z-30 flex items-center gap-xl border-b border-neutral-900 bg-base-black px-xl py-lg md:static md:border-0 md:px-0">
        <SearchInput value={value} onValueChange={setValue} autoFocus aria-label="Search users" />
        <button
          type="button"
          onClick={close}
          className="flex cursor-pointer text-neutral-25"
          aria-label="Close search"
        >
          <Icon name="close" />
        </button>
      </div>
      <div className="flex flex-1 flex-col px-xl py-xl md:px-0">
        {keyword ? (
          <SearchResults keyword={keyword} emptyClassName="flex-1 justify-center" />
        ) : (
          <p className="pt-3xl text-center text-sm text-neutral-400">
            Search people by name or username
          </p>
        )}
      </div>
    </div>
  );
}
