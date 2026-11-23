import type { CSSProperties } from "react";

import { icons, type IconName } from "@/assets/icons";
import { cn } from "@/lib/utils";

interface IconProps {
  name: IconName;
  className?: string;
  /** Accessible name; omit for decorative icons next to a text label. */
  label?: string;
}

/**
 * Renders an SVG from `src/assets/icons` as a CSS mask filled with
 * `currentColor`, so `text-*` classes recolor it (active nav, liked heart…).
 */
export function Icon({ name, className, label }: IconProps) {
  const url = `url("${icons[name].src}")`;
  const style: CSSProperties = {
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block size-6 shrink-0 bg-current", className)}
      style={style}
    />
  );
}
