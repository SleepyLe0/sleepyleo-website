# IDE Portfolio Redesign — Design Spec

**Date:** 2026-03-17
**Status:** Approved by user

---

## Overview

Redesign the sleepyleo-website portfolio from its current "indigo glow / particle effects" aesthetic to a **VSCode/IDE-inspired** design. The site remains a single-page scroll with anchor-linked sections. All existing personality (humor, easter eggs, sarcastic tooltips, meme GIFs) is preserved — only the visual shell changes.

---

## Design Direction

**Style:** VSCode/IDE window frame wrapping the entire portfolio
**Personality:** Keep all humor — FlipWords subtitles, sarcastic tooltips, matcha jokes, easter egg quiz
**Color scheme:** Monochrome dark (`#0d0d0d`, `#111`, `#1a1a1a`) + single indigo accent (`#818cf8`)
**Typography:** Geist Sans (body/headings) + Geist Mono (code blocks, line numbers, file tree, status bar)
**Mode:** Always dark (existing `class="dark"` on `<html>` stays)

---

## Layout Structure

### Desktop (≥ 1024px) — Full IDE chrome

```
┌─────────────────────────────────────────────────────────┐
│ ● ● ●   sleepyleo — hero.tsx — portfolio        [title] │
├────┬──────────────┬────────────────────────────────────┤
│    │ EXPLORER     │ ⚛ hero.tsx × | ⚛ projects.tsx ×  │ ← tabs
│ AB │              │────────────────────────────────────│
│    │ ▾ sleepyleo  │ pages / hero.tsx    [⊞ Preview|</>]│ ← toolbar
│    │   ▾ pages/   │                                    │
│    │     hero.tsx │   [editor content area]            │
│    │     projects │                                    │
│    │     about    │                                    │
│    │     skills   │                                    │
│    │     contact  │                                    │
│    │   ▾ utils/   │                                    │
│    │     matcha   │                                    │
│    │   README.md  │                                    │
│    │              │                                    │
│    │  ● available │                                    │
├────┴──────────────┴────────────────────────────────────┤
│ ⑂ main  ⚠ 0  ✓ 0          hero.tsx  TypeScript React  │ ← statusbar
└─────────────────────────────────────────────────────────┘
```

**Components:**
- **Title bar:** Window chrome dots (red/yellow/green), centered filename, `bg-[#111]`
- **Activity bar (AB):** 40px wide, icons for Explorer / Search / Git / Settings. Explorer always active on load.
- **File explorer:** 200px wide. Nested folder tree: `pages/` (all sections), `utils/matcha.ts` (easter egg), `README.md`. Active file highlighted with indigo left border. Availability pill at bottom.
- **Editor tabs:** Accumulate as files are clicked/scrolled. Active tab has indigo top border, `bg-[#0d0d0d]`. Inactive tabs `bg-[#111]`.
- **Toolbar:** Breadcrumb (e.g. `pages / hero.tsx`) + **Preview / `</>` Code toggle** (right-aligned).
- **Status bar:** `bg-[#818cf8]`, shows branch, error/warning counts, current file, language.

### Mobile (< 768px) — Collapsed IDE chrome

```
┌──────────────────────────────┐
│ 9:41              ●●● 🔋     │ ← status bar
├──────────────────────────────┤
│ 🐱 SleepyLeo    [⊞ | </>]  │ ← top bar with toggle
├──────────────────────────────┤
│ pages / hero.tsx    Preview  │ ← breadcrumb
├──────────────────────────────┤
│                              │
│   [scrollable content]       │
│                              │
├──────────────────────────────┤
│ ⌂    ◫    ◉    ⚙    ✉      │ ← bottom tab bar
│Home Proj About Skill Contact │
└──────────────────────────────┘
```

- File explorer + activity bar → **bottom tab bar** (5 icons with labels)
- Editor tabs → hidden (navigation via bottom tabs only)
- Top bar: logo left, Preview/Code toggle right
- Breadcrumb strip below top bar shows current section file

### Tablet (768px – 1023px) — Collapsed sidebar

Same as mobile bottom-tabs layout. The full IDE chrome (title bar, activity bar, explorer, editor tabs) is hidden. Top bar + bottom tabs + breadcrumb are shown. No drawer/hamburger — tablet uses the same bottom-tab navigation as mobile. `lg:` Tailwind prefix activates full IDE chrome.

---

## Navigation Behavior

- **Single-page scroll:** All sections (`#home`, `#projects`, `#about`, `#skills`, `#contact`) live on one page. The existing hero section currently uses `id="hero"` — this must be updated to `id="home"` in `hero.tsx` to match.
- **IntersectionObserver:** As user scrolls, updates the active file in the explorer, the active tab, the breadcrumb, and the status bar filename — same pattern as current navbar
- **Click file in explorer:** Smooth-scrolls to that section's anchor, opens it as a new tab if not already open
- **Click tab:** Smooth-scrolls to that section
- **Bottom tabs (mobile):** Tap scrolls to section and updates breadcrumb

---

## Preview / Code Toggle

The key design innovation. Each section has two view modes, toggled per-section:

### Preview mode (default)
Real, readable UI content — the visitor sees this first. Clean typography, cards, lists. No forced code styling.

### Code mode (on toggle)
Syntax-highlighted TypeScript/JSX code block **generated from live DB data** — not hardcoded. When the admin updates any value via the CMS, the code view reflects it automatically on next page load (ISR revalidation at 1 hour, or on-demand via admin).

`components/code-block.tsx` receives the section's already-fetched data as props and serializes it into a formatted, syntax-highlighted code string. No additional DB queries — it reuses the same data already passed to the Preview view.

Per-section data mapping:

| Section | Data source | Code shape rendered |
|---|---|---|
| Hero | `Profile` (from `getProfile()`) | `const dev = { name: "...", role: "...", location: "...", fuel: "...", available: true }` — all values live from DB |
| Projects | `Project[]` (from `getProjects()`) | `const projects: Project[] = [{ name: "...", status: "active", stack: [...], stars: N }]` — one entry per visible project |
| About | `Profile` | `const profile = { bio: "...", education: "...", location: "...", focus: "...", fuel: "..." }` — all from profile row |
| Skills | `Skill[]` (from `getSkills()`) | `const skills: Skill[] = [{ name: "...", category: "Frontend", level: "daily_driver" }]` — all from skills table |
| Contact | `Profile` | `export const links = { email: "...", github: "...", linkedin: "..." }` — from profile row |

**Dynamic IDE chrome elements** (also CMS-driven, not hardcoded):
- Explorer availability pill → `profile.availableForHire` + `profile.availableLabel`
- Status bar right side → shows `profile.availableLabel` (e.g. "open to work") when `availableForHire` is true
- Logo text in title bar / top bar → `profile.name`
- Title bar center filename updates as sections scroll (structural, not CMS data)

Toggle state is **per-section** (not global). Managed via a `IdeContext` React context (created in `components/ide-shell.tsx`) that holds a `Map<sectionId, 'preview' | 'code'>`. The toolbar reads the active section from context and dispatches a toggle action; each section component reads its own entry from the map. This avoids prop drilling through the shell → toolbar → section chain.

Toggle UI: `[⊞ Preview | </> Code]` pill in the toolbar on desktop, in the top bar on mobile.

---

## File Tree Structure

```
📁 sleepyleo/
  📁 pages/
    ⚛ hero.tsx        → #home section
    ⚛ projects.tsx    → #projects section
    ⚛ about.tsx       → #about section
    ⚛ skills.tsx      → #skills section
    ⚛ contact.tsx     → #contact section
  📁 utils/
    🍵 matcha.ts      → easter egg: clicking opens a **Radix popover** (not a modal) anchored to the file row. Content: one hardcoded matcha joke + the live "Cups of Matcha" count fetched from the existing `getProfile()` server action (the `fuel` field). No additional DB query needed — profile data is already loaded on the page.
  📄 README.md        → scrolls to top / refreshes page
```

---

## Section Content (what changes vs. current)

### Hero section
- **Remove:** Organic blob shape on photo, ParticleField canvas, glow blobs, dot grid, gradient fades
- **Keep:** Profile photo (`gunnie.webp`), FlipWords subtitle, stats row (Projects/Matcha/Bugs), CTA buttons, availability badge
- **Change photo:** Square with `rounded-xl` + subtle `border border-white/10`, no blob shape
- **Layout:** Photo left + text right (flex row), no full-screen hero — fits within editor content pane

### Projects section
- **Remove:** Per-card mouse spotlight, outer glow effects, parallax blobs, floating code lines, BackgroundBeams
- **Keep:** Tech stack badges with sarcastic tooltips, status badges, stars/forks, meme GIF, Code/Live buttons, featured flag
- **Meme behavior:** Hidden by default. **Desktop:** reveal on hover as overlay. **Mobile:** reveal on long-press (tap-hold ~500ms). No layout shift — overlay appears on top of card.
- **Layout:** On desktop (`lg:`), sections render as a **table/list** using a new `components/project-row.tsx` component (name, description, language, stars columns). `project-card.tsx` is used on mobile only (`< lg:`). Both share the same meme overlay behavior. Add `components/project-row.tsx` to the new components list.

### About section
- **Remove:** Background glow blobs, mouse spotlight, dot grid
- **Keep:** Bio (markdown), expandable background, info cards (Education/Location/Focus/Fuel), timeline, availability badge
- **Change:** Cleaner card borders (`border-neutral-800`), no blur backdrop effects

### Skills section
- **Remove:** Color-coded proficiency pills, background effects
- **Keep:** Category grouping (Frontend/Backend/DevOps/Tools), tooltips with `projectUsage`
- **Change:** 5-dot mastery rating per skill. Mapping: `daily_driver` = 5 filled dots, `comfortable` = 3 filled dots, `learning` = 1 filled dot. Any unknown/future proficiency value falls back to 2 filled dots. Dots are indigo-filled (`bg-indigo-500`) vs empty circles (`border border-neutral-700`). Legend at bottom.

### Contact section
- **Remove:** Background effects, spotlight
- **Keep:** CTA copy from profile, availability badge, email/GitHub/LinkedIn link cards
- **Change:** Cleaner card borders, indigo accent on hover only

### Navbar → File explorer + tabs
- **Remove:** Current floating pill navbar (`navbar.tsx`) entirely
- **Replace with:** IDE shell layout (see above). The `navbar.tsx` component is replaced by the new IDE layout.

---

## Animations

Keep animations but reduce them significantly — no particle fields, no glow pulses, no parallax blobs.

**Keep:**
- Framer Motion scroll-triggered entrance (`whileInView`, `once: true`) on sections
- FlipWords cycling animation
- Scroll-to-top button

**Remove/replace:**
- `<PageTransition />` — removed. The IDE shell's editor content area provides its own enter animation (fade-in on mount). `page-transition.tsx` is no longer used and can be deleted.

**Remove:**
- ParticleField canvas
- Mouse-tracking spotlight (all sections)
- Background blob parallax (`useScroll`/`useTransform`)
- `animate-shimmer` gradient text
- `animate-glow-pulse`
- `animate-float`

**Add:**
- Smooth tab open animation (slide in from right, ~150ms)
- File explorer active item transition (indigo border slide)
- Preview ↔ Code toggle crossfade (opacity transition, ~200ms)

---

## Components to Create / Modify

### New components
| Component | Purpose |
|---|---|
| `components/ide-shell.tsx` | Top-level layout: title bar, activity bar, explorer, tabs, toolbar, status bar |
| `components/ide-explorer.tsx` | File tree with nested folders, active state |
| `components/ide-tabs.tsx` | Tab bar, accumulates on navigation, active indigo border |
| `components/ide-toolbar.tsx` | Breadcrumb + Preview/Code toggle |
| `components/ide-statusbar.tsx` | Bottom indigo bar with branch/file/language |
| `components/view-toggle.tsx` | `⊞ Preview / </> Code` toggle pill |
| `components/code-block.tsx` | Receives section data as props, serializes to syntax-highlighted TypeScript string. No hardcoded values — all output is derived from props. Props typed per section: `HeroCodeBlock`, `ProjectsCodeBlock`, `AboutCodeBlock`, `SkillsCodeBlock`, `ContactCodeBlock`. |
| `components/project-row.tsx` | Desktop list-row view for a project (used inside `projects-section.tsx` at `lg:`) |

### Modified components
| Component | Change |
|---|---|
| `app/(website)/layout.tsx` | Replace `<Navbar />` + `<PageTransition>` with `<IdeShell>` wrapper. Layout stays a Server Component — `IdeShell` is a Client Component (`"use client"`) and handles all interactive state internally. |
| `components/hero.tsx` | Remove blob/particle, new photo style, fits in pane |
| `components/project-card.tsx` | Remove spotlight/glow, add meme overlay on hover/long-press |
| `components/sections/skills-section.tsx` | Replace pills with dot ratings |
| `components/sections/about-section.tsx` | Remove bg effects |
| `components/sections/contact-section.tsx` | Remove bg effects |
| `components/sections/projects-section.tsx` | Remove bg effects, list layout on desktop |

### Removed components
- `components/ui/particle-field.tsx` — no longer used
- `components/navbar.tsx` — replaced by IDE shell
- `components/page-transition.tsx` — replaced by IDE shell enter animation

---

## Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 1024px` (mobile + tablet) | Top bar + bottom tabs, no file explorer, no editor tabs. Tailwind: default styles. |
| `≥ 1024px` (desktop) | Full IDE chrome: title bar, activity bar, explorer, tabs, status bar. Tailwind: `lg:` prefix. |

---

## Easter Eggs (preserved)

- **`utils/matcha.ts`** in file tree: clicking opens a **Radix popover** anchored to the file row, showing a hardcoded matcha joke + the live `fuel` value from `getProfile()` (no extra DB query)
- **Dog breed quiz:** Stays at the bottom of the contact section. Correct answer (French Bulldog) reveals admin link — same as current
- **Sarcastic tooltips on tech stack badges:** Unchanged

---

## What Does NOT Change

- All data fetching (server actions, Prisma queries, GitHub sync)
- Database schema and models
- `/projects` listing page and `/projects/[slug]` detail page (only homepage IDE shell)
- SEO metadata, JSON-LD, sitemap, robots
- ISR revalidation strategy (`revalidate = 3600`)
- Admin panel (`sleepyleo-admin`) — untouched. All CMS edits (profile, projects, skills) continue to flow through the existing admin → Prisma → DB pipeline and surface on the public site after revalidation.
- Accessibility: skip link, reduced motion support, focus visible styles

## CMS Data Contract

Everything a visitor sees — in both Preview and Code modes — is driven by the three Prisma models managed in the admin panel. Nothing in the IDE shell or code blocks is hardcoded to specific values:

| Admin panel page | Prisma model | Affects these site areas |
|---|---|---|
| Profile editor | `Profile` | Hero (name, bio, role chips, availability), About (bio, education, location, focus, fuel, timeline), Contact (email, github, linkedin, ctaCopy), IDE chrome (logo, status bar label, availability pill) |
| Project manager | `Project` | Projects section (Preview cards/rows + Code block), `/projects` page, `/projects/[slug]` page |
| Skills manager | `Skill` | Skills section (dot ratings, tooltips, category grouping) |

Any future fields added to these models in the admin will need a corresponding update to the relevant section component and `code-block.tsx` prop type to appear in the redesigned site.

---

## Verification

1. `docker compose watch` — confirm live reload works
2. Desktop: verify all 5 sections scroll, explorer highlights, tabs accumulate
3. Mobile (≤ 768px): verify bottom tabs scroll to sections, top bar visible
4. Toggle: verify Preview/Code switch works per section, state is independent
5. Meme hover (desktop) and long-press (mobile) reveal overlay without layout shift
6. Reduced motion: confirm animations disabled with `prefers-reduced-motion: reduce`
7. `/projects` and `/projects/[slug]` pages unaffected
8. Admin panel (port 3001) unaffected
