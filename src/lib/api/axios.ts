import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

import { useAuthStore } from "@/store/auth-store";
import type { ApiFieldError, ApiResponse } from "@/types/api";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AUTH_PATHS = ["/auth/login", "/auth/register"];

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Expired / invalid token: drop the session; <SessionGuard> sends the user to login.
    if (
      error instanceof AxiosError &&
      error.response?.status === 401 &&
      !AUTH_PATHS.some((p) => error.config?.url?.startsWith(p)) &&
      useAuthStore.getState().token
    ) {
      useAuthStore.getState().expireSession();
    }
    return Promise.reject(error);
  },
);

/** Calls the API and unwraps the `{ success, message, data }` envelope. */
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const { data } = await api.request<ApiResponse<T>>(config);
  return data.data;
}

export function getErrorStatus(error: unknown): number | undefined {
  return error instanceof AxiosError ? error.response?.status : undefined;
}

/** Field errors from a 400 "Validation failed" (`data: [{ path, msg }]`). */
export function getFieldErrors(error: unknown): ApiFieldError[] {
  if (!(error instanceof AxiosError)) return [];
  const data: unknown = error.response?.data;
  if (typeof data === "object" && data !== null && "data" in data && Array.isArray(data.data)) {
    return data.data.filter(
      (item: unknown): item is ApiFieldError =>
        typeof item === "object" && item !== null && "path" in item && "msg" in item,
    );
  }
  return [];
}

/** Human readable message for toasts. */
export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof AxiosError) {
    if (!error.response) return "Cannot reach the server. Check your connection.";
    const fieldErrors = getFieldErrors(error);
    if (fieldErrors.length > 0) return fieldErrors[0].msg;
    const data: unknown = error.response.data;
    if (typeof data === "object" && data !== null && "message" in data) {
      const message = data.message;
      if (typeof message === "string" && message) return message;
    }
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * Puts the API's per-field validation messages under the matching inputs.
 * Returns true when at least one field error was applied.
 */
export function applyFieldErrors<T extends FieldValues>(
  error: unknown,
  fields: readonly Path<T>[],
  setError: UseFormSetError<T>,
): boolean {
  let applied = false;
  for (const fieldError of getFieldErrors(error)) {
    const field = fields.find((f) => f === fieldError.path);
    if (field) {
      setError(field, { type: "server", message: fieldError.msg });
      applied = true;
    }
  }
  return applied;
}
