"use client";

import {
  infiniteQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { commentsApi } from "@/lib/api/posts";

import { queryKeys } from "./keys";
import { nextPage } from "./pagination";
import { updatePostInCache } from "./post-cache";

export const commentQueries = {
  list: (postId: number) =>
    infiniteQueryOptions({
      queryKey: queryKeys.posts.comments(postId),
      queryFn: ({ pageParam }) => commentsApi.list(postId, { page: pageParam, limit: 10 }),
      initialPageParam: 1,
      getNextPageParam: nextPage,
    }),
};

export function useComments(postId: number) {
  return useInfiniteQuery(commentQueries.list(postId));
}

export function useAddComment(postId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => commentsApi.create(postId, text),
    onSuccess: () => {
      updatePostInCache(qc, postId, (post) => ({ ...post, commentCount: post.commentCount + 1 }));
      return qc.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
    },
  });
}

export function useDeleteComment(postId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => commentsApi.remove(commentId),
    onSuccess: () => {
      updatePostInCache(qc, postId, (post) => ({
        ...post,
        commentCount: Math.max(0, post.commentCount - 1),
      }));
      return qc.invalidateQueries({ queryKey: queryKeys.posts.comments(postId) });
    },
  });
}
