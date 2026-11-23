"use client";

import { useRouter } from "next/navigation";

import { Icon } from "./icon";

/** Desktop "← Title" heading (Add Post, Edit Profile). Mobile uses MobileBackHeader. */
export function PageTitle({ title, fallbackHref = "/" }: { title: string; fallbackHref?: string }) {
  const router = useRouter();
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };
  return (
    <h1 className="hidden md:block">
      <button
        type="button"
        onClick={goBack}
        className="flex cursor-pointer items-center gap-lg text-display-xs font-bold text-neutral-25"
      >
        <Icon name="arrow-left" />
        {title}
      </button>
    </h1>
  );
}
