import { isServer, QueryClient } from "@tanstack/react-query";

import { getErrorStatus } from "@/lib/api/axios";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // 4xx (not found, unauthorized, validation) won't fix itself on retry.
        retry: (failureCount, error) => {
          const status = getErrorStatus(error);
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** One client per request on the server, a singleton in the browser. */
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
