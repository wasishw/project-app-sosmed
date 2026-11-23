import type { InfiniteData } from "@tanstack/react-query";

import type { Pagination } from "@/types/api";

export const PAGE_SIZE = 10;

/** Shared `getNextPageParam` for every paginated endpoint of the API. */
export function nextPage<T extends { pagination: Pagination }>(lastPage: T): number | undefined {
  const { page, totalPages } = lastPage.pagination;
  return page < totalPages ? page + 1 : undefined;
}

/** Flattens `InfiniteData` pages into one list. */
export function flatPages<T, K extends string>(
  data: InfiniteData<Record<K, T[]>> | undefined,
  key: K,
): T[] {
  // Guard against pages cached in an unexpected shape (e.g. across a hot reload).
  return data?.pages.flatMap((page) => (Array.isArray(page?.[key]) ? page[key] : [])) ?? [];
}
