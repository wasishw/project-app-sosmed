"use client";

import { useSyncExternalStore } from "react";

import { formatRelativeTime } from "@/lib/utils";

const subscribe = (onChange: () => void) => {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
};

/**
 * "5 Minutes Ago". Rendered on the client only (server snapshot = absolute
 * date), so the server HTML never disagrees with the browser's clock.
 */
export function RelativeTime({ iso, className }: { iso: string; className?: string }) {
  const label = useSyncExternalStore(
    subscribe,
    () => formatRelativeTime(iso, Math.floor(Date.now() / 60_000) * 60_000),
    () => "",
  );
  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {label || " "}
    </time>
  );
}
