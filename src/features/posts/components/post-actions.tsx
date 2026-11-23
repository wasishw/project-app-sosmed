"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Icon } from "@/components/shared/icon";
import { getErrorMessage } from "@/lib/api/axios";
import { useSavedPostIds } from "@/lib/query/use-me";
import { useToggleLike, useToggleSave } from "@/lib/query/use-posts";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import { useAuthStatus } from "@/store/use-auth-status";
import type { Post } from "@/types/post";

interface PostActionsProps {
  post: Post;
  /** In the detail dialog the comment icon focuses the input instead of navigating. */
  onCommentClick?: () => void;
  size?: "md" | "sm";
  className?: string;
}

/** ♥ count · 💬 count · ➤ share · 🔖 save — Figma "Frame 2" row of the Card Post. */
export function PostActions({ post, onCommentClick, size = "md", className }: PostActionsProps) {
  const router = useRouter();
  const status = useAuthStatus();
  const savedIds = useSavedPostIds();
  const toggleLike = useToggleLike();
  const toggleSave = useToggleSave();
  const openUserList = useUiStore((s) => s.openUserList);

  const saved = post.savedByMe ?? savedIds.has(post.id);

  const requireAuth = () => {
    if (status === "authenticated") return true;
    router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    return false;
  };

  const onLike = () => {
    if (!requireAuth()) return;
    toggleLike.mutate(
      { id: post.id, liked: post.likedByMe },
      { onError: (e) => toast.error(getErrorMessage(e, "Could not update like")) },
    );
  };

  const onSave = () => {
    if (!requireAuth()) return;
    toggleSave.mutate(
      { id: post.id, saved },
      {
        onSuccess: () => toast.success(saved ? "Removed from saved" : "Post saved"),
        onError: (e) => toast.error(getErrorMessage(e, "Could not update saved")),
      },
    );
  };

  const onShare = async () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    try {
      if (navigator.share) await navigator.share({ title: `Post by ${post.author.name}`, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      // share sheet dismissed
    }
  };

  const countClass = cn(
    "font-semibold tracking-minus-2 text-neutral-25",
    size === "md" ? "text-sm md:text-md" : "text-sm",
  );

  return (
    <div className={cn("flex items-center justify-between gap-xl", className)}>
      <div className="flex items-center gap-lg md:gap-xl">
        <div className="flex items-center gap-sm">
          <button
            type="button"
            onClick={onLike}
            aria-pressed={post.likedByMe}
            aria-label={post.likedByMe ? "Unlike" : "Like"}
            className="flex cursor-pointer"
          >
            <Icon
              name={post.likedByMe ? "heart-filled" : "heart"}
              className={post.likedByMe ? "text-destructive" : "text-neutral-25"}
            />
          </button>
          <button
            type="button"
            onClick={() => openUserList({ kind: "likes", postId: post.id })}
            className={cn(countClass, "cursor-pointer hover:underline")}
            aria-label={`${post.likeCount} likes, see who liked`}
          >
            {post.likeCount}
          </button>
        </div>

        {onCommentClick ? (
          <button
            type="button"
            onClick={onCommentClick}
            className="flex cursor-pointer items-center gap-sm"
          >
            <Icon name="comment" />
            <span className={countClass}>{post.commentCount}</span>
          </button>
        ) : (
          <Link
            href={`/posts/${post.id}`}
            scroll={false}
            className="flex items-center gap-sm"
            aria-label="Comments"
          >
            <Icon name="comment" />
            <span className={countClass}>{post.commentCount}</span>
          </Link>
        )}

        <button
          type="button"
          onClick={onShare}
          className="flex cursor-pointer"
          aria-label="Share post"
        >
          <Icon name="send" />
        </button>
      </div>

      <button
        type="button"
        onClick={onSave}
        aria-pressed={saved}
        aria-label={saved ? "Unsave post" : "Save post"}
        className="flex cursor-pointer"
      >
        <Icon name={saved ? "bookmark-filled" : "bookmark"} />
      </button>
    </div>
  );
}
