import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MobileBackHeader } from "@/components/shared/mobile-back-header";
import { PostDetail } from "@/features/posts/components/post-detail";

export const metadata: Metadata = { title: "Post" };

/** Full page for a shared/refreshed /posts/[id] link. */
export default function PostPage({ params }: PageProps<"/posts/[id]">) {
  return (
    <>
      <MobileBackHeader title="Post" />
      <div className="w-full md:px-6xl md:pt-6xl">
        <Suspense>
          <PostById params={params} />
        </Suspense>
      </div>
    </>
  );
}

async function PostById({ params }: { params: PageProps<"/posts/[id]">["params"] }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) notFound();
  return <PostDetail postId={postId} mode="page" />;
}
