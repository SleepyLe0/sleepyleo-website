"use client";

import { SECTIONS, SectionId, useIde } from "@/components/ide-context";
import { ViewToggle } from "@/components/view-toggle";

interface SectionBarProps {
  sectionId: SectionId;
}

export function SectionBar({ sectionId }: SectionBarProps) {
  const { getViewMode, toggleView } = useIde();
  const section = SECTIONS.find((s) => s.id === sectionId);
  const parts = section?.path.split("/") ?? ["pages", "index.tsx"];
  const folder = parts[0];
  const file = parts[parts.length - 1];

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-800/60 bg-[#0d0d0d] px-4 py-2">
      <span className="font-mono text-[10px] text-neutral-600">
        {folder} / <span className="text-indigo-400">{file}</span>
      </span>
      <ViewToggle
        value={getViewMode(sectionId)}
        onChange={toggleView}
      />
    </div>
  );
}
