// components/ide-explorer.tsx
"use client";

import { SECTIONS, useIde } from "@/components/ide-context";

interface IdeExplorerProps {
  profileName: string | null;
  availableForHire: boolean;
  availableLabel: string | null;
}

export function IdeExplorer({
  profileName,
  availableForHire,
  availableLabel,
}: IdeExplorerProps) {
  const { activeSection, navigateTo } = useIde();

  return (
    <aside className="flex h-full w-[200px] flex-shrink-0 flex-col border-r border-neutral-800 bg-[#0d0d0d]">
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

        {/* Section files (pages only) */}
        {SECTIONS.filter((s) => s.path.startsWith("pages/")).map((sec) => (
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

        {/* dogbreed.tsx */}
        {(() => {
          const sec = SECTIONS.find((s) => s.id === "dogbreed")!;
          return (
            <button
              onClick={() => navigateTo("dogbreed")}
              className={`flex w-full items-center gap-1.5 border-l-2 py-1 pl-8 pr-3 font-mono text-[11px] transition-colors ${
                activeSection === "dogbreed"
                  ? "border-indigo-500 bg-neutral-800/60 text-white"
                  : "border-transparent text-neutral-500 hover:bg-neutral-800/30 hover:text-neutral-300"
              }`}
            >
              <span className="text-[10px]">🐶</span>
              {sec.file}
            </button>
          );
        })()}

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
