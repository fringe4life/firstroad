import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { CardCompact } from "@/components/card-compact";
import { Suspend } from "@/components/suspend";
import { getUser } from "@/features/auth/queries/get-user";
import { AcceptInvitationCard } from "@/features/invitations/components/accept-invitation-card";
import { AcceptInvitationCardSkeleton } from "@/features/invitations/components/skeletons/accept-invitation-card-skeleton";
import { getInvitation } from "@/features/invitations/queries/get-invitation";
import { acceptInvitationPath, signInPath } from "@/path";

interface AcceptInvitationPageProps {
  params: PageProps<"/accept-invitation/[id]">["params"];
}

const AcceptInvitationContent = async ({
  params,
}: AcceptInvitationPageProps) => {
  await connection();
  const { id } = await params;

  // Check if user is logged in
  const { user, hasUser } = await getUser();
  if (!hasUser) {
    // Redirect to sign-in with return URL
    throw redirect(`${signInPath()}?callbackUrl=${acceptInvitationPath(id)}`);
  }

  const invitation = await getInvitation(id);

  if (!invitation || invitation.email !== user.email) {
    notFound();
  }

  return <AcceptInvitationCard invitation={invitation} />;
};

const AcceptInvitationPage = ({
  params,
}: PageProps<"/accept-invitation/[id]">) => (
  <CardCompact
    content={
      <Suspend fallback={<AcceptInvitationCardSkeleton />}>
        <AcceptInvitationContent params={params} />
      </Suspend>
    }
    description="Review the invitation details below"
    footer={
      <Link className="text-muted-foreground text-sm" href={signInPath()}>
        Back to Sign In
      </Link>
    }
    title="Organisation Invitation"
  />
);

export default AcceptInvitationPage;
