"use client";

import { motion } from "motion/react";
import { Mail, Github, Linkedin, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useIde } from "@/components/ide-context";
import { CodeBlock } from "@/components/code-block";

interface Profile {
  id: string;
  name: string;
  bio: string;
  background: string;
  education: string;
  location: string;
  focus: string;
  fuel: string;
  timeline: { year: string; event: string }[];
  availableForHire: boolean;
  availableLabel: string;
  email: string;
  github: string;
  linkedin: string;
  ctaCopy: string;
  updatedAt: Date;
}

interface ContactSectionProps {
  profile: Profile | null;
}

const defaultLinks = [
  {
    key: "email" as const,
    label: "Email",
    icon: Mail,
    colorClass: "group-hover:border-indigo-500/50 group-hover:bg-indigo-900/10",
    iconClass: "bg-indigo-500/20 text-indigo-400 group-hover:text-indigo-300",
    arrowClass: "text-indigo-400",
    href: (p: Profile) => `mailto:${p.email}`,
    display: (p: Profile) => p.email || "—",
  },
  {
    key: "github" as const,
    label: "GitHub",
    icon: Github,
    colorClass: "group-hover:border-violet-500/50 group-hover:bg-violet-900/10",
    iconClass: "bg-violet-500/20 text-violet-400 group-hover:text-violet-300",
    arrowClass: "text-violet-400",
    href: (p: Profile) => `https://github.com/${p.github}`,
    display: (p: Profile) => `github.com/${p.github}`,
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    icon: Linkedin,
    colorClass: "group-hover:border-sky-500/50 group-hover:bg-sky-900/10",
    iconClass: "bg-sky-500/20 text-sky-400 group-hover:text-sky-300",
    arrowClass: "text-sky-400",
    href: (p: Profile) => `https://linkedin.com/in/${p.linkedin}`,
    display: (p: Profile) => `linkedin.com/in/${p.linkedin}`,
  },
];

export function ContactSection({ profile }: ContactSectionProps) {
  const { getViewMode } = useIde();

  if (getViewMode("contact") === "code") {
    return <CodeBlock section="contact" profile={profile} />;
  }

  return (
    <section
      id="contact"
      className="relative bg-transparent py-16 sm:py-24 px-4"
    >
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3 block">
            Contact
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            {profile?.ctaCopy || "Let's build something."}
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl">
            Whether it&apos;s a project collab, job opportunity, or just to say hi — my inbox is open.
          </p>
        </motion.div>

        {/* Availability badge */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-2"
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
        )}

        {/* Link cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {defaultLinks.map(({ key, label, icon: Icon, colorClass, iconClass, arrowClass, href, display }, i) => {
            const link = profile ? href(profile) : "#";
            const text = profile ? display(profile) : "—";
            const isDisabled = !profile || !text || text === "—";

            return (
              <motion.a
                key={key}
                href={isDisabled ? undefined : link}
                target={key !== "email" ? "_blank" : undefined}
                rel={key !== "email" ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className={`group flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all ${isDisabled ? "cursor-default opacity-50" : "cursor-pointer"} ${colorClass}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`inline-flex rounded-xl p-3 transition-colors ${iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {!isDisabled && (
                    <ArrowUpRight className={`h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${arrowClass}`} />
                  )}
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-white font-medium text-sm truncate">{text}</p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
