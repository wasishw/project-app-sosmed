import type { Metadata } from "next";

import { MobileBackHeader } from "@/components/shared/mobile-back-header";
import { PageTitle } from "@/components/shared/page-title";
import { AddPostForm } from "@/features/posts/components/add-post-form";

export const metadata: Metadata = { title: "Add Post" };

export default function AddPostPage() {
  return (
    <>
      <MobileBackHeader title="Add Post" />
      <div className="mx-auto flex w-full max-w-[452px] flex-col gap-3xl px-xl pt-xl md:px-0 md:pt-[40px]">
        <PageTitle title="Add Post" />
        <AddPostForm />
      </div>
    </>
  );
}
