// components/ide-tabs.tsx
"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SECTIONS, useIde } from "@/components/ide-context";

export function IdeTabs() {
  const { openTabs, activeSection, navigateTo, closeTab } = useIde();

  if (openTabs.length === 0) return null;

  return (
    <div className="flex h-8 flex-shrink-0 items-end overflow-x-auto border-b border-neutral-800 bg-[#111]">
      <AnimatePresence initial={false}>
      {openTabs.map((id) => {
        const sec = SECTIONS.find((s) => s.id === id)!;
        const isActive = id === activeSection;
        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className={`group flex h-full flex-shrink-0 cursor-pointer items-center gap-1.5 border-r border-neutral-800 px-3 font-mono text-[11px] transition-colors ${
              isActive
                ? "border-t border-t-indigo-500 bg-[#0d0d0d] text-white"
                : "text-neutral-500 hover:bg-neutral-800/40 hover:text-neutral-300"
            }`}
            style={isActive ? { marginBottom: -1 } : undefined}
            onClick={() => navigateTo(id)}
          >
            <span className="text-[9px]">⚛</span>
            {sec.file}
            <button
              onClick={(e) => { e.stopPropagation(); closeTab(id); }}
              className="ml-0.5 rounded p-0.5 text-neutral-600 opacity-0 transition-opacity hover:text-neutral-300 group-hover:opacity-100"
            >
              <X size={10} />
            </button>
          </motion.div>
        );
      })}
      </AnimatePresence>
    </div>
  );
}
