import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { CardCompact } from "@/components/card-compact";
import { Suspend } from "@/components/suspend";
import { getUser } from "@/features/auth/queries/get-user";
import { AcceptInvitationCard } from "@/features/invitations/components/accept-invitation-card";
import { AcceptInvitationCardSkeleton } from "@/features/invitations/components/accept-invitation-card-skeleton";
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
    redirect(`${signInPath()}?callbackUrl=${acceptInvitationPath(id)}`);
  }

  const invitation = await getInvitation(id);

  if (!invitation) {
    notFound();
  }

  // Check if the invitation email matches the logged-in user
  // Use generic message to prevent email enumeration
  if (invitation.email !== user.email) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">
          This invitation is not associated with your account.
        </p>
        <p className="text-muted-foreground text-sm">
          Please sign in with the email address the invitation was sent to.
        </p>
      </div>
    );
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
