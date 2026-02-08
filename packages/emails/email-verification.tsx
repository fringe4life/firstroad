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

interface EmailVerificationProps {
  TO_NAME: string;
  URL: string;
}

const EmailVerification = ({ TO_NAME, URL }: EmailVerificationProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Tailwind>
      <Body className="m-8 text-center font-sans">
        <Container>
          <Heading>Verify Your Email Address</Heading>
          <Section>
            <Text>Hello {TO_NAME}</Text>
          </Section>
          <Section>
            <Text>
              Thank you for signing up! Please verify your email address to
              complete your registration.
            </Text>
            <Text>Click the button below to verify your email:</Text>
            <Button
              className="m-2 cursor-pointer rounded bg-black p-2 text-white"
              href={URL}
            >
              Verify Email
            </Button>
          </Section>
          <Section>
            <Text className="text-gray-600 text-sm">
              If you didn't create an account, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

EmailVerification.PreviewProps = {
  TO_NAME: "John Doe",
  URL: "https://example.com/verify-email?token=abc123",
} as EmailVerificationProps;

export default EmailVerification;
