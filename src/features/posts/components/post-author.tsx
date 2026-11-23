import Link from "next/link";

import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/utils";
import type { UserSummary } from "@/types/user";

import { RelativeTime } from "./relative-time";

interface PostAuthorProps {
  author: UserSummary;
  createdAt: string;
  /** "card" = timeline (64px desktop / 44px mobile); "compact" = dialog & comments (40px). */
  variant?: "card" | "compact";
  className?: string;
}

export function PostAuthor({ author, createdAt, variant = "card", className }: PostAuthorProps) {
  const isCard = variant === "card";
  return (
    <Link
      href={`/users/${author.username}`}
      className={cn("flex min-w-0 items-center", isCard ? "gap-md md:gap-lg" : "gap-md", className)}
    >
      <UserAvatar
        src={author.avatarUrl}
        name={author.name}
        size={isCard ? 64 : 40}
        className={isCard ? "size-11! md:size-16!" : undefined}
      />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "truncate font-bold text-neutral-25",
            isCard
              ? "text-sm tracking-minus-1 md:text-md md:tracking-minus-2"
              : "text-sm tracking-minus-1",
          )}
        >
          {author.name}
        </span>
        <RelativeTime
          iso={createdAt}
          className={cn(
            "text-neutral-400",
            isCard ? "text-xs/4 md:text-sm md:tracking-minus-2" : "text-xs/4",
          )}
        />
      </span>
    </Link>
  );
}
