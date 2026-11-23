"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { getQueryClient } from "@/lib/query/get-query-client";
import { useAuthStore } from "@/store/auth-store";

import { SessionGuard } from "./session-guard";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  // Read the session cookie after mount (see `skipHydration` in auth-store).
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <SessionGuard />
      <Toaster offset={{ top: 96, right: 24 }} mobileOffset={{ top: 76, left: 16, right: 16 }} />
    </QueryClientProvider>
  );
}
