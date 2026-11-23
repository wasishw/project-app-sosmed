import { PostCardSkeleton } from "@/features/posts/components/post-card";

export default function MainLoading() {
  return (
    <div className="mx-auto w-full max-w-[600px] px-xl pt-xl md:px-0 md:pt-[40px]">
      <PostCardSkeleton />
    </div>
  );
}
