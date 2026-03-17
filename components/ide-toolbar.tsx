// components/ide-toolbar.tsx
"use client";

import { SECTIONS, useIde } from "@/components/ide-context";

export function IdeToolbar() {
  const { activeSection } = useIde();
  const sec = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="flex h-7 flex-shrink-0 items-center border-b border-neutral-800/60 bg-[#0d0d0d] px-3">
      <span className="font-mono text-[10px] text-neutral-600">
        pages{" "}
        <span className="text-neutral-500">/</span>{" "}
        <span className="text-indigo-400">{sec.file}</span>
      </span>
    </div>
  );
}
