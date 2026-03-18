// components/sidebar-git.tsx
"use client";

import { useState } from "react";
import { GitBranch } from "lucide-react";

interface SidebarGitProps {
  timeline: { year: string; event: string }[];
  github: string;
}

export function SidebarGit({ github }: SidebarGitProps) {
  const [clicked, setClicked] = useState(0);

  const messages = [
    "still loading...",
    "almost there...",
    "just kidding.",
    "seriously, stop clicking.",
    "okay fine — it's not done.",
    "please touch grass.",
    "i warned you.",
    "🍵 go make some matcha.",
    "you have too much free time.",
    "file a bug report. oh wait.",
  ];

  const msg = messages[Math.min(clicked, messages.length - 1)];

  return (
    <aside className="flex h-full w-[220px] flex-shrink-0 flex-col border-r border-neutral-800 bg-[#0d0d0d]">
      {/* Header */}
      <div className="border-b border-neutral-800 px-3 py-2 font-mono text-[9px] uppercase tracking-[2.5px] text-neutral-600">
        Source Control
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center select-none">
        <div className="relative">
          <GitBranch size={32} className="text-neutral-800" />
          <span className="absolute -right-1 -top-1 text-[10px]">🚧</span>
        </div>

        <div>
          <p className="font-mono text-[11px] text-neutral-500">coming soon™</p>
          <p className="mt-1 font-mono text-[9px] text-neutral-700">
            (probably)
          </p>
        </div>

        <button
          onClick={() => setClicked((c) => c + 1)}
          className="rounded border border-neutral-800 px-3 py-1.5 font-mono text-[9px] text-neutral-700 transition-colors hover:border-neutral-700 hover:text-neutral-500"
        >
          check progress
        </button>

        {clicked > 0 && (
          <p className="font-mono text-[9px] text-indigo-500 transition-all">
            {msg}
          </p>
        )}
      </div>

      {/* Footer */}
      {github && (
        <div className="border-t border-neutral-800 p-3">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-700 transition-colors hover:text-neutral-500"
          >
            <span>↗</span>
            <span>View on GitHub</span>
          </a>
        </div>
      )}
    </aside>
  );
}
