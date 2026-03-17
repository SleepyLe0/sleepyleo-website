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
import { SectionBar } from "@/components/section-bar";

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
  const profile = await getProfileData();

  const adminUrl = process.env.ADMIN_URL ?? "http://localhost:3001";

  return (
    <IdeShell
      profile={profile}
      sections={{
        home:      <Hero profile={profile} />,
        projects:  <Suspense fallback={null}><ProjectsData /></Suspense>,
        about:     <Suspense fallback={null}><AboutData /></Suspense>,
        skills:    <Suspense fallback={null}><SkillsData /></Suspense>,
        contact:   <Suspense fallback={null}><ContactData /></Suspense>,
        dogbreed:  (
          <section id="dogbreed">
            <SectionBar sectionId="dogbreed" filename="dogbreed.tsx" />
            <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-10">
              <DogBreedQuizClient adminUrl={adminUrl} />
            </div>
          </section>
        ),
      }}
    />
  );
}
