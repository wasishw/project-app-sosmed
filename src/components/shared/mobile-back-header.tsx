"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMe } from "@/lib/query/use-me";
import { useAuthStatus } from "@/store/use-auth-status";

import { Icon } from "./icon";
import { UserAvatar } from "./user-avatar";

/** Mobile "← Title  (avatar)" bar from Add Post / Profile / Edit Profile frames. */
export function MobileBackHeader({
  title,
  fallbackHref = "/",
}: {
  title: string;
  fallbackHref?: string;
}) {
  const router = useRouter();
  const status = useAuthStatus();
  const { data: me } = useMe();

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-lg border-b border-neutral-900 bg-base-black px-xl md:hidden">
      <button
        type="button"
        onClick={goBack}
        className="flex min-w-0 cursor-pointer items-center gap-lg"
      >
        <Icon name="arrow-left" />
        <span className="truncate text-md font-bold tracking-minus-2 text-neutral-25">{title}</span>
      </button>
      {status === "authenticated" && (
        <Link href="/profile" aria-label="My profile">
          <UserAvatar src={me?.avatarUrl} name={me?.name ?? "Profile"} size={40} />
        </Link>
      )}
    </header>
  );
}
