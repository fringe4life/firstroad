import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailOTPVerificationProps {
  TO_NAME: string;
  OTP: string;
  TYPE: string;
}

const EmailOTPVerification = ({
  TO_NAME,
  OTP,
  TYPE,
}: EmailOTPVerificationProps) => (
  <Html>
    <Head />
    <Preview>Your 5-minute sign-in code is ready to use</Preview>
    <Tailwind>
      <Body className="m-8 text-center font-sans">
        <Container>
          <Heading>Your Code:</Heading>
          <Section>
            <Text>Hello {TO_NAME}</Text>
          </Section>
          <Section>
            <Text>{TYPE}</Text>
            <Text className="my-6 font-bold text-4xl text-blue-600 tracking-widest">
              {OTP}
            </Text>
            <Text className="text-gray-600 text-sm">
              This code will expire in 5 minutes for security reasons.
            </Text>
          </Section>
          <Section>
            <Text className="text-gray-600 text-sm">
              If you didn't request this code, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

EmailOTPVerification.PreviewProps = {
  TO_NAME: "John Doe",
  OTP: "123456",
  TYPE: "Your Sign-In Code",
} as EmailOTPVerificationProps;

export default EmailOTPVerification;
