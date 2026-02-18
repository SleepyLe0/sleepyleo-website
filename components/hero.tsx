"use client";

import { motion } from "motion/react";
import { FlipWords } from "@/components/ui/flip-words";
import { Button } from "@/components/ui/button";
import { ParticleField } from "@/components/ui/particle-field";
import { ArrowRight, Github, Linkedin, ChevronDown } from "lucide-react";

const words = [
  "Fullstack Dev",
  "Professional Oversleeper",
  "Bug's Worst Nightmare",
  "TypeScript Enthusiast",
  "Coffee Powered",
];

// Stagger container — no ease needed here
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.4 },
  },
};

// Item variants without ease — ease goes on the motion element's `transition` prop
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const itemTransition = { duration: 0.7, ease: "easeOut" as const };

export function Hero() {
  const scrollToSection = (id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex h-screen min-h-[700px] flex-col items-center justify-center overflow-hidden bg-zinc-950"
    >
      {/* === Layer 1: Particle Field === */}
      <ParticleField className="z-0" count={90} connectionDistance={130} />

      {/* === Layer 2: Radial glow blobs === */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[80px]" />
      </div>

      {/* === Layer 3: Noise/grain texture overlay === */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* === Layer 4: Main content === */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-6 px-4 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} transition={itemTransition}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-neutral-400 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={itemVariants}
          transition={itemTransition}
          className="text-5xl font-bold tracking-tight md:text-8xl"
        >
          <span className="block text-neutral-400 text-2xl md:text-3xl font-normal mb-2 tracking-widest uppercase">
            Hey, I&apos;m
          </span>
          <span className="relative inline-block">
            {/* Glow behind name */}
            <span
              aria-hidden="true"
              className="absolute inset-0 blur-2xl opacity-60 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent select-none"
            >
              SleepyLeo
            </span>
            <span className="relative bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              SleepyLeo
            </span>
          </span>
        </motion.h1>

        {/* Flip Words */}
        <motion.div
          variants={itemVariants}
          transition={itemTransition}
          className="flex items-center gap-2 text-lg md:text-2xl text-neutral-400"
        >
          <span>I&apos;m a</span>
          <FlipWords
            words={words}
            className="text-indigo-300 font-semibold"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          transition={itemTransition}
          className="max-w-xl text-sm md:text-base leading-relaxed text-neutral-500"
        >
          Building things that work{" "}
          <span className="text-neutral-400">(most of the time)</span> and
          debugging code that shouldn&apos;t have broken in the first place.
          Armed with TypeScript and an unhealthy amount of caffeine.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          transition={itemTransition}
          className="flex flex-col sm:flex-row items-center gap-3 mt-2"
        >
          <Button
            onClick={() => scrollToSection("projects")}
            size="lg"
            className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 px-8"
          >
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 px-5"
            >
              <a
                href="https://github.com/SleepyLe0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
                <span className="ml-2">GitHub</span>
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 px-5"
            >
              <a
                href="https://www.linkedin.com/in/kundids-khawmeesri-90814526a/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
                <span className="ml-2">LinkedIn</span>
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={itemVariants}
          transition={itemTransition}
          className="flex items-center gap-8 mt-4 text-center"
        >
          {[
            { label: "Projects Built", value: "10+" },
            { label: "Cups of Coffee", value: "∞" },
            { label: "Bugs Fixed", value: "Most" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-neutral-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* === Scroll Indicator === */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-1.5 text-neutral-600 hover:text-neutral-300 transition-colors cursor-pointer group"
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="group-hover:text-indigo-400 transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.button>

      {/* Bottom fade — must match projects section bg (zinc-950) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-48 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
    </section>
  );
}
