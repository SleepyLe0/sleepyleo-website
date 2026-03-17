"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ProjectCard } from "@/components/project-card";
import { ProjectRow } from "@/components/project-row";
import { useIde } from "@/components/ide-context";
import { CodeBlock } from "@/components/code-block";

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
  totalCommits: number;
}

// Animated counter hook
function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

export function ProjectsSection({ projects, totalCommits }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerInView, setHeaderInView] = useState(false);

  const { getViewMode } = useIde();

  // Intersection observer for header stats counter
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderInView(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const projectCount = useCounter(projects.length, headerInView);
  const commitCount = useCounter(totalCommits, headerInView);

  // Sort: featured first
  const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-zinc-950 py-16 sm:py-28 px-4"
    >
      {/* ── Background: dot grid ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Top transition bridge — blends from hero ── */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-10">
        {/* Fade in from hero's zinc-950 */}
        <div className="h-32 bg-gradient-to-b from-zinc-950 to-transparent" />
        {/* Indigo glow echo — continues hero's aurora */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-indigo-600/6 blur-[80px]" />
        {/* Hairline separator glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* ── Code view ── */}
        {getViewMode("projects") === "code" ? (
          <CodeBlock section="projects" projects={projects} />
        ) : (
          <>
            {/* ── Section Header ── */}
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12 sm:mb-20"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-400/80 mb-5">
                What I&apos;ve been building
              </p>

              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-none">
                My{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                    Projects
                  </span>
                  {/* Underline glow */}
                  <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-60" />
                </span>
              </h2>

              <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed mb-10">
                Things I built that somehow work. Hover the tech badges for
                totally unbiased professional opinions.
              </p>

              {/* Animated stats */}
              <div className="inline-flex items-center gap-5 sm:gap-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 sm:px-8 py-4 backdrop-blur-sm">
                {[
                  { value: projectCount, suffix: "+", label: "Projects" },
                  { value: commitCount, suffix: "+", label: "Commits" },
                  { value: "∞", suffix: "", label: "Matcha" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-white tabular-nums">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-neutral-600 mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Projects listing ── */}
            {sorted.length > 0 ? (
              <>
                {/* Desktop: row list */}
                <div className="hidden lg:block space-y-0.5">
                  {sorted.map((project) => (
                    <ProjectRow key={project.id} project={project} />
                  ))}
                </div>

                {/* Mobile: card grid */}
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                  {sorted.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      featured={index === 0 && !!project.featured}
                    />
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center justify-center py-40 gap-4"
              >
                <div className="text-6xl">😴</div>
                <p className="text-neutral-600 text-base">
                  No projects yet. The developer is probably sleeping.
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom fade ── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
    </section>
  );
}
