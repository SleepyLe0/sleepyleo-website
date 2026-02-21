"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  projectUsage: string;
  order: number;
}

interface SkillsSectionProps {
  skills: Skill[];
}

const CATEGORY_ORDER = ["Frontend", "Backend", "DevOps", "Tools"];

const proficiencyConfig: Record<string, { label: string; ringClass: string; textClass: string; bgClass: string }> = {
  daily_driver: {
    label: "Daily Driver",
    ringClass: "ring-indigo-500/50",
    textClass: "text-indigo-300",
    bgClass: "bg-indigo-500/10",
  },
  comfortable: {
    label: "Comfortable",
    ringClass: "ring-violet-500/50",
    textClass: "text-violet-300",
    bgClass: "bg-violet-500/10",
  },
  learning: {
    label: "Learning",
    ringClass: "ring-neutral-500/40",
    textClass: "text-neutral-400",
    bgClass: "bg-neutral-500/10",
  },
};

function SkillPill({ skill }: { skill: Skill }) {
  const config = proficiencyConfig[skill.proficiency] ?? proficiencyConfig.learning;

  const pill = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex cursor-default items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ring-1 ${config.ringClass} ${config.textClass} ${config.bgClass} border-white/5 transition-all`}
    >
      {skill.name}
    </motion.div>
  );

  if (!skill.projectUsage) return pill;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{pill}</TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={6}
        className="z-50 max-w-[220px] rounded-xl border border-white/10 bg-neutral-900/95 px-3 py-2 text-xs text-neutral-300 shadow-xl backdrop-blur-md"
      >
        <p className={`mb-0.5 font-semibold ${config.textClass}`}>{config.label}</p>
        <p>{skill.projectUsage}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
    };
    const onLeave = () => setSpotlight((s) => ({ ...s, visible: false }));

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Group skills by category
  const grouped = CATEGORY_ORDER.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  // Collect any categories not in CATEGORY_ORDER
  const extraCategories = [...new Set(skills.map((s) => s.category))].filter(
    (c) => !CATEGORY_ORDER.includes(c)
  );
  for (const cat of extraCategories) {
    grouped[cat] = skills.filter((s) => s.category === cat);
  }

  const allCategories = [...CATEGORY_ORDER, ...extraCategories].filter(
    (cat) => grouped[cat]?.length > 0
  );

  return (
    <TooltipProvider delayDuration={200}>
      <section
        id="skills"
        ref={sectionRef}
        className="relative bg-zinc-950 py-24 px-4 overflow-hidden"
      >
        {/* Mouse spotlight */}
        {spotlight.visible && (
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${spotlight.x}px ${spotlight.y}px, rgba(139,92,246,0.06), transparent 60%)`,
            }}
          />
        )}

        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top/bottom fades */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-950 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3 block">
              Tech Stack
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tools of the trade
            </h2>
            <p className="text-neutral-400 max-w-xl">
              The technologies I reach for daily, and a few I&apos;m still getting cozy with.
              Hover a badge to see where I&apos;ve used it.
            </p>
          </motion.div>

          {skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-600">
              <span className="text-4xl mb-4">🛠️</span>
              <p>Skills coming soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {allCategories.map((category, catIdx) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: catIdx * 0.08 }}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {grouped[category].map((skill, i) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: catIdx * 0.06 + i * 0.04 }}
                      >
                        <SkillPill skill={skill} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Legend */}
          {skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center gap-4 text-xs text-neutral-500"
            >
              <span className="font-medium text-neutral-400">Proficiency:</span>
              {Object.entries(proficiencyConfig).map(([key, cfg]) => (
                <span key={key} className={`flex items-center gap-1.5 ${cfg.textClass}`}>
                  <span className={`inline-block h-2 w-2 rounded-full ring-1 ${cfg.ringClass}`} />
                  {cfg.label}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </TooltipProvider>
  );
}
