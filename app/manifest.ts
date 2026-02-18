import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "SleepyLeo | Fullstack Developer Portfolio",
        short_name: "SleepyLeo",
        description:
            "SleepyLeo - Fullstack Developer portfolio showcasing projects in TypeScript, React, and Next.js.",
        start_url: "/",
        display: "standalone",
        background_color: "#18181b", // zinc-900
        theme_color: "#18181b",
        icons: [
            {
                src: "/icon.png",
                sizes: "any",
                type: "image/x-icon",
            },
            {
                src: "/icon.png", // Assuming you might have a larger version or just reusing for now
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
