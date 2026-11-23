"use client";

import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

import { meApi } from "@/lib/api/users";
import { useAuthToken } from "@/store/use-auth-status";
import type { UpdateProfileInput } from "@/types/auth";
import type { MyProfile } from "@/types/user";

import { queryKeys } from "./keys";
import { nextPage } from "./pagination";

export const meQueries = {
  profile: () => queryOptions({ queryKey: queryKeys.me.profile(), queryFn: meApi.get }),
  posts: () =>
    infiniteQueryOptions({
      queryKey: queryKeys.me.posts(),
      queryFn: ({ pageParam }) => meApi.posts({ page: pageParam, limit: 12 }),
      initialPageParam: 1,
      getNextPageParam: nextPage,
    }),
  saved: () =>
    infiniteQueryOptions({
      queryKey: queryKeys.me.saved(),
      queryFn: ({ pageParam }) => meApi.saved({ page: pageParam, limit: 12 }),
      initialPageParam: 1,
      getNextPageParam: nextPage,
    }),
};

/** The signed-in user. Disabled (and `undefined`) for guests. */
export function useMe() {
  const token = useAuthToken();
  return useQuery({ ...meQueries.profile(), enabled: Boolean(token) });
}

export function useMyPosts(enabled = true) {
  return useInfiniteQuery({ ...meQueries.posts(), enabled });
}

export function useMySaved(enabled = true) {
  return useInfiniteQuery({ ...meQueries.saved(), enabled });
}

/**
 * Post objects don't say whether *I* saved them, so the bookmark state comes
 * from GET /api/me/saved, kept as a Set of post ids.
 */
export function useSavedPostIds() {
  const token = useAuthToken();
  const query = useQuery({
    queryKey: queryKeys.me.savedIds(),
    queryFn: async () => {
      const ids: number[] = [];
      let page = 1;
      // Bounded: at most 5 pages × 50 = the 250 most recent bookmarks.
      while (page <= 5) {
        const data = await meApi.saved({ page, limit: 50 });
        ids.push(...data.posts.map((p) => p.id));
        if (page >= data.pagination.totalPages) break;
        page += 1;
      }
      return ids;
    },
    enabled: Boolean(token),
    staleTime: 60_000,
  });
  return useMemo(() => new Set(query.data ?? []), [query.data]);
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => meApi.update(input),
    onSuccess: (profile) => {
      // PATCH returns the profile; keep the counters we already have.
      qc.setQueryData<MyProfile>(queryKeys.me.profile(), (old) =>
        old ? { ...old, ...profile, counts: old.counts } : profile,
      );
      // Name / avatar appear on posts and public profiles too.
      return Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.me.all }),
        qc.invalidateQueries({ queryKey: queryKeys.posts.all }),
        qc.invalidateQueries({ queryKey: queryKeys.users.all }),
      ]);
    },
  });
}
