import type { Metadata } from "next";

import { MobileBackHeader } from "@/components/shared/mobile-back-header";
import { PageTitle } from "@/components/shared/page-title";
import { EditProfileView } from "@/features/profile/components/edit-profile-form";

export const metadata: Metadata = { title: "Edit Profile" };

export default function EditProfilePage() {
  return (
    <>
      <MobileBackHeader title="Edit Profile" fallbackHref="/profile" />
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-3xl px-xl pt-xl md:px-0 md:pt-[40px]">
        <PageTitle title="Edit Profile" fallbackHref="/profile" />
        <EditProfileView />
      </div>
    </>
  );
}
