import { ImmersivePortfolio } from "@/components/immersive-portfolio";
import { getProfile, getProjects, getSkills } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projects, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
  ]);

  return (
    <ImmersivePortfolio
      profile={profile.success ? profile.data : null}
      projects={projects.success ? projects.data : []}
      skills={skills.success ? skills.data : []}
    />
  );
}
