"use client";

import {
  infiniteQueryOptions,
  keepPreviousData,
  queryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { meApi, usersApi, followApi } from "@/lib/api/users";
import type { PublicProfile, UserListData } from "@/types/user";

import { queryKeys } from "./keys";
import { nextPage } from "./pagination";

export const userQueries = {
  profile: (username: string) =>
    queryOptions({
      queryKey: queryKeys.users.profile(username),
      queryFn: () => usersApi.profile(username),
    }),
  posts: (username: string) =>
    infiniteQueryOptions({
      queryKey: queryKeys.users.posts(username),
      queryFn: ({ pageParam }) => usersApi.posts(username, { page: pageParam, limit: 12 }),
      initialPageParam: 1,
      getNextPageParam: nextPage,
    }),
  likes: (username: string) =>
    infiniteQueryOptions({
      queryKey: queryKeys.users.likes(username),
      queryFn: ({ pageParam }) => usersApi.likes(username, { page: pageParam, limit: 12 }),
      initialPageParam: 1,
      getNextPageParam: nextPage,
    }),
};

export function useUserProfile(username: string) {
  return useQuery(userQueries.profile(username));
}

export function useUserPosts(username: string, enabled = true) {
  return useInfiniteQuery({ ...userQueries.posts(username), enabled });
}

export function useUserLikes(username: string, enabled = true) {
  return useInfiniteQuery({ ...userQueries.likes(username), enabled });
}

/** Followers / following of a user; the signed-in user uses the /me endpoints. */
export function useFollowList(
  kind: "followers" | "following",
  username: string,
  isMe: boolean,
  enabled: boolean,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.users[kind](username),
    queryFn: ({ pageParam }) => {
      const params = { page: pageParam, limit: 20 };
      if (isMe) return kind === "followers" ? meApi.followers(params) : meApi.following(params);
      return kind === "followers"
        ? usersApi.followers(username, params)
        : usersApi.following(username, params);
    },
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled,
  });
}

export function useSearchUsers(q: string) {
  const keyword = q.trim();
  return useInfiniteQuery({
    queryKey: queryKeys.users.search(keyword),
    queryFn: ({ pageParam }) => usersApi.search(keyword, { page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: keyword.length > 0,
    placeholderData: keepPreviousData,
  });
}

/** Keys whose data is `InfiniteData<UserListData>` (likes, followers, following, search). */
function isUserListKey(key: readonly unknown[]) {
  const [root, kind] = key;
  return (
    (root === "posts" && kind === "likes") ||
    (root === "users" && (kind === "followers" || kind === "following" || kind === "search"))
  );
}

/** Sets `isFollowedByMe` for one user in every cached user list. */
function setFollowFlag(
  data: InfiniteData<UserListData> | undefined,
  username: string,
  following: boolean,
) {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      users: page.users.map((u) =>
        u.username === username ? { ...u, isFollowedByMe: following } : u,
      ),
    })),
  };
}

/** Optimistic follow / unfollow (button state + follower count). */
export function useToggleFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ username, following }: { username: string; following: boolean }) =>
      following ? followApi.unfollow(username) : followApi.follow(username),
    onMutate: async ({ username, following }) => {
      await qc.cancelQueries({ queryKey: queryKeys.users.all });
      const profileKey = queryKeys.users.profile(username);
      const previousProfile = qc.getQueryData<PublicProfile>(profileKey);
      qc.setQueryData<PublicProfile>(profileKey, (old) =>
        old
          ? {
              ...old,
              isFollowing: !following,
              counts: {
                ...old.counts,
                followers: Math.max(0, old.counts.followers + (following ? -1 : 1)),
              },
            }
          : old,
      );
      qc.setQueriesData<InfiniteData<UserListData>>(
        { predicate: (q) => isUserListKey(q.queryKey) },
        (old) => setFollowFlag(old, username, !following),
      );
      return { previousProfile, profileKey };
    },
    onError: (_error, _vars, context) => {
      if (context) qc.setQueryData(context.profileKey, context.previousProfile);
    },
    onSettled: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.users.all }),
        qc.invalidateQueries({ queryKey: queryKeys.me.profile() }),
        // A new follow changes what the timeline shows.
        qc.invalidateQueries({ queryKey: queryKeys.posts.timeline("feed") }),
        qc.invalidateQueries({ predicate: (q) => isUserListKey(q.queryKey) }),
      ]),
  });
}
