import { ViewTransition } from "react";
import { Suspend } from "@/components/suspend";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { AuthNavSkeleton } from "@/features/auth/components/skeletons/auth-nav-skeleton";
import { NavItems } from "@/features/navigation/components/nav-items";
import { SidebarSignInUpLinks } from "./sidebar-sign-in-up-links";
import { SidebarSkeleton } from "./skeletons/sidebar-skeleton";

const SidebarMobileContent = () => (
  <>
    <Suspend fallback={<SidebarSkeleton />}>
      <NavItems />
    </Suspend>
    <HasAuthSuspense fallback={<AuthNavSkeleton />}>
      {(user) =>
        user ? null : (
          <ViewTransition>
            <SidebarSignInUpLinks />
          </ViewTransition>
        )
      }
    </HasAuthSuspense>
  </>
);

export { SidebarMobileContent };
