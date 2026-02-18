"use server";

import { prisma } from "@/lib/prisma";

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  techStack: string[];
  memeUrl: string | null;
  repoUrl: string | null;
  liveUrl: string | null;
  visible: boolean;
  featured: boolean;
  githubId: number | null;
  stars: number;
  forks: number;
  language: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getProjects(includeHidden = false): Promise<{ success: boolean; data: Project[]; error?: string }> {
  if (!prisma) {
    return { success: false, data: [], error: "Database not configured" };
  }

  try {
    const projects = await prisma.project.findMany({
      where: includeHidden ? {} : { visible: true },
      orderBy: [{ featured: "desc" }, { stars: "desc" }, { updatedAt: "desc" }],
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, data: [], error: "Failed to fetch projects" };
  }
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
}

export async function syncGitHubProjects() {
  if (!prisma) {
    return { success: false, error: "Database not configured" };
  }

  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    return { success: false, error: "GitHub username not configured" };
  }

  try {
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "SleepyLeo-Hub",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers, cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    const filteredRepos = repos.filter((repo) => !repo.fork && !repo.archived);

    for (const repo of filteredRepos) {
      const slug = repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const existing = await prisma.project.findUnique({
        where: { githubId: repo.id },
      });

      if (existing) {
        await prisma.project.update({
          where: { githubId: repo.id },
          data: {
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            description: repo.description || existing.description,
          },
        });
      } else {
        const slugExists = await prisma.project.findUnique({
          where: { slug },
        });

        await prisma.project.create({
          data: {
            githubId: repo.id,
            name: repo.name,
            slug: slugExists ? `${slug}-${repo.id}` : slug,
            description: repo.description,
            repoUrl: repo.html_url,
            liveUrl: repo.homepage,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            techStack: repo.topics || [],
            visible: true,
          },
        });
      }
    }

    return { success: true, synced: filteredRepos.length };
  } catch (error) {
    console.error("Failed to sync GitHub projects:", error);
    return { success: false, error: "Failed to sync GitHub projects" };
  }
}
