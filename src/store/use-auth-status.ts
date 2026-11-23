"use client";

import { useAuthStore } from "./auth-store";

export type AuthStatus = "loading" | "authenticated" | "guest";

/**
 * "loading" until the cookie has been read on the client. Components render a
 * neutral skeleton for that moment instead of flashing the guest UI.
 */
export function useAuthStatus(): AuthStatus {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const token = useAuthStore((s) => s.token);
  if (!hasHydrated) return "loading";
  return token ? "authenticated" : "guest";
}

export function useAuthToken(): string | null {
  return useAuthStore((s) => (s.hasHydrated ? s.token : null));
}
