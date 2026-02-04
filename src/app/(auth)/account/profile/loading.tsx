import { HeadingSkeleton } from "@/components/heading-skeleton";
import { ProfileSkeleton } from "@/features/auth/components/profile-skeleton";

const ProfileLoading = () => (
  <>
    <HeadingSkeleton showTabs />
    <ProfileSkeleton />
  </>
);

export default ProfileLoading;
