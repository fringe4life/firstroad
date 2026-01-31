import type { Metadata } from "next";
import { connection } from "next/server";
import { AccountTabs } from "@/app/(auth)/account/_components/account-tabs";
import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { Suspend } from "@/components/suspend";
import { UserProfileCard } from "@/features/auth/components/user-profile-card";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { TicketStatsCard } from "@/features/ticket/components/ticket-stats-card";
import { getUserTicketStats } from "@/features/ticket/queries/get-user-ticket-stats";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your First Road profile and account settings.",
};

const ProfileContent = async () => {
  await connection();
  const user = await getUserOrRedirect();
  const stats = await getUserTicketStats(user.id);

  return (
    <div className="grid items-start gap-6 md:grid-cols-2 md:grid-rows-[auto_1fr]">
      <UserProfileCard user={user} />
      <TicketStatsCard stats={stats} />
    </div>
  );
};

const ProfilePage = () => (
  <div className="grid h-full w-full grid-rows-[min-content_min-content_min-content_1fr] gap-y-8">
    <Heading
      description="All your profile information"
      tabs={<AccountTabs />}
      title="Profile"
    />
    <Suspend fallback={<Spinner />}>
      <ProfileContent />
    </Suspend>
  </div>
);

export default ProfilePage;
