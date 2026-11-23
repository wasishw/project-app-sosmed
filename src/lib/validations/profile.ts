import { z } from "zod";

import { imageFileSchema } from "./post";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: z
    .string()
    .trim()
    .min(3, "Username min 3 characters")
    .regex(/^[A-Za-z0-9._]+$/, "Only letters, numbers, dot and underscore"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?\d{8,15})?$/, "Enter a valid number phone"),
  bio: z.string().trim().max(160, "Bio max 160 characters"),
  avatar: imageFileSchema.optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;
