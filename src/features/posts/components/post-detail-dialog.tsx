"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

import { PostDetail } from "./post-detail";

/**
 * Rendered by the intercepted route `@modal/(.)posts/[id]`: the URL changes to
 * /posts/[id] (shareable, back button closes it) while the feed stays behind.
 */
export function PostDetailDialog({ postId }: { postId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const close = () => {
    setOpen(false);
    router.back();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent
        closeClassName="-top-10 right-xl md:-top-12 md:right-0"
        className="top-auto bottom-0 left-0 w-full translate-x-0 translate-y-0 md:top-1/2 md:bottom-auto md:left-1/2 md:w-auto md:-translate-x-1/2 md:-translate-y-1/2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Post</DialogTitle>
        <DialogDescription className="sr-only">Post detail and comments</DialogDescription>
        <PostDetail postId={postId} mode="dialog" onDeleted={close} />
      </DialogContent>
    </Dialog>
  );
}
