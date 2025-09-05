import { Body, Button, Container, Head, Heading, Html, Section, Tailwind, Text } from "@react-email/components"

interface EmailPasswordResetProps {
  toName: string;
  url: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const EmailPasswordReset = ({ toName, url }: EmailPasswordResetProps) => {
    return (
        <Html>
            <Head />
            <Tailwind>
            <Body className="font-sans m-8 text-center">
                <Container>
                    <Heading>Password Reset</Heading>
                    <Section>
                        <Text>Hello {toName}</Text>
                    </Section>
                    <Section>
                        <Text>You are receiving this email because you (or someone else) have requested a password reset for your account.</Text>
                        <Text>Please click the button below to reset your password:</Text>
                        <Button className="bg-black text-white cursor-pointer rounded p-2 m-2" href={url}>Reset Password</Button>
                    </Section>
                </Container>
            </Body>
            </Tailwind>
        </Html>
    )
}

EmailPasswordReset.PreviewProps = {
    toName: 'John Doe',
    url: 'https://example.com/reset-password',
} as EmailPasswordResetProps;

export default EmailPasswordReset;