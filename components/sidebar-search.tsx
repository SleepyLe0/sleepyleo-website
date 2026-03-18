// components/sidebar-search.tsx
"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useIde, SECTIONS, SectionId } from "@/components/ide-context";

interface Project {
  id: string;
  name: string;
  description: string | null;
  techStack: string[];
  status: string;
  language: string | null;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
}

interface Profile {
  name?: string | null;
  bio?: string | null;
  background?: string | null;
  education?: string | null;
  location?: string | null;
  focus?: string | null;
  fuel?: string | null;
  email?: string | null;
  github?: string | null;
  linkedin?: string | null;
  ctaCopy?: string | null;
  timeline?: { year: string; event: string }[];
}

interface SidebarSearchProps {
  projects: Project[];
  skills: Skill[];
  profile: Profile | null;
}

type ResultType = "project" | "skill" | "about" | "contact" | "home" | "page";

interface SearchResult {
  id: string;
  type: ResultType;
  label: string;
  sub: string;
  section: SectionId;
  matchText: string;
}

const EASTER_EGGS: Record<string, { label: string; sub: string; icon: string }> = {
  matcha:  { label: "Critical dependency found",    sub: "matcha.ts — 73% of developer",   icon: "🍵" },
  bug:     { label: "0 bugs found. Obviously.",     sub: "trust me bro",                    icon: "🐛" },
  sleep:   { label: "Core feature, not a bug",      sub: "sleep() — deeply integrated",     icon: "💤" },
  coffee:  { label: "Inferior dependency detected", sub: "consider switching to matcha()",  icon: "☕" },
  error:   { label: "Error: no errors found",       sub: "which is suspicious",             icon: "⚠️" },
};

// Static text content per section for full-content search
const STATIC_CONTENT: { section: SectionId; label: string; text: string }[] = [
  { section: "home",     label: "Home",           text: "fullstack developer portfolio sleepyleo hero landing" },
  { section: "projects", label: "Projects",        text: "projects open source github repos code work" },
  { section: "about",    label: "About",           text: "about me background story journey timeline education kmutt" },
  { section: "skills",   label: "Skills",          text: "skills technologies stack tools languages frameworks" },
  { section: "contact",  label: "Contact",         text: "contact email hire reach out linkedin social" },
  { section: "dogbreed", label: "Dog Breed Quiz",  text: "dog breed quiz french bulldog secret hidden fun easter egg" },
];

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-indigo-400">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

const GROUP_ORDER: ResultType[] = ["home", "about", "contact", "project", "skill", "page"];
const GROUP_LABELS: Record<ResultType, string> = {
  home:    "HOME",
  about:   "ABOUT",
  contact: "CONTACT",
  project: "PROJECTS",
  skill:   "SKILLS",
  page:    "PAGES",
};

export function SidebarSearch({ projects, skills, profile }: SidebarSearchProps) {
  const { navigateTo } = useIde();
  const [query, setQuery] = useState("");

  const easterEgg = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EASTER_EGGS[q] ?? null;
  }, [query]);

  // Build the full search index from all content
  const index = useMemo((): SearchResult[] => {
    const items: SearchResult[] = [];

    // Profile — home fields
    if (profile?.name)      items.push({ id: "p-name",     type: "home",    label: profile.name,      sub: "Name",              section: "home",    matchText: profile.name });
    if (profile?.bio)       items.push({ id: "p-bio",      type: "about",   label: "Bio",             sub: profile.bio,         section: "about",   matchText: profile.bio });
    if (profile?.background)items.push({ id: "p-bg",       type: "about",   label: "Background",      sub: profile.background,  section: "about",   matchText: profile.background });
    if (profile?.education) items.push({ id: "p-edu",      type: "about",   label: "Education",       sub: profile.education,   section: "about",   matchText: profile.education });
    if (profile?.location)  items.push({ id: "p-loc",      type: "about",   label: "Location",        sub: profile.location,    section: "about",   matchText: profile.location });
    if (profile?.focus)     items.push({ id: "p-focus",    type: "about",   label: "Focus",           sub: profile.focus,       section: "about",   matchText: profile.focus });
    if (profile?.fuel)      items.push({ id: "p-fuel",     type: "about",   label: "Fuel",            sub: profile.fuel,        section: "about",   matchText: profile.fuel });
    if (profile?.ctaCopy)   items.push({ id: "p-cta",      type: "contact", label: "CTA",             sub: profile.ctaCopy,     section: "contact", matchText: profile.ctaCopy });
    if (profile?.email)     items.push({ id: "p-email",    type: "contact", label: "Email",           sub: profile.email,       section: "contact", matchText: profile.email });
    if (profile?.github)    items.push({ id: "p-github",   type: "contact", label: "GitHub",          sub: profile.github,      section: "contact", matchText: profile.github });
    if (profile?.linkedin)  items.push({ id: "p-linkedin", type: "contact", label: "LinkedIn",        sub: profile.linkedin,    section: "contact", matchText: profile.linkedin });

    // Timeline entries
    for (const entry of profile?.timeline ?? []) {
      items.push({
        id: `tl-${entry.year}`,
        type: "about",
        label: entry.year,
        sub: entry.event,
        section: "about",
        matchText: `${entry.year} ${entry.event}`,
      });
    }

    // Projects
    for (const p of projects) {
      items.push({
        id: `pr-${p.id}`,
        type: "project",
        label: p.name,
        sub: p.description ?? p.techStack.join(", "),
        section: "projects",
        matchText: [p.name, p.description, ...p.techStack, p.status, p.language].filter(Boolean).join(" "),
      });
    }

    // Skills
    for (const s of skills) {
      items.push({
        id: `sk-${s.id}`,
        type: "skill",
        label: s.name,
        sub: `${s.category} · ${s.proficiency}`,
        section: "skills",
        matchText: `${s.name} ${s.category} ${s.proficiency}`,
      });
    }

    // Static section content
    for (const sec of SECTIONS) {
      const extra = STATIC_CONTENT.find((c) => c.section === sec.id);
      items.push({
        id: `sec-${sec.id}`,
        type: "page",
        label: sec.label,
        sub: sec.path,
        section: sec.id,
        matchText: `${sec.label} ${sec.file} ${extra?.text ?? ""}`,
      });
    }

    return items;
  }, [projects, skills, profile]);

  const results = useMemo((): SearchResult[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    // Deduplicate by id
    const seen = new Set<string>();
    return index.filter((item) => {
      if (seen.has(item.id)) return false;
      if (item.matchText.toLowerCase().includes(q)) {
        seen.add(item.id);
        return true;
      }
      return false;
    });
  }, [query, index]);

  function handleChange(val: string) {
    setQuery(val);
    if (val.trim().toLowerCase() === "hire") navigateTo("contact");
  }

  return (
    <aside className="flex h-full w-[220px] flex-shrink-0 flex-col border-r border-neutral-800 bg-[#0d0d0d]">
      {/* Header */}
      <div className="border-b border-neutral-800 px-3 py-2 font-mono text-[9px] uppercase tracking-[2.5px] text-neutral-600">
        Search
      </div>

      {/* Search input */}
      <div className="border-b border-neutral-800 p-2">
        <div className="relative">
          <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-600" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search everything..."
            className="w-full rounded border border-neutral-700 bg-neutral-900 py-1.5 pl-6 pr-2 font-mono text-[11px] text-neutral-300 placeholder-neutral-600 outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {/* Easter egg */}
        {easterEgg && (
          <div className="m-2 rounded border border-green-900/50 bg-green-950/30 p-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{easterEgg.icon}</span>
              <span className="font-mono text-[10px] text-green-400">{easterEgg.label}</span>
            </div>
            <div className="mt-0.5 font-mono text-[9px] text-green-700">{easterEgg.sub}</div>
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="px-3 py-4 space-y-1">
            <p className="font-mono text-[9px] text-neutral-700">{`// searches everything:`}</p>
            <p className="font-mono text-[9px] text-neutral-800">bio · timeline · projects</p>
            <p className="font-mono text-[9px] text-neutral-800">skills · contact · pages</p>
          </div>
        )}

        {/* Results grouped */}
        {query && results.length > 0 && (
          <div className="py-1">
            {GROUP_ORDER.map((type) => {
              const group = results.filter((r) => r.type === type);
              if (!group.length) return null;
              return (
                <div key={type}>
                  <div className="px-3 py-1.5 font-mono text-[8px] uppercase tracking-[2px] text-neutral-700">
                    {GROUP_LABELS[type]}
                  </div>
                  {group.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => navigateTo(r.section)}
                      className="flex w-full flex-col items-start px-3 py-1.5 text-left transition-colors hover:bg-neutral-800/50"
                    >
                      <span className="font-mono text-[11px] text-neutral-300">
                        {highlight(r.label, query)}
                      </span>
                      <span className="font-mono text-[9px] text-neutral-600 truncate w-full">
                        {highlight(r.sub.slice(0, 60), query)}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && !easterEgg && (
          <div className="px-3 py-4">
            <p className="font-mono text-[9px] text-neutral-700">no results for &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </div>
    </aside>
  );
}
