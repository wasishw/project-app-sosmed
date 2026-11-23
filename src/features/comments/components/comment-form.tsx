"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Icon } from "@/components/shared/icon";
import { getErrorMessage } from "@/lib/api/axios";
import { useAddComment } from "@/lib/query/use-comments";
import { cn } from "@/lib/utils";
import { commentSchema, type CommentValues } from "@/lib/validations/post";
import { useAuthStatus } from "@/store/use-auth-status";

import { EmojiPicker } from "./emoji-picker";

interface CommentFormProps {
  postId: number;
  className?: string;
}

/** Lets the comment icon elsewhere focus this input. */
export const commentInputId = (postId: number) => `comment-input-${postId}`;

/** [☺] [ Add Comment ……… Post ] — "Post" turns purple once there is text. */
export function CommentForm({ postId, className }: CommentFormProps) {
  const router = useRouter();
  const status = useAuthStatus();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const addComment = useAddComment(postId);
  const { control, register, handleSubmit, setValue, getValues, reset, formState } =
    useForm<CommentValues>({
      resolver: zodResolver(commentSchema),
      defaultValues: { text: "" },
    });
  const text = useWatch({ control, name: "text" });

  const onSubmit = handleSubmit((values) => {
    if (status !== "authenticated") {
      router.push(`/login?redirect=${encodeURIComponent(`/posts/${postId}`)}`);
      return;
    }
    addComment.mutate(values.text, {
      onSuccess: () => reset({ text: "" }),
      onError: (error) => toast.error(getErrorMessage(error, "Could not add comment")),
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className={cn("relative flex items-start gap-md", className)}
      noValidate
    >
      <button
        type="button"
        data-emoji-toggle
        onClick={() => setEmojiOpen((v) => !v)}
        className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-neutral-900 text-neutral-25"
        aria-label="Add emoji"
        aria-expanded={emojiOpen}
      >
        <Icon name="emoji" />
      </button>
      <EmojiPicker
        open={emojiOpen}
        onClose={() => setEmojiOpen(false)}
        onPick={(emoji) => setValue("text", `${getValues("text")}${emoji}`, { shouldDirty: true })}
      />
      <div className="flex h-12 min-w-0 flex-1 items-center gap-md rounded-xl border border-neutral-900 bg-neutral-950 px-xl">
        <input
          {...register("text")}
          id={commentInputId(postId)}
          placeholder="Add Comment"
          autoComplete="off"
          aria-label="Add comment"
          aria-invalid={Boolean(formState.errors.text)}
          className="h-full min-w-0 flex-1 bg-transparent text-md font-medium text-neutral-25 outline-none placeholder:text-neutral-600"
        />
        <button
          type="submit"
          disabled={!text.trim() || addComment.isPending}
          className="cursor-pointer text-md font-bold tracking-minus-2 text-primary-200 disabled:cursor-default disabled:text-neutral-600"
        >
          Post
        </button>
      </div>
    </form>
  );
}
