import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/sections/projects-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactSection } from "@/components/sections/contact-section";
import { getProjects, getTotalCommits, getProfile, getSkills } from "@/lib/actions";
import { DogBreedQuizClient } from "@/components/dog-breed-quiz-client";

// ISR: revalidate every hour instead of force-dynamic on every request
export const revalidate = 3600;

// Async data-fetching wrappers — each streams independently
async function ProjectsData() {
  const [result, totalCommits] = await Promise.all([getProjects(), getTotalCommits()]);
  return (
    <ProjectsSection
      projects={result.success ? result.data : []}
      totalCommits={totalCommits}
    />
  );
}

async function AboutData() {
  const profileResult = await getProfile();
  return <AboutSection profile={profileResult.success ? profileResult.data : null} />;
}

async function SkillsData() {
  const skillsResult = await getSkills();
  return <SkillsSection skills={skillsResult.success ? skillsResult.data : []} />;
}

async function ContactData() {
  const profileResult = await getProfile();
  return <ContactSection profile={profileResult.success ? profileResult.data : null} />;
}

export default function Home() {
  return (
    <>
      {/* Hero has no data dependency — renders immediately */}
      <Hero />

      {/* Each section streams independently; Hero is visible while data loads */}
      <Suspense fallback={null}>
        <ProjectsData />
      </Suspense>
      <Suspense fallback={null}>
        <AboutData />
      </Suspense>
      <Suspense fallback={null}>
        <SkillsData />
      </Suspense>
      <Suspense fallback={null}>
        <ContactData />
      </Suspense>

      <DogBreedQuizClient adminUrl={process.env.ADMIN_URL ?? "http://localhost:3001"} />
    </>
  );
}
