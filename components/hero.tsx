// components/hero.tsx
"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { FlipWords } from "@/components/ui/flip-words";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { useIde } from "@/components/ide-context";

interface Profile {
  name: string | null;
  bio: string | null;
  education: string | null;
  location: string | null;
  focus: string | null;
  fuel: string | null;
  availableForHire: boolean;
  availableLabel: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
}

interface HeroProps {
  profile: Profile | null;
}

const words = [
  "Fullstack Dev",
  "Professional Oversleeper",
  "Bug's Worst Nightmare",
  "TypeScript Enthusiast",
  "Matcha Powered",
];

export function Hero({ profile }: HeroProps) {
  const { getViewMode } = useIde();
  const viewMode = getViewMode("home");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="home" className="px-6 py-10 md:px-10 md:py-14">
      {viewMode === "code" ? (
        <CodeBlock section="hero" profile={profile} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12"
        >
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10 md:h-28 md:w-28">
              <Image
                src="/gunnie.webp"
                alt="SleepyLeo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-600">
              {profile?.location ?? "Developer"}
            </p>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              {profile?.name ?? "SleepyLeo"}
            </h1>
            <div className="mb-4 text-sm text-neutral-500">
              I&apos;m a{" "}
              <FlipWords
                words={words}
                className="font-semibold text-indigo-400"
              />
            </div>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-neutral-500">
              {profile?.bio ??
                "Building things with TypeScript, Next.js and an unreasonable amount of matcha."}
            </p>

            {/* Stats */}
            <div className="mb-6 flex gap-6">
              {[
                { value: "10+", label: "Projects Built" },
                { value: "∞",   label: "Cups of Matcha" },
                { value: "Most", label: "Bugs Fixed" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-neutral-600">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => scrollTo("projects")}
                className="bg-indigo-600 text-white hover:bg-indigo-500"
              >
                View Projects <ArrowRight size={14} className="ml-1" />
              </Button>
              {profile?.github && (
                <Button variant="outline" asChild>
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <Github size={14} className="mr-1" /> GitHub
                  </a>
                </Button>
              )}
              {profile?.linkedin && (
                <Button variant="outline" asChild>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin size={14} className="mr-1" /> LinkedIn
                  </a>
                </Button>
              )}
            </div>

            {/* Availability */}
            {profile?.availableForHire && (
              <div className="mt-4 inline-flex items-center gap-1.5 rounded border border-green-900 bg-green-950/30 px-2.5 py-1 text-[11px] text-green-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                {profile.availableLabel ?? "Available for opportunities"}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
}
