import type { Metadata } from "next";
import { Suspense } from "react";

import { MyProfileView } from "@/features/profile/components/my-profile-view";
import { ProfileHeaderSkeleton } from "@/features/profile/components/profile-header";

export const metadata: Metadata = { title: "My Profile" };

export default function MyProfilePage() {
  return (
    <div className="mx-auto w-full max-w-[812px] md:pt-[40px]">
      {/* The active tab comes from ?tab= */}
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <MyProfileView />
      </Suspense>
    </div>
  );
}
