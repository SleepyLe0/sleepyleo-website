// components/ide-shell.tsx
"use client";

import { ReactNode } from "react";
import { IdeProvider, SECTIONS, SectionId, SidebarPanel, useIde } from "@/components/ide-context";
import { IdeExplorer } from "@/components/ide-explorer";
import { IdeTabs } from "@/components/ide-tabs";
import { IdeStatusBar } from "@/components/ide-statusbar";
import { SectionBar } from "@/components/section-bar";
import { SidebarSearch } from "@/components/sidebar-search";
import { SidebarGit } from "@/components/sidebar-git";
import { SidebarSettings } from "@/components/sidebar-settings";
import { Home, FolderOpen, Search, Settings, GitBranch, Mail } from "lucide-react";

interface Profile {
  name: string | null;
  availableForHire: boolean;
  availableLabel: string | null;
  fuel: string | null;
  timeline?: { year: string; event: string }[];
  github?: string;
  bio?: string | null | undefined;
  background?: string | null | undefined;
  education?: string | null | undefined;
  location?: string | null | undefined;
  focus?: string | null | undefined;
  email?: string | null | undefined;
  linkedin?: string | null | undefined;
  ctaCopy?: string | null | undefined;
}

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

interface IdeShellProps {
  profile: Profile | null;
  sections: Record<SectionId, ReactNode>;
  projects: Project[];
  skills: Skill[];
}

type ActivityItem = {
  icon: ReactNode;
  panel: SidebarPanel;
};

function IdeShellInner({ profile, sections, projects, skills }: IdeShellProps) {
  const { activeSection, openTabs, navigateTo, activeSidebarPanel, toggleSidebarPanel, matchaMode } = useIde();
  const p = profile;

  const activityItems: ActivityItem[] = [
    { icon: <FolderOpen size={16} />, panel: "explorer" },
    { icon: <Search size={16} />,     panel: "search"   },
    { icon: <GitBranch size={16} />,  panel: "git"      },
  ];

  const timeline = p?.timeline ?? [];
  const github = p?.github ? `https://github.com/${p.github}` : "";

  return (
    <div className={`flex h-screen flex-col overflow-hidden bg-[#0d0d0d] ${matchaMode ? "matcha" : ""}`}>

      {/* ── Desktop: Title bar ── */}
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

      {/* ── Mobile: Top bar ── */}
      <div className="flex h-11 flex-shrink-0 items-center justify-between border-b border-neutral-800 bg-[#111] px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-xs">🐱</div>
          <span className="font-semibold tracking-tight text-white">
            {p?.name ?? "SleepyLeo"}
          </span>
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Desktop left panel: activity bar + sidebar */}
        <div className="hidden flex-shrink-0 lg:flex h-full overflow-hidden">
          {/* Activity bar */}
          <div className="flex w-10 flex-col items-center border-r border-neutral-800 bg-[#111] py-2">
            {activityItems.map(({ icon, panel }) => {
              const isActive = activeSidebarPanel === panel;
              return (
                <button
                  key={panel}
                  onClick={() => toggleSidebarPanel(panel)}
                  className={`relative mb-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors ${
                    isActive
                      ? "bg-indigo-950 text-indigo-400"
                      : "text-neutral-600 hover:text-neutral-400"
                  }`}
                >
                  {isActive && (
                    <span className="absolute -left-[1px] top-1 h-6 w-0.5 rounded-r bg-indigo-500" />
                  )}
                  {icon}
                </button>
              );
            })}
            <button
              onClick={() => toggleSidebarPanel("settings")}
              className={`relative mt-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded transition-colors ${
                activeSidebarPanel === "settings"
                  ? "bg-indigo-950 text-indigo-400"
                  : "text-neutral-600 hover:text-neutral-400"
              }`}
            >
              {activeSidebarPanel === "settings" && (
                <span className="absolute -left-[1px] top-1 h-6 w-0.5 rounded-r bg-indigo-500" />
              )}
              <Settings size={16} />
            </button>
          </div>

          {/* Sidebar panel */}
          {activeSidebarPanel === "explorer" && (
            <IdeExplorer
              profileName={p?.name ?? null}
              availableForHire={p?.availableForHire ?? false}
              availableLabel={p?.availableLabel ?? null}
            />
          )}
          {activeSidebarPanel === "search" && (
            <SidebarSearch projects={projects} skills={skills} profile={p} />
          )}
          {activeSidebarPanel === "git" && (
            <SidebarGit timeline={timeline} github={github} />
          )}
          {activeSidebarPanel === "settings" && (
            <SidebarSettings />
          )}
        </div>

        {/* Editor column */}
        <div className="flex min-w-0 flex-1 flex-col min-h-0">

          {/* Tabs (desktop only) */}
          <div className="hidden flex-shrink-0 lg:block">
            <IdeTabs />
          </div>

          {/* Section scroll container */}
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
            {/* SectionBar — lives here once for all sections */}
            {openTabs.length > 0 && <SectionBar sectionId={activeSection} />}

            {openTabs.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 select-none">
                <div className="text-5xl opacity-20">⚛</div>
                <div className="text-center">
                  <p className="font-mono text-[13px] text-neutral-600">No files open</p>
                  <p className="mt-1 font-mono text-[11px] text-neutral-700">
                    Open a file from the explorer to get started
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  {SECTIONS.filter((s) => s.path.startsWith("pages/")).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => navigateTo(s.id)}
                      className="font-mono text-[11px] text-neutral-700 transition-colors hover:text-indigo-400"
                    >
                      <span className="mr-1.5 text-[9px]">⚛</span>{s.file}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 relative">
                {(Object.entries(sections) as [SectionId, ReactNode][]).map(([id, content]) => (
                  <div key={id} className={activeSection === id ? "h-full" : "hidden"}>
                    {content}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Status bar */}
      <div className="hidden flex-shrink-0 lg:block">
        <IdeStatusBar
          availableForHire={p?.availableForHire ?? false}
          availableLabel={p?.availableLabel ?? null}
        />
      </div>

      {/* Mobile: Bottom tab bar */}
      <nav className="flex h-14 flex-shrink-0 items-center justify-around border-t border-neutral-800 bg-[#111] px-2 pb-1 lg:hidden">
        {SECTIONS.filter(({ id }) => id !== "dogbreed").map(({ id, label }) => {
          const icons: Record<string, ReactNode> = {
            home:     <Home size={18} />,
            projects: <FolderOpen size={18} />,
            about:    <span className="text-base">◉</span>,
            skills:   <Settings size={18} />,
            contact:  <Mail size={18} />,
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

export function IdeShell({ profile, sections, projects, skills }: IdeShellProps) {
  return (
    <IdeProvider>
      <IdeShellInner profile={profile} sections={sections} projects={projects} skills={skills} />
    </IdeProvider>
  );
}
