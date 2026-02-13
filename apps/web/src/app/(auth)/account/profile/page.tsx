import type { Metadata } from "next";
import { connection } from "next/server";
import { Heading } from "@/components/heading";
import { Suspend } from "@/components/suspend";
import { ProfileSkeleton } from "@/features/auth/components/profile-skeleton";
import { UserProfileCard } from "@/features/auth/components/user-profile-card";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import type { User } from "@/features/auth/types";
import { TicketStatsCard } from "@/features/ticket/components/ticket-stats-card";
import { getUserTicketStats } from "@/features/ticket/queries/get-user-ticket-stats";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your First Road profile and account settings.",
};

const ProfileContent = async ({ user }: { user: User }) => {
  const stats = await getUserTicketStats(user.id);

  return (
    <div className="grid items-start gap-6 md:grid-cols-2 md:grid-rows-[auto_1fr]">
      <UserProfileCard user={user} />
      <TicketStatsCard stats={stats} />
    </div>
  );
};

const ProfilePage = async () => {
  await connection();
  const user = await getUserOrRedirect();

  return (
    <>
      <Heading description="All your profile information" title="Profile" />
      <Suspend fallback={<ProfileSkeleton />}>
        <ProfileContent user={user} />
      </Suspend>
    </>
  );
};

export default ProfilePage;
