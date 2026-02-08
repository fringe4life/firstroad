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

interface EmailPasswordResetProps {
  TO_NAME: string;
  URL: string;
}

const EmailPasswordReset = ({ TO_NAME, URL }: EmailPasswordResetProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Tailwind>
      <Body className="m-8 text-center font-sans">
        <Container>
          <Heading>Password Reset</Heading>
          <Section>
            <Text>Hello {TO_NAME}</Text>
          </Section>
          <Section>
            <Text>
              You are receiving this email because you (or someone else) have
              requested a password reset for your account.
            </Text>
            <Text>Please click the button below to reset your password:</Text>
            <Button
              className="m-2 cursor-pointer rounded bg-black p-2 text-white"
              href={URL}
            >
              Reset Password
            </Button>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

EmailPasswordReset.PreviewProps = {
  TO_NAME: "John Doe",
  URL: "https://example.com/reset-password",
} as EmailPasswordResetProps;

export default EmailPasswordReset;
