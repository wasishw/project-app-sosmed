import Image from "next/image";

import { images } from "@/assets/images";

/** Login / Register: black page with the blurred purple gradient from Figma. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="relative isolate flex min-h-dvh flex-1 items-center justify-center overflow-hidden bg-base-black px-xl py-6xl">
      <Image
        src={images.authBgDesktop}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 hidden object-cover object-bottom md:block"
      />
      <Image
        src={images.authBgMobile}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-bottom md:hidden"
      />
      {children}
    </main>
  );
}
