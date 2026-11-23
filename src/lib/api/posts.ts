import type { PageParams } from "@/types/api";
import type { CreatePostInput } from "@/types/post";

import { request } from "./axios";
import { toCommentList, toPost, toPostList, toUserList } from "./normalize";

export const postsApi = {
  /** Public explore list (guests) — also flags `likedByMe` when a token is sent. */
  explore: async (params: PageParams) =>
    toPostList(await request<unknown>({ url: "/posts", params }), params),
  /** Timeline of the signed-in user: own posts + people they follow. */
  feed: async (params: PageParams) =>
    toPostList(await request<unknown>({ url: "/feed", params }), params),
  detail: async (id: number) => toPost(await request<unknown>({ url: `/posts/${id}` })),

  create: ({ image, caption }: CreatePostInput) => {
    const form = new FormData();
    form.append("image", image);
    if (caption) form.append("caption", caption);
    return request<unknown>({ method: "POST", url: "/posts", data: form });
  },
  remove: (id: number) => request<unknown>({ method: "DELETE", url: `/posts/${id}` }),

  like: (id: number) => request<unknown>({ method: "POST", url: `/posts/${id}/like` }),
  unlike: (id: number) => request<unknown>({ method: "DELETE", url: `/posts/${id}/like` }),
  likes: async (id: number, params: PageParams) =>
    toUserList(await request<unknown>({ url: `/posts/${id}/likes`, params }), params),

  save: (id: number) => request<unknown>({ method: "POST", url: `/posts/${id}/save` }),
  unsave: (id: number) => request<unknown>({ method: "DELETE", url: `/posts/${id}/save` }),
};

export const commentsApi = {
  list: async (postId: number, params: PageParams) =>
    toCommentList(await request<unknown>({ url: `/posts/${postId}/comments`, params }), params),
  create: (postId: number, text: string) =>
    request<unknown>({ method: "POST", url: `/posts/${postId}/comments`, data: { text } }),
  remove: (commentId: number) =>
    request<unknown>({ method: "DELETE", url: `/comments/${commentId}` }),
};
