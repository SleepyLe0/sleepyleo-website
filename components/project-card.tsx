"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ExternalLink,
  Github,
  Star,
  GitFork,
  Sparkles,
  Terminal,
} from "lucide-react";

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

// Per-card accent — used for the spotlight glow color
const accentRgb = [
  "99, 102, 241",   // indigo
  "168, 85, 247",   // purple
  "20, 184, 166",   // teal
  "245, 158, 11",   // amber
  "59, 130, 246",   // blue
  "236, 72, 153",   // pink
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  archived: { label: "Archived", color: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30" },
  wip: { label: "WIP", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });
  const rgb = accentRgb[index % accentRgb.length];
  const status = statusConfig[project.status] ?? {
    label: project.status,
    color: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setSpotlight((s) => ({ ...s, opacity: 0 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: "easeOut" }}
      className={`group relative h-full ${featured ? "md:col-span-2" : ""}`}
    >
      {/* Outer glow on hover */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, rgba(${rgb},0.5), rgba(${rgb},0.1))`,
          filter: "blur(1px)",
        }}
      />

      {/* Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full flex flex-col rounded-2xl border border-white/[0.06] bg-zinc-900/70 backdrop-blur-md overflow-hidden"
      >
        {/* Mouse-tracking spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 rounded-2xl"
          style={{
            opacity: spotlight.opacity,
            background: `radial-gradient(400px circle at ${spotlight.x}px ${spotlight.y}px, rgba(${rgb},0.12), transparent 60%)`,
          }}
        />

        {/* Inner border highlight (always subtle) */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04] group-hover:ring-white/[0.1] transition-all duration-500" />

        {/* Image */}
        <div className={`relative ${featured ? "h-56" : "h-40"} w-full shrink-0 overflow-hidden`}>
          {project.memeUrl ? (
            <Image
              src={project.memeUrl}
              alt={`${project.name} meme`}
              fill
              sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
              loading="eager"
              unoptimized
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-2"
              style={{
                background: `radial-gradient(ellipse at center, rgba(${rgb},0.08) 0%, transparent 70%), #18181b`,
              }}
            >
              <Terminal className="h-8 w-8" style={{ color: `rgba(${rgb},0.3)` }} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/10">
                no meme yet
              </span>
            </div>
          )}
          {/* Gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

          {/* Featured badge overlay */}
          {project.featured && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-400 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Featured
            </div>
          )}

          {/* Status badge overlay */}
          <div className="absolute top-3 right-3 z-20">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-1 flex-col p-5 gap-3">
          {/* Title + stats row */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-bold text-white leading-tight group-hover:text-white transition-colors">
              {project.name}
            </h2>
            <div className="flex items-center gap-3 text-[11px] text-neutral-600 shrink-0">
              {project.language && (
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `rgba(${rgb},0.8)` }} />
                  {project.language}
                </span>
              )}
              {!!project.stars && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {project.stars}
                </span>
              )}
              {!!project.forks && (
                <span className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  {project.forks}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-sm text-neutral-500 leading-relaxed line-clamp-2 group-hover:text-neutral-400 transition-colors">
              {project.description}
            </p>
          )}

          {/* Tech stack */}
          <TooltipProvider delayDuration={100}>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <Tooltip key={tech}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="border-white/8 bg-white/[0.03] text-neutral-400 hover:bg-white/8 hover:border-white/15 hover:text-neutral-200 cursor-help transition-all text-[10px] py-0"
                    >
                      {tech}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-zinc-900 border-zinc-700 text-neutral-200 text-xs">
                    {sarcasticTooltips[tech] ?? tech}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          {/* Action buttons */}
          <div className="mt-auto flex gap-2 pt-1">
            {project.repoUrl && (
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-8 border border-white/8 hover:border-white/15 hover:bg-white/5 text-neutral-400 hover:text-white transition-all text-xs px-3"
              >
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3.5 w-3.5 mr-1.5" />
                  Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button
                asChild
                size="sm"
                className="h-8 text-xs px-3 text-white shadow-sm transition-all"
                style={{
                  background: `rgba(${rgb}, 0.7)`,
                  boxShadow: `0 0 16px rgba(${rgb}, 0.2)`,
                }}
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Live
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
