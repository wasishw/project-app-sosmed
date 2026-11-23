"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Icon } from "./icon";

/** The floating Home / + / Profile menu shows on the timeline and profile pages only. */
const VISIBLE_ON = (pathname: string) =>
  pathname === "/" || pathname === "/profile" || pathname.startsWith("/users/");

export function BottomNav() {
  const pathname = usePathname();
  if (!VISIBLE_ON(pathname)) return null;
  const isHome = pathname === "/";
  const isProfile = pathname === "/profile";

  return (
    <nav
      aria-label="Main"
      className="fixed bottom-6 left-1/2 z-40 flex h-16 w-[calc(100%-32px)] max-w-[345px] -translate-x-1/2 items-center justify-center gap-[45px] rounded-full border border-neutral-900 bg-neutral-950/90 backdrop-blur-[50px] md:bottom-8 md:h-20 md:max-w-[360px]"
    >
      <NavItem href="/" label="Home" icon="home-filled" active={isHome} />
      <Link
        href="/add-post"
        className="flex size-11 items-center justify-center rounded-full bg-primary-300 text-neutral-25 transition-colors hover:bg-primary-200 md:size-12"
        aria-label="Add post"
      >
        <Icon name="plus" />
      </Link>
      <NavItem href="/profile" label="Profile" icon="user-filled" active={isProfile} />
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: "home-filled" | "user-filled";
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-[94px] flex-col items-center gap-xxs text-xs/4 tracking-minus-2 md:gap-xs md:text-md",
        active ? "font-bold text-primary-200" : "font-regular text-neutral-25",
      )}
    >
      <Icon name={icon} />
      {label}
    </Link>
  );
}
