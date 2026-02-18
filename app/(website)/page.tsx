import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/sections/projects-section";
import { DogBreedQuiz } from "@/components/dog-breed-quiz";
import { getProjects, getTotalCommits } from "@/lib/actions";

// Force dynamic rendering to always show fresh data
export const dynamic = "force-dynamic";

export default async function Home() {
  const [result, totalCommits] = await Promise.all([
    getProjects(),
    getTotalCommits(),
  ]);
  const projects = result.success ? result.data : [];

  return (
    <>
      <Hero />
      <ProjectsSection projects={projects} totalCommits={totalCommits} />
      <DogBreedQuiz adminUrl={process.env.ADMIN_URL ?? "http://localhost:3001"} />
    </>
  );
}
