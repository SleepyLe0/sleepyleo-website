"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { FlipWords } from "@/components/ui/flip-words";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Coffee, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const words = ["Fullstack Dev", "Professional Oversleeper", "Bug's Worst Nightmare", "TypeScript Enthusiast", "Coffee Powered"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section based on scroll position
      const sections = ["hero", "projects", "server-health", "intern"];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      // For hero, scroll to top. For other sections, scroll to their start
      if (id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setMobileMenuOpen(false);
  };
  
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <AuroraBackground id="hero" className="scroll-mt-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        {/* Greeting Badge */}
        <motion.div
          variants={itemVariants}
          className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
        >
          <span className="text-sm text-neutral-300">👋 Welcome to my corner of the internet</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-7xl font-bold dark:text-white text-center"
        >
          Hey, I&apos;m <span className="text-indigo-500 bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text">SleepyLeo</span>
        </motion.h1>

        {/* Flip Words */}
        <motion.div
          variants={itemVariants}
          className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4 flex items-center justify-center"
        >
          I'm a <FlipWords words={words} className="text-indigo-400 font-normal" />
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-neutral-600 dark:text-neutral-400 text-center max-w-2xl text-sm md:text-base leading-relaxed"
        >
          Building things that work (most of the time) and debugging code that shouldn't have broken in the first place.
          Armed with TypeScript and an unhealthy amount of caffeine.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mt-6"
        >
          <Button onClick={() => scrollToSection("#projects")} size="lg" className="group bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300">
            View My Work
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button onClick={() => scrollToSection("#intern")} variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
            <Coffee className="mr-2 h-4 w-4" />
            Meet My Intern
          </Button>
          <Button asChild variant="ghost" size="lg" className="hover:bg-white/10 transition-all duration-300">
            <a href="https://github.com/SleepyLe0" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Scroll down"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.button>
    </AuroraBackground>
  );
}

