"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, MapPin, Zap, Leaf, CheckCircle2, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useIde } from "@/components/ide-context";
import { CodeBlock } from "@/components/code-block";

interface TimelineItem {
  year: string;
  event: string;
}

interface Profile {
  id: string;
  name: string;
  bio: string;
  background: string;
  education: string;
  location: string;
  focus: string;
  fuel: string;
  timeline: TimelineItem[];
  availableForHire: boolean;
  availableLabel: string;
  email: string;
  github: string;
  linkedin: string;
  ctaCopy: string;
  updatedAt: Date;
}

interface AboutSectionProps {
  profile: Profile | null;
}

const cardItems = [
  {
    key: "education" as const,
    label: "Education",
    icon: GraduationCap,
    color: "indigo",
  },
  {
    key: "location" as const,
    label: "Location",
    icon: MapPin,
    color: "violet",
  },
  {
    key: "focus" as const,
    label: "Currently Focused On",
    icon: Zap,
    color: "indigo",
  },
  {
    key: "fuel" as const,
    label: "Runs On",
    icon: Leaf,
    color: "violet",
  },
];

const markdownComponents: React.ComponentProps<typeof ReactMarkdown>["components"] = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-neutral-300">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300 transition-colors">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
  li: ({ children }) => <li className="text-neutral-300">{children}</li>,
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-indigo-300 text-sm font-mono">{children}</code>
  ),
  h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-semibold text-white mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold text-neutral-200 mb-1">{children}</h3>,
};

export function AboutSection({ profile }: AboutSectionProps) {
  const { getViewMode } = useIde();
  const [backgroundExpanded, setBackgroundExpanded] = useState(false);

  const timeline: TimelineItem[] = Array.isArray(profile?.timeline) ? profile.timeline : [];

  if (getViewMode("about") === "code") {
    return <CodeBlock section="about" profile={profile} />;
  }

  return (
    <section
      id="about"
      className="relative bg-transparent py-16 sm:py-24 px-4"
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3 block">
            About Me
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            The human behind the code
          </h2>

          {profile ? (
            <div className="text-neutral-400 text-lg leading-relaxed w-full">
              <ReactMarkdown components={markdownComponents}>{profile.bio}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-neutral-600 text-lg">Profile not configured yet.</p>
          )}
        </motion.div>

        {profile ? (
          <>
            {/* Background blurb */}
            {profile.background && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-10 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6"
              >
                <div className="relative">
                  <div
                    className={`text-neutral-300 leading-relaxed overflow-hidden transition-all duration-500 ${
                      backgroundExpanded ? "max-h-[2000px]" : "max-h-[4.5rem]"
                    }`}
                  >
                    <ReactMarkdown components={markdownComponents}>{profile.background}</ReactMarkdown>
                  </div>

                  {/* Gradient fade when collapsed */}
                  {!backgroundExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-neutral-900/50 to-transparent pointer-events-none" />
                  )}
                </div>

                <button
                  onClick={() => setBackgroundExpanded((v) => !v)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>{backgroundExpanded ? "See less" : "See more"}</span>
                  <motion.span
                    animate={{ rotate: backgroundExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </motion.span>
                </button>
              </motion.div>
            )}

            {/* 2×2 info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {cardItems.map(({ key, label, icon: Icon, color }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 hover:border-neutral-700 hover:bg-neutral-900/70 transition-all"
                >
                  <div className={`inline-flex rounded-lg p-2 mb-3 ${color === "indigo" ? "bg-indigo-500/10 text-indigo-400" : "bg-violet-500/10 text-violet-400"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">{label}</p>
                  <p className="text-white font-medium">{profile[key] || "—"}</p>
                </motion.div>
              ))}
            </div>

            {/* Timeline */}
            {timeline.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-12"
              >
                <h3 className="text-lg font-semibold text-white mb-6">Timeline</h3>
                <div className="relative pl-6">
                  {/* Vertical line */}
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/40 via-violet-500/20 to-transparent" />

                  <div className="flex flex-col gap-6">
                    {timeline.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 * i }}
                        className="relative"
                      >
                        {/* Dot */}
                        <div className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-500/30" />
                        <span className="text-xs font-mono text-indigo-400 mb-0.5 block">{item.year}</span>
                        <p className="text-neutral-300">{item.event}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-2"
            >
              <span className="relative flex h-2.5 w-2.5">
                {profile.availableForHire ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-500" />
                )}
              </span>
              <span className="text-sm text-neutral-300">{profile.availableLabel}</span>
              {profile.availableForHire && (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
              )}
            </motion.div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-600">
            <span className="text-4xl mb-4">😴</span>
            <p>Profile coming soon...</p>
          </div>
        )}
      </div>
    </section>
  );
}
