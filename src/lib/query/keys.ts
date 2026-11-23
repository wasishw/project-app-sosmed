/**
 * Query key factory. Hierarchical so one `invalidateQueries({ queryKey: x.all })`
 * refreshes everything below it.
 */
export const queryKeys = {
  me: {
    all: ["me"] as const,
    profile: () => [...queryKeys.me.all, "profile"] as const,
    posts: () => [...queryKeys.me.all, "posts"] as const,
    saved: () => [...queryKeys.me.all, "saved"] as const,
    savedIds: () => [...queryKeys.me.all, "saved-ids"] as const,
  },
  posts: {
    all: ["posts"] as const,
    timeline: (mode: "feed" | "explore") => [...queryKeys.posts.all, "timeline", mode] as const,
    detail: (id: number) => [...queryKeys.posts.all, "detail", id] as const,
    likes: (id: number) => [...queryKeys.posts.all, "likes", id] as const,
    comments: (id: number) => [...queryKeys.posts.all, "comments", id] as const,
  },
  users: {
    all: ["users"] as const,
    profile: (username: string) => [...queryKeys.users.all, "profile", username] as const,
    posts: (username: string) => [...queryKeys.users.all, "posts", username] as const,
    likes: (username: string) => [...queryKeys.users.all, "likes", username] as const,
    followers: (username: string) => [...queryKeys.users.all, "followers", username] as const,
    following: (username: string) => [...queryKeys.users.all, "following", username] as const,
    search: (q: string) => [...queryKeys.users.all, "search", q] as const,
  },
};
