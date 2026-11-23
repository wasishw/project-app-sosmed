"use client";

import Link from "next/link";
import { toast } from "sonner";

import { Icon } from "@/components/shared/icon";
import { EmptyState, ErrorState } from "@/components/shared/state-views";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { RelativeTime } from "@/features/posts/components/relative-time";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { getErrorMessage } from "@/lib/api/axios";
import { flatPages } from "@/lib/query/pagination";
import { useComments, useDeleteComment } from "@/lib/query/use-comments";
import { useMe } from "@/lib/query/use-me";
import { cn } from "@/lib/utils";
import type { Comment } from "@/types/post";

interface CommentListProps {
  postId: number;
  postAuthorId: number;
  className?: string;
}

export function CommentList({ postId, postAuthorId, className }: CommentListProps) {
  const query = useComments(postId);
  const { data: me } = useMe();
  const remove = useDeleteComment(postId);
  const comments = flatPages(query.data, "comments");
  const sentinel = useInfiniteScroll({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    rootMargin: "120px",
  });

  if (query.isPending) {
    return (
      <div className={cn("flex flex-col gap-xl", className)}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex flex-col gap-md">
            <div className="flex items-center gap-md">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <ErrorState
        message="Couldn't load comments."
        onRetry={() => query.refetch()}
        className="py-3xl"
      />
    );
  }

  if (comments.length === 0) {
    return (
      <EmptyState
        title="No Comments yet"
        description="Start the conversation"
        className={cn("flex-1 justify-center py-5xl", className)}
      />
    );
  }

  const canDelete = (comment: Comment) =>
    Boolean(me) && (comment.author.id === me?.id || postAuthorId === me?.id);

  return (
    <ul className={cn("flex flex-col", className)}>
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="group flex flex-col gap-md border-b border-neutral-900 py-lg first:pt-0 md:gap-[10px]"
        >
          <div className="flex items-center justify-between gap-md">
            <Link
              href={`/users/${comment.author.username}`}
              className="flex min-w-0 items-center gap-md"
            >
              <UserAvatar src={comment.author.avatarUrl} name={comment.author.name} size={40} />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-bold tracking-minus-1 text-neutral-25">
                  {comment.author.name}
                </span>
                <RelativeTime iso={comment.createdAt} className="text-xs/4 text-neutral-400" />
              </span>
            </Link>
            {canDelete(comment) && (
              <button
                type="button"
                onClick={() =>
                  remove.mutate(comment.id, {
                    onSuccess: () => toast.success("Comment deleted"),
                    onError: (e) => toast.error(getErrorMessage(e, "Could not delete comment")),
                  })
                }
                disabled={remove.isPending}
                className="flex cursor-pointer text-neutral-500 opacity-100 transition-opacity hover:text-destructive md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                aria-label="Delete comment"
              >
                <Icon name="trash" className="size-5" />
              </button>
            )}
          </div>
          <p className="text-sm tracking-minus-2 break-words whitespace-pre-line text-neutral-25">
            {comment.text}
          </p>
        </li>
      ))}
      {query.hasNextPage && <div ref={sentinel} aria-hidden className="h-px" />}
    </ul>
  );
}
