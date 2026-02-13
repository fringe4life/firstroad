import { Heading } from "@/components/heading";
import { ProfileSkeleton } from "@/features/auth/components/profile-skeleton";

const ProfileLoading = () => (
  <>
    <Heading description="All your profile information" title="Profile" />
    <ProfileSkeleton />
  </>
);

export default ProfileLoading;
