import { Suspense } from "react";

import { PostDetailDialog } from "@/features/posts/components/post-detail-dialog";

/** Intercepted /posts/[id]: opens the comments dialog on top of the feed/profile. */
export default function PostModalPage({ params }: PageProps<"/posts/[id]">) {
  return (
    <Suspense>
      <PostModal params={params} />
    </Suspense>
  );
}

async function PostModal({ params }: { params: PageProps<"/posts/[id]">["params"] }) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) return null;
  return <PostDetailDialog key={postId} postId={postId} />;
}
