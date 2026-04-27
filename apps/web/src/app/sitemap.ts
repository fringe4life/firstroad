import type { MetadataRoute } from "next";
import { getAllTicketSlugs } from "@/features/ticket/queries/get-all-ticket-slugs";
import { homePath, ticketPath } from "@/path";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllTicketSlugs();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}${homePath()}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...slugs.map(({ slug }) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}${ticketPath(slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return entries;
}
