// components/view-toggle.tsx
"use client";

import { ViewMode } from "@/components/ide-context";

interface ViewToggleProps {
  value: ViewMode;
  onChange: () => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center overflow-hidden rounded border border-neutral-800 bg-neutral-900 text-[10px]">
      <button
        onClick={onChange}
        className={`flex items-center gap-1 px-2.5 py-1 transition-colors ${
          value === "preview"
            ? "bg-indigo-950 text-indigo-400"
            : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        <span>⊞</span> Preview
      </button>
      <div className="h-3.5 w-px bg-neutral-800" />
      <button
        onClick={onChange}
        className={`flex items-center gap-1 px-2.5 py-1 font-mono transition-colors ${
          value === "code"
            ? "bg-indigo-950 text-indigo-400"
            : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        &lt;/&gt; Code
      </button>
    </div>
  );
}
