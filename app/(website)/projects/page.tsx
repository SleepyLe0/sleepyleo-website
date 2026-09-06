import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProjects, syncGitHubProjects } from "@/lib/actions";
import "@/components/sleepy-world.css";

export const metadata: Metadata = {
  title: "The Workshop",
  description:
    "A collection of ideas, experiments, and projects from SleepyLeo’s workshop.",
};
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let result = await getProjects();
  if (result.success && result.data.length === 0) {
    await syncGitHubProjects();
    result = await getProjects();
  }
  const projects = result.success ? result.data : [];
  return (
    <div className="sleepy-world world-reading">
      <header className="world-header">
        <Link href="/" className="world-brand">
          sleepyleo
        </Link>
        <Link href="/#work" className="world-menu-button">
          <ArrowLeft size={16} /> Back to the island
        </Link>
      </header>
      <div className="reading-content">
        <div className="reading-heading">
          <p className="world-eyebrow">01 / THE PROJECT JOURNAL</p>
          <h1>
            From the <em>workshop.</em>
          </h1>
          <p>Ideas that made it out of my head and into the world.</p>
        </div>
        <section className="journal-projects">
          {projects.map((project, index) => (
            <Link
              className="journal-project"
              href={`/projects/${project.slug}`}
              key={project.id}
            >
              <span className="project-order">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="project-type">
                  {project.featured ? "FEATURED" : project.status}
                </span>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="world-tags">
                  {project.techStack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
              <ArrowUpRight size={20} />
            </Link>
          ))}
          {!projects.length && (
            <div className="journal-note">
              <h3>The next idea is taking shape.</h3>
              <p>
                Explore my public repositories while the journal is being
                filled.
              </p>
              <a
                href="https://github.com/SleepyLe0"
                className="world-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit GitHub <ArrowUpRight size={16} />
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
