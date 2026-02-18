"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ProjectCard } from "@/components/project-card";

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

// Floating decorative code line
function CodeLine({ text, style }: { text: string; style: React.CSSProperties }) {
  return (
    <div
      className="pointer-events-none absolute font-mono text-[11px] text-white/[0.04] select-none whitespace-nowrap"
      style={style}
    >
      {text}
    </div>
  );
}

export function ProjectsSection({ projects, totalCommits }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerInView, setHeaderInView] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Scroll-based parallax for background blobs
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const blob1Y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

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

  // Section-level mouse tracking for the big spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const projectCount = useCounter(projects.length, headerInView);
  const commitCount = useCounter(totalCommits, headerInView);

  // Sort: featured first
  const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <section
      id="projects"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-zinc-950 py-28 px-4"
    >
      {/* ── Background: section-level mouse spotlight ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mouse.x}px ${mouse.y}px, rgba(99,102,241,0.04), transparent 50%)`,
        }}
      />

      {/* ── Background: animated aurora blobs ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{ y: blob1Y }}
          className="absolute -left-64 top-0 h-[700px] w-[700px] rounded-full bg-indigo-600/8 blur-[120px]"
        />
        <motion.div
          style={{ y: blob2Y }}
          className="absolute -right-64 bottom-0 h-[600px] w-[600px] rounded-full bg-violet-600/8 blur-[100px]"
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full bg-indigo-500/4 blur-[80px]" />
      </div>

      {/* ── Background: dot grid ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* ── Background: floating code lines ── */}
      <CodeLine text="const projects = await prisma.project.findMany();" style={{ top: "8%", left: "5%", transform: "rotate(-2deg)" }} />
      <CodeLine text="export default function Hero() {" style={{ top: "15%", right: "4%", transform: "rotate(1deg)" }} />
      <CodeLine text="import { motion } from 'framer-motion';" style={{ top: "55%", left: "2%", transform: "rotate(-1deg)" }} />
      <CodeLine text="const [isAwake, setIsAwake] = useState(false);" style={{ bottom: "20%", right: "3%", transform: "rotate(2deg)" }} />
      <CodeLine text="// TODO: sleep less, code more" style={{ bottom: "35%", left: "6%", transform: "rotate(-1.5deg)" }} />

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
        {/* ── Section Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-indigo-400/80 mb-5">
            What I&apos;ve been building
          </p>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-none">
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
          <div className="inline-flex items-center gap-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-4 backdrop-blur-sm">
            {[
              { value: projectCount, suffix: "+", label: "Projects" },
              { value: commitCount, suffix: "+", label: "Commits" },
              { value: "∞", suffix: "", label: "Coffee" },
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

        {/* ── Projects Grid ── */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {sorted.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                featured={index === 0 && !!project.featured}
              />
            ))}
          </div>
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
      </div>

      {/* ── Bottom fade ── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
    </section>
  );
}
