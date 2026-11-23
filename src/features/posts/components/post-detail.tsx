"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { images } from "@/assets/images";
import { Icon } from "@/components/shared/icon";
import { ErrorState } from "@/components/shared/state-views";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentForm, commentInputId } from "@/features/comments/components/comment-form";
import { CommentList } from "@/features/comments/components/comment-list";
import { getErrorMessage, getErrorStatus } from "@/lib/api/axios";
import { useMe } from "@/lib/query/use-me";
import { useDeletePost, usePost } from "@/lib/query/use-posts";
import { cn, isOptimizableImage, toImageSrc } from "@/lib/utils";

import { PostActions } from "./post-actions";
import { PostAuthor } from "./post-author";

interface PostDetailProps {
  postId: number;
  /**
   * "dialog": opened from a feed (intercepted route). Desktop = 1200×720 panel,
   * mobile = comments bottom sheet. "page": the full /posts/[id] page.
   */
  mode: "dialog" | "page";
  onDeleted?: () => void;
}

export function PostDetail({ postId, mode, onDeleted }: PostDetailProps) {
  const { data: post, isPending, isError, error, refetch } = usePost(postId);
  const { data: me } = useMe();
  const remove = useDeletePost();
  const router = useRouter();
  const isDialog = mode === "dialog";

  if (isPending) return <PostDetailSkeleton mode={mode} />;
  if (isError || !post) {
    return (
      <div className="flex min-h-80 w-full items-center justify-center bg-neutral-950 md:w-[480px]">
        <ErrorState
          message={
            getErrorStatus(error) === 404
              ? "This post doesn't exist anymore."
              : "Couldn't load this post."
          }
          onRetry={getErrorStatus(error) === 404 ? undefined : () => refetch()}
        />
      </div>
    );
  }

  const isMine = me?.id === post.author.id;

  const onDelete = () =>
    remove.mutate(post.id, {
      onSuccess: () => {
        toast.success("Post deleted");
        if (onDeleted) onDeleted();
        else router.replace("/profile");
      },
      onError: (e) => toast.error(getErrorMessage(e, "Could not delete post")),
    });

  return (
    <div
      className={cn(
        "flex w-full flex-col bg-neutral-950 md:h-[min(720px,calc(100vh-160px))] md:w-[min(1200px,calc(100vw-48px))] md:flex-row",
        isDialog ? "max-h-[75vh] rounded-t-2xl md:max-h-none md:rounded-none" : "md:mx-auto",
      )}
    >
      <div
        className={cn(
          "relative aspect-square w-full shrink-0 bg-base-black md:aspect-auto md:h-full md:w-auto md:flex-1",
          isDialog && "hidden md:block",
        )}
      >
        <Image
          src={toImageSrc(post.imageUrl) ?? images.avatarDefault}
          unoptimized={!isOptimizableImage(toImageSrc(post.imageUrl))}
          alt={post.caption || `Post by ${post.author.name}`}
          fill
          priority
          sizes="(min-width: 768px) 720px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-xl p-xl md:w-[480px] md:flex-none md:gap-3xl md:p-2xl">
        <div className={cn("flex flex-col gap-md", isDialog && "hidden md:flex")}>
          <div className="flex items-center justify-between gap-md">
            <PostAuthor author={post.author} createdAt={post.createdAt} variant="compact" />
            {isMine && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex cursor-pointer text-neutral-25 outline-none"
                  aria-label="Post options"
                >
                  <Icon name="more-horizontal" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={onDelete}
                    disabled={remove.isPending}
                  >
                    <Icon name="trash" className="size-5" /> Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {post.caption && (
            <p className="max-h-36 overflow-y-auto border-b border-neutral-900 pb-xl text-sm tracking-minus-2 break-words whitespace-pre-line text-neutral-25">
              {post.caption}
            </p>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-xl">
          <h2 className="text-md font-bold tracking-minus-2 text-neutral-25">Comments</h2>
          <div className="-mr-md min-h-24 flex-1 overflow-y-auto pr-md">
            <CommentList postId={post.id} postAuthorId={post.author.id} />
          </div>
        </div>

        <div className="flex flex-col gap-xl border-t border-neutral-900 pt-xl">
          <PostActions
            post={post}
            onCommentClick={() => document.getElementById(commentInputId(post.id))?.focus()}
            className={cn(isDialog && "hidden md:flex")}
          />
          <CommentForm postId={post.id} />
        </div>
      </div>
    </div>
  );
}

function PostDetailSkeleton({ mode }: { mode: PostDetailProps["mode"] }) {
  return (
    <div className="flex w-full flex-col bg-neutral-950 md:h-[min(720px,calc(100vh-160px))] md:w-[min(1200px,calc(100vw-48px))] md:flex-row">
      <Skeleton
        className={cn(
          "aspect-square w-full rounded-none md:aspect-auto md:h-full md:flex-1",
          mode === "dialog" && "hidden md:block",
        )}
      />
      <div className="flex w-full flex-col gap-xl p-xl md:w-[480px] md:p-2xl">
        <div className="flex items-center gap-md">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
