"use client";

import { motion } from "motion/react";
import { DogBreedQuizClient } from "@/components/dog-breed-quiz-client";
import { CodeBlock } from "@/components/code-block";
import { useIde } from "@/components/ide-context";

interface DogBreedSectionProps {
  adminUrl: string;
}

export function DogBreedSection({ adminUrl }: DogBreedSectionProps) {
  const { getViewMode } = useIde();

  return (
    <section id="dogbreed">
      {getViewMode("dogbreed") === "code" ? (
        <CodeBlock section="dogbreed" />
      ) : (
        <div className="relative bg-transparent py-16 sm:py-24 px-4">
          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3 block">
                Secret Lab
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                The most important question
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed">
                Before you explore any further — there&apos;s one thing I need to know about you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <DogBreedQuizClient adminUrl={adminUrl} />
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}
