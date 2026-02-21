"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, MapPin, Zap, Coffee, CheckCircle2 } from "lucide-react";

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
    icon: Coffee,
    color: "violet",
  },
];

export function AboutSection({ profile }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
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

  const timeline: TimelineItem[] = Array.isArray(profile?.timeline) ? profile.timeline : [];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-zinc-950 py-24 px-4 overflow-hidden"
    >
      {/* Mouse spotlight */}
      {spotlight.visible && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${spotlight.x}px ${spotlight.y}px, rgba(99,102,241,0.06), transparent 60%)`,
          }}
        />
      )}

      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top fade */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-950 to-transparent" />
      {/* Bottom fade */}
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
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3 block">
            About Me
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The human behind the code
          </h2>

          {profile ? (
            <p className="text-neutral-400 text-lg leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
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
                className="mb-10 rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <p className="text-neutral-300 leading-relaxed">{profile.background}</p>
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
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
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
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2"
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
