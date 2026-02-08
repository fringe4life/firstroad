import { TicketStatsCardSkeleton } from "@/features/ticket/components/skeletons/ticket-stats-card-skeleton";
import { UserProfileCardSkeleton } from "./user-profile-card-skeleton";

const ProfileSkeleton = () => (
  <div className="grid items-start gap-6 md:grid-cols-2 md:grid-rows-[auto_1fr]">
    <UserProfileCardSkeleton />
    <TicketStatsCardSkeleton />
  </div>
);

export { ProfileSkeleton };
