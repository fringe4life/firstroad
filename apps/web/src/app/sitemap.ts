import type { MetadataRoute } from "next";
import { getAllTicketSlugs } from "@/features/ticket/queries/get-all-ticket-slugs";
import { homePath, ticketPath } from "@/path";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllTicketSlugs();

  const entries: MetadataRoute.Sitemap = [
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 1,
      url: `${process.env.NEXT_PUBLIC_APP_URL}${homePath()}`,
    },
    ...slugs.map(({ slug }) => ({
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: 0.8,
      url: `${process.env.NEXT_PUBLIC_APP_URL}${ticketPath(slug)}`,
    })),
  ];

  return entries;
}
