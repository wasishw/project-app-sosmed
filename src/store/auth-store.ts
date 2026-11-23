import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

/**
 * Client state only: the session token. Everything about the user
 * (profile, counts, posts) is server state and lives in TanStack Query.
 */
interface AuthState {
  token: string | null;
  hasHydrated: boolean;
  /** Set when the API rejected the token (401); <SessionGuard> reacts to it. */
  sessionExpired: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  expireSession: () => void;
  clearExpired: () => void;
}

const cookieStorage: StateStorage = {
  getItem: (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
  },
  setItem: (name, value) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; samesite=lax`;
  },
  removeItem: (name) => {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      hasHydrated: false,
      sessionExpired: false,
      setToken: (token) => set({ token, sessionExpired: false }),
      logout: () => set({ token: null }),
      expireSession: () => set({ token: null, sessionExpired: true }),
      clearExpired: () => set({ sessionExpired: false }),
    }),
    {
      name: AUTH_COOKIE_NAME,
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({ token: state.token }),
      // Rehydrated from <Providers> after mount, so server HTML and the first
      // client render match (both start as "unknown").
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    },
  ),
);
