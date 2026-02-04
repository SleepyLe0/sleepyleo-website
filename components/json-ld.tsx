export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "SleepyLeo",
    url: "https://www.sleepyleo.com",
    jobTitle: "Fullstack Developer",
    description:
      "SleepyLeo - A Fullstack Developer specializing in TypeScript, React, and Next.js. Professional oversleeper and bugs' worst nightmare.",
    knowsAbout: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js",
      "Web Development",
      "Fullstack Development",
    ],
    sameAs: [
      "https://github.com/SleepyLe0",
      "https://www.linkedin.com/in/kundids-khawmeesri-90814526a/",
      "https://www.facebook.com/khawmeesri.kundids",
    ],
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SleepyLeo",
    alternateName: ["SleepyLeo Portfolio", "SleepyLeo Hub"],
    url: "https://www.sleepyleo.com",
    description:
      "SleepyLeo's Portfolio - Fullstack Developer specializing in modern web technologies",
    author: {
      "@type": "Person",
      name: "SleepyLeo",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}
