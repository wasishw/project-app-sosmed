"use client";

import { useEffect, useRef } from "react";

interface Options {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  rootMargin?: string;
}

/** Returns a ref for a sentinel element; loads the next page when it scrolls into view. */
export function useInfiniteScroll<T extends Element = HTMLDivElement>({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = "400px",
}: Options) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin]);

  return ref;
}
