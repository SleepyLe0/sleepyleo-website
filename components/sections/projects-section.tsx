"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { BackgroundBeams } from "@/components/ui/background-beams";

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

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="relative min-h-screen py-24 px-4 flex flex-col justify-center">
      <BackgroundBeams className="opacity-20" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            My Projects
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            A curated collection of things I built that somehow work.
            Hover over the tech badges for some totally professional insights.
          </p>
        </motion.div>

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
    </section>
  );
}
