import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PROTOCOL_VERSION = "2024-11-05";

// Fetch public profile fields — email is excluded (sensitive)
async function getProfile() {
  if (!prisma) return null;
  const profile = await prisma.profile.findFirst({
    select: {
      name: true,
      bio: true,
      background: true,
      education: true,
      location: true,
      focus: true,
      fuel: true,
      timeline: true,
      availableForHire: true,
      availableLabel: true,
      github: true,
      linkedin: true,
      ctaCopy: true,
      updatedAt: true,
    },
  });
  if (!profile) return null;
  return {
    ...profile,
    social: {
      github: profile.github ? `https://github.com/${profile.github}` : null,
      linkedin: profile.linkedin
        ? `https://linkedin.com/in/${profile.linkedin}`
        : null,
    },
  };
}

async function getSkills() {
  if (!prisma) return [];
  return prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    select: {
      id: true,
      name: true,
      category: true,
      proficiency: true,
      projectUsage: true,
      order: true,
    },
  });
}

type SafeProject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  techStack: string[];
  repoUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: Date;
};

async function getVisibleProjects(): Promise<SafeProject[]> {
  if (!prisma) return [];
  return prisma.project.findMany({
    where: { visible: true },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      status: true,
      techStack: true,
      repoUrl: true,
      liveUrl: true,
      featured: true,
      stars: true,
      forks: true,
      language: true,
      updatedAt: true,
    },
  });
}

const TOOLS = [
  {
    name: "get_profile",
    description:
      "Get the portfolio owner's profile: bio, background, education, location, roles, availability, and social links",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_projects",
    description:
      "Get all publicly visible portfolio projects with name, description, tech stack, links, and GitHub stats",
    inputSchema: {
      type: "object",
      properties: {
        featured_only: {
          type: "boolean",
          description: "If true, return only featured projects",
        },
      },
      required: [],
    },
  },
  {
    name: "get_skills",
    description:
      "Get the full skills list with category, proficiency level, and related projects",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_stats",
    description:
      "Get portfolio statistics: project count, total GitHub stars/forks, top programming languages",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "search_projects",
    description:
      "Search projects by name, description, tech stack, or programming language",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Search term matched against project name, description, tech stack, and language",
        },
      },
      required: ["query"],
    },
  },
];

const RESOURCES = [
  {
    uri: "portfolio://profile",
    name: "Portfolio Profile",
    description: "Public profile information from the CMS",
    mimeType: "application/json",
  },
  {
    uri: "portfolio://projects",
    name: "Portfolio Projects",
    description: "All publicly visible portfolio projects",
    mimeType: "application/json",
  },
  {
    uri: "portfolio://skills",
    name: "Skills & Technologies",
    description: "Skills list managed via the admin CMS",
    mimeType: "application/json",
  },
];

type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
};

function ok(id: string | number | null | undefined, result: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function mcpError(
  id: string | number | null | undefined,
  code: number,
  message: string
) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

async function handleMethod(
  method: string,
  params: Record<string, unknown>,
  id: string | number | null | undefined
) {
  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {}, resources: {} },
        serverInfo: { name: "sleepyleo-portfolio", version: "1.0.0" },
      });

    case "ping":
      return ok(id, {});

    case "tools/list":
      return ok(id, { tools: TOOLS });

    case "tools/call": {
      const toolName = params.name as string;
      const args = (params.arguments ?? {}) as Record<string, unknown>;

      if (toolName === "get_profile") {
        const profile = await getProfile();
        return ok(id, {
          content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
        });
      }

      if (toolName === "get_projects") {
        const projects = await getVisibleProjects();
        const result = args.featured_only
          ? projects.filter((p) => p.featured)
          : projects;
        return ok(id, {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        });
      }

      if (toolName === "get_skills") {
        const skills = await getSkills();
        return ok(id, {
          content: [{ type: "text", text: JSON.stringify(skills, null, 2) }],
        });
      }

      if (toolName === "get_stats") {
        const projects = await getVisibleProjects();
        const langCount: Record<string, number> = {};
        let totalStars = 0;
        let totalForks = 0;
        for (const p of projects) {
          totalStars += p.stars;
          totalForks += p.forks;
          if (p.language) {
            langCount[p.language] = (langCount[p.language] ?? 0) + 1;
          }
        }
        const topLanguages = Object.entries(langCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([language, projectCount]) => ({ language, projectCount }));
        return ok(id, {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  totalProjects: projects.length,
                  featuredProjects: projects.filter((p) => p.featured).length,
                  totalStars,
                  totalForks,
                  topLanguages,
                },
                null,
                2
              ),
            },
          ],
        });
      }

      if (toolName === "search_projects") {
        const query = ((args.query as string) ?? "").toLowerCase();
        const projects = await getVisibleProjects();
        const results = projects.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            (p.description ?? "").toLowerCase().includes(query) ||
            p.techStack.some((t) => t.toLowerCase().includes(query)) ||
            (p.language ?? "").toLowerCase().includes(query)
        );
        return ok(id, {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        });
      }

      return mcpError(id, -32602, `Unknown tool: ${toolName}`);
    }

    case "resources/list":
      return ok(id, { resources: RESOURCES });

    case "resources/read": {
      const uri = params.uri as string;

      if (uri === "portfolio://profile") {
        const profile = await getProfile();
        return ok(id, {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(profile, null, 2),
            },
          ],
        });
      }

      if (uri === "portfolio://projects") {
        const projects = await getVisibleProjects();
        return ok(id, {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(projects, null, 2),
            },
          ],
        });
      }

      if (uri === "portfolio://skills") {
        const skills = await getSkills();
        return ok(id, {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(skills, null, 2),
            },
          ],
        });
      }

      return mcpError(id, -32602, `Unknown resource URI: ${uri}`);
    }

    default:
      if (method.startsWith("notifications/")) return null;
      return mcpError(id, -32601, `Method not found: ${method}`);
  }
}

export async function POST(req: NextRequest) {
  let body: JsonRpcRequest | JsonRpcRequest[];

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(mcpError(null, -32700, "Parse error"), {
      status: 400,
    });
  }

  if (Array.isArray(body)) {
    const responses = await Promise.all(
      body.map((r) => handleMethod(r.method, r.params ?? {}, r.id))
    );
    return NextResponse.json(responses.filter(Boolean));
  }

  const response = await handleMethod(body.method, body.params ?? {}, body.id);

  if (response === null) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json(response);
}

// SSE endpoint for server-initiated messages (Streamable HTTP transport spec)
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(": MCP SSE ready\n\n"));
      controller.close();
    },
  });
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
