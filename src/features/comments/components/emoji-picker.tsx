"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/** The 3×6 emoji grid from the Figma "Comment" frames. */
const EMOJIS = [..."😀😅🥰😇🙂😋🤪🤐😏🤗😪🙄🤫😴😡😫😭😱"];

interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onPick: (emoji: string) => void;
  className?: string;
}

export function EmojiPicker({ open, onClose, onPick, className }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!ref.current?.contains(target) && !target.closest("[data-emoji-toggle]")) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      role="listbox"
      aria-label="Emoji"
      className={cn(
        "absolute bottom-[calc(100%+8px)] left-0 z-10 grid grid-cols-6 gap-md rounded-2xl border border-neutral-900 bg-neutral-950 p-xl shadow-lg",
        className,
      )}
    >
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          role="option"
          aria-selected={false}
          onClick={() => onPick(emoji)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md text-xl hover:bg-neutral-900"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
