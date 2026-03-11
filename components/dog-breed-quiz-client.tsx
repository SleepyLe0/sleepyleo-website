"use client";

import dynamic from "next/dynamic";

const DogBreedQuiz = dynamic(
  () => import("@/components/dog-breed-quiz").then((m) => ({ default: m.DogBreedQuiz })),
  { ssr: false }
);

export function DogBreedQuizClient({ adminUrl }: { adminUrl: string }) {
  return <DogBreedQuiz adminUrl={adminUrl} />;
}
