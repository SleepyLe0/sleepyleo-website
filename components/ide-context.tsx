// components/ide-context.tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type SectionId = "home" | "projects" | "about" | "skills" | "contact" | "dogbreed";
export type ViewMode = "preview" | "code";

export interface SectionMeta {
  id: SectionId;
  file: string;        // e.g. "hero.tsx"
  path: string;        // e.g. "pages/hero.tsx"
  label: string;       // e.g. "Home"
}

export const SECTIONS: SectionMeta[] = [
  { id: "home",      file: "hero.tsx",       path: "pages/hero.tsx",           label: "Home"      },
  { id: "projects",  file: "projects.tsx",   path: "pages/projects.tsx",       label: "Projects"  },
  { id: "about",     file: "about.tsx",      path: "pages/about.tsx",          label: "About"     },
  { id: "skills",    file: "skills.tsx",     path: "pages/skills.tsx",         label: "Skills"    },
  { id: "contact",   file: "contact.tsx",    path: "pages/contact.tsx",        label: "Contact"   },
  { id: "dogbreed",  file: "dogbreed.tsx",   path: "utils/dogbreed.tsx",       label: "Dog Breed" },
];

interface IdeState {
  activeSection: SectionId;
  openTabs: SectionId[];
  viewMode: ViewMode;
  setActiveSection: (id: SectionId) => void;
  openTab: (id: SectionId) => void;
  closeTab: (id: SectionId) => void;
  toggleView: () => void;
  getViewMode: (id: SectionId) => ViewMode;
  navigateTo: (id: SectionId) => void;
}

const IdeContext = createContext<IdeState | null>(null);

export function IdeProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<SectionId>("home");
  const [openTabs, setOpenTabs] = useState<SectionId[]>(["home"]);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

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

  const toggleView = useCallback(() => {
    setViewMode((prev) => (prev === "code" ? "preview" : "code"));
  }, []);

  const getViewMode = useCallback(
    (_id: SectionId): ViewMode => viewMode,
    [viewMode]
  );

  const navigateTo = useCallback(
    (id: SectionId) => {
      openTab(id);
    },
    [openTab]
  );

  return (
    <IdeContext.Provider value={{
      activeSection, openTabs, viewMode,
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
