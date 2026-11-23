"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Caption clamped to 2 lines with the purple "Show More / Show Less" toggle. */
export function PostCaption({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      if (!expanded) setOverflowing(node.scrollHeight > node.clientHeight + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [text, expanded]);

  return (
    <div className={cn("flex flex-col", className)}>
      <p
        ref={ref}
        className={cn(
          "text-sm tracking-minus-2 break-words whitespace-pre-line text-neutral-25 md:text-md",
          !expanded && "line-clamp-2",
        )}
      >
        {text}
      </p>
      {(overflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-fit cursor-pointer text-sm font-bold tracking-minus-1 text-primary-200 md:text-md md:font-semibold md:tracking-minus-2"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
