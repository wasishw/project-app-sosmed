import type { UserSummary } from "./user";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthData {
  token: string;
  user?: UserSummary & { email?: string };
}

export interface UpdateProfileInput {
  name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar?: File;
}
