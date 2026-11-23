import Link from "next/link";

import { cn } from "@/lib/utils";

import { Icon } from "./icon";

/** Sunburst mark + "Sociality" wordmark (Display xs / Bold). */
export function Logo({ className, href = "/" }: { className?: string; href?: string | null }) {
  const content = (
    <>
      <Icon name="logo" className="size-[30px]" />
      <span className="text-display-xs font-bold text-neutral-25">Sociality</span>
    </>
  );
  const classes = cn("flex items-center gap-[11px]", className);
  if (href === null) return <div className={classes}>{content}</div>;
  return (
    <Link href={href} className={classes} aria-label="Sociality home">
      {content}
    </Link>
  );
}
