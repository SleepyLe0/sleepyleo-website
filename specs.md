# ROLE
You are a Creative Frontend Engineer. Build the foundation for "SleepyLeo Hub" (www.sleepyleo.com), a Next.js 15 portfolio that is "Modern & Friendly" with a heavy dose of personality and developer memes.

# UI ARCHITECTURE
- **Structure:** Shadcn UI (for clean buttons, forms, and dialogs).
- **Vibe & Flair:** Aceternity UI (for flashy backgrounds and high-end animations).
- **Framework:** Next.js 15 (App Router) + Tailwind CSS + Framer Motion.

# DESIGN GOALS (Modern-Meme Style)
- **The "Banger" Projects:** Use Aceternity's `Wobble Card` or `3D Card Effect` for the project grid. 
- **The Hero:** Use Aceternity's `Typewriter Effect` or `Flip Words` to rotate funny titles (e.g., "Fullstack Dev," "Professional Oversleeper," "Bugs' Worst Nightmare").
- **Visuals:** Add the `Background Beams` or `Aurora Background` to the main landing page for a premium "Glassmorphism" look.
- **Friendly Touch:** Use Shadcn's `Tooltip` to add sarcastic developer commentary to my skill icons.

# KEY FEATURES:
1. **Leo's Intern (AI Agent):**
   - A chat UI built using Shadcn's `Scroll Area` and `Input`.
   - Backend: A Next.js Server Action to execute shell commands in my Debian VM.
2. **"Server Health" (The Meme Dashboard):**
   - A stats page showing real-time CPU/RAM from my host.
   - Use Shadcn's `Progress` bars. If CPU usage > 90%, change the color to red and display a "This is Fine" dog GIF.
3. **SEO:**
   - Dynamic metadata for every project and a custom 404 page with a "John Travolta" meme for lost visitors.

# SPECIFIC DELIVERABLES:
- **Project Structure:** A standard Next.js layout using the `cn` utility function to merge Shadcn and Aceternity classes.
- **Hero Component:** A combination of Aceternity's `Hero Highlight` and a playful greeting.
- **Prisma Schema:** A model for Projects including `id, name, slug, status, techStack, and memeUrl`.