import { Suspense, type ReactNode } from "react";

import { BottomNav } from "@/components/shared/bottom-nav";
import { Navbar } from "@/components/shared/navbar";
import { UserListDialog } from "@/features/users/components/user-list-dialog";

/**
 * App chrome. `modal` is the parallel-route slot that receives the
 * intercepted `/posts/[id]` (comments dialog over the current page).
 */
export default function MainLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
  return (
    <>
      <Suspense fallback={<div className="h-16 border-b border-neutral-900 md:h-20" />}>
        <Navbar />
      </Suspense>
      <main className="flex flex-1 flex-col pb-32">{children}</main>
      <Suspense>
        <BottomNav />
      </Suspense>
      {modal}
      <UserListDialog />
    </>
  );
}
