# IDE Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current indigo-glow particle aesthetic with a VSCode/IDE-inspired shell — file explorer sidebar, editor tabs, breadcrumb toolbar with Preview/Code toggle, and indigo status bar — while keeping all content, CMS data flow, and personality intact.

**Architecture:** `IdeShell` is a `"use client"` component wrapping the homepage content, receiving `profile` data from a server component in `page.tsx`. An `IdeContext` React context manages active section, open tabs, and per-section view mode (preview vs. code). On desktop (`lg:`) the full IDE chrome renders; below `lg:` a compact top bar + bottom tab bar replaces it. All section data is already fetched in `page.tsx` and passed as props — no new DB queries.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion (motion/react), Radix UI (Popover, Tooltip), Lucide React, Geist Mono font (already loaded via root layout)

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `components/ide-context.tsx` | React context + types: active section, open tabs, per-section view mode map, dispatch functions |
| `components/ide-shell.tsx` | Outer wrapper: wires context, renders title bar + activity bar + explorer + tabs + toolbar + status bar on desktop; top bar + bottom tabs on mobile |
| `components/ide-explorer.tsx` | File tree UI: nested folders, active file highlight, matcha popover easter egg |
| `components/ide-tabs.tsx` | Accumulating tab bar with close buttons, active indigo top border |
| `components/ide-toolbar.tsx` | Breadcrumb + ViewToggle pill, reads/dispatches to IdeContext |
| `components/ide-statusbar.tsx` | Bottom indigo bar: branch, filename, language, availability label |
| `components/view-toggle.tsx` | `⊞ Preview / </> Code` pill, accepts `value` + `onChange` |
| `components/code-block.tsx` | Serializes section data props into syntax-highlighted TypeScript code string |
| `components/project-row.tsx` | Desktop list-row for a single project (name, desc, lang, stars, meme overlay on hover) |

### Modified files
| File | Change |
|---|---|
| `app/(website)/layout.tsx` | Remove `<Navbar />` + `<PageTransition>`, render `<main id="main-content">{children}</main>` |
| `app/(website)/page.tsx` | Add `HeroData` async wrapper (profile → Hero); wrap all content in `<IdeShell>` |
| `components/hero.tsx` | Remove ParticleField, blob, glow, gradient fade; accept `profile` prop; `id="home"` |
| `components/sections/projects-section.tsx` | Remove bg effects; use `ProjectRow` at `lg:`, `ProjectCard` below |
| `components/project-card.tsx` | Remove spotlight/glow; add meme overlay on hover (desktop) and long-press (mobile) |
| `components/sections/skills-section.tsx` | Replace proficiency pills with 5-dot mastery rating |
| `components/sections/about-section.tsx` | Remove mouse spotlight, glow blobs, dot grid |
| `components/sections/contact-section.tsx` | Remove mouse spotlight, glow blobs, dot grid |

### Deleted files
- `components/navbar.tsx`
- `components/page-transition.tsx`
- `components/ui/particle-field.tsx`

---

## Task 1: IdeContext + shared types

**Files:**
- Create: `components/ide-context.tsx`

- [ ] **Step 1: Create context file**

```tsx
// components/ide-context.tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type SectionId = "home" | "projects" | "about" | "skills" | "contact";
export type ViewMode = "preview" | "code";

export interface SectionMeta {
  id: SectionId;
  file: string;        // e.g. "hero.tsx"
  path: string;        // e.g. "pages/hero.tsx"
  label: string;       // e.g. "Home"
}

export const SECTIONS: SectionMeta[] = [
  { id: "home",     file: "hero.tsx",     path: "pages/hero.tsx",     label: "Home"    },
  { id: "projects", file: "projects.tsx", path: "pages/projects.tsx", label: "Projects"},
  { id: "about",    file: "about.tsx",    path: "pages/about.tsx",    label: "About"   },
  { id: "skills",   file: "skills.tsx",   path: "pages/skills.tsx",   label: "Skills"  },
  { id: "contact",  file: "contact.tsx",  path: "pages/contact.tsx",  label: "Contact" },
];

interface IdeState {
  activeSection: SectionId;
  openTabs: SectionId[];
  viewModes: Map<SectionId, ViewMode>;
  setActiveSection: (id: SectionId) => void;
  openTab: (id: SectionId) => void;
  closeTab: (id: SectionId) => void;
  toggleView: (id: SectionId) => void;
  getViewMode: (id: SectionId) => ViewMode;
  navigateTo: (id: SectionId) => void;
}

const IdeContext = createContext<IdeState | null>(null);

export function IdeProvider({
  children,
  onNavigate,
}: {
  children: ReactNode;
  onNavigate: (id: SectionId) => void;
}) {
  const [activeSection, setActiveSectionState] = useState<SectionId>("home");
  const [openTabs, setOpenTabs] = useState<SectionId[]>(["home"]);
  const [viewModes, setViewModes] = useState<Map<SectionId, ViewMode>>(new Map());

  const setActiveSection = useCallback((id: SectionId) => {
    setActiveSectionState(id);
    setOpenTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const openTab = useCallback((id: SectionId) => {
    setOpenTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setActiveSectionState(id);
  }, []);

  const closeTab = useCallback((id: SectionId) => {
    setOpenTabs((prev) => {
      const next = prev.filter((t) => t !== id);
      return next.length === 0 ? ["home"] : next;
    });
    setActiveSectionState((prev) => {
      if (prev !== id) return prev;
      const remaining = openTabs.filter((t) => t !== id);
      return remaining[remaining.length - 1] ?? "home";
    });
  }, [openTabs]);

  const toggleView = useCallback((id: SectionId) => {
    setViewModes((prev) => {
      const next = new Map(prev);
      next.set(id, prev.get(id) === "code" ? "preview" : "code");
      return next;
    });
  }, []);

  const getViewMode = useCallback(
    (id: SectionId): ViewMode => viewModes.get(id) ?? "preview",
    [viewModes]
  );

  const navigateTo = useCallback(
    (id: SectionId) => {
      openTab(id);
      onNavigate(id);
    },
    [openTab, onNavigate]
  );

  return (
    <IdeContext.Provider value={{
      activeSection, openTabs, viewModes,
      setActiveSection, openTab, closeTab,
      toggleView, getViewMode, navigateTo,
    }}>
      {children}
    </IdeContext.Provider>
  );
}

export function useIde() {
  const ctx = useContext(IdeContext);
  if (!ctx) throw new Error("useIde must be used inside IdeProvider");
  return ctx;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
docker exec sleepyleo-app-1 bunx tsc --noEmit 2>&1 | head -20
```
Expected: no errors on this file (others may have pre-existing ones).

- [ ] **Step 3: Commit**

```bash
git add components/ide-context.tsx
git commit -m "feat: add IdeContext with section navigation and view-mode state"
```

---

## Task 2: ViewToggle + CodeBlock

**Files:**
- Create: `components/view-toggle.tsx`
- Create: `components/code-block.tsx`

- [ ] **Step 1: Create ViewToggle**

```tsx
// components/view-toggle.tsx
"use client";

import { ViewMode } from "@/components/ide-context";

interface ViewToggleProps {
  value: ViewMode;
  onChange: () => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center overflow-hidden rounded border border-neutral-800 bg-neutral-900 text-[10px]">
      <button
        onClick={onChange}
        className={`flex items-center gap-1 px-2.5 py-1 transition-colors ${
          value === "preview"
            ? "bg-indigo-950 text-indigo-400"
            : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        <span>⊞</span> Preview
      </button>
      <div className="h-3.5 w-px bg-neutral-800" />
      <button
        onClick={onChange}
        className={`flex items-center gap-1 px-2.5 py-1 font-mono transition-colors ${
          value === "code"
            ? "bg-indigo-950 text-indigo-400"
            : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        &lt;/&gt; Code
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create CodeBlock — types + serializers**

```tsx
// components/code-block.tsx
"use client";

import { useMemo } from "react";

// ── Types (mirror Prisma shapes passed as props) ──────────────────────────

interface ProfileData {
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

interface ProjectData {
  name: string;
  status: string;
  techStack: string[];
  stars?: number | null;
  forks?: number | null;
  language?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
}

interface SkillData {
  name: string;
  category: string;
  proficiency: string;
}

type SectionCodeProps =
  | { section: "hero";     profile: ProfileData | null }
  | { section: "projects"; projects: ProjectData[] }
  | { section: "about";    profile: ProfileData | null }
  | { section: "skills";   skills: SkillData[] }
  | { section: "contact";  profile: ProfileData | null };

// ── Serializers ──────────────────────────────────────────────────────────

function s(v: string | null | undefined) {
  return v ? `"${v}"` : `null`;
}

function serializeHero(profile: ProfileData | null): string {
  const p = profile;
  // role is derived from the FlipWords list — use focus field as the closest CMS proxy
  const role = p?.focus ?? "Fullstack Developer";
  return `// ── hero.tsx ─────────────────────────────────
// @desc  ${p?.name ?? "SleepyLeo"} — portfolio hero

const dev = {
  name:      ${s(p?.name)},
  role:      ${s(role)},
  location:  ${s(p?.location)},
  fuel:      ${s(p?.fuel)},
  available: ${p?.availableForHire ?? false},
} satisfies Developer

export default function Hero() {
  return <HeroSection data={dev} />
}

// 🍵 matcha-powered`;
}

function serializeProjects(projects: ProjectData[]): string {
  const items = projects
    .slice(0, 8)
    .map((p) =>
      `  {\n    name:     ${s(p.name)},\n    status:   ${s(p.status)},\n    stack:    [${p.techStack.map(s).join(", ")}],\n    stars:    ${p.stars ?? 0},\n    language: ${s(p.language)},\n  }`
    )
    .join(",\n");
  return `// ── projects.tsx ─────────────────────────────
// @desc  ${projects.length} projects synced from GitHub

const projects: Project[] = [
${items}
]

export default function Projects() {
  return <ProjectsSection data={projects} />
}`;
}

function serializeAbout(profile: ProfileData | null): string {
  const p = profile;
  return `// ── about.tsx ────────────────────────────────
// @desc  The human behind the code

const profile = {
  bio:       ${s(p?.bio?.slice(0, 60)?.concat("..."))},
  education: ${s(p?.education)},
  location:  ${s(p?.location)},
  focus:     ${s(p?.focus)},
  fuel:      ${s(p?.fuel)},
} satisfies Profile

export default function About() {
  return <AboutSection data={profile} />
}`;
}

function serializeSkills(skills: SkillData[]): string {
  const items = skills
    .slice(0, 10)
    .map((sk) =>
      `  { name: ${s(sk.name)}, category: ${s(sk.category)}, level: ${s(sk.proficiency)} }`
    )
    .join(",\n");
  return `// ── skills.tsx ───────────────────────────────
// @desc  Tools of the trade (${skills.length} skills)

const skills: Skill[] = [
${items},
  // ...${Math.max(0, skills.length - 10)} more
]

export default function Skills() {
  return <SkillsSection data={skills} />
}`;
}

function serializeContact(profile: ProfileData | null): string {
  const p = profile;
  return `// ── contact.tsx ──────────────────────────────
// @desc  Let's build something

export const links = {
  email:    ${s(p?.email)},
  github:   ${s(p?.github)},
  linkedin: ${s(p?.linkedin)},
} as const

export const available = ${p?.availableForHire ?? false}
export const label     = ${s(p?.availableLabel)}`;
}

// ── Token renderer ───────────────────────────────────────────────────────

type Token = { type: "kw" | "str" | "cm" | "prop" | "fn" | "num" | "plain"; text: string };

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  const patterns: [string, Token["type"]][] = [
    ["(//[^\n]*)", "cm"],
    ["(\"[^\"]*\")", "str"],
    ["\\b(const|export|default|function|return|true|false|null|satisfies|as)\\b", "kw"],
    ["\\b([A-Z][a-zA-Z]+)(?=\\()", "fn"],
    ["\\b(\\d+)\\b", "num"],
    ["([a-zA-Z_][a-zA-Z0-9_]*)(?=\\s*:)", "prop"],
  ];
  let rest = line;
  while (rest.length > 0) {
    let matched = false;
    for (const [pat, type] of patterns) {
      const m = rest.match(new RegExp("^" + pat));
      if (m) {
        tokens.push({ type, text: m[0] });
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      const last = tokens[tokens.length - 1];
      if (last?.type === "plain") last.text += rest[0];
      else tokens.push({ type: "plain", text: rest[0] });
      rest = rest.slice(1);
    }
  }
  return tokens;
}

const tokenColors: Record<Token["type"], string> = {
  kw:    "text-indigo-400",
  str:   "text-green-300",
  cm:    "text-neutral-600",
  prop:  "text-sky-300",
  fn:    "text-purple-300",
  num:   "text-orange-300",
  plain: "text-neutral-300",
};

// ── Main component ────────────────────────────────────────────────────────

export function CodeBlock(props: SectionCodeProps) {
  const code = useMemo(() => {
    if (props.section === "hero")     return serializeHero(props.profile);
    if (props.section === "projects") return serializeProjects(props.projects);
    if (props.section === "about")    return serializeAbout(props.profile);
    if (props.section === "skills")   return serializeSkills(props.skills);
    return serializeContact(props.profile);
  }, [props]);

  const lines = code.split("\n");

  return (
    <div className="flex overflow-x-auto font-mono text-[11px] leading-relaxed">
      {/* Line numbers */}
      <div className="select-none border-r border-neutral-800 px-3 py-4 text-right text-neutral-700">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      {/* Code */}
      <div className="flex-1 py-4 pl-4">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {tokenize(line).map((tok, j) => (
              <span key={j} className={tokenColors[tok.type]}>{tok.text}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build check**

```bash
docker exec sleepyleo-app-1 bunx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 4: Commit**

```bash
git add components/view-toggle.tsx components/code-block.tsx
git commit -m "feat: add ViewToggle pill and data-driven CodeBlock serializer"
```

---

## Task 3: IdeExplorer

**Files:**
- Create: `components/ide-explorer.tsx`

- [ ] **Step 1: Create explorer component**

```tsx
// components/ide-explorer.tsx
"use client";

import { Cat } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SECTIONS, useIde } from "@/components/ide-context";

interface IdeExplorerProps {
  profileName: string | null;
  availableForHire: boolean;
  availableLabel: string | null;
  fuel: string | null;
}

export function IdeExplorer({
  profileName,
  availableForHire,
  availableLabel,
  fuel,
}: IdeExplorerProps) {
  const { activeSection, navigateTo } = useIde();

  return (
    <aside className="flex w-[200px] flex-shrink-0 flex-col border-r border-neutral-800 bg-[#0d0d0d]">
      {/* Header */}
      <div className="border-b border-neutral-800 px-3 py-2 font-mono text-[9px] uppercase tracking-[2.5px] text-neutral-600">
        Explorer
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto py-1.5">
        {/* Root folder */}
        <div className="flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] text-indigo-400">
          <span className="text-neutral-600">▾</span>
          <span>📁</span>
          <span>{profileName ?? "sleepyleo"}</span>
        </div>

        {/* pages/ folder */}
        <div className="flex items-center gap-1.5 pl-5 pr-3 py-1 font-mono text-[11px] text-indigo-400">
          <span className="text-neutral-600">▾</span>
          <span>📁</span>
          <span>pages</span>
        </div>

        {/* Section files */}
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => navigateTo(sec.id)}
            className={`flex w-full items-center gap-1.5 border-l-2 py-1 pl-8 pr-3 font-mono text-[11px] transition-colors ${
              activeSection === sec.id
                ? "border-indigo-500 bg-neutral-800/60 text-white"
                : "border-transparent text-neutral-500 hover:bg-neutral-800/30 hover:text-neutral-300"
            }`}
          >
            <span className="text-[10px]">⚛</span>
            {sec.file}
          </button>
        ))}

        {/* utils/ folder */}
        <div className="mt-1 flex items-center gap-1.5 pl-5 pr-3 py-1 font-mono text-[11px] text-indigo-400">
          <span className="text-neutral-600">▾</span>
          <span>📁</span>
          <span>utils</span>
        </div>

        {/* matcha.ts easter egg */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex w-full items-center gap-1.5 border-l-2 border-transparent py-1 pl-8 pr-3 font-mono text-[11px] text-green-400 transition-colors hover:bg-neutral-800/30">
              <span className="text-[10px]">🍵</span>
              matcha.ts
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            className="w-64 border-neutral-800 bg-neutral-900 p-3 text-sm"
          >
            <p className="font-mono text-[10px] text-neutral-500 mb-2">
              // matcha.ts — critical dependency
            </p>
            <p className="text-neutral-300 text-xs leading-relaxed mb-2">
              &quot;A software developer is 73% matcha.&quot;
            </p>
            {fuel && (
              <p className="font-mono text-[10px] text-green-400">
                fuel: <span className="text-green-300">&quot;{fuel}&quot;</span>
              </p>
            )}
          </PopoverContent>
        </Popover>

        {/* README.md — scrolls to very top of page */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex w-full items-center gap-1.5 border-l-2 border-transparent py-1 pl-5 pr-3 font-mono text-[11px] text-neutral-500 transition-colors hover:bg-neutral-800/30 hover:text-neutral-300"
        >
          <span className="text-[10px]">📄</span>
          README.md
        </button>
      </div>

      {/* Footer: availability */}
      <div className="border-t border-neutral-800 p-3">
        <div
          className={`flex items-center gap-1.5 rounded px-2 py-1.5 text-[10px] ${
            availableForHire
              ? "border border-green-900 bg-green-950/40 text-green-400"
              : "border border-neutral-800 bg-neutral-900 text-neutral-600"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              availableForHire ? "animate-pulse bg-green-400" : "bg-neutral-600"
            }`}
          />
          {availableForHire
            ? (availableLabel ?? "available for hire")
            : "not available"}
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Build check**

```bash
docker exec sleepyleo-app-1 bunx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/ide-explorer.tsx
git commit -m "feat: add IdeExplorer with file tree and matcha popover easter egg"
```

---

## Task 4: IdeTabs + IdeToolbar + IdeStatusBar

**Files:**
- Create: `components/ide-tabs.tsx`
- Create: `components/ide-toolbar.tsx`
- Create: `components/ide-statusbar.tsx`

- [ ] **Step 1: Create IdeTabs**

```tsx
// components/ide-tabs.tsx
"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SECTIONS, useIde } from "@/components/ide-context";

export function IdeTabs() {
  const { openTabs, activeSection, navigateTo, closeTab } = useIde();

  if (openTabs.length === 0) return null;

  return (
    <div className="flex h-8 flex-shrink-0 items-end overflow-x-auto border-b border-neutral-800 bg-[#111]">
      <AnimatePresence initial={false}>
      {openTabs.map((id) => {
        const sec = SECTIONS.find((s) => s.id === id)!;
        const isActive = id === activeSection;
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className={`group flex h-full flex-shrink-0 cursor-pointer items-center gap-1.5 border-r border-neutral-800 px-3 font-mono text-[11px] transition-colors ${
              isActive
                ? "border-t border-t-indigo-500 bg-[#0d0d0d] text-white"
                : "text-neutral-500 hover:bg-neutral-800/40 hover:text-neutral-300"
            }`}
            style={isActive ? { marginBottom: -1 } : undefined}
            onClick={() => navigateTo(id)}
          >
            <span className="text-[9px]">⚛</span>
            {sec.file}
            <button
              onClick={(e) => { e.stopPropagation(); closeTab(id); }}
              className="ml-0.5 rounded p-0.5 text-neutral-600 opacity-0 transition-opacity hover:text-neutral-300 group-hover:opacity-100"
            >
              <X size={10} />
            </button>
          </motion.div>
        );
      })}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Create IdeToolbar**

```tsx
// components/ide-toolbar.tsx
"use client";

import { SECTIONS, useIde } from "@/components/ide-context";
import { ViewToggle } from "@/components/view-toggle";

export function IdeToolbar() {
  const { activeSection, toggleView, getViewMode } = useIde();
  const sec = SECTIONS.find((s) => s.id === activeSection)!;
  const viewMode = getViewMode(activeSection);

  return (
    <div className="flex h-7 flex-shrink-0 items-center justify-between border-b border-neutral-800/60 bg-[#0d0d0d] px-3">
      <span className="font-mono text-[10px] text-neutral-600">
        pages{" "}
        <span className="text-neutral-500">/</span>{" "}
        <span className="text-indigo-400">{sec.file}</span>
      </span>
      <ViewToggle value={viewMode} onChange={() => toggleView(activeSection)} />
    </div>
  );
}
```

- [ ] **Step 3: Create IdeStatusBar**

```tsx
// components/ide-statusbar.tsx
"use client";

import { GitBranch } from "lucide-react";
import { SECTIONS, useIde } from "@/components/ide-context";

interface IdeStatusBarProps {
  availableForHire: boolean;
  availableLabel: string | null;
}

export function IdeStatusBar({ availableForHire, availableLabel }: IdeStatusBarProps) {
  const { activeSection } = useIde();
  const sec = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="flex h-5 flex-shrink-0 items-center gap-3 bg-indigo-600 px-3 font-mono text-[10px] text-indigo-100">
      <span className="flex items-center gap-1">
        <GitBranch size={10} />
        main
      </span>
      <span>⚠ 0</span>
      <span>✓ 0</span>
      <div className="flex-1" />
      <span>{sec.file}</span>
      <span>TypeScript React</span>
      <span>UTF-8</span>
      {availableForHire && availableLabel && (
        <span className="rounded bg-indigo-500/40 px-1.5 text-white">
          {availableLabel}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Build check**

```bash
docker exec sleepyleo-app-1 bunx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add components/ide-tabs.tsx components/ide-toolbar.tsx components/ide-statusbar.tsx
git commit -m "feat: add IdeTabs, IdeToolbar with breadcrumb, and IdeStatusBar"
```

---

## Task 5: IdeShell — full layout component

**Files:**
- Create: `components/ide-shell.tsx`

- [ ] **Step 1: Create IdeShell**

```tsx
// components/ide-shell.tsx
"use client";

import { useCallback, useEffect, useRef, ReactNode } from "react";
import { IdeProvider, SECTIONS, SectionId, useIde } from "@/components/ide-context";
import { IdeExplorer } from "@/components/ide-explorer";
import { IdeTabs } from "@/components/ide-tabs";
import { IdeToolbar } from "@/components/ide-toolbar";
import { IdeStatusBar } from "@/components/ide-statusbar";
import { Home, FolderOpen, Search, Settings, GitBranch } from "lucide-react";
import { ViewToggle } from "@/components/view-toggle";

interface Profile {
  name: string | null;
  availableForHire: boolean;
  availableLabel: string | null;
  fuel: string | null;
}

interface IdeShellProps {
  children: ReactNode;
  profile: Profile | null;
}

// Inner component — has access to IdeContext
function IdeShellInner({ children, profile }: IdeShellProps) {
  const { activeSection, setActiveSection, navigateTo, getViewMode, toggleView } = useIde();
  const editorRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver: update active section as user scrolls
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id as SectionId); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [setActiveSection]);

  const p = profile;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0d0d0d]">

      {/* ── Desktop: Title bar (lg+) ── */}
      <div className="hidden h-8 flex-shrink-0 items-center border-b border-neutral-800 bg-[#111] lg:flex">
        <div className="flex items-center gap-1.5 px-4">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center font-mono text-[11px] text-neutral-600">
          {p?.name ?? "sleepyleo"} — portfolio
        </div>
        <div className="w-24" />
      </div>

      {/* ── Mobile/Tablet: Top bar (< lg) ── */}
      <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-neutral-800 bg-[#111] px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-xs">🐱</div>
          <span className="font-semibold tracking-tight text-white">
            {p?.name ?? "SleepyLeo"}
          </span>
        </div>
        <ViewToggle
          value={getViewMode(activeSection)}
          onChange={() => toggleView(activeSection)}
        />
      </div>

      {/* ── Mobile breadcrumb (< lg) ── */}
      <div className="flex h-6 flex-shrink-0 items-center border-b border-neutral-800/60 bg-[#0d0d0d] px-4 lg:hidden">
        <span className="font-mono text-[10px] text-neutral-600">
          pages / <span className="text-indigo-400">
            {SECTIONS.find((s) => s.id === activeSection)?.file}
          </span>
        </span>
      </div>

      {/* ── Main body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Activity bar (lg+) */}
        <div className="hidden w-10 flex-shrink-0 flex-col items-center border-r border-neutral-800 bg-[#111] py-2 lg:flex">
          {[
            { icon: <FolderOpen size={16} />, active: true },
            { icon: <Search size={16} />,     active: false },
            { icon: <GitBranch size={16} />,  active: false },
          ].map(({ icon, active }, i) => (
            <div
              key={i}
              className={`mb-1 flex h-8 w-8 items-center justify-center rounded transition-colors ${
                active ? "bg-indigo-950 text-indigo-400" : "text-neutral-600 hover:text-neutral-400"
              }`}
            >
              {icon}
            </div>
          ))}
          <div className="mt-auto flex h-8 w-8 items-center justify-center rounded text-neutral-600 hover:text-neutral-400">
            <Settings size={16} />
          </div>
        </div>

        {/* File explorer (lg+) */}
        <div className="hidden lg:block">
          <IdeExplorer
            profileName={p?.name ?? null}
            availableForHire={p?.availableForHire ?? false}
            availableLabel={p?.availableLabel ?? null}
            fuel={p?.fuel ?? null}
          />
        </div>

        {/* Editor area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tabs (lg+) */}
          <div className="hidden lg:block">
            <IdeTabs />
          </div>

          {/* Toolbar (lg+) */}
          <div className="hidden lg:block">
            <IdeToolbar />
          </div>

          {/* Scrollable content */}
          <div ref={editorRef} className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Status bar (lg+) */}
      <div className="hidden lg:block">
        <IdeStatusBar
          availableForHire={p?.availableForHire ?? false}
          availableLabel={p?.availableLabel ?? null}
        />
      </div>

      {/* ── Bottom tab bar (< lg) ── */}
      <nav className="flex h-14 flex-shrink-0 items-center justify-around border-t border-neutral-800 bg-[#111] px-2 pb-1 lg:hidden">
        {SECTIONS.map(({ id, label }) => {
          const icons: Record<string, ReactNode> = {
            home:     <Home size={18} />,
            projects: <FolderOpen size={18} />,
            about:    <span className="text-base">◉</span>,
            skills:   <Settings size={18} />,
            contact:  <span className="text-base">✉</span>,
          };
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => navigateTo(id)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1 transition-colors ${
                isActive ? "bg-neutral-800 text-indigo-400" : "text-neutral-600"
              }`}
            >
              {icons[id]}
              <span className="text-[9px]">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// Outer component — sets up IdeProvider with scroll navigation callback
export function IdeShell({ children, profile }: IdeShellProps) {
  const navigate = useCallback((id: SectionId) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <IdeProvider onNavigate={navigate}>
      <IdeShellInner profile={profile}>{children}</IdeShellInner>
    </IdeProvider>
  );
}
```

- [ ] **Step 2: Build check**

```bash
docker exec sleepyleo-app-1 bunx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add components/ide-shell.tsx
git commit -m "feat: add IdeShell layout with full desktop IDE chrome and mobile bottom tabs"
```

---

## Task 6: Wire IdeShell into layout + page

**Files:**
- Modify: `app/(website)/layout.tsx`
- Modify: `app/(website)/page.tsx`

- [ ] **Step 1: Verify skip link location before editing**

```bash
grep -r "skip-link\|skip to\|main-content" --include="*.tsx" app/ components/
```

The skip link lives in the **root layout** (`app/layout.tsx`), not the website layout — confirm this before proceeding. The root layout is untouched by this plan.

- [ ] **Step 2: Simplify layout.tsx**

Replace the full content of `app/(website)/layout.tsx` with:

```tsx
// app/(website)/layout.tsx
export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <main id="main-content">{children}</main>;
}
```

- [ ] **Step 2: Update page.tsx — add HeroData + IdeShell wrapper**

```tsx
// app/(website)/page.tsx
import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/sections/projects-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactSection } from "@/components/sections/contact-section";
import { IdeShell } from "@/components/ide-shell";
import { getProjects, getTotalCommits, getProfile, getSkills } from "@/lib/actions";
import { DogBreedQuizClient } from "@/components/dog-breed-quiz-client";

export const revalidate = 3600;

// Fetch profile once for IdeShell chrome + Hero code block
async function getProfileData() {
  const result = await getProfile();
  return result.success ? result.data : null;
}

async function ProjectsData() {
  const [result, totalCommits] = await Promise.all([getProjects(), getTotalCommits()]);
  return (
    <ProjectsSection
      projects={result.success ? result.data : []}
      totalCommits={totalCommits}
    />
  );
}

async function AboutData() {
  const profile = await getProfileData();
  return <AboutSection profile={profile} />;
}

async function SkillsData() {
  const result = await getSkills();
  return <SkillsSection skills={result.success ? result.data : []} />;
}

async function ContactData() {
  const profile = await getProfileData();
  return <ContactSection profile={profile} />;
}

export default async function Home() {
  const profile = await getProfileData();

  return (
    <IdeShell profile={profile}>
      <Hero profile={profile} />

      <Suspense fallback={null}><ProjectsData /></Suspense>
      <Suspense fallback={null}><AboutData /></Suspense>
      <Suspense fallback={null}><SkillsData /></Suspense>
      <Suspense fallback={null}><ContactData /></Suspense>

      <DogBreedQuizClient adminUrl={process.env.ADMIN_URL ?? "http://localhost:3001"} />
    </IdeShell>
  );
}
```

- [ ] **Step 3: Start dev server and verify IDE shell renders**

```bash
docker compose watch
```

Open http://localhost:3000. You should see the IDE chrome frame on desktop (title bar, activity bar, file explorer, tabs, toolbar, status bar) and a top bar + bottom tabs on mobile. Content sections will still have old styles — that's fine for now.

- [ ] **Step 4: Commit**

```bash
git add app/(website)/layout.tsx app/(website)/page.tsx
git commit -m "feat: wire IdeShell into website layout and page.tsx"
```

---

## Task 7: Redesign Hero section

**Files:**
- Modify: `components/hero.tsx`

- [ ] **Step 1: Rewrite hero.tsx**

Replace the full file with the new clean version — remove `ParticleField`, blob shape, glow blobs, gradient fades, `min-h-screen`. Accept `profile` prop. Change `id` to `"home"`. Keep `FlipWords`, stats, CTA buttons, availability badge, and `motion` entrance.

```tsx
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
            <p className="mb-4 text-sm text-neutral-500">
              I&apos;m a{" "}
              <FlipWords
                words={words}
                className="font-semibold text-indigo-400"
              />
            </p>
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
```

- [ ] **Step 2: Verify in browser**

Reload http://localhost:3000. Hero should show clean photo (square, no blob), stats, CTAs. Click `</> Code` in the toolbar — hero area should show the code view. Click `⊞ Preview` to return.

- [ ] **Step 3: Commit**

```bash
git add components/hero.tsx
git commit -m "feat: redesign hero — clean photo, CMS-driven props, Preview/Code toggle"
```

---

## Task 8: Redesign Projects section

**Files:**
- Create: `components/project-row.tsx`
- Modify: `components/project-card.tsx`
- Modify: `components/sections/projects-section.tsx`

- [ ] **Step 1: Create ProjectRow (desktop list view)**

```tsx
// components/project-row.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ExternalLink, Github, Star } from "lucide-react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

interface Project {
  id: string; name: string; slug: string;
  description?: string | null; status: string; techStack: string[];
  memeUrl?: string | null; repoUrl?: string | null; liveUrl?: string | null;
  featured?: boolean; stars?: number | null; language?: string | null;
}

const sarcasticTooltips: Record<string, string> = {
  TypeScript: "JavaScript that went to therapy",
  React: "The library that makes you feel productive",
  "Next.js": "React's overachieving sibling",
  PostgreSQL: "SQL but make it fancy",
  Prisma: "Because writing raw SQL is for masochists",
  Docker: "Works on my machine, certified",
  "Node.js": "JavaScript escaped the browser",
  Tailwind: "Inline styles but we pretend it's different",
};

export function ProjectRow({ project }: { project: Project }) {
  const [memeVisible, setMemeVisible] = useState(false);

  return (
    <div
      className="group relative flex items-center gap-3 rounded border border-transparent px-3 py-2.5 transition-colors hover:border-neutral-800 hover:bg-neutral-900/50"
      onMouseEnter={() => setMemeVisible(true)}
      onMouseLeave={() => setMemeVisible(false)}
    >
      {/* Meme overlay on hover */}
      {project.memeUrl && memeVisible && (
        <div className="pointer-events-none absolute right-3 top-1/2 z-10 h-16 w-16 -translate-y-1/2 overflow-hidden rounded border border-neutral-700">
          <Image src={project.memeUrl} alt="meme" fill unoptimized className="object-cover" />
        </div>
      )}

      {/* Name */}
      <span className="w-48 flex-shrink-0 truncate font-medium text-neutral-200 text-sm">
        {project.name}
        {project.featured && (
          <span className="ml-1.5 rounded bg-amber-900/40 px-1 py-0.5 font-mono text-[9px] text-amber-400">
            featured
          </span>
        )}
      </span>

      {/* Description */}
      <span className="flex-1 truncate text-xs text-neutral-600">
        {project.description}
      </span>

      {/* Tech stack pills (first 3) */}
      <TooltipProvider>
        <div className="flex gap-1">
          {project.techStack.slice(0, 3).map((tech) => (
            <Tooltip key={tech}>
              <TooltipTrigger asChild>
                <span className="cursor-default rounded border border-neutral-800 px-1.5 py-0.5 font-mono text-[9px] text-neutral-500 hover:border-neutral-600 hover:text-neutral-300">
                  {tech}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {sarcasticTooltips[tech] ?? tech}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Language */}
      <span className="w-12 flex-shrink-0 text-right font-mono text-[10px] text-indigo-400">
        {project.language}
      </span>

      {/* Stars */}
      <span className="flex w-10 flex-shrink-0 items-center justify-end gap-0.5 font-mono text-[10px] text-neutral-700">
        <Star size={9} /> {project.stars ?? 0}
      </span>

      {/* Actions */}
      <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
            className="rounded border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-500 hover:border-neutral-600 hover:text-neutral-300">
            <Github size={10} className="inline mr-0.5" />Code
          </a>
        )}
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className="rounded bg-indigo-600/80 px-2 py-0.5 text-[10px] text-white hover:bg-indigo-500">
            <ExternalLink size={10} className="inline mr-0.5" />Live
          </a>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update project-card.tsx — remove spotlight/glow, add long-press meme**

In `components/project-card.tsx`:
- Remove the `mouseMove` spotlight handler and the radial gradient spotlight div
- Remove the `boxShadow` hover glow style from the motion wrapper
- Add long-press meme reveal with the following hook pattern (add near top of component, before the return):

```tsx
// Long-press to reveal meme (mobile tap-hold) + hover reveal (desktop)
const [memeVisible, setMemeVisible] = useState(false);
const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

const startLongPress = () => {
  longPressTimer.current = setTimeout(() => setMemeVisible(true), 500);
};
const cancelLongPress = () => {
  if (longPressTimer.current) {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = null;
  }
};
```

Wire to the card's outer div:
```tsx
onMouseEnter={() => setMemeVisible(true)}
onMouseLeave={() => { setMemeVisible(false); cancelLongPress(); }}
onPointerDown={startLongPress}
onPointerUp={cancelLongPress}
onPointerCancel={cancelLongPress}   // ← handles scroll gesture cancellation
onPointerLeave={() => { setMemeVisible(false); cancelLongPress(); }}
```

Then gate the meme `<Image>` render on `memeVisible` instead of always rendering it at low opacity. Remove the existing CSS opacity/scale transition on the meme image — the overlay simply appears/disappears.

Keep all other content (badge, sarcastic tech tooltips, status badge, stars/forks, Code/Live buttons) unchanged.

- [ ] **Step 3: Update projects-section.tsx — remove bg effects, add CodeBlock, responsive layout**

In `components/sections/projects-section.tsx`:
- Remove `useScroll`/`useTransform` parallax imports and blob divs
- Remove `mouseMove` spotlight handler
- Remove floating code-line decorations
- Remove `BackgroundBeams` import and usage
- Wrap section content with: show `<CodeBlock section="projects" projects={projects} />` when `viewMode === "code"`, else show normal content
- Replace project grid with: `<div className="hidden lg:block">` containing `ProjectRow` list, and `<div className="lg:hidden">` containing existing card grid
- Add `useIde()` to read `getViewMode("projects")`

- [ ] **Step 4: Verify in browser — desktop shows list rows, mobile shows cards, meme reveals on hover/long-press**

- [ ] **Step 5: Commit**

```bash
git add components/project-row.tsx components/project-card.tsx components/sections/projects-section.tsx
git commit -m "feat: redesign projects — desktop list rows, mobile cards, meme overlay, CodeBlock"
```

---

## Task 9: Redesign Skills, About, Contact sections

**Files:**
- Modify: `components/sections/skills-section.tsx`
- Modify: `components/sections/about-section.tsx`
- Modify: `components/sections/contact-section.tsx`

- [ ] **Step 1: Update skills-section.tsx**

Replace `proficiencyConfig` pill styling with dot-rating:

```tsx
// Replace SkillPill with SkillDots
const DOTS_MAP: Record<string, number> = {
  daily_driver: 5,
  comfortable:  3,
  learning:     1,
};

function SkillDots({ skill }: { skill: Skill }) {
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
        {skill.projectUsage}
      </TooltipContent>
    </Tooltip>
  );
}
```

- Remove all mouse spotlight `useRef`/`useEffect`/handler code
- Remove background blob divs
- Remove dot-grid div
- Remove top/bottom gradient fades
- Add `useIde()` + show `<CodeBlock section="skills" skills={skills} />` when `viewMode === "code"`

- [ ] **Step 2: Update about-section.tsx**

- Remove mouse spotlight `useRef`/`useEffect`/handler code (the `mouseMoveHandler` and the spotlight div with `radial-gradient`)
- Remove background glow blob divs (the `absolute inset-0 pointer-events-none` blobs)
- Remove dot-grid div
- Remove top/bottom gradient fade divs
- Replace `bg-zinc-950` section background with `bg-transparent` (IDE shell provides background)
- Change card classes: `bg-white/[0.02]` → `bg-neutral-900/50`, `border-white/5` → `border-neutral-800`
- Add `useIde()` + show `<CodeBlock section="about" profile={profile} />` when `viewMode === "code"`

- [ ] **Step 3: Update contact-section.tsx**

- Remove mouse spotlight handler and spotlight div
- Remove background blob divs
- Remove dot-grid div
- Remove top/bottom gradient fades
- Change card hover classes: keep indigo accent on hover only, remove glow effects
- Add `useIde()` + show `<CodeBlock section="contact" profile={profile} />` when `viewMode === "code"`

- [ ] **Step 4: Verify all 3 sections in browser — no glow blobs, clean card borders, Code toggle works**

- [ ] **Step 5: Commit**

```bash
git add components/sections/skills-section.tsx components/sections/about-section.tsx components/sections/contact-section.tsx
git commit -m "feat: redesign Skills/About/Contact — dot ratings, clean borders, CodeBlock toggle"
```

---

## Task 10: Cleanup deleted files

**Files:**
- Delete: `components/navbar.tsx`
- Delete: `components/page-transition.tsx`
- Delete: `components/ui/particle-field.tsx`

- [ ] **Step 1: Delete old files**

```bash
rm components/navbar.tsx
rm components/page-transition.tsx
rm components/ui/particle-field.tsx
```

- [ ] **Step 2: Remove any remaining imports of deleted files**

```bash
grep -r "particle-field\|page-transition\|navbar" --include="*.tsx" --include="*.ts" app/ components/ lib/
```

Fix any remaining imports found.

- [ ] **Step 3: Full build check**

```bash
docker exec sleepyleo-app-1 bun run build 2>&1 | tail -20
```

Expected: Build completes successfully with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove navbar, page-transition, and particle-field components"
```

---

## Task 11: Verification

- [ ] **Desktop (≥ 1024px):** Full IDE chrome visible — title bar with window dots, activity bar, file explorer with nested folders, editor tabs accumulating, toolbar breadcrumb, indigo status bar
- [ ] **Desktop scroll:** Scrolling through sections updates active file in explorer, active tab, breadcrumb, and status bar filename
- [ ] **Desktop toggle:** `</> Code` shows data-driven code block per section; `⊞ Preview` returns to normal UI; each section's toggle is independent
- [ ] **Desktop projects:** Shows list rows with name, description, lang, stars; meme appears on hover without layout shift
- [ ] **Mobile (< 1024px):** Top bar with logo + toggle visible; bottom tab bar with 5 icons; no file explorer
- [ ] **Mobile tabs:** Tapping bottom tabs smooth-scrolls to section
- [ ] **Mobile meme:** Long-press (~500ms) on project card reveals meme overlay
- [ ] **Matcha easter egg:** Clicking `matcha.ts` in explorer opens Radix popover with joke + fuel value
- [ ] **Skills:** Dot ratings render correctly — 5 dots for daily_driver, 3 for comfortable, 1 for learning
- [ ] **CMS round-trip:** Update profile name/availability in admin panel → wait for revalidation (or trigger rebuild) → verify IDE chrome logo + availability pill update
- [ ] **Reduced motion:** `@media (prefers-reduced-motion: reduce)` — all animations disabled
- [ ] **Other pages unaffected:** `/projects` and `/projects/[slug]` render correctly without IDE chrome
- [ ] **Admin panel:** http://localhost:3001 unaffected

```bash
# Full production build must pass
docker exec sleepyleo-app-1 bun run build
```

- [ ] **Final commit if any fixes**

```bash
git add -A
git commit -m "fix: verification fixes for IDE portfolio redesign"
```
