import type { PageParams } from "@/types/api";
import type { UpdateProfileInput } from "@/types/auth";
import type { MyProfile, PublicProfile, UserCounts } from "@/types/user";

import { request } from "./axios";
import { toPostList, toUserList } from "./normalize";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const num = (value: unknown) => (typeof value === "number" ? value : 0);
const str = (value: unknown) => (typeof value === "string" ? value : null);

function toCounts(raw: unknown): UserCounts {
  const c = isRecord(raw) ? raw : {};
  return {
    post: num(c.post ?? c.posts),
    followers: num(c.followers),
    following: num(c.following),
    likes: num(c.likes),
  };
}

/** GET /api/me returns "profile + quick stats"; accept flat or nested shapes. */
function toMyProfile(data: unknown): MyProfile {
  const root = isRecord(data) ? data : {};
  const profile = isRecord(root.profile) ? root.profile : isRecord(root.user) ? root.user : root;
  return {
    id: num(profile.id),
    name: str(profile.name) ?? "",
    username: str(profile.username) ?? "",
    email: str(profile.email) ?? "",
    phone: str(profile.phone),
    bio: str(profile.bio),
    avatarUrl: str(profile.avatarUrl),
    counts: toCounts(root.stats ?? root.counts ?? profile.counts),
  };
}

function toFormData(input: UpdateProfileInput): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    form.append(key, value instanceof File ? value : String(value));
  }
  return form;
}

export const meApi = {
  get: async () => toMyProfile(await request<unknown>({ url: "/me" })),

  update: async (input: UpdateProfileInput) =>
    toMyProfile(await request<unknown>({ method: "PATCH", url: "/me", data: toFormData(input) })),

  posts: async (params: PageParams) =>
    toPostList(await request<unknown>({ url: "/me/posts", params }), params),
  saved: async (params: PageParams) =>
    toPostList(await request<unknown>({ url: "/me/saved", params }), params),
  likes: async (params: PageParams) =>
    toPostList(await request<unknown>({ url: "/me/likes", params }), params),
  followers: async (params: PageParams) =>
    toUserList(await request<unknown>({ url: "/me/followers", params }), params),
  following: async (params: PageParams) =>
    toUserList(await request<unknown>({ url: "/me/following", params }), params),
};

const enc = encodeURIComponent;

export const usersApi = {
  profile: async (username: string) => {
    const data = await request<PublicProfile>({ url: `/users/${enc(username)}` });
    return { ...data, counts: toCounts(data.counts) };
  },
  posts: async (username: string, params: PageParams) =>
    toPostList(await request<unknown>({ url: `/users/${enc(username)}/posts`, params }), params),
  likes: async (username: string, params: PageParams) =>
    toPostList(await request<unknown>({ url: `/users/${enc(username)}/likes`, params }), params),
  followers: async (username: string, params: PageParams) =>
    toUserList(
      await request<unknown>({ url: `/users/${enc(username)}/followers`, params }),
      params,
    ),
  following: async (username: string, params: PageParams) =>
    toUserList(
      await request<unknown>({ url: `/users/${enc(username)}/following`, params }),
      params,
    ),
  search: async (q: string, params: PageParams) =>
    toUserList(await request<unknown>({ url: "/users/search", params: { q, ...params } }), params),
};

export const followApi = {
  follow: (username: string) =>
    request<unknown>({ method: "POST", url: `/follow/${enc(username)}` }),
  unfollow: (username: string) =>
    request<unknown>({ method: "DELETE", url: `/follow/${enc(username)}` }),
};
