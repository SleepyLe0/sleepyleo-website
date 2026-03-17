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
          <div ref={editorRef} id="ide-editor" className="flex-1 overflow-y-auto">
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
    const container = document.getElementById("ide-editor");
    const target = document.getElementById(id);
    if (container && target) {
      const offset = target.offsetTop - container.offsetTop;
      container.scrollTo({ top: offset, behavior: "smooth" });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <IdeProvider onNavigate={navigate}>
      <IdeShellInner profile={profile}>{children}</IdeShellInner>
    </IdeProvider>
  );
}
