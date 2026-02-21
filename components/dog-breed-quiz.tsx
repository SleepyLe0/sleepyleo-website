"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const breeds = [
  { name: "Golden Retriever", correct: false },
  { name: "Husky", correct: false },
  { name: "French Bulldog", correct: true },
  { name: "Poodle", correct: false },
];

const wrongMessages = [
  "Hmm, good choice but not quite...",
  "Respectable, but wrong answer.",
  "Try again, you're overthinking it.",
  "Nope! Think smaller and snortier.",
];

function pickRandomWrongMessage() {
  return wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
}

export function DogBreedQuiz({ adminUrl }: { adminUrl: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongMessage, setWrongMessage] = useState("");

  const handleSelect = (breed: (typeof breeds)[number]) => {
    setSelected(breed.name);
    if (!breed.correct) {
      setWrongMessage(pickRandomWrongMessage());
    }
  };

  const isCorrect = selected === "French Bulldog";

  return (
    <section className="relative bg-zinc-950 py-20 px-4">
      {/* Top separator line */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center"
      >
        <p className="text-neutral-700 text-[10px] uppercase tracking-[0.3em] mb-3">
          One more thing...
        </p>
        <h3 className="text-neutral-500 text-sm mb-6">
          What&apos;s the best dog breed?
        </h3>

        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {breeds.map((breed) => (
            <motion.button
              key={breed.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(breed)}
              className={`px-3.5 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                selected === breed.name
                  ? breed.correct
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400 shadow-sm shadow-indigo-500/10"
                    : "border-red-500/30 bg-red-500/5 text-red-400/70"
                  : "border-white/5 text-neutral-600 hover:border-white/15 hover:text-neutral-400 hover:bg-white/3"
              }`}
            >
              {breed.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selected && !isCorrect && (
            <motion.p
              key="wrong"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-neutral-600 text-xs"
            >
              {wrongMessage}
            </motion.p>
          )}
          {isCorrect && (
            <motion.div
              key="correct"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-indigo-400/70 text-xs">
                Correct! You have great taste. 🐾
              </p>
              <a
                href={adminUrl}
                className="inline-block text-[10px] text-neutral-700 hover:text-indigo-400 transition-colors underline underline-offset-2 decoration-neutral-800 hover:decoration-indigo-500/50"
              >
                You&apos;ve earned a secret passage →
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer credit */}
        <p className="mt-12 text-[10px] text-neutral-800 uppercase tracking-widest">
          Built with ☕ by SleepyLeo
        </p>
      </motion.div>
    </section>
  );
}
