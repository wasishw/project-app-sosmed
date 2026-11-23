"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Icon } from "@/components/shared/icon";
import type { IconName } from "@/assets/icons";
import { cn } from "@/lib/utils";

export interface ProfileTab<T extends string> {
  value: T;
  label: string;
  icon: IconName;
  activeIcon: IconName;
}

/** Active tab lives in the URL (`?tab=`), so it survives refresh and back/forward. */
export function useProfileTab<T extends string>(tabs: readonly ProfileTab<T>[]): T {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  return tabs.find((t) => t.value === tab)?.value ?? tabs[0].value;
}

export function ProfileTabs<T extends string>({
  tabs,
  active,
}: {
  tabs: readonly ProfileTab<T>[];
  active: T;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const select = (value: T) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === tabs[0].value) params.delete("tab");
    else params.set("tab", value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div role="tablist" className="flex">
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => select(tab.value)}
            className={cn(
              "flex h-12 flex-1 cursor-pointer items-center justify-center gap-md px-3xl text-sm md:gap-lg md:text-md",
              isActive
                ? "border-b-2 border-neutral-25 font-bold tracking-minus-1 text-neutral-25 md:tracking-minus-2"
                : "border-b border-neutral-900 font-medium text-neutral-400",
            )}
          >
            <Icon name={isActive ? tab.activeIcon : tab.icon} className="size-5 md:size-6" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
