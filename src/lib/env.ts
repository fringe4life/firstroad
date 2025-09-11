import "server-only";
import { z } from "zod/v4";

// Environment schema validation
const envSchema = z.object({
	AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
	DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
	// DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
	RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
	RESEND_FROM: z
		.string()
		.min(
			1,
			"RESEND_FROM is required (e.g. 'Your App <onboarding@resend.dev>' or 'noreply@yourdomain.com')",
		),
	NEXTAUTH_URL: z.url().optional(),
});

// Export validated environment variables
export const env = envSchema.parse(process.env);
