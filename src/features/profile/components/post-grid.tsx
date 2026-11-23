"use client";

import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { images } from "@/assets/images";
import { ErrorState } from "@/components/shared/state-views";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { flatPages } from "@/lib/query/pagination";
import { isOptimizableImage, toImageSrc } from "@/lib/utils";
import type { PostListData } from "@/types/post";

interface PostGridProps {
  query: UseInfiniteQueryResult<InfiniteData<PostListData>>;
  empty: ReactNode;
}

/** 3-column square gallery with 4px gaps (Figma "Gallery Images"). */
export function PostGrid({ query, empty }: PostGridProps) {
  const posts = flatPages(query.data, "posts");
  const sentinel = useInfiniteScroll({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  });

  if (query.isPending) {
    return (
      <div className="grid grid-cols-3 gap-xs">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-sm" />
        ))}
      </div>
    );
  }
  if (query.isError)
    return <ErrorState message="Couldn't load posts." onRetry={() => query.refetch()} />;
  if (posts.length === 0) return <>{empty}</>;

  return (
    <>
      <ul className="grid grid-cols-3 gap-xs">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/posts/${post.id}`}
              scroll={false}
              className="relative block aspect-square overflow-hidden rounded-sm bg-neutral-900"
              aria-label={post.caption || `Post ${post.id}`}
            >
              <Image
                src={toImageSrc(post.imageUrl) ?? images.avatarDefault}
                unoptimized={!isOptimizableImage(toImageSrc(post.imageUrl))}
                alt={post.caption || `Post by ${post.author.name}`}
                fill
                sizes="(min-width: 768px) 268px, 33vw"
                className="object-cover transition-opacity hover:opacity-85"
              />
            </Link>
          </li>
        ))}
      </ul>
      <div ref={sentinel} aria-hidden className="h-px" />
      {query.isFetchingNextPage && (
        <div className="mt-xs grid grid-cols-3 gap-xs">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-sm" />
          ))}
        </div>
      )}
    </>
  );
}
