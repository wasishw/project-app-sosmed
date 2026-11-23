"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";

/** When the API answers 401 for a stored token: clear cached data and go to login. */
export function SessionGuard() {
  const expired = useAuthStore((s) => s.sessionExpired);
  const clearExpired = useAuthStore((s) => s.clearExpired);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!expired) return;
    clearExpired();
    queryClient.clear();
    toast.error("Your session has expired. Please log in again.");
    const here = window.location.pathname + window.location.search;
    router.replace(`/login?redirect=${encodeURIComponent(here)}`);
  }, [expired, clearExpired, queryClient, router]);

  return null;
}
