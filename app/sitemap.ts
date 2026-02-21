import { MetadataRoute } from "next";
import { getProjects } from "@/lib/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.sleepyleo.com";

    const result = await getProjects();
    const projects = result.success ? result.data : [];

    const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        ...projectEntries,
    ];
}
