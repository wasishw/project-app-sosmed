import type { Pagination } from "./api";

/** Short author/user shape embedded in posts and comments. */
export interface UserSummary {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

/** Users in search / followers / following / likes lists. */
export interface UserListItem extends UserSummary {
  isFollowedByMe?: boolean;
  isMe?: boolean;
  followsMe?: boolean;
}

export interface UserCounts {
  post: number;
  followers: number;
  following: number;
  likes: number;
}

/** GET /api/users/{username} */
export interface PublicProfile {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  email: string;
  phone: string | null;
  counts: UserCounts;
  isFollowing: boolean;
  isMe: boolean;
}

/** GET /api/me (normalised, see lib/api/me.ts). */
export interface MyProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
  counts: UserCounts;
}

export interface UserListData {
  users: UserListItem[];
  pagination: Pagination;
}
