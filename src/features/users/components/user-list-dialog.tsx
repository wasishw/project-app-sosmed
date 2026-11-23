"use client";

import { EmptyState, ErrorState } from "@/components/shared/state-views";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { flatPages } from "@/lib/query/pagination";
import { useMe } from "@/lib/query/use-me";
import { usePostLikes } from "@/lib/query/use-posts";
import { useFollowList } from "@/lib/query/use-users";
import { useUiStore, type UserListTarget } from "@/store/ui-store";

import { FollowButton } from "./follow-button";
import { UserRow } from "./user-row";

const TITLES: Record<UserListTarget["kind"], string> = {
  likes: "Likes",
  followers: "Followers",
  following: "Following",
};

/** Figma "Likes" list (also reused for Followers / Following). */
export function UserListDialog() {
  const target = useUiStore((s) => s.userList);
  const close = useUiStore((s) => s.closeUserList);

  return (
    <Dialog open={Boolean(target)} onOpenChange={(open) => !open && close()}>
      <DialogContent
        closeClassName="-top-10 right-xl md:-top-12 md:right-0"
        className="top-auto bottom-0 left-0 w-full translate-x-0 translate-y-0 md:top-1/2 md:bottom-auto md:left-1/2 md:w-[548px] md:-translate-x-1/2 md:-translate-y-1/2"
      >
        {target && (
          <UserListPanel key={JSON.stringify(target)} target={target} onNavigate={close} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function UserListPanel({ target, onNavigate }: { target: UserListTarget; onNavigate: () => void }) {
  const likes = usePostLikes(target.kind === "likes" ? target.postId : 0, target.kind === "likes");
  const follows = useFollowList(
    target.kind === "following" ? "following" : "followers",
    target.kind === "likes" ? "" : target.username,
    target.kind !== "likes" && target.isMe,
    target.kind !== "likes",
  );
  const query = target.kind === "likes" ? likes : follows;
  const { data: me } = useMe();
  const users = flatPages(query.data, "users");
  const sentinel = useInfiniteScroll({
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    rootMargin: "120px",
  });

  return (
    <div className="flex max-h-[75vh] flex-col gap-xl rounded-t-2xl bg-neutral-950 p-xl md:max-h-[640px] md:rounded-2xl md:p-3xl">
      <DialogTitle>{TITLES[target.kind]}</DialogTitle>
      <DialogDescription className="sr-only">List of users</DialogDescription>
      <div className="-mr-md flex-1 overflow-y-auto pr-md">
        {query.isPending ? (
          <div className="flex flex-col gap-xl">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-lg">
                <Skeleton className="size-12 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : query.isError ? (
          <ErrorState
            message="Couldn't load the list."
            onRetry={() => query.refetch()}
            className="py-3xl"
          />
        ) : users.length === 0 ? (
          <EmptyState title={`No ${TITLES[target.kind].toLowerCase()} yet`} className="py-5xl" />
        ) : (
          <ul className="flex flex-col gap-xl">
            {users.map((user) => {
              const isMe = user.isMe ?? user.id === me?.id;
              return (
                <li key={user.id}>
                  <UserRow
                    user={user}
                    onNavigate={onNavigate}
                    action={
                      isMe ? null : (
                        <FollowButton
                          username={user.username}
                          isFollowing={Boolean(user.isFollowedByMe)}
                        />
                      )
                    }
                  />
                </li>
              );
            })}
            {query.hasNextPage && <div ref={sentinel} aria-hidden className="h-px" />}
          </ul>
        )}
      </div>
    </div>
  );
}
