import { Heading } from "@/components/heading";
import { PasswordSkeleton } from "@/features/password/components/skeletons/password-skeleton";

const PasswordLoading = () => (
  <>
    <Heading description="All your password information" title="Password" />
    <PasswordSkeleton />
  </>
);

export default PasswordLoading;
