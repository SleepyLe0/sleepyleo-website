// app/(website)/page.tsx
import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/sections/projects-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactSection } from "@/components/sections/contact-section";
import { IdeShell } from "@/components/ide-shell";
import { getProjects, getTotalCommits, getProfile, getSkills } from "@/lib/actions";
import { DogBreedQuizClient } from "@/components/dog-breed-quiz-client";

export const revalidate = 3600;

// Fetch profile once for IdeShell chrome + Hero code block
async function getProfileData() {
  const result = await getProfile();
  return result.success ? result.data : null;
}

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
  const profile = await getProfileData();
  return <AboutSection profile={profile} />;
}

async function SkillsData() {
  const result = await getSkills();
  return <SkillsSection skills={result.success ? result.data : []} />;
}

async function ContactData() {
  const profile = await getProfileData();
  return <ContactSection profile={profile} />;
}

export default async function Home() {
  const profile = await getProfileData();

  return (
    <IdeShell profile={profile}>
      <Hero profile={profile} />

      <Suspense fallback={null}><ProjectsData /></Suspense>
      <Suspense fallback={null}><AboutData /></Suspense>
      <Suspense fallback={null}><SkillsData /></Suspense>
      <Suspense fallback={null}><ContactData /></Suspense>

      <DogBreedQuizClient adminUrl={process.env.ADMIN_URL ?? "http://localhost:3001"} />
    </IdeShell>
  );
}
