import { Suspense } from "react";

import { ProfileHeaderSkeleton } from "@/features/profile/components/profile-header";
import { UserProfileView } from "@/features/profile/components/user-profile-view";

export async function generateMetadata({ params }: PageProps<"/users/[username]">) {
  const { username } = await params;
  return { title: `@${decodeURIComponent(username)}` };
}

/** "Friends Profile" — any user by username. */
export default function UserProfilePage({ params }: PageProps<"/users/[username]">) {
  return (
    <div className="mx-auto w-full max-w-[812px] md:pt-[40px]">
      <Suspense
        fallback={
          <div className="px-xl pt-xl md:px-0">
            <ProfileHeaderSkeleton />
          </div>
        }
      >
        <UserProfile params={params} />
      </Suspense>
    </div>
  );
}

async function UserProfile({ params }: { params: PageProps<"/users/[username]">["params"] }) {
  const { username } = await params;
  const decoded = decodeURIComponent(username);
  return <UserProfileView key={decoded} username={decoded} />;
}
