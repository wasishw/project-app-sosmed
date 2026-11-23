import type { Pagination } from "./api";
import type { UserSummary } from "./user";

export interface Post {
  id: number;
  imageUrl: string;
  caption: string | null;
  createdAt: string;
  author: UserSummary;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  /** Only some endpoints send it; otherwise derived from GET /api/me/saved. */
  savedByMe?: boolean;
}

export interface PostListData {
  posts: Post[];
  pagination: Pagination;
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  author: UserSummary;
}

export interface CommentListData {
  comments: Comment[];
  pagination: Pagination;
}

export interface CreatePostInput {
  image: File;
  caption?: string;
}
