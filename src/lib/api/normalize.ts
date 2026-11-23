import type { PageParams, Pagination } from "@/types/api";
import type { Comment, CommentListData, Post, PostListData } from "@/types/post";
import type { UserListData, UserListItem, UserSummary } from "@/types/user";

/**
 * The Swagger file documents requests but not responses, and endpoints don't
 * all answer with the same shape (e.g. `/posts` → `{ posts }`, while other
 * lists may use another key or wrap each item). Everything coming from a list
 * endpoint goes through these helpers so the UI only ever sees our own types.
 */

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const num = (...values: unknown[]) => {
  for (const v of values) if (typeof v === "number" && Number.isFinite(v)) return v;
  return 0;
};
const str = (...values: unknown[]) => {
  for (const v of values) if (typeof v === "string") return v;
  return null;
};
const bool = (...values: unknown[]) => {
  for (const v of values) if (typeof v === "boolean") return v;
  return undefined;
};

/** Finds the item array: `data` itself, a preferred key, or the first array property. */
function findArray(data: unknown, keys: string[]): unknown[] {
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return [];
  for (const key of keys) if (Array.isArray(data[key])) return data[key] as unknown[];
  const first = Object.values(data).find(Array.isArray);
  return (first as unknown[] | undefined) ?? [];
}

function toPagination(data: unknown, params: PageParams, count: number): Pagination {
  const raw = isRecord(data) ? (data.pagination ?? data.meta) : undefined;
  const page = params.page ?? 1;
  const limit = params.limit ?? (count || 1);
  if (isRecord(raw)) {
    const total = num(raw.total, raw.totalItems, raw.count);
    return {
      page: num(raw.page, raw.currentPage) || page,
      limit: num(raw.limit, raw.perPage) || limit,
      total,
      totalPages: num(raw.totalPages, raw.lastPage) || Math.max(1, Math.ceil(total / limit)),
    };
  }
  // No pagination info: assume there is another page only if this one is full.
  return { page, limit, total: count, totalPages: count < limit ? page : page + 1 };
}

export function toUserSummary(raw: unknown): UserSummary {
  const u = isRecord(raw) ? raw : {};
  return {
    id: num(u.id),
    username: str(u.username) ?? "",
    name: str(u.name, u.username) ?? "",
    avatarUrl: str(u.avatarUrl, u.avatar),
  };
}

export function toPost(raw: unknown): Post {
  // Some lists wrap the post: `{ post: {...}, savedAt }`.
  const p = isRecord(raw) && isRecord(raw.post) && !("imageUrl" in raw) ? raw.post : raw;
  const r = isRecord(p) ? p : {};
  const count = isRecord(r._count) ? r._count : {};
  return {
    id: num(r.id),
    imageUrl: str(r.imageUrl, r.image) ?? "",
    caption: str(r.caption),
    createdAt: str(r.createdAt) ?? new Date(0).toISOString(),
    author: toUserSummary(r.author ?? r.user),
    likeCount: num(r.likeCount, r.likesCount, count.likes),
    commentCount: num(r.commentCount, r.commentsCount, count.comments),
    likedByMe: bool(r.likedByMe, r.isLiked, r.liked) ?? false,
    savedByMe: bool(r.savedByMe, r.isSaved, r.saved),
  };
}

export function toPostList(data: unknown, params: PageParams): PostListData {
  const items = findArray(data, ["posts", "items", "feed", "results"]).map(toPost);
  return { posts: items, pagination: toPagination(data, params, items.length) };
}

function toUserListItem(raw: unknown): UserListItem {
  // Followers/following may wrap the user: `{ follower: {...} }` / `{ user: {...} }`.
  const r = isRecord(raw) ? raw : {};
  const inner = [r.user, r.follower, r.following].find(isRecord);
  const base = inner && !("username" in r) ? inner : r;
  return {
    ...toUserSummary(base),
    isFollowedByMe: bool(r.isFollowedByMe, base.isFollowedByMe, r.isFollowing),
    isMe: bool(r.isMe, base.isMe),
    followsMe: bool(r.followsMe, base.followsMe),
  };
}

export function toUserList(data: unknown, params: PageParams): UserListData {
  const users = findArray(data, ["users", "items", "followers", "following", "results"]).map(
    toUserListItem,
  );
  return { users, pagination: toPagination(data, params, users.length) };
}

function toComment(raw: unknown): Comment {
  const r = isRecord(raw) ? raw : {};
  return {
    id: num(r.id),
    text: str(r.text, r.content) ?? "",
    createdAt: str(r.createdAt) ?? new Date(0).toISOString(),
    author: toUserSummary(r.author ?? r.user),
  };
}

export function toCommentList(data: unknown, params: PageParams): CommentListData {
  const comments = findArray(data, ["comments", "items", "results"]).map(toComment);
  return { comments, pagination: toPagination(data, params, comments.length) };
}
