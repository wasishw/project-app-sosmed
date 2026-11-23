import Image from "next/image";

import { images } from "@/assets/images";
import { cn, isOptimizableImage, toImageSrc } from "@/lib/utils";

interface UserAvatarProps {
  src: string | null | undefined;
  name: string;
  /** Rendered size in px (also used for `sizes`). */
  size: number;
  className?: string;
  priority?: boolean;
}

/** Round avatar; users without a photo get the default PNG. */
export function UserAvatar({ src, name, size, className, priority }: UserAvatarProps) {
  const url = toImageSrc(src);
  return (
    <Image
      src={url ?? images.avatarDefault}
      unoptimized={!isOptimizableImage(url)}
      alt={name}
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      className={cn("shrink-0 rounded-full bg-neutral-900 object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
