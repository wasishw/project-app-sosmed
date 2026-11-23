"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { Icon } from "@/components/shared/icon";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowButton } from "@/features/users/components/follow-button";
import { formatCount } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import type { UserCounts } from "@/types/user";

interface ProfileHeaderProps {
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  counts: UserCounts;
  isMe: boolean;
  isFollowing?: boolean;
}

/** Avatar · name · actions · bio · 4 stats (Figma "My Profile" / "Friends Profile"). */
export function ProfileHeader({
  name,
  username,
  avatarUrl,
  bio,
  counts,
  isMe,
  isFollowing = false,
}: ProfileHeaderProps) {
  const openUserList = useUiStore((s) => s.openUserList);

  const share = async () => {
    const url = `${window.location.origin}/users/${username}`;
    try {
      if (navigator.share) await navigator.share({ title: name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Profile link copied");
      }
    } catch {
      // dismissed
    }
  };

  const actions = (
    <div className="flex w-full items-center gap-lg md:w-auto">
      {isMe ? (
        <Button asChild variant="secondary" className="flex-1 md:w-[130px] md:flex-none">
          <Link href="/profile/edit">Edit Profile</Link>
        </Button>
      ) : (
        <FollowButton
          username={username}
          isFollowing={isFollowing}
          variant="profile"
          className="flex-1 md:w-[130px] md:flex-none"
        />
      )}
      <Button variant="secondary" size="icon" onClick={share} aria-label="Share profile">
        <Icon name="send" />
      </Button>
    </div>
  );

  return (
    <section className="flex flex-col gap-xl">
      <div className="flex flex-col gap-xl md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-xl md:gap-2xl">
          <UserAvatar src={avatarUrl} name={name} size={64} priority />
          <div className="flex min-w-0 flex-col">
            <h1 className="truncate text-sm font-bold tracking-minus-1 text-neutral-25 md:text-md md:tracking-minus-2">
              {name}
            </h1>
            <p className="truncate text-sm tracking-minus-2 text-neutral-25 md:text-md">
              {username}
            </p>
          </div>
        </div>
        {actions}
      </div>

      {bio && (
        <p className="text-sm tracking-minus-2 break-words whitespace-pre-line text-neutral-25 md:text-md">
          {bio}
        </p>
      )}

      <dl className="flex items-center">
        <Stat label="Post" value={counts.post} />
        <Stat
          label="Followers"
          value={counts.followers}
          onClick={() => openUserList({ kind: "followers", username, isMe })}
        />
        <Stat
          label="Following"
          value={counts.following}
          onClick={() => openUserList({ kind: "following", username, isMe })}
        />
        <Stat label="Likes" value={counts.likes} />
      </dl>
    </section>
  );
}

function Stat({ label, value, onClick }: { label: string; value: number; onClick?: () => void }) {
  const body: ReactNode = (
    <>
      {/* <dt> before <dd> for valid markup; flex-col-reverse puts the number on top. */}
      <dt className="text-xs text-neutral-400 md:text-md md:tracking-minus-2">{label}</dt>
      <dd className="text-lg font-bold tracking-minus-3 text-neutral-25 md:text-xl md:tracking-minus-2">
        {formatCount(value)}
      </dd>
    </>
  );
  const classes = "flex flex-1 flex-col-reverse items-center gap-xxs";
  return (
    <div className="flex flex-1 items-center border-r border-neutral-900 last:border-r-0">
      {onClick ? (
        <button type="button" onClick={onClick} className={`${classes} cursor-pointer`}>
          {body}
        </button>
      ) : (
        <div className={classes}>{body}</div>
      )}
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-xl">
      <div className="flex items-center gap-xl">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex flex-col gap-xs">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}
