"use client";

import { DogBreedQuizClient } from "@/components/dog-breed-quiz-client";
import { CodeBlock } from "@/components/code-block";
import { SectionBar } from "@/components/section-bar";
import { useIde } from "@/components/ide-context";

interface DogBreedSectionProps {
  adminUrl: string;
}

export function DogBreedSection({ adminUrl }: DogBreedSectionProps) {
  const { getViewMode } = useIde();

  return (
    <section id="dogbreed">
      <SectionBar sectionId="dogbreed" filename="dogbreed.tsx" />
      {getViewMode("dogbreed") === "code" ? (
        <CodeBlock section="dogbreed" />
      ) : (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-10">
          <DogBreedQuizClient adminUrl={adminUrl} />
        </div>
      )}
    </section>
  );
}
