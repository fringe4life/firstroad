import { z } from "zod";

// Environment schema validation
const envSchema = z.object({
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
  NEXTAUTH_URL: z.url().optional(),
});

// Validate environment variables (only runs on server)
function validateEnv() {
  if (typeof window !== "undefined") {
    throw new Error("Environment validation should only run on the server");
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    parsed.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    });
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

// Export validated environment variables
export const env = validateEnv();
