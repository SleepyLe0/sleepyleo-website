"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Cat, Home, FolderGit2, Activity, Menu, X, LogIn } from "lucide-react";

const navItems = [
  { href: "#hero", label: "Home", icon: Home },
  { href: "#projects", label: "Projects", icon: FolderGit2 },
  { href: "#server-health", label: "Server Health", icon: Activity },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section based on scroll position
      const sections = ["hero", "projects", "server-health"];
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

  /* Navbar visibility is now handled by the layout structure */

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "flex items-center gap-1 rounded-full border border-white/10 px-2 py-2 transition-all duration-300",
          scrolled
            ? "bg-neutral-900/80 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-neutral-900/60 backdrop-blur-md"
        )}
      >
        {/* Logo */}
        <button
          onClick={() => scrollToSection("#hero")}
          className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-white/10"
        >
          <Cat className="h-5 w-5 text-indigo-400" />
          <span className="font-semibold text-sm hidden sm:inline">SleepyLeo</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

        {/* Nav Items - Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all duration-200",
                  isActive
                    ? "bg-white/15 text-white font-medium"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

        {/* Admin Login Button */}
        <Link
          href="/admin"
          className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full text-neutral-500 hover:text-white hover:bg-white/10 transition-colors ml-1"
          title="Admin Login"
        >
          <LogIn className="h-4 w-4" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full mt-2 left-4 right-4 sm:hidden">
          <div className="bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 w-full text-left",
                    isActive
                      ? "bg-white/10 text-white font-medium"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 w-full text-left text-neutral-400 hover:text-white hover:bg-white/5 mt-1"
            >
              <LogIn className="h-5 w-5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

