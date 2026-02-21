import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/sections/projects-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactSection } from "@/components/sections/contact-section";
import { DogBreedQuiz } from "@/components/dog-breed-quiz";
import { getProjects, getTotalCommits, getProfile, getSkills } from "@/lib/actions";

// Force dynamic rendering to always show fresh data
export const dynamic = "force-dynamic";

export default async function Home() {
  const [result, totalCommits, profileResult, skillsResult] = await Promise.all([
    getProjects(),
    getTotalCommits(),
    getProfile(),
    getSkills(),
  ]);
  const projects = result.success ? result.data : [];
  const profile = profileResult.success ? profileResult.data : null;
  const skills = skillsResult.success ? skillsResult.data : [];

  return (
    <>
      <Hero />
      <ProjectsSection projects={projects} totalCommits={totalCommits} />
      <AboutSection profile={profile} />
      <SkillsSection skills={skills} />
      <ContactSection profile={profile} />
      <DogBreedQuiz adminUrl={process.env.ADMIN_URL ?? "http://localhost:3001"} />
    </>
  );
}
