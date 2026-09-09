import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: [
        "/api/",
        "/account/",
        "/organisations/",
        "/onboarding/",
        "/accept-invitation/",
        "/tickets$",
        "/tickets/organisation",
        "/tickets/*/edit",
        "/sign-in",
        "/sign-up",
        "/forgot-password",
        "/reset-password/",
        "/verify-email/",
        "/sign-out",
      ],
      userAgent: "*",
    },
    sitemap: appUrl ? `${appUrl}/sitemap.xml` : undefined,
  };
}
