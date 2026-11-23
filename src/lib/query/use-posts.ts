"use client";

import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { postsApi } from "@/lib/api/posts";
import { useAuthStatus } from "@/store/use-auth-status";
import type { CreatePostInput } from "@/types/post";

import { queryKeys } from "./keys";
import { nextPage, PAGE_SIZE } from "./pagination";
import { restoreSnapshot, snapshotPostCaches, updatePostInCache } from "./post-cache";

export const postQueries = {
  timeline: (mode: "feed" | "explore") =>
    infiniteQueryOptions({
      queryKey: queryKeys.posts.timeline(mode),
      queryFn: ({ pageParam }) =>
        (mode === "feed" ? postsApi.feed : postsApi.explore)({ page: pageParam, limit: PAGE_SIZE }),
      initialPageParam: 1,
      getNextPageParam: nextPage,
    }),
  detail: (id: number) =>
    queryOptions({ queryKey: queryKeys.posts.detail(id), queryFn: () => postsApi.detail(id) }),
  likes: (id: number) =>
    infiniteQueryOptions({
      queryKey: queryKeys.posts.likes(id),
      queryFn: ({ pageParam }) => postsApi.likes(id, { page: pageParam, limit: 20 }),
      initialPageParam: 1,
      getNextPageParam: nextPage,
    }),
};

/**
 * Signed in → GET /api/feed (self + following). Guests (and a brand-new user
 * whose feed is still empty) → GET /api/posts, the public explore list.
 */
export function useTimeline() {
  const status = useAuthStatus();
  const feed = useInfiniteQuery({
    ...postQueries.timeline("feed"),
    enabled: status === "authenticated",
  });
  const feedIsEmpty = feed.isSuccess && (feed.data.pages[0]?.posts?.length ?? 0) === 0;
  const explore = useInfiniteQuery({
    ...postQueries.timeline("explore"),
    enabled: status === "guest" || feedIsEmpty,
  });
  if (status === "loading") return { query: feed, isResolvingAuth: true };
  return { query: status === "guest" || feedIsEmpty ? explore : feed, isResolvingAuth: false };
}

export function usePost(id: number) {
  return useQuery(postQueries.detail(id));
}

export function usePostLikes(id: number, enabled: boolean) {
  return useInfiniteQuery({ ...postQueries.likes(id), enabled });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => postsApi.create(input),
    onSuccess: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.posts.all }),
        qc.invalidateQueries({ queryKey: queryKeys.me.all }),
      ]),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postsApi.remove(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: queryKeys.posts.detail(id) });
      return Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.posts.all }),
        qc.invalidateQueries({ queryKey: queryKeys.me.all }),
        qc.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]);
    },
  });
}

/** Optimistic like / unlike, rolled back if the request fails. */
export function useToggleLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, liked }: { id: number; liked: boolean }) =>
      liked ? postsApi.unlike(id) : postsApi.like(id),
    onMutate: async ({ id, liked }) => {
      await qc.cancelQueries({ queryKey: queryKeys.posts.all });
      const snapshot = snapshotPostCaches(qc);
      updatePostInCache(qc, id, (post) => ({
        ...post,
        likedByMe: !liked,
        likeCount: Math.max(0, post.likeCount + (liked ? -1 : 1)),
      }));
      return { snapshot };
    },
    onError: (_error, _vars, context) => {
      if (context) restoreSnapshot(qc, context.snapshot);
    },
    onSettled: (_data, _error, { id }) =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.posts.likes(id) }),
        qc.invalidateQueries({ queryKey: queryKeys.posts.detail(id) }),
        // "Likes" counters on profiles and the Liked tab.
        qc.invalidateQueries({ queryKey: queryKeys.users.all }),
        qc.invalidateQueries({ queryKey: queryKeys.me.profile() }),
      ]),
  });
}

/** Optimistic bookmark toggle on the saved-ids set. */
export function useToggleSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, saved }: { id: number; saved: boolean }) =>
      saved ? postsApi.unsave(id) : postsApi.save(id),
    onMutate: async ({ id, saved }) => {
      await qc.cancelQueries({ queryKey: queryKeys.me.savedIds() });
      const previous = qc.getQueryData<number[]>(queryKeys.me.savedIds());
      qc.setQueryData<number[]>(queryKeys.me.savedIds(), (ids = []) =>
        saved ? ids.filter((x) => x !== id) : [id, ...ids],
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      qc.setQueryData(queryKeys.me.savedIds(), context?.previous);
    },
    onSettled: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.me.savedIds() }),
        qc.invalidateQueries({ queryKey: queryKeys.me.saved() }),
      ]),
  });
}
