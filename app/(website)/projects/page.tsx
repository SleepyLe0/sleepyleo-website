import { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { getProjects, syncGitHubProjects } from "@/lib/actions";
import { BackgroundBeams } from "@/components/ui/background-beams";

export const metadata: Metadata = {
  title: "Projects",
  description: "A collection of projects that somehow work. Most of the time.",
};

// Force dynamic rendering to always show fresh data
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  // First try to get projects from database
  let result = await getProjects();

  // If no projects in database, try to sync from GitHub
  if (result.success && result.data.length === 0) {
    await syncGitHubProjects();
    result = await getProjects();
  }

  const projects = result.success ? result.data : [];

  return (
    <div className="relative min-h-screen bg-neutral-950 pt-24 pb-12 px-4">
      <BackgroundBeams className="opacity-40" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            My Projects
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            A curated collection of things I built that somehow work.
            Hover over the tech badges for some totally professional insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-xl">
              No projects yet. The developer is probably sleeping.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
