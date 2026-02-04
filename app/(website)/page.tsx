import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ServerHealthSection } from "@/components/sections/server-health-section";
import { getProjects, syncGitHubProjects } from "@/lib/actions";

// Force dynamic rendering to always show fresh data
export const dynamic = "force-dynamic";

export default async function Home() {
  // First try to get projects from database
  let result = await getProjects();

  // If no projects in database, try to sync from GitHub
  if (result.success && result.data.length === 0) {
    await syncGitHubProjects();
    result = await getProjects();
  }

  const projects = result.success ? result.data : [];

  return (
    <>
      <Hero />
      <ProjectsSection projects={projects} />
      <ServerHealthSection />
    </>
  );
}
