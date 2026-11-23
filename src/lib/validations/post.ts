import { z } from "zod";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

/** Shared by Add Post (image) and Edit Profile (avatar). */
export const imageFileSchema = z
  .instanceof(File, { message: "Please choose a photo" })
  .refine((f) => (IMAGE_TYPES as readonly string[]).includes(f.type), "Only PNG, JPG or WEBP")
  .refine((f) => f.size <= MAX_IMAGE_SIZE, "Max file size is 5MB");

export const addPostSchema = z.object({
  image: z.instanceof(File, { message: "Photo is required" }).pipe(imageFileSchema),
  caption: z.string().trim().min(1, "Caption is required").max(2200, "Caption is too long"),
});

export const commentSchema = z.object({
  text: z.string().trim().min(1, "Write a comment first").max(500, "Comment is too long"),
});

export type AddPostValues = z.infer<typeof addPostSchema>;
export type CommentValues = z.infer<typeof commentSchema>;
