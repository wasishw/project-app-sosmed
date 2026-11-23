"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBox } from "@/features/search/components/search-box";
import { useLogout } from "@/lib/query/use-auth";
import { useMe } from "@/lib/query/use-me";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import { useAuthStatus } from "@/store/use-auth-status";

import { Icon } from "./icon";
import { Logo } from "./logo";
import { UserAvatar } from "./user-avatar";

/**
 * Routes whose mobile layout uses a "← Title" bar rendered by the page itself
 * (Figma: Add Post, My/Friends Profile, Edit Profile, Search). Desktop always
 * shows this full header.
 */
const MOBILE_BACK_HEADER = ["/add-post", "/profile", "/users/", "/search", "/posts/"];

export function Navbar() {
  const pathname = usePathname();
  const hideOnMobile = MOBILE_BACK_HEADER.some((p) => pathname.startsWith(p));
  const status = useAuthStatus();
  const isMenuOpen = useUiStore((s) => s.isMobileMenuOpen);
  const setMenuOpen = useUiStore((s) => s.setMobileMenuOpen);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-neutral-900 bg-base-black",
        hideOnMobile && "hidden md:block",
      )}
    >
      <div className="flex h-16 items-center justify-between gap-xl px-xl md:h-20 md:gap-4xl md:px-[120px]">
        <Logo className="[&>span:last-child]:text-xl md:[&>span:last-child]:text-display-xs" />

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBox />
        </div>

        <div className="flex items-center gap-xl md:gap-lg">
          <Link href="/search" className="flex text-neutral-25 md:hidden" aria-label="Search">
            <Icon name="search" />
          </Link>
          {status === "loading" && (
            <Skeleton className="size-10 rounded-full md:h-11 md:w-[272px]" />
          )}
          {status === "authenticated" && <UserMenu />}
          {status === "guest" && (
            <>
              <div className="hidden items-center gap-lg md:flex">
                <Button asChild variant="secondary" className="h-11 w-[130px]">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="h-11 w-[130px]">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="flex cursor-pointer text-neutral-25 md:hidden"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                <Icon name={isMenuOpen ? "close" : "menu"} />
              </button>
            </>
          )}
        </div>
      </div>

      {status === "guest" && isMenuOpen && (
        <div className="flex gap-lg px-xl pb-xl md:hidden">
          <Button asChild variant="secondary" className="flex-1" onClick={() => setMenuOpen(false)}>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="flex-1" onClick={() => setMenuOpen(false)}>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      )}
    </header>
  );
}

/** Avatar (+ name on desktop) → My Profile / Logout. */
function UserMenu() {
  const { data: me } = useMe();
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-[13px] rounded-full outline-none focus-visible:shadow-focus-ring">
        <UserAvatar
          src={me?.avatarUrl}
          name={me?.name ?? "Profile"}
          size={40}
          className="md:size-12!"
        />
        <span className="hidden text-md font-bold tracking-minus-2 text-neutral-25 md:inline">
          {me?.name ?? ""}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Icon name="user" className="size-5" /> My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={logout}>
          <Icon name="arrow-left" className="size-5" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
