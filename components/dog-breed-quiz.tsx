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

export function DogBreedQuiz() {
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongMessage, setWrongMessage] = useState("");

  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";

  const handleSelect = (breed: typeof breeds[number]) => {
    setSelected(breed.name);
    if (!breed.correct) {
      setWrongMessage(wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
    }
  };

  const isCorrect = selected === "French Bulldog";

  return (
    <section className="py-16 px-4">
      <div className="max-w-md mx-auto text-center">
        <p className="text-neutral-600 text-xs mb-4">
          One more thing...
        </p>
        <h3 className="text-neutral-500 text-sm mb-6">
          What&apos;s the best dog breed?
        </h3>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {breeds.map((breed) => (
            <button
              key={breed.name}
              onClick={() => handleSelect(breed)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                selected === breed.name
                  ? breed.correct
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
                    : "border-red-500/30 bg-red-500/5 text-red-400/70"
                  : "border-white/5 text-neutral-600 hover:border-white/10 hover:text-neutral-400"
              }`}
            >
              {breed.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selected && !isCorrect && (
            <motion.p
              key="wrong"
              initial={{ opacity: 0, y: 5 }}
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
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-indigo-400/70 text-xs">
                Correct! You have great taste.
              </p>
              <a
                href={adminUrl}
                className="inline-block text-[10px] text-neutral-600 hover:text-indigo-400 transition-colors underline underline-offset-2 decoration-neutral-800 hover:decoration-indigo-500/50"
              >
                You&apos;ve earned a secret passage
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
