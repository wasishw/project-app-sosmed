import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchView } from "@/features/search/components/search-view";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="mx-auto w-full max-w-[600px] md:pt-[40px]">
      <Suspense>
        <SearchView />
      </Suspense>
    </div>
  );
}
