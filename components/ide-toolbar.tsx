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
