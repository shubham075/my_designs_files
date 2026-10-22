import type { MetadataRoute } from "next";
import { VERTICAL_TEMPLATES } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aethelgard.agency";
  const updatedAt = new Date();

  return [
    {
      url: baseUrl,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...VERTICAL_TEMPLATES.map((template) => ({
      url: `${baseUrl}/work/${template.slug}`,
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
