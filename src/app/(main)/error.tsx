"use client";

import { ErrorState } from "@/components/shared/state-views";

export default function MainError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState message="Something went wrong on this page." onRetry={reset} className="py-10xl" />
  );
}
