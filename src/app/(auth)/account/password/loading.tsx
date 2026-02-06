import { Heading } from "@/components/heading";
import { TabsSkeleton } from "@/components/skeletons/tabs-skeleton";
import { PasswordSkeleton } from "@/features/password/components/password-skeleton";

const PasswordLoading = () => (
  <>
    <Heading
      description="All your password information"
      tabs={<TabsSkeleton />}
      title="Password"
    />
    <PasswordSkeleton />
  </>
);

export default PasswordLoading;
