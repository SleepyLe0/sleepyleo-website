// components/project-row.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Github, Star } from "lucide-react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

interface Project {
  id: string; name: string; slug: string;
  description?: string | null; status: string; techStack: string[];
  memeUrl?: string | null; repoUrl?: string | null; liveUrl?: string | null;
  featured?: boolean; stars?: number | null; language?: string | null;
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
};

export function ProjectRow({ project }: { project: Project }) {
  const [memeVisible, setMemeVisible] = useState(false);

  return (
    <div
      className="group relative flex items-center gap-3 rounded border border-transparent px-3 py-2.5 transition-colors hover:border-neutral-800 hover:bg-neutral-900/50"
      onMouseEnter={() => setMemeVisible(true)}
      onMouseLeave={() => setMemeVisible(false)}
    >
      {/* Meme overlay on hover */}
      {project.memeUrl && memeVisible && (
        <div className="pointer-events-none absolute right-3 top-1/2 z-10 h-16 w-16 -translate-y-1/2 overflow-hidden rounded border border-neutral-700">
          <Image src={project.memeUrl} alt="meme" fill unoptimized className="object-cover" />
        </div>
      )}

      {/* Name */}
      <span className="w-48 flex-shrink-0 truncate font-medium text-neutral-200 text-sm">
        {project.name}
        {project.featured && (
          <span className="ml-1.5 rounded bg-amber-900/40 px-1 py-0.5 font-mono text-[9px] text-amber-400">
            featured
          </span>
        )}
      </span>

      {/* Description */}
      <span className="flex-1 truncate text-xs text-neutral-600">
        {project.description}
      </span>

      {/* Tech stack pills (first 3) */}
      <TooltipProvider>
        <div className="flex gap-1">
          {project.techStack.slice(0, 3).map((tech) => (
            <Tooltip key={tech}>
              <TooltipTrigger asChild>
                <span className="cursor-default rounded border border-neutral-800 px-1.5 py-0.5 font-mono text-[9px] text-neutral-500 hover:border-neutral-600 hover:text-neutral-300">
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

      {/* Language */}
      <span className="w-12 flex-shrink-0 text-right font-mono text-[10px] text-indigo-400">
        {project.language}
      </span>

      {/* Stars */}
      <span className="flex w-10 flex-shrink-0 items-center justify-end gap-0.5 font-mono text-[10px] text-neutral-700">
        <Star size={9} /> {project.stars ?? 0}
      </span>

      {/* Actions */}
      <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
            className="rounded border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-500 hover:border-neutral-600 hover:text-neutral-300">
            <Github size={10} className="inline mr-0.5" />Code
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className="rounded bg-indigo-600/80 px-2 py-0.5 text-[10px] text-white hover:bg-indigo-500">
            <ExternalLink size={10} className="inline mr-0.5" />Live
          </a>
        )}
      </div>
    </div>
  );
}
