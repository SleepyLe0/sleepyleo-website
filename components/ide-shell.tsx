// components/ide-shell.tsx
"use client";

import { useCallback, useEffect, ReactNode } from "react";
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

// Title bar height: h-8 = 32px, status bar: h-5 = 20px → sidebar height = 100vh - 52px
const TITLE_H = 32;
const STATUS_H = 20;
const SIDEBAR_H = `calc(100vh - ${TITLE_H + STATUS_H}px)`;

// Mobile top bar: h-11 = 44px, breadcrumb: h-6 = 24px
const MOBILE_TOP_H = 44;
const MOBILE_BREAD_H = 24;
const MOBILE_BOTTOM_H = 56; // h-14

function IdeShellInner({ children, profile }: IdeShellProps) {
  const { activeSection, setActiveSection, navigateTo, getViewMode, toggleView } = useIde();

  // IntersectionObserver on the viewport (normal document scroll)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id as SectionId); },
        { threshold: 0.3, rootMargin: "-80px 0px -20% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [setActiveSection]);

  const p = profile;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">

      {/* ── Desktop: Title bar — sticky top ── */}
      <div className="sticky top-0 z-50 hidden h-8 items-center border-b border-neutral-800 bg-[#111] lg:flex">
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

      {/* ── Mobile/Tablet: Top bar — sticky top ── */}
      <div className="sticky top-0 z-50 flex h-11 items-center justify-between border-b border-neutral-800 bg-[#111] px-4 lg:hidden">
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

      {/* ── Mobile breadcrumb — sticky below top bar ── */}
      <div
        className="sticky z-40 flex h-6 items-center border-b border-neutral-800/60 bg-[#0d0d0d] px-4 lg:hidden"
        style={{ top: MOBILE_TOP_H }}
      >
        <span className="font-mono text-[10px] text-neutral-600">
          pages / <span className="text-indigo-400">
            {SECTIONS.find((s) => s.id === activeSection)?.file}
          </span>
        </span>
      </div>

      {/* ── Main body: sidebar + editor ── */}
      <div className="flex">

        {/* ── Desktop left panel: activity bar + explorer (sticky) ── */}
        <div
          className="sticky hidden flex-shrink-0 lg:flex"
          style={{ top: TITLE_H, height: SIDEBAR_H }}
        >
          {/* Activity bar */}
          <div className="flex w-10 flex-col items-center border-r border-neutral-800 bg-[#111] py-2">
            {[
              { icon: <FolderOpen size={16} />, active: true },
              { icon: <Search size={16} />,     active: false },
              { icon: <GitBranch size={16} />,  active: false },
            ].map(({ icon, active }, i) => (
              <div
                key={i}
                className={`mb-1 flex h-8 w-8 cursor-default items-center justify-center rounded transition-colors ${
                  active ? "bg-indigo-950 text-indigo-400" : "text-neutral-600"
                }`}
              >
                {icon}
              </div>
            ))}
            <div className="mt-auto flex h-8 w-8 cursor-default items-center justify-center rounded text-neutral-600">
              <Settings size={16} />
            </div>
          </div>

          {/* File explorer */}
          <IdeExplorer
            profileName={p?.name ?? null}
            availableForHire={p?.availableForHire ?? false}
            availableLabel={p?.availableLabel ?? null}
            fuel={p?.fuel ?? null}
          />
        </div>

        {/* ── Editor column ── */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Tabs — sticky below title bar (desktop only) */}
          <div
            className="sticky z-40 hidden lg:block"
            style={{ top: TITLE_H }}
          >
            <IdeTabs />
          </div>

          {/* Toolbar — sticky below tabs (desktop only) */}
          <div
            className="sticky z-40 hidden lg:block"
            style={{ top: TITLE_H + 32 }} // title + tabs height
          >
            <IdeToolbar />
          </div>

          {/* Content — normal document flow, no overflow tricks */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>

      {/* ── Desktop: Status bar — sticky bottom ── */}
      <div className="sticky bottom-0 z-50 hidden lg:block">
        <IdeStatusBar
          availableForHire={p?.availableForHire ?? false}
          availableLabel={p?.availableLabel ?? null}
        />
      </div>

      {/* ── Mobile: Bottom tab bar — sticky bottom ── */}
      <nav
        className="sticky bottom-0 z-50 flex h-14 items-center justify-around border-t border-neutral-800 bg-[#111] px-2 pb-1 lg:hidden"
      >
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

// Outer component — normal scrollIntoView works now (document scroll)
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
