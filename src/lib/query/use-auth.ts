"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth-store";
import type { LoginInput, RegisterInput } from "@/types/auth";

/** Server state of the previous session (likedByMe, feed, profile) must not leak. */
function useResetSessionCache() {
  const qc = useQueryClient();
  return () => {
    qc.cancelQueries();
    qc.clear();
  };
}

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);
  const resetCache = useResetSessionCache();
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: ({ token }) => {
      resetCache();
      setToken(token);
    },
  });
}

/** Registers and signs straight in with the same credentials. */
export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken);
  const resetCache = useResetSessionCache();
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      await authApi.register(input);
      return authApi.login({ email: input.email, password: input.password });
    },
    onSuccess: ({ token }) => {
      resetCache();
      setToken(token);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const resetCache = useResetSessionCache();
  const router = useRouter();
  return () => {
    logout();
    resetCache();
    router.replace("/");
    router.refresh();
  };
}
