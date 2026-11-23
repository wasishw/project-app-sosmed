"use client";

import { EmptyState } from "@/components/shared/state-views";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRow } from "@/features/users/components/user-row";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { flatPages } from "@/lib/query/pagination";
import { useSearchUsers } from "@/lib/query/use-users";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  keyword: string;
  onNavigate?: () => void;
  className?: string;
  emptyClassName?: string;
}

/** Users matching name/username (GET /api/users/search). */
export function SearchResults({
  keyword,
  onNavigate,
  className,
  emptyClassName,
}: SearchResultsProps) {
  const query = useSearchUsers(keyword);
  const users = flatPages(query.data, "users");
  const sentinel = useInfiniteScroll({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    rootMargin: "120px",
  });

  if (query.isPending) {
    return (
      <div className={cn("flex flex-col gap-xl", className)}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-lg">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-xs">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <EmptyState title="Search failed" description="Please try again" className={emptyClassName} />
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        title="No results found"
        description="Change your keyword"
        className={emptyClassName}
      />
    );
  }

  return (
    <ul className={cn("flex flex-col gap-xl", className)} aria-busy={query.isFetching}>
      {users.map((user) => (
        <li key={user.id}>
          <UserRow user={user} onNavigate={onNavigate} />
        </li>
      ))}
      {query.hasNextPage && <div ref={sentinel} className="h-1" />}
    </ul>
  );
}
