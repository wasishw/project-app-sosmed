"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { MobileBackHeader } from "@/components/shared/mobile-back-header";
import { EmptyState, ErrorState } from "@/components/shared/state-views";
import { getErrorStatus } from "@/lib/api/axios";
import { useUserLikes, useUserPosts, useUserProfile } from "@/lib/query/use-users";

import { PostGrid } from "./post-grid";
import { ProfileHeader, ProfileHeaderSkeleton } from "./profile-header";
import { ProfileTabs, useProfileTab, type ProfileTab } from "./profile-tabs";

const TABS = [
  { value: "gallery", label: "Gallery", icon: "gallery", activeIcon: "gallery" },
  { value: "liked", label: "Liked", icon: "heart", activeIcon: "heart-filled" },
] as const satisfies readonly ProfileTab<string>[];

/** /users/[username] — "Friends Profile": Follow / Following, Gallery and Liked tabs. */
export function UserProfileView({ username }: { username: string }) {
  const router = useRouter();
  const tab = useProfileTab(TABS);
  const profile = useUserProfile(username);
  const posts = useUserPosts(username, tab === "gallery");
  const likes = useUserLikes(username, tab === "liked");

  // My own username → my profile page (Edit Profile, Saved tab).
  const isMe = profile.data?.isMe;
  useEffect(() => {
    if (isMe) router.replace("/profile");
  }, [isMe, router]);

  if (profile.isError) {
    const notFound = getErrorStatus(profile.error) === 404;
    return (
      <>
        <MobileBackHeader title={username} />
        <ErrorState
          message={notFound ? "User not found." : "Couldn't load this profile."}
          onRetry={notFound ? undefined : () => profile.refetch()}
        />
      </>
    );
  }

  return (
    <>
      <MobileBackHeader title={profile.data?.name ?? username} />
      <div className="flex flex-col gap-xl px-xl pt-xl md:gap-2xl md:px-0 md:pt-0">
        {profile.isPending ? (
          <ProfileHeaderSkeleton />
        ) : (
          <ProfileHeader
            name={profile.data.name}
            username={profile.data.username}
            avatarUrl={profile.data.avatarUrl}
            bio={profile.data.bio}
            counts={profile.data.counts}
            isMe={profile.data.isMe}
            isFollowing={profile.data.isFollowing}
          />
        )}
        <div className="flex flex-col gap-xl md:gap-3xl">
          <ProfileTabs tabs={TABS} active={tab} />
          <PostGrid
            query={tab === "gallery" ? posts : likes}
            empty={
              <EmptyState
                title={tab === "gallery" ? "No posts yet" : "No liked posts yet"}
                className="py-6xl"
              />
            }
          />
        </div>
      </div>
    </>
  );
}
