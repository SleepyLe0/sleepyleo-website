"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
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
  TypeScript: "JavaScript that went to therapy",
  React: "The library that makes you feel productive",
  "Next.js": "React's overachieving sibling",
  PostgreSQL: "SQL but make it fancy",
  Prisma: "Because writing raw SQL is for masochists",
  Docker: "Works on my machine, certified",
  "Node.js": "JavaScript escaped the browser",
  Tailwind: "Inline styles but we pretend it's different",
  Python: "Whitespace: The Programming Language",
  Go: "When you want C but hate yourself less",
  Rust: "Memory safety at the cost of your sanity",
  JavaScript: "The language that refuses to die",
  CSS: "Where centering a div is a major achievement",
  HTML: "The skeleton nobody appreciates",
  MongoDB: "JSON all the way down",
  Redis: "Memory? What memory?",
  GraphQL: "REST but make it complicated",
  Kubernetes: "YAML engineering at its finest",
  AWS: "Another Way to Spend money",
  Vue: "React's chill cousin",
  Svelte: "The compiler does the work",
};

const accentRgb = [
  "99, 102, 241",
  "168, 85, 247",
  "20, 184, 166",
  "245, 158, 11",
  "59, 130, 246",
  "236, 72, 153",
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active:   { label: "Active",   color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  archived: { label: "Archived", color: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30" },
  wip:      { label: "WIP",      color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
};

export function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const rgb = accentRgb[index % accentRgb.length];
  const status = statusConfig[project.status] ?? {
    label: project.status,
    color: "bg-neutral-500/20 text-neutral-400 border-neutral-500/30",
  };
  const hasMeme = !!project.memeUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: "easeOut" }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 ${featured ? "md:col-span-2" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Meme background — fades in on hover */}
      {hasMeme && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <Image
            src={`/api/gif?url=${encodeURIComponent(project.memeUrl!)}`}
            alt={`${project.name} meme`}
            fill
            unoptimized
            className="object-cover"
          />
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      {/* Accent glow on hover (no meme) */}
      {!hasMeme && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at top left, rgba(${rgb},0.12) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Card content */}
      <div className="relative z-10 flex flex-1 flex-col gap-3 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                <Sparkles className="h-2.5 w-2.5" /> Featured
              </span>
            )}
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-[11px] text-neutral-600 group-hover:text-neutral-400 transition-colors">
            {project.language && (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `rgba(${rgb},0.9)` }} />
                {project.language}
              </span>
            )}
            {!!project.stars && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {project.stars}
              </span>
            )}
            {!!project.forks && (
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" /> {project.forks}
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <h2 className="text-base font-bold leading-tight text-white">
          {project.name}
        </h2>

        {/* Description */}
        {project.description && (
          <p className="text-xs leading-relaxed text-neutral-500 line-clamp-2 group-hover:text-neutral-300 transition-colors">
            {project.description}
          </p>
        )}

        {/* Tech stack */}
        <TooltipProvider delayDuration={100}>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <Tooltip key={tech}>
                <TooltipTrigger asChild>
                  <span className="cursor-default rounded border border-neutral-800 bg-neutral-900/80 px-1.5 py-0.5 font-mono text-[9px] text-neutral-500 transition-colors hover:border-neutral-600 hover:text-neutral-300 group-hover:border-neutral-700 group-hover:bg-black/40">
                    {tech}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {sarcasticTooltips[tech] ?? tech}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[11px] text-neutral-400 transition-all hover:border-neutral-600 hover:text-white group-hover:bg-black/40"
            >
              <Github className="h-3 w-3" /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] text-white transition-all hover:opacity-90"
              style={{ background: `rgba(${rgb}, 0.8)` }}
            >
              <ExternalLink className="h-3 w-3" /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
