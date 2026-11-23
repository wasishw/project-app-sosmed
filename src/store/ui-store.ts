import { create } from "zustand";

/** Which user list is shown in the shared "Likes / Followers / Following" dialog. */
export type UserListTarget =
  | { kind: "likes"; postId: number }
  | { kind: "followers"; username: string; isMe: boolean }
  | { kind: "following"; username: string; isMe: boolean };

/** Pure UI state: what is open on screen. No API data lives here. */
interface UiState {
  userList: UserListTarget | null;
  isMobileMenuOpen: boolean;
  openUserList: (target: UserListTarget) => void;
  closeUserList: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  userList: null,
  isMobileMenuOpen: false,
  openUserList: (target) => set({ userList: target }),
  closeUserList: () => set({ userList: null }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));
