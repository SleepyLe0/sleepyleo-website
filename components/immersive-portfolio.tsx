"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  Copy,
  Github,
  Leaf,
  Mail,
  Moon,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Sun,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Profile, Skill } from "@/lib/actions";
import type { Destination } from "@/components/sleepy-world-scene";
import "./sleepy-world.css";

const WorldScene = dynamic(() => import("@/components/sleepy-world-scene"), {
  ssr: false,
});
type Project = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  techStack: string[];
  featured: boolean;
  language: string | null;
  status: string;
  repoUrl?: string | null;
  liveUrl?: string | null;
};
const chapters: {
  id: Destination;
  number: string;
  title: string;
  subtitle: string;
  icon: typeof Compass;
}[] = [
  {
    id: "home",
    number: "00",
    title: "The island",
    subtitle: "A place for possibility",
    icon: Compass,
  },
  {
    id: "work",
    number: "01",
    title: "The workshop",
    subtitle: "Ideas, made real",
    icon: Sparkles,
  },
  {
    id: "about",
    number: "02",
    title: "The slow corner",
    subtitle: "The human behind it all",
    icon: Leaf,
  },
  {
    id: "contact",
    number: "03",
    title: "The next chapter",
    subtitle: "It starts with a hello",
    icon: Mail,
  },
];
const copy = {
  home: {
    eyebrow: "A SMALL WORLD. A CURIOUS MIND.",
    line: "Somewhere",
    accent: "between",
    end: "dream & code.",
    description:
      "Welcome to my little corner of the internet. A place where curious ideas wake up and become real things.",
    cta: "Explore the island",
  },
  work: {
    eyebrow: "01 / THE WORKSHOP",
    line: "Little sparks.",
    accent: "Real",
    end: "possibilities.",
    description:
      "Experiments, interfaces, and things built from scratch. This is where the daydreams get their first commit.",
    cta: "Open the project journal",
  },
  about: {
    eyebrow: "02 / THE SLOW CORNER",
    line: "Powered by",
    accent: "curiosity.",
    end: "And matcha.",
    description:
      "A developer, a professional overthinker, and a believer that the small details make all the difference. Take a seat.",
    cta: "Meet the human",
  },
  contact: {
    eyebrow: "03 / THE NEXT CHAPTER",
    line: "Good things",
    accent: "begin with",
    end: "a hello.",
    description:
      "Have a curious idea, a new opportunity, or a story to share? There’s always room for one more conversation.",
    cta: "Leave a little hello",
  },
};

export function ImmersivePortfolio({
  profile,
  projects,
  skills,
}: {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
}) {
  const [destination, setDestination] = useState<Destination>("home");
  const [night, setNight] = useState(false);
  const [paused, setPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reading, setReading] = useState(false);
  const [journal, setJournal] = useState<Destination | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [visited, setVisited] = useState<Destination[]>(["home"]);
  const journalTrigger = useRef<HTMLButtonElement>(null);
  const current = copy[destination];
  const github = profile?.github || "SleepyLe0";
  const linkedin = profile?.linkedin || "kundids-khawmeesri-90814526a";
  const name = profile?.name || "Kundids Khawmeesri";
  const technology = skills.length
    ? [...new Set(skills.map((skill) => skill.name))]
    : ["TypeScript", "React", "Next.js", "Node.js"];
  const sorted = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );
  useEffect(() => {
    const applyHash = () => {
      const target = window.location.hash.slice(1);
      const aliases: Record<string, Destination> = {
        projects: "work",
        work: "work",
        about: "about",
        contact: "contact",
        home: "home",
      };
      const id = aliases[target];
      if (id) {
        setDestination(id);
        setVisited((previous) =>
          previous.includes(id) ? previous : [...previous, id],
        );
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);
  const choose = useCallback((id: Destination) => {
    setDestination(id);
    window.history.replaceState(
      null,
      "",
      id === "home" ? window.location.pathname : `#${id}`,
    );
    setVisited((previous) =>
      previous.includes(id) ? previous : [...previous, id],
    );
  }, []);
  const selectObject = useCallback(
    (id: Destination) => {
      choose(id);
      setJournal(id);
    },
    [choose],
  );
  const copyEmail = async () => {
    if (!profile?.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  };
  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timeout);
  }, [copied]);
  const showReading = reading || failed;

  function projectContent() {
    return (
      <>
        <div className="journal-projects">
          {sorted.length ? (
            sorted.map((project, i) => (
              <Link
                className="journal-project"
                href={`/projects/${project.slug}`}
                key={project.id}
              >
                <span className="project-order">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="project-type">
                    {project.featured
                      ? "FEATURED PROJECT"
                      : project.language || "PROJECT"}
                  </span>
                  <h3>{project.name}</h3>
                  <p>
                    {project.description ||
                      "A closer look at the idea, the build, and the details."}
                  </p>
                  <div className="world-tags">
                    {project.techStack.slice(0, 5).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight size={20} />
              </Link>
            ))
          ) : (
            <div className="journal-note">
              <Sparkles size={28} />
              <h3>The workshop is always open.</h3>
              <p>
                My latest public projects live on GitHub. Come see what I’ve
                been making.
              </p>
              <a
                href={`https://github.com/${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="world-link"
              >
                Explore GitHub <ArrowUpRight size={16} />
              </a>
            </div>
          )}
        </div>
        <a
          className="world-link"
          href={`https://github.com/${github}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={17} /> All the commits, over here{" "}
          <ArrowUpRight size={16} />
        </a>
      </>
    );
  }
  function aboutContent() {
    return (
      <>
        <div className="journal-person">
          <Image src="/gunnie.webp" width={160} height={160} alt={name} />
          <div>
            <span className="project-type">THE ISLAND’S RESIDENT</span>
            <h3>{name}</h3>
            <p>Fullstack developer · perpetually curious</p>
          </div>
        </div>
        <div className="world-prose">
          <ReactMarkdown>
            {profile?.bio ||
              "I’m SleepyLeo. I turn ideas into thoughtful web experiences with TypeScript, React, and Next.js. I like work that makes me curious, interfaces that feel natural, and the little details you notice only when they’re missing."}
          </ReactMarkdown>
          {profile?.background && (
            <ReactMarkdown>{profile.background}</ReactMarkdown>
          )}
        </div>
        <div className="personal-note">
          <Leaf size={23} />
          <p>
            Build things with care.
            <br />
            Make time to daydream.
            <br />
            Don’t forget the matcha.
          </p>
          <span>A LITTLE ISLAND PHILOSOPHY</span>
        </div>
        <dl className="world-facts">
          {(
            [
              ["Based in", profile?.location],
              ["Education", profile?.education],
              ["Exploring", profile?.focus],
              ["Fuel", profile?.fuel || "Matcha & curiosity"],
            ] as const
          )
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
        <h3 className="journal-subtitle">Things in my toolkit</h3>
        <div className="world-tags large">
          {technology.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {profile?.timeline?.length ? (
          <>
            <h3 className="journal-subtitle">The path so far</h3>
            <ol className="world-timeline">
              {profile.timeline.map((item, i) => (
                <li key={i}>
                  <span>{item.year}</span>
                  <p>{item.event}</p>
                </li>
              ))}
            </ol>
          </>
        ) : null}
      </>
    );
  }
  function contactContent() {
    return (
      <>
        <div className="contact-letter">
          <span>TO: THE NEXT GOOD IDEA</span>
          <p>
            {profile?.ctaCopy ||
              "Let’s make something we’re excited to put into the world."}
          </p>
          <span>FROM: SLEEPYLEO ♡</span>
        </div>
        {profile?.availableForHire && (
          <p className="world-availability">
            <i />
            {profile.availableLabel || "Open to opportunities"}
          </p>
        )}
        <div className="contact-options">
          {profile?.email && (
            <div className="email-option">
              <a href={`mailto:${profile.email}`}>
                <Mail size={20} />
                <span>
                  Email me<strong>{profile.email}</strong>
                </span>
                <ArrowUpRight size={20} />
              </a>
              <button onClick={copyEmail} aria-label="Copy email address">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          )}
          <a
            href={`https://github.com/${github}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} />
            <span>
              Find me on GitHub<strong>@{github}</strong>
            </span>
            <ArrowUpRight size={20} />
          </a>
          <a
            href={`https://linkedin.com/in/${linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArrowUpRight size={20} />
            <span>
              Connect on LinkedIn<strong>Let’s cross paths</strong>
            </span>
            <ArrowUpRight size={20} />
          </a>
        </div>
        <p className="copy-status" role="status">
          {copied
            ? "Email copied. Say something good."
            : copyFailed
              ? `You can copy it here: ${profile?.email}`
              : "No grand pitch needed. A simple hello is a good start."}
        </p>
      </>
    );
  }

  return (
    <div
      className={`sleepy-world ${night ? "world-night" : ""} ${showReading ? "world-reading" : ""}`}
    >
      <a href="#world-navigation" className="world-skip">
        Skip to destination navigation
      </a>
      <header className="world-header">
        <button
          className="world-brand"
          onClick={() => {
            choose("home");
            setReading(false);
          }}
          aria-label="Return to Sleepy World home"
        >
          <span className="brand-symbol">
            s<span>l</span>
          </span>
          <span>
            sleepyleo
            <span className="brand-caption">A DEVELOPER’S LITTLE WORLD</span>
          </span>
        </button>
        <div className="header-center">
          <i /> SOMEWHERE BETWEEN DREAM & CODE
        </div>
        <button
          className="world-menu-button"
          onClick={() => setReading((value) => !value)}
          aria-pressed={showReading}
        >
          <BookOpen size={16} />
          <span>
            {showReading ? "Back to the island" : "Just the essentials"}
          </span>
          <ArrowUpRight size={15} />
        </button>
      </header>

      {!showReading ? (
        <div className="world-experience">
          <div className="world-atmosphere" aria-hidden="true" />
          <div className="world-title-watermark" aria-hidden="true">
            DAYDREAM
          </div>
          <div className="world-stage">
            <WorldScene
              destination={destination}
              night={night}
              paused={paused || journal !== null}
              resetKey={resetKey}
              onReady={onReady}
              onError={onError}
              onSelect={selectObject}
            />
            {!ready && (
              <div className="world-loading" role="status">
                <span className="loading-orbit">
                  <Compass size={24} />
                </span>
                <span>A little world is waking up…</span>
              </div>
            )}
          </div>
          <div className="world-intro" key={destination}>
            <p className="world-eyebrow">
              <span /> {current.eyebrow}
            </p>
            <h1>
              {current.line}
              <br />
              <em>{current.accent}</em>
              <br />
              {current.end}
            </h1>
            <p className="world-description">{current.description}</p>
            <button
              ref={journalTrigger}
              className="world-primary"
              onClick={() =>
                destination === "home"
                  ? choose("work")
                  : setJournal(destination)
              }
            >
              {current.cta}
              <ArrowRight size={18} />
            </button>
            <p className="world-byline">
              {destination === "home" ? (
                <>
                  Hi, I’m <strong>SleepyLeo.</strong> Fullstack developer,
                  daydreamer.
                </>
              ) : (
                <>
                  <span className="byline-dash" />{" "}
                  {
                    chapters.find((chapter) => chapter.id === destination)
                      ?.subtitle
                  }
                </>
              )}
            </p>
          </div>
          <div className="world-side-label" aria-hidden="true">
            INDEPENDENT MIND / ENDLESS CURIOSITY
          </div>
          <div className="world-location">
            <span className="location-cross">+</span>
            <div>
              <span>YOU ARE HERE</span>
              <strong>
                {chapters.find((chapter) => chapter.id === destination)?.title}
              </strong>
            </div>
            <span className="location-index">
              {chapters.find((chapter) => chapter.id === destination)?.number} /
              03
            </span>
          </div>
          <div className="world-hint">
            <MousePointer2 size={15} />
            <span>Drag to wander · click an object to discover</span>
          </div>
          <div className="world-tools" aria-label="World controls">
            <button
              onClick={() => setNight((value) => !value)}
              aria-label={night ? "Switch to daylight" : "Switch to moonlight"}
              title={night ? "Daylight" : "Moonlight"}
              aria-pressed={night}
            >
              {night ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setPaused((value) => !value)}
              aria-label={
                paused ? "Resume island motion" : "Pause island motion"
              }
              title={paused ? "Resume motion" : "Pause motion"}
              aria-pressed={paused}
            >
              {paused ? <Play size={17} /> : <Pause size={17} />}
            </button>
            <button
              onClick={() => setResetKey((value) => value + 1)}
              aria-label="Reset camera"
              title="Reset camera"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>
      ) : (
        <div className="reading-content">
          <div className="reading-heading">
            <p className="world-eyebrow">THE ESSENTIALS, AT YOUR OWN PACE</p>
            <h1>
              Hello, I’m <em>SleepyLeo.</em>
            </h1>
            <p>Fullstack developer. Curious mind. Builder of little worlds.</p>
            {failed && (
              <p className="fallback-note" role="status">
                The 3D island isn’t available on this device. Everything about
                me is right here.
              </p>
            )}
          </div>
          <section id="reading-work">
            <p className="world-eyebrow">01 / SELECTED WORK</p>
            <h2>Ideas, made real.</h2>
            {projectContent()}
          </section>
          <section id="reading-about">
            <p className="world-eyebrow">02 / THE HUMAN SIDE</p>
            <h2>Behind the daydream.</h2>
            {aboutContent()}
          </section>
          <section id="reading-contact">
            <p className="world-eyebrow">03 / THE NEXT CHAPTER</p>
            <h2>A good place to say hello.</h2>
            {contactContent()}
          </section>
        </div>
      )}

      <nav
        className="world-navigation"
        id="world-navigation"
        aria-label="Island destinations"
      >
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => {
              if (showReading && chapter.id !== "home") {
                document
                  .getElementById(`reading-${chapter.id}`)
                  ?.scrollIntoView({
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "instant"
                      : "smooth",
                  });
              } else {
                setReading(false);
                choose(chapter.id);
              }
            }}
            aria-current={
              destination === chapter.id && !showReading
                ? "location"
                : undefined
            }
            className={
              destination === chapter.id && !showReading ? "is-current" : ""
            }
          >
            <span className="chapter-number">{chapter.number}</span>
            <span className="chapter-icon">
              <chapter.icon size={19} />
            </span>
            <span className="chapter-copy">
              <strong>{chapter.title}</strong>
              <span>{chapter.subtitle}</span>
            </span>
            <ArrowUpRight className="chapter-arrow" size={17} />
          </button>
        ))}
      </nav>
      <footer className="world-footer">
        <span>© {new Date().getFullYear()} SLEEPYLEO</span>
        <span>HANDCRAFTED WITH CODE & A LITTLE DAYDREAMING</span>
        <span className="discovery-count">
          <span>{visited.length} / 4</span> CORNERS DISCOVERED
        </span>
      </footer>

      <Dialog
        open={journal !== null}
        onOpenChange={(open) => {
          if (!open) setJournal(null);
        }}
      >
        <DialogContent
          className="world-journal"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            journalTrigger.current?.focus();
          }}
        >
          <div className="journal-topline">
            <span>SLEEPYLEO / FIELD NOTES</span>
            <span>
              {journal === "work" ? "01" : journal === "about" ? "02" : "03"}
            </span>
          </div>
          <DialogTitle className="journal-title">
            {journal === "work"
              ? "From the workshop."
              : journal === "about"
                ? "A little about me."
                : "Send a little hello."}
          </DialogTitle>
          <DialogDescription className="journal-description">
            {journal === "work"
              ? "A collection of ideas that made it out of my head."
              : journal === "about"
                ? "Every little world has a person behind it. This one has me."
                : "The next chapter is still unwritten. Let’s make it a good one."}
          </DialogDescription>
          <div className="journal-body">
            {journal === "work"
              ? projectContent()
              : journal === "about"
                ? aboutContent()
                : contactContent()}
          </div>
          <button className="journal-back" onClick={() => setJournal(null)}>
            <ArrowLeft size={16} /> Back to wandering
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
