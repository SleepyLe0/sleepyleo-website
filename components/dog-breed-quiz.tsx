"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const breeds = [
  { name: "Golden Retriever", correct: false },
  { name: "Husky",            correct: false },
  { name: "French Bulldog",   correct: true  },
  { name: "Poodle",           correct: false },
];

const wrongMessages = [
  "TypeError: wrong answer — expected 'French Bulldog'",
  "AssertionError: taste.level < required",
  "404: Good taste not found. Try again.",
  "RangeError: answer out of acceptable bounds",
];

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function DogBreedQuiz({ adminUrl }: { adminUrl: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongMsg, setWrongMsg] = useState("");

  const handleSelect = (breed: (typeof breeds)[number]) => {
    if (selected) return; // lock after first pick
    setSelected(breed.name);
    if (!breed.correct) setWrongMsg(pickRandom(wrongMessages));
  };

  const isCorrect = selected === "French Bulldog";

  return (
    <div className="w-full max-w-xl mx-auto font-mono">
      {/* Fake terminal window */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
        {/* Terminal title bar */}
        <div className="flex items-center gap-1.5 border-b border-neutral-800 bg-neutral-900 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-3 text-[10px] text-neutral-600">dogbreed.tsx — quiz runtime</span>
        </div>

        {/* Terminal body */}
        <div className="p-5 space-y-4 text-[12px] leading-relaxed">
          {/* Static "code" lines */}
          <div className="space-y-1">
            <p className="text-neutral-600">
              <span className="text-indigo-400">const</span>{" "}
              <span className="text-sky-300">question</span>{" "}
              <span className="text-neutral-500">=</span>{" "}
              <span className="text-amber-300/80">&quot;What&apos;s the best dog breed?&quot;</span>
              <span className="text-neutral-500">;</span>
            </p>
            <p className="text-neutral-600">
              <span className="text-indigo-400">const</span>{" "}
              <span className="text-sky-300">options</span>{" "}
              <span className="text-neutral-500">= [</span>
              {breeds.map((b, i) => (
                <span key={b.name}>
                  <span className="text-amber-300/60">&quot;{b.name}&quot;</span>
                  {i < breeds.length - 1 && <span className="text-neutral-600">, </span>}
                </span>
              ))}
              <span className="text-neutral-500">];</span>
            </p>
          </div>

          <div className="border-t border-neutral-800/60" />

          {/* Prompt */}
          <div>
            <p className="text-neutral-500 text-[11px] mb-3">
              <span className="text-green-400">▶</span> Select answer:{" "}
              <span className="text-neutral-600">{'// choose wisely'}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {breeds.map((breed) => {
                const isSelected = selected === breed.name;
                return (
                  <motion.button
                    key={breed.name}
                    whileHover={!selected ? { scale: 1.03 } : {}}
                    whileTap={!selected ? { scale: 0.97 } : {}}
                    onClick={() => handleSelect(breed)}
                    disabled={!!selected}
                    className={`rounded border px-3 py-1.5 text-[11px] transition-all duration-200 ${
                      isSelected
                        ? breed.correct
                          ? "border-green-500/40 bg-green-500/10 text-green-400"
                          : "border-red-500/30 bg-red-500/5 text-red-400"
                        : selected
                          ? "border-neutral-800 text-neutral-700 cursor-default"
                          : "border-neutral-700 text-neutral-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-indigo-300 cursor-pointer"
                    }`}
                  >
                    {isSelected ? (breed.correct ? "✓ " : "✗ ") : ""}
                    &quot;{breed.name}&quot;
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Output */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t border-neutral-800/60 pt-4 space-y-2"
              >
                {isCorrect ? (
                  <>
                    <p className="text-green-400 text-[11px]">
                      <span className="text-neutral-600">console.log(</span>
                      &quot;✓ Correct! French Bulldog is the only valid answer.&quot;
                      <span className="text-neutral-600">)</span>
                    </p>
                    <p className="text-neutral-600 text-[11px]">
                      <span className="text-indigo-400">const</span>{" "}
                      <span className="text-sky-300">secretPassage</span>{" "}
                      <span className="text-neutral-500">=</span>{" "}
                      <a
                        href={adminUrl}
                        className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300 transition-colors"
                      >
                        &quot;{adminUrl}&quot;
                      </a>
                      <span className="text-neutral-500">; </span>
                      <span className="text-neutral-700">{'// 🔓 unlocked'}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-red-400/80 text-[11px]">
                    <span className="text-red-500/60">Error:</span>{" "}
                    {wrongMsg}{" "}
                    <button
                      onClick={() => { setSelected(null); setWrongMsg(""); }}
                      className="ml-2 text-neutral-600 underline underline-offset-2 hover:text-neutral-400 transition-colors"
                    >
                      retry
                    </button>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cursor blink */}
          {!selected && (
            <p className="text-indigo-400 text-[11px]">
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}
              >
                █
              </motion.span>
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-neutral-800">
        Built with ☕ by SleepyLeo
      </p>
    </div>
  );
}
