import Image from "next/image";
import Link from "next/link";

import { images } from "@/assets/images";
import { isOptimizableImage, toImageSrc } from "@/lib/utils";
import type { Post } from "@/types/post";

import { PostActions } from "./post-actions";
import { PostAuthor } from "./post-author";
import { PostCaption } from "./post-caption";

/** Figma "Card Post": 600px desktop / full width mobile, square image, divider below. */
export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="flex flex-col gap-md border-b border-neutral-900 pb-xl md:gap-lg md:pb-3xl">
      <PostAuthor author={post.author} createdAt={post.createdAt} />

      <Link
        href={`/posts/${post.id}`}
        scroll={false}
        className="relative block aspect-square w-full overflow-hidden rounded-md bg-neutral-900"
        aria-label={`Open post by ${post.author.name}`}
      >
        <Image
          src={toImageSrc(post.imageUrl) ?? images.avatarDefault}
          unoptimized={!isOptimizableImage(toImageSrc(post.imageUrl))}
          alt={post.caption || `Post by ${post.author.name}`}
          fill
          priority={priority}
          sizes="(min-width: 768px) 600px, 100vw"
          className="object-cover"
        />
      </Link>

      <PostActions post={post} />

      <div className="flex flex-col gap-xs">
        <Link
          href={`/users/${post.author.username}`}
          className="w-fit text-sm font-bold tracking-minus-1 text-neutral-25 md:text-md md:tracking-minus-2"
        >
          {post.author.name}
        </Link>
        {post.caption && <PostCaption text={post.caption} />}
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-md pb-xl md:gap-lg">
      <div className="flex items-center gap-md md:gap-lg">
        <div className="size-11 animate-pulse rounded-full bg-neutral-900 md:size-16" />
        <div className="flex flex-col gap-xs">
          <div className="h-4 w-28 animate-pulse rounded bg-neutral-900" />
          <div className="h-3 w-20 animate-pulse rounded bg-neutral-900" />
        </div>
      </div>
      <div className="aspect-square w-full animate-pulse rounded-md bg-neutral-900" />
      <div className="h-6 w-40 animate-pulse rounded bg-neutral-900" />
    </div>
  );
}
