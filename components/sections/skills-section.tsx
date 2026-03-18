"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useIde } from "@/components/ide-context";
import { CodeBlock } from "@/components/code-block";

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

const DOTS_MAP: Record<string, number> = {
  daily_driver: 5,
  comfortable:  3,
  learning:     1,
};

function SkillDots({ skill }: { skill: { name: string; proficiency: string; projectUsage?: string | null } }) {
  const filled = DOTS_MAP[skill.proficiency] ?? 2;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex cursor-default items-center gap-2">
          <span className="w-24 flex-shrink-0 text-xs text-neutral-400">{skill.name}</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i < filled ? "bg-indigo-500" : "border border-neutral-700"
                }`}
              />
            ))}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {skill.projectUsage ?? skill.proficiency}
      </TooltipContent>
    </Tooltip>
  );
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const { getViewMode } = useIde();

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
      <section id="skills">
        {getViewMode("skills") === "code" ? (
          <CodeBlock section="skills" skills={skills} />
        ) : (
        <div className="relative bg-transparent py-16 sm:py-24 px-4">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Tools of the trade
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl">
              The technologies I reach for daily, and a few I&apos;m still getting cozy with.
              Hover a skill to see where I&apos;ve used it.
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
                  <div className="flex flex-col gap-2">
                    {grouped[category].map((skill, i) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: catIdx * 0.06 + i * 0.04 }}
                      >
                        <SkillDots skill={skill} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Legend */}
          {skills.length > 0 && (
            <div className="mt-6 flex items-center gap-4 text-[10px] text-neutral-600 font-mono">
              <span>●●●●● daily driver</span>
              <span>●●●○○ comfortable</span>
              <span>●○○○○ learning</span>
            </div>
          )}
        </div>
        </div>
        )}
      </section>
    </TooltipProvider>
  );
}
