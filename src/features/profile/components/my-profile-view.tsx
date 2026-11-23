"use client";

import Link from "next/link";

import { MobileBackHeader } from "@/components/shared/mobile-back-header";
import { EmptyState, ErrorState } from "@/components/shared/state-views";
import { Button } from "@/components/ui/button";
import { useMe, useMyPosts, useMySaved } from "@/lib/query/use-me";

import { PostGrid } from "./post-grid";
import { ProfileHeader, ProfileHeaderSkeleton } from "./profile-header";
import { ProfileTabs, useProfileTab, type ProfileTab } from "./profile-tabs";

const TABS = [
  { value: "gallery", label: "Gallery", icon: "gallery", activeIcon: "gallery" },
  { value: "saved", label: "Saved", icon: "bookmark", activeIcon: "bookmark-filled" },
] as const satisfies readonly ProfileTab<string>[];

/** /profile — Gallery (GET /api/me/posts) and Saved (GET /api/me/saved). */
export function MyProfileView() {
  const tab = useProfileTab(TABS);
  const me = useMe();
  const posts = useMyPosts(tab === "gallery");
  const saved = useMySaved(tab === "saved");

  return (
    <>
      <MobileBackHeader title={me.data?.name ?? "My Profile"} />
      <div className="flex flex-col gap-xl px-xl pt-xl md:gap-2xl md:px-0 md:pt-0">
        {me.isPending ? (
          <ProfileHeaderSkeleton />
        ) : me.isError || !me.data ? (
          <ErrorState message="Couldn't load your profile." onRetry={() => me.refetch()} />
        ) : (
          <ProfileHeader
            name={me.data.name}
            username={me.data.username}
            avatarUrl={me.data.avatarUrl}
            bio={me.data.bio}
            counts={me.data.counts}
            isMe
          />
        )}

        <div className="flex flex-col gap-xl md:gap-3xl">
          <ProfileTabs tabs={TABS} active={tab} />
          {tab === "gallery" ? (
            <PostGrid
              query={posts}
              empty={
                <EmptyState
                  title="Your story starts here"
                  description="Share your first post and let the world see your moments, passions, and memories. Make this space truly yours."
                  className="mx-auto max-w-[360px] py-6xl [&>p:first-child]:text-lg"
                  action={
                    <Button asChild className="w-[260px]">
                      <Link href="/add-post">Upload My First Post</Link>
                    </Button>
                  }
                />
              }
            />
          ) : (
            <PostGrid
              query={saved}
              empty={
                <EmptyState
                  title="No saved posts yet"
                  description="Tap the bookmark on a post to save it"
                  className="py-6xl"
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
}
