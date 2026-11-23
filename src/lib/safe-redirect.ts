/** Only same-origin paths, never `//evil.com` or absolute URLs. */
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target || !target.startsWith("/") || target.startsWith("//")) return fallback;
  return target;
}
