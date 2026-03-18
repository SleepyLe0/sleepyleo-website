// components/sidebar-settings.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";

const PRANK_STYLES = `
  .prank-cursor, .prank-cursor * { cursor: none !important; }
  .prank-flip { transform: rotate(180deg); transition: transform 0.5s ease; }
  .prank-fontsize * { font-size: 4px !important; }
  @keyframes prankHue { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
  .prank-party { animation: prankHue 0.8s linear infinite; }
  .prank-blur { filter: blur(5px); transition: filter 0.3s ease; }
  .prank-redact * { color: transparent !important; text-shadow: 0 0 8px #000 !important; }
  @keyframes prankGravity { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(40px); } }
  .prank-gravity { animation: prankGravity 2s ease-in-out infinite; }
  .prank-dark { opacity: 0; transition: opacity 0.3s ease; }
  @keyframes confettiFall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    80%  { opacity: 1; }
    100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
  }
`;

// Module-level: survives component unmount/remount within a session, resets on page refresh
const sessionActive = new Set<string>();

function injectStyles() {
  if (document.getElementById("prank-styles")) return;
  const tag = document.createElement("style");
  tag.id = "prank-styles";
  tag.textContent = PRANK_STYLES;
  document.head.appendChild(tag);
}

interface Prank {
  key: string;
  label: string;
  desc: string;
  cssClass?: string;
  on: (spawnConfetti: () => void) => void;
  off: (clearConfetti: () => void) => void;
}

const PRANKS: Prank[] = [
  {
    key: "optimize.cursor",
    label: "optimize.cursor",
    desc: "Reduce cursor overhead for better performance",
    cssClass: "prank-cursor",
    on()  { document.documentElement.classList.add("prank-cursor"); },
    off() { document.documentElement.classList.remove("prank-cursor"); },
  },
  {
    key: "performance.flipMode",
    label: "performance.flipMode",
    desc: "Unlock GPU-accelerated hardware rendering",
    cssClass: "prank-flip",
    on()  { document.documentElement.classList.add("prank-flip"); },
    off() { document.documentElement.classList.remove("prank-flip"); },
  },
  {
    key: "accessibility.fontSize",
    label: "accessibility.fontSize",
    desc: "AI-powered font size optimization",
    cssClass: "prank-fontsize",
    on()  { document.documentElement.classList.add("prank-fontsize"); },
    off() { document.documentElement.classList.remove("prank-fontsize"); },
  },
  {
    key: "display.partyMode",
    label: "display.partyMode",
    desc: "Sync display colors with GPU clock cycles",
    cssClass: "prank-party",
    on()  { document.documentElement.classList.add("prank-party"); },
    off() { document.documentElement.classList.remove("prank-party"); },
  },
  {
    key: "editor.blur",
    label: "editor.blur",
    desc: "Reduce eye strain — recommended by 0 doctors",
    cssClass: "prank-blur",
    on()  { document.documentElement.classList.add("prank-blur"); },
    off() { document.documentElement.classList.remove("prank-blur"); },
  },
  {
    key: "security.redact",
    label: "security.redact",
    desc: "Hide sensitive portfolio data for privacy",
    cssClass: "prank-redact",
    on()  { document.documentElement.classList.add("prank-redact"); },
    off() { document.documentElement.classList.remove("prank-redact"); },
  },
  {
    key: "performance.gravity",
    label: "performance.gravity",
    desc: "Remove layout constraints for free-form rendering",
    cssClass: "prank-gravity",
    on()  { document.documentElement.classList.add("prank-gravity"); },
    off() { document.documentElement.classList.remove("prank-gravity"); },
  },
  {
    key: "editor.darkMode",
    label: "editor.darkMode",
    desc: "Maximum darkness — for true dark mode purists",
    cssClass: "prank-dark",
    on()  { document.documentElement.classList.add("prank-dark"); },
    off() { document.documentElement.classList.remove("prank-dark"); },
  },
  {
    key: "fun.confetti",
    label: "fun.confetti",
    desc: "Celebrate shipping — you earned it",
    on(spawnConfetti)  { spawnConfetti(); },
    off(clearConfetti) { clearConfetti(); },
  },
];

export function SidebarSettings() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState<Set<string>>(new Set());
  const confettiRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function spawnBatch() {
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#f97316"];
    for (let i = 0; i < 12; i++) {
      const el = document.createElement("div");
      el.className = "prank-confetti-piece";
      const duration = Math.random() * 1.5 + 1.5;
      el.style.cssText = `
        position: fixed; z-index: 99999;
        width: ${Math.random() * 8 + 6}px; height: ${Math.random() * 8 + 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        left: ${Math.random() * 100}vw; top: -10px; opacity: 1;
        animation: confettiFall ${duration}s linear forwards;
        animation-delay: ${Math.random() * 0.4}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), (duration + 0.6) * 1000);
    }
  }

  function startConfetti() {
    spawnBatch();
    confettiRef.current = setInterval(spawnBatch, 1200);
  }

  function stopConfetti() {
    if (confettiRef.current) {
      clearInterval(confettiRef.current);
      confettiRef.current = null;
    }
    document.querySelectorAll(".prank-confetti-piece").forEach((el) => el.remove());
  }

  // Inject persistent styles + restore session state on remount (e.g. panel close/reopen)
  useEffect(() => {
    injectStyles();
    if (sessionActive.size === 0) return;

    for (const key of sessionActive) {
      const prank = PRANKS.find((p) => p.key === key);
      if (!prank) continue;
      if (prank.cssClass) {
        document.documentElement.classList.add(prank.cssClass);
      } else if (key === "fun.confetti" && !confettiRef.current) {
        startConfetti();
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(new Set(sessionActive));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle(key: string, checked: boolean) {
    const prank = PRANKS.find((p) => p.key === key);
    if (!prank) return;

    if (checked) {
      sessionActive.add(key);
      prank.on(startConfetti);
    } else {
      sessionActive.delete(key);
      prank.off(stopConfetti);
    }
    setActive((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  const filtered = search
    ? PRANKS.filter(
        (p) =>
          p.key.toLowerCase().includes(search.toLowerCase()) ||
          p.desc.toLowerCase().includes(search.toLowerCase())
      )
    : PRANKS;

  return (
    <aside className="flex h-full w-[220px] flex-shrink-0 flex-col border-r border-neutral-800 bg-[#0d0d0d]">
      <div className="border-b border-neutral-800 px-3 py-2 font-mono text-[9px] uppercase tracking-[2.5px] text-neutral-600">
        Settings
      </div>

      <div className="border-b border-neutral-800 p-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search settings..."
          className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1.5 font-mono text-[10px] text-neutral-400 placeholder-neutral-700 outline-none focus:border-neutral-600"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map((prank) => {
          const isActive = active.has(prank.key);
          return (
            <div
              key={prank.key}
              className="flex items-start justify-between gap-2 border-b border-neutral-900/60 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-[9px] text-neutral-400">{prank.label}</div>
                <div className="mt-0.5 font-mono text-[8px] leading-tight text-neutral-700">{prank.desc}</div>
              </div>
              <div className="flex-shrink-0">
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => toggle(prank.key, checked)}
                  className="scale-75 data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-neutral-800"
                />
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-3 py-4">
            <p className="font-mono text-[9px] text-neutral-700">no settings match &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>
    </aside>
  );
}
