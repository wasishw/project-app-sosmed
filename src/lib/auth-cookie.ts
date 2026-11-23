/**
 * The auth store is persisted in a cookie (not localStorage) so `proxy.ts`
 * can protect routes on the server before anything renders.
 */
export const AUTH_COOKIE_NAME = "sociality-auth";

export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Reads the token out of the persisted Zustand JSON (`{"state":{"token":...}}`). */
export function readTokenFromCookieValue(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value));
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "state" in parsed &&
      typeof parsed.state === "object" &&
      parsed.state !== null &&
      "token" in parsed.state &&
      typeof parsed.state.token === "string"
    ) {
      return parsed.state.token || null;
    }
  } catch {
    // malformed cookie → treat as signed out
  }
  return null;
}
