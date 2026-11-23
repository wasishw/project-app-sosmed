import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's default font sizes. Without this,
 * `text-md` / `text-display-*` (Figma tokens) would be treated as colors and
 * dropped when merged with `text-neutral-25`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "md",
            "display-xs",
            "display-sm",
            "display-md",
            "display-lg",
            "display-xl",
            "display-2xl",
            "display-3xl",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "1 Minutes Ago" style used in the Figma post header and comments. */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (seconds < MINUTE) return "Just now";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)} Minutes Ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)} Hours Ago`;
  if (seconds < 7 * DAY) return `${Math.floor(seconds / DAY)} Days Ago`;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Compact counters: 1200 → "1.2K". */
export function formatCount(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

/**
 * The API sometimes returns protocol-relative URLs ("//res.cloudinary.com/…"),
 * which `next/image` rejects. Make them absolute; drop anything that isn't http(s).
 */
export function toImageSrc(url: string | null | undefined): string | null {
  if (!url) return null;
  const value = url.trim();
  if (value.startsWith("//")) return `https:${value}`;
  if (/^https?:\/\//i.test(value)) return value;
  return null;
}

/** Only Cloudinary is whitelisted in next.config `images.remotePatterns`. */
export function isOptimizableImage(src: string | null): boolean {
  if (!src) return true; // local static fallback
  try {
    return new URL(src).hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}
