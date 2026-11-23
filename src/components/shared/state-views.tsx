import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** "No results found / Change your keyword", "Your story starts here", … */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-xs text-center", className)}>
      <p className="text-md font-bold tracking-minus-2 text-neutral-25">{title}</p>
      {description && <p className="text-sm text-neutral-400">{description}</p>}
      {action && <div className="mt-3xl">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-md py-6xl text-center", className)}>
      <p className="text-md font-bold text-neutral-25">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer text-sm font-bold text-primary-200 hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
