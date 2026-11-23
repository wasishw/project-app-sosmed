import type { StaticImageData } from "next/image";

import arrowLeft from "./arrow-left.svg";
import arrowUp from "./arrow-up.svg";
import bookmark from "./bookmark.svg";
import bookmarkFilled from "./bookmark-filled.svg";
import checkCircle from "./check-circle.svg";
import chevronDown from "./chevron-down.svg";
import close from "./close.svg";
import comment from "./comment.svg";
import emoji from "./emoji.svg";
import eye from "./eye.svg";
import eyeOff from "./eye-off.svg";
import gallery from "./gallery.svg";
import heart from "./heart.svg";
import heartFilled from "./heart-filled.svg";
import homeFilled from "./home-filled.svg";
import logo from "./logo.svg";
import menu from "./menu.svg";
import moreHorizontal from "./more-horizontal.svg";
import plus from "./plus.svg";
import search from "./search.svg";
import searchClear from "./search-clear.svg";
import send from "./send.svg";
import trash from "./trash.svg";
import uploadCloud from "./upload-cloud.svg";
import user from "./user.svg";
import userFilled from "./user-filled.svg";

/** Every icon from the Figma "Components & Variant" page (24×24, currentColor). */
export const icons = {
  "arrow-left": arrowLeft as StaticImageData,
  "arrow-up": arrowUp as StaticImageData,
  bookmark: bookmark as StaticImageData,
  "bookmark-filled": bookmarkFilled as StaticImageData,
  "check-circle": checkCircle as StaticImageData,
  "chevron-down": chevronDown as StaticImageData,
  close: close as StaticImageData,
  comment: comment as StaticImageData,
  emoji: emoji as StaticImageData,
  eye: eye as StaticImageData,
  "eye-off": eyeOff as StaticImageData,
  gallery: gallery as StaticImageData,
  heart: heart as StaticImageData,
  "heart-filled": heartFilled as StaticImageData,
  "home-filled": homeFilled as StaticImageData,
  logo: logo as StaticImageData,
  menu: menu as StaticImageData,
  "more-horizontal": moreHorizontal as StaticImageData,
  plus: plus as StaticImageData,
  search: search as StaticImageData,
  "search-clear": searchClear as StaticImageData,
  send: send as StaticImageData,
  trash: trash as StaticImageData,
  "upload-cloud": uploadCloud as StaticImageData,
  user: user as StaticImageData,
  "user-filled": userFilled as StaticImageData,
} as const;

export type IconName = keyof typeof icons;
