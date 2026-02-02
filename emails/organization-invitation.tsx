import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OrganizationInvitationProps {
  TO_NAME: string;
  ORGANIZATION_NAME: string;
  INVITER_NAME: string;
  ROLE: string;
  INVITE_URL: string;
}

const OrganizationInvitation = ({
  TO_NAME,
  ORGANIZATION_NAME,
  INVITER_NAME,
  ROLE,
  INVITE_URL,
}: OrganizationInvitationProps) => (
  <Html>
    <Head />
    <Preview>You've been invited to join {ORGANIZATION_NAME}</Preview>
    <Tailwind>
      <Body className="m-8 text-center font-sans">
        <Container>
          <Heading>You've Been Invited!</Heading>
          <Section>
            <Text>Hello {TO_NAME}</Text>
          </Section>
          <Section>
            <Text>
              <strong>{INVITER_NAME}</strong> has invited you to join{" "}
              <strong>{ORGANIZATION_NAME}</strong> as a <strong>{ROLE}</strong>.
            </Text>
            <Text>
              Click the button below to accept the invitation and join the
              organisation:
            </Text>
            <Button
              className="m-2 cursor-pointer rounded bg-black p-2 text-white"
              href={INVITE_URL}
            >
              Accept Invitation
            </Button>
          </Section>
          <Section>
            <Text className="text-gray-600 text-sm">
              If you don't want to join this organisation, you can ignore this
              email or click the link above to decline the invitation.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

OrganizationInvitation.PreviewProps = {
  TO_NAME: "John Doe",
  ORGANIZATION_NAME: "Acme Corp",
  INVITER_NAME: "Jane Smith",
  ROLE: "member",
  INVITE_URL: "https://example.com/accept-invitation/abc123",
} as OrganizationInvitationProps;

export default OrganizationInvitation;
