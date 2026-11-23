import type { AuthData, LoginInput, RegisterInput } from "@/types/auth";

import { request } from "./axios";

/** The API has answered both `{ token, user }` and `{ accessToken }` shapes; normalise. */
function toAuthData(data: unknown): AuthData {
  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    const token = record.token ?? record.accessToken;
    if (typeof token === "string") {
      return { token, user: record.user as AuthData["user"] };
    }
  }
  throw new Error("Login succeeded but no token was returned");
}

export const authApi = {
  login: async (input: LoginInput) =>
    toAuthData(await request<unknown>({ method: "POST", url: "/auth/login", data: input })),

  register: (input: RegisterInput) =>
    request<unknown>({ method: "POST", url: "/auth/register", data: input }),
};
