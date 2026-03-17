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
