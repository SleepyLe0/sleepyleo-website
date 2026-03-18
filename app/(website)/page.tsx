// app/(website)/page.tsx
import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/sections/projects-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactSection } from "@/components/sections/contact-section";
import { IdeShell } from "@/components/ide-shell";
import { getProjects, getTotalCommits, getProfile, getSkills } from "@/lib/actions";
import { DogBreedSection } from "@/components/sections/dogbreed-section";

export const revalidate = 3600;

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
  const [profile, projectsResult, skillsResult] = await Promise.all([
    getProfileData(),
    getProjects(),
    getSkills(),
  ]);

  const projects = projectsResult.success ? projectsResult.data : [];
  const skills = skillsResult.success ? skillsResult.data : [];
  const adminUrl = process.env.ADMIN_URL ?? "http://localhost:3001";

  return (
    <IdeShell
      profile={profile}
      projects={projects}
      skills={skills}
      sections={{
        home:      <Hero profile={profile} />,
        projects:  <Suspense fallback={null}><ProjectsData /></Suspense>,
        about:     <Suspense fallback={null}><AboutData /></Suspense>,
        skills:    <Suspense fallback={null}><SkillsData /></Suspense>,
        contact:   <Suspense fallback={null}><ContactData /></Suspense>,
        dogbreed:  <DogBreedSection adminUrl={adminUrl} />,
      }}
    />
  );
}
