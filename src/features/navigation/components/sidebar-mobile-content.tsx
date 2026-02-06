import { ViewTransition } from "react";
import { AuthNavSkeleton } from "@/features/auth/components/auth-nav-skeleton";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { NavItems } from "@/features/navigation/components/nav-items";
import { SidebarSignInUpLinks } from "./sidebar-sign-in-up-links";

const SidebarMobileContent = () => (
  <>
    <NavItems />
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
