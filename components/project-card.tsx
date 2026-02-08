"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WobbleCard } from "@/components/ui/wobble-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, Github, Star, GitFork, Sparkles } from "lucide-react";

interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: string;
  techStack: string[];
  memeUrl?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  stars?: number;
  forks?: number;
  language?: string | null;
}

const sarcasticTooltips: Record<string, string> = {
  "TypeScript": "JavaScript that went to therapy",
  "React": "The library that makes you feel productive",
  "Next.js": "React's overachieving sibling",
  "PostgreSQL": "SQL but make it fancy",
  "Prisma": "Because writing raw SQL is for masochists",
  "Docker": "Works on my machine, certified",
  "Node.js": "JavaScript escaped the browser",
  "Tailwind": "Inline styles but we pretend it's different",
  "Python": "Whitespace: The Programming Language",
  "Go": "When you want C but hate yourself less",
  "Rust": "Memory safety at the cost of your sanity",
  "JavaScript": "The language that refuses to die",
  "CSS": "Where centering a div is a major achievement",
  "HTML": "The skeleton nobody appreciates",
  "MongoDB": "JSON all the way down",
  "Redis": "Memory? What memory?",
  "GraphQL": "REST but make it complicated",
  "Kubernetes": "YAML engineering at its finest",
  "AWS": "Another Way to Spend money",
  "Vue": "React's chill cousin",
  "Svelte": "The compiler does the work",
};

const cardColors = [
  "bg-pink-800",
  "bg-indigo-800",
  "bg-emerald-800",
  "bg-orange-800",
  "bg-cyan-800",
  "bg-purple-800",
];

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const colorClass = cardColors[index % cardColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
    >
      <WobbleCard className="p-0 sm:p-0" containerClassName={`col-span-1 min-h-[300px] ${colorClass}`}>
        {project.memeUrl && (
          <div className="overflow-hidden rounded-t-lg w-full relative aspect-[3/1]">
            <Image
              src={project.memeUrl}
              alt={`${project.name} meme`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover opacity-80"
              unoptimized
            />
          </div>
        )}
        <div className="relative z-10 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {project.name}
              </h2>
              {project.featured && (
                <Sparkles className="h-5 w-5 text-yellow-400" />
              )}
            </div>
            <Badge
              variant={project.status === "active" ? "default" : "secondary"}
              className="ml-2"
            >
              {project.status}
            </Badge>
          </div>

          {project.description && (
            <p className="text-neutral-200 text-sm md:text-base mb-4">
              {project.description}
            </p>
          )}

          {/* GitHub Stats */}
          {(project.stars !== undefined || project.language) && (
            <div className="flex items-center gap-4 mb-4 text-sm text-neutral-300">
              {project.language && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white/60" />
                  {project.language}
                </span>
              )}
              {project.stars !== undefined && project.stars > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {project.stars}
                </span>
              )}
              {project.forks !== undefined && project.forks > 0 && (
                <span className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  {project.forks}
                </span>
              )}
            </div>
          )}

          <TooltipProvider delayDuration={200}>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.map((tech) => (
                <Tooltip key={tech}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="text-white border-white/30 hover:bg-white/10 cursor-help transition-colors"
                    >
                      {tech}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-neutral-900 border-neutral-700 text-neutral-200"
                  >
                    <p className="text-sm">{sarcasticTooltips[tech] || tech}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          <div className="flex gap-2">
            {project.repoUrl && (
              <Button asChild size="sm" variant="secondary">
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-1" />
                  Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild size="sm" variant="secondary">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Live
                </a>
              </Button>
            )}
          </div>
        </div>
      </WobbleCard>
    </motion.div>
  );
}

