import { HeadingSkeleton } from "@/components/heading-skeleton";
import { PasswordSkeleton } from "@/features/password/components/password-skeleton";

const PasswordLoading = () => (
  <>
    <HeadingSkeleton showTabs />
    <PasswordSkeleton />
  </>
);

export default PasswordLoading;
