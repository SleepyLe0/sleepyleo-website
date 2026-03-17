"use client";

import { SectionId, useIde } from "@/components/ide-context";
import { ViewToggle } from "@/components/view-toggle";

interface SectionBarProps {
  sectionId: SectionId;
  filename: string;
}

export function SectionBar({ sectionId, filename }: SectionBarProps) {
  const { getViewMode, toggleView } = useIde();
  return (
    <div className="flex items-center justify-between border-b border-neutral-800/60 px-4 py-2">
      <span className="font-mono text-[10px] text-neutral-600">
        pages / <span className="text-indigo-400">{filename}</span>
      </span>
      <ViewToggle
        value={getViewMode(sectionId)}
        onChange={() => toggleView(sectionId)}
      />
    </div>
  );
}
