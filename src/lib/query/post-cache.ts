import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import type { Post, PostListData } from "@/types/post";

import { queryKeys } from "./keys";

type PostUpdater = (post: Post) => Post;

const isPostList = (value: unknown): value is InfiniteData<PostListData> =>
  typeof value === "object" &&
  value !== null &&
  "pages" in value &&
  Array.isArray(value.pages) &&
  value.pages.every((p: unknown) => typeof p === "object" && p !== null && "posts" in p);

const isPost = (value: unknown): value is Post =>
  typeof value === "object" && value !== null && "imageUrl" in value && "author" in value;

/** Roots that can contain post lists or a post detail. */
const POST_ROOTS = [queryKeys.posts.all, queryKeys.me.all, queryKeys.users.all];

/**
 * Applies the same change to one post wherever it is cached (timeline,
 * profile grids, saved tab, detail), so like/save feel instant everywhere.
 */
export function updatePostInCache(qc: QueryClient, postId: number, update: PostUpdater) {
  for (const queryKey of POST_ROOTS) {
    qc.setQueriesData({ queryKey }, (old: unknown) => {
      if (isPost(old)) return old.id === postId ? update(old) : old;
      if (isPostList(old)) {
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) => (post.id === postId ? update(post) : post)),
          })),
        };
      }
      return old;
    });
  }
}

/** Snapshot of everything `updatePostInCache` may touch, for rollback. */
export function snapshotPostCaches(qc: QueryClient) {
  return POST_ROOTS.flatMap((queryKey) => qc.getQueriesData({ queryKey }));
}

export function restoreSnapshot(qc: QueryClient, snapshot: ReturnType<typeof snapshotPostCaches>) {
  for (const [key, data] of snapshot) qc.setQueryData(key, data);
}
