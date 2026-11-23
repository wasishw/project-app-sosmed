"use client";

import { ErrorState, EmptyState } from "@/components/shared/state-views";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { flatPages } from "@/lib/query/pagination";
import { useTimeline } from "@/lib/query/use-posts";

import { PostCard, PostCardSkeleton } from "./post-card";

/** Home timeline with infinite scroll. */
export function Timeline() {
  const { query, isResolvingAuth } = useTimeline();
  const posts = flatPages(query.data, "posts");
  const sentinel = useInfiniteScroll({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  });

  if (isResolvingAuth || query.isPending) {
    return (
      <div className="flex flex-col gap-xl md:gap-3xl">
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState message="Couldn't load the timeline." onRetry={() => query.refetch()} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description="Follow people or share your first post"
        className="py-10xl"
      />
    );
  }

  return (
    <div className="flex flex-col gap-xl md:gap-3xl">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} priority={index === 0} />
      ))}
      <div ref={sentinel} aria-hidden className="h-px" />
      {query.isFetchingNextPage && <PostCardSkeleton />}
    </div>
  );
}
