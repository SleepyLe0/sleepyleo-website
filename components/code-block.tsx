// components/code-block.tsx
"use client";

import { useMemo } from "react";

// ── Types (mirror Prisma shapes passed as props) ──────────────────────────

interface ProfileData {
  name: string | null;
  bio: string | null;
  education: string | null;
  location: string | null;
  focus: string | null;
  fuel: string | null;
  availableForHire: boolean;
  availableLabel: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
}

interface ProjectData {
  name: string;
  status: string;
  techStack: string[];
  stars?: number | null;
  forks?: number | null;
  language?: string | null;
  liveUrl?: string | null;
  repoUrl?: string | null;
}

interface SkillData {
  name: string;
  category: string;
  proficiency: string;
}

type SectionCodeProps =
  | { section: "hero";     profile: ProfileData | null }
  | { section: "projects"; projects: ProjectData[] }
  | { section: "about";    profile: ProfileData | null }
  | { section: "skills";   skills: SkillData[] }
  | { section: "contact";  profile: ProfileData | null };

// ── Serializers ──────────────────────────────────────────────────────────

function s(v: string | null | undefined) {
  return v ? `"${v}"` : `null`;
}

function serializeHero(profile: ProfileData | null): string {
  const p = profile;
  // role is derived from the FlipWords list — use focus field as the closest CMS proxy
  const role = p?.focus ?? "Fullstack Developer";
  return `// ── hero.tsx ─────────────────────────────────
// @desc  ${p?.name ?? "SleepyLeo"} — portfolio hero

const dev = {
  name:      ${s(p?.name)},
  role:      ${s(role)},
  location:  ${s(p?.location)},
  fuel:      ${s(p?.fuel)},
  available: ${p?.availableForHire ?? false},
} satisfies Developer

export default function Hero() {
  return <HeroSection data={dev} />
}

// 🍵 matcha-powered`;
}

function serializeProjects(projects: ProjectData[]): string {
  const items = projects
    .slice(0, 8)
    .map((p) =>
      `  {\n    name:     ${s(p.name)},\n    status:   ${s(p.status)},\n    stack:    [${p.techStack.map(s).join(", ")}],\n    stars:    ${p.stars ?? 0},\n    language: ${s(p.language)},\n  }`
    )
    .join(",\n");
  return `// ── projects.tsx ─────────────────────────────
// @desc  ${projects.length} projects synced from GitHub

const projects: Project[] = [
${items}
]

export default function Projects() {
  return <ProjectsSection data={projects} />
}`;
}

function serializeAbout(profile: ProfileData | null): string {
  const p = profile;
  return `// ── about.tsx ────────────────────────────────
// @desc  The human behind the code

const profile = {
  bio:       ${s(p?.bio?.slice(0, 60)?.concat("..."))},
  education: ${s(p?.education)},
  location:  ${s(p?.location)},
  focus:     ${s(p?.focus)},
  fuel:      ${s(p?.fuel)},
} satisfies Profile

export default function About() {
  return <AboutSection data={profile} />
}`;
}

function serializeSkills(skills: SkillData[]): string {
  const items = skills
    .slice(0, 10)
    .map((sk) =>
      `  { name: ${s(sk.name)}, category: ${s(sk.category)}, level: ${s(sk.proficiency)} }`
    )
    .join(",\n");
  return `// ── skills.tsx ───────────────────────────────
// @desc  Tools of the trade (${skills.length} skills)

const skills: Skill[] = [
${items},
  // ...${Math.max(0, skills.length - 10)} more
]

export default function Skills() {
  return <SkillsSection data={skills} />
}`;
}

function serializeContact(profile: ProfileData | null): string {
  const p = profile;
  return `// ── contact.tsx ──────────────────────────────
// @desc  Let's build something

export const links = {
  email:    ${s(p?.email)},
  github:   ${s(p?.github)},
  linkedin: ${s(p?.linkedin)},
} as const

export const available = ${p?.availableForHire ?? false}
export const label     = ${s(p?.availableLabel)}`;
}

// ── Token renderer ───────────────────────────────────────────────────────

type Token = { type: "kw" | "str" | "cm" | "prop" | "fn" | "num" | "plain"; text: string };

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  const patterns: [string, Token["type"]][] = [
    ["(//[^\n]*)", "cm"],
    ["(\"[^\"]*\")", "str"],
    ["\\b(const|export|default|function|return|true|false|null|satisfies|as)\\b", "kw"],
    ["\\b([A-Z][a-zA-Z]+)(?=\\()", "fn"],
    ["\\b(\\d+)\\b", "num"],
    ["([a-zA-Z_][a-zA-Z0-9_]*)(?=\\s*:)", "prop"],
  ];
  let rest = line;
  while (rest.length > 0) {
    let matched = false;
    for (const [pat, type] of patterns) {
      const m = rest.match(new RegExp("^" + pat));
      if (m) {
        tokens.push({ type, text: m[0] });
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      const last = tokens[tokens.length - 1];
      if (last?.type === "plain") last.text += rest[0];
      else tokens.push({ type: "plain", text: rest[0] });
      rest = rest.slice(1);
    }
  }
  return tokens;
}

const tokenColors: Record<Token["type"], string> = {
  kw:    "text-indigo-400",
  str:   "text-green-300",
  cm:    "text-neutral-600",
  prop:  "text-sky-300",
  fn:    "text-purple-300",
  num:   "text-orange-300",
  plain: "text-neutral-300",
};

// ── Main component ────────────────────────────────────────────────────────

export function CodeBlock(props: SectionCodeProps) {
  const code = useMemo(() => {
    if (props.section === "hero")     return serializeHero(props.profile);
    if (props.section === "projects") return serializeProjects(props.projects);
    if (props.section === "about")    return serializeAbout(props.profile);
    if (props.section === "skills")   return serializeSkills(props.skills);
    return serializeContact(props.profile);
  }, [props]);

  const lines = code.split("\n");

  return (
    <div className="flex overflow-x-auto font-mono text-[11px] leading-relaxed">
      {/* Line numbers */}
      <div className="select-none border-r border-neutral-800 px-3 py-4 text-right text-neutral-700">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      {/* Code */}
      <div className="flex-1 py-4 pl-4">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {tokenize(line).map((tok, j) => (
              <span key={j} className={tokenColors[tok.type]}>{tok.text}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
