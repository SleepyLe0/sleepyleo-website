import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, GitFork, ExternalLink, Github } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProjects } from "@/lib/actions";
import "@/components/sleepy-world.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const result = await getProjects();
  if (!result.success) return [];
  return result.data.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  if (!prisma) notFound();

  const project = await (
    prisma as unknown as {
      project: {
        findUnique: (args: object) => Promise<{
          id: string;
          name: string;
          slug: string;
          description: string | null;
          status: string;
          techStack: string[];
          memeUrl: string | null;
          repoUrl: string | null;
          liveUrl: string | null;
          visible: boolean;
          featured: boolean;
          stars: number;
          forks: number;
          language: string | null;
          createdAt: Date;
          updatedAt: Date;
        } | null>;
      };
    }
  ).project.findUnique({
    where: { slug, visible: true },
  });

  if (!project) notFound();

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
      <article className="reading-content">
        <Link href="/projects" className="world-link">
          <ArrowLeft size={16} /> The project journal
        </Link>
        <div className="reading-heading project-detail-heading">
          <p className="world-eyebrow">
            FROM THE WORKSHOP / {project.status.toUpperCase()}
          </p>
          <h1>{project.name}</h1>
          {project.description && <p>{project.description}</p>}
        </div>
        <div className="project-detail-stats">
          {project.language && <span>{project.language}</span>}
          <span>
            <Star size={16} /> {project.stars} stars
          </span>
          <span>
            <GitFork size={16} /> {project.forks} forks
          </span>
        </div>
        {project.techStack.length > 0 && (
          <div>
            <h2 className="journal-subtitle">Built with</h2>
            <div className="world-tags large">
              {project.techStack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        )}
        {project.memeUrl && (
          <div className="project-detail-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.memeUrl} alt={`${project.name} project image`} />
          </div>
        )}
        <div className="project-detail-actions">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="world-link"
            >
              <Github size={18} /> Explore the code <ExternalLink size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="world-primary"
            >
              See it in the wild <ExternalLink size={16} />
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
