import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, GitFork, ExternalLink, Github } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProjects } from "@/lib/actions";
import { BackgroundBeams } from "@/components/ui/background-beams";

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

  const project = await (prisma as unknown as {
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
  }).project.findUnique({
    where: { slug, visible: true },
  });

  if (!project) notFound();

  const statusColors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400 ring-green-500/30",
    archived: "bg-neutral-500/15 text-neutral-400 ring-neutral-500/30",
    wip: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <BackgroundBeams className="opacity-40" />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-24">
        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-10 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Projects</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{project.name}</h1>
            <span
              className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusColors[project.status] ?? statusColors.active}`}
            >
              {project.status}
            </span>
          </div>

          {project.description && (
            <p className="text-neutral-400 text-lg leading-relaxed">{project.description}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-8 text-sm text-neutral-400">
          {project.language && (
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
              {project.language}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-yellow-400" />
            {project.stars}
          </span>
          <span className="flex items-center gap-1.5">
            <GitFork className="h-4 w-4 text-violet-400" />
            {project.forks}
          </span>
        </div>

        {/* Tech stack */}
        {project.techStack.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meme GIF */}
        {project.memeUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.memeUrl}
              alt={`${project.name} meme`}
              className="w-full max-h-80 object-cover"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10"
            >
              <Github className="h-4 w-4" />
              View Code
              <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-500"
            >
              Live Demo
              <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
