import { Heading } from "@/components/heading";
import { TabsSkeleton } from "@/components/skeletons/tabs-skeleton";
import { ProfileSkeleton } from "@/features/auth/components/profile-skeleton";

const ProfileLoading = () => (
  <>
    <Heading
      description="All your profile information"
      tabs={<TabsSkeleton />}
      title="Profile"
    />
    <ProfileSkeleton />
  </>
);

export default ProfileLoading;
