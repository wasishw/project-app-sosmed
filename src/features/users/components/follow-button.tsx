"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/api/axios";
import { useToggleFollow } from "@/lib/query/use-users";
import { cn } from "@/lib/utils";
import { useAuthStatus } from "@/store/use-auth-status";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
  /** "list" = compact Follow/Following of the Likes list; "profile" = wide profile button. */
  variant?: "list" | "profile";
  className?: string;
}

/** Figma Follow (primary) / Following (outline + check-circle). */
export function FollowButton({
  username,
  isFollowing,
  variant = "list",
  className,
}: FollowButtonProps) {
  const status = useAuthStatus();
  const router = useRouter();
  const toggle = useToggleFollow();

  const onClick = () => {
    if (status !== "authenticated") {
      router.push(`/login?redirect=${encodeURIComponent(`/users/${username}`)}`);
      return;
    }
    toggle.mutate(
      { username, following: isFollowing },
      { onError: (error) => toast.error(getErrorMessage(error, "Could not update follow")) },
    );
  };

  return (
    <Button
      variant={isFollowing ? "secondary" : "primary"}
      size={variant === "list" ? "sm" : "default"}
      onClick={onClick}
      disabled={toggle.isPending}
      aria-pressed={isFollowing}
      className={cn(variant === "list" && !isFollowing && "px-3xl", className)}
    >
      {isFollowing && <Icon name="check-circle" className="size-5" />}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
