import Link from "next/link";
import type { ReactNode } from "react";

import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/utils";
import type { UserSummary } from "@/types/user";

interface UserRowProps {
  user: UserSummary;
  action?: ReactNode;
  onNavigate?: () => void;
  avatarSize?: number;
  className?: string;
}

/** Figma "User Info": avatar + name (Text sm/Bold) + username (Text sm/Regular, neutral-400). */
export function UserRow({ user, action, onNavigate, avatarSize = 48, className }: UserRowProps) {
  return (
    <div className={cn("flex items-center justify-between gap-lg", className)}>
      <Link
        href={`/users/${user.username}`}
        onClick={onNavigate}
        className="flex min-w-0 items-center gap-lg"
      >
        <UserAvatar src={user.avatarUrl} name={user.name} size={avatarSize} />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-bold tracking-minus-1 text-neutral-25">
            {user.name}
          </span>
          <span className="truncate text-sm tracking-minus-2 text-neutral-400">
            {user.username}
          </span>
        </span>
      </Link>
      {action}
    </div>
  );
}
