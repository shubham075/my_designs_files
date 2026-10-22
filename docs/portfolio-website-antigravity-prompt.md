# Master Prompt — "Next-Gen Portfolio" for Google Antigravity (Gemini 3 Agent)

Paste the **MASTER PROMPT** below into a new Antigravity task/workspace first (Agent-driven or Agent-assisted mode). Then use the **SECTION PROMPTS** as follow-up tasks to the same agent, one per business-type template, so it keeps full project context instead of starting fresh each time.

---

## 🧠 MASTER PROMPT (paste this first)

```
You are building a next-generation, agency-grade PORTFOLIO WEBSITE for a web designer who
sells website design templates to different business types. The portfolio's own job is to
BE the proof: it must feel like watching a buttery 240fps video while scrolling — no jank,
no layout shift, no default-feeling transitions.

GOAL
Showcase 6–8 template concepts, one per business vertical (e.g. Restaurant, Real Estate,
SaaS/Startup, Fashion/E-commerce, Fitness/Gym, Law/Corporate, Photography/Creative Studio,
Healthcare/Clinic). Each template gets its own full-viewport scrollytelling "chapter" inside
one continuous single-page portfolio, plus a live-preview modal/route that demonstrates the
actual template.

TECH STACK (use exactly this — do not substitute without asking me)
- Next.js 15 (App Router, TypeScript, React Server Components where sensible)
- Tailwind CSS v4 for styling + design tokens
- Framer Motion (motion/react) for component-level transitions, page transitions,
  cursor-following elements, and exit/enter choreography
- GSAP + ScrollTrigger for scroll-linked/pinned/scrubbed parallax and scrollytelling timelines
- Lenis (studio-freight/lenis) for buttery smooth-scroll that drives GSAP ScrollTrigger —
  this combo (Lenis + GSAP ScrollTrigger) is what produces the "240fps feel": interpolated,
  inertia-based scroll instead of native jump-scroll
- Three.js (via @react-three/fiber + drei) ONLY for the hero section's ambient 3D/particle
  background — keep it lightweight (instancing, low poly count, capped DPR)
- Lucide-react for icons
- next/image and next/font for optimized assets and variable fonts

ARCHITECTURE
- /app/page.tsx — the single continuous scroll portfolio (all chapters/sections)
- /app/work/[slug]/page.tsx — dedicated live-demo route per template, with its own
  page-transition (shared element / morph transition from the portfolio card)
- /components/motion/ — reusable motion primitives (RevealText, ParallaxLayer,
  MagneticButton, CursorFollower, PinnedSection, SplitTextReveal, PageTransition)
- /components/sections/ — one component per chapter (Hero, About, Work-[Vertical], Process,
  Contact)
- /lib/gsap.ts — central GSAP + ScrollTrigger + Lenis registration/setup (register plugins
  once, expose a useSmoothScroll hook)
- Respect prefers-reduced-motion: provide a reduced-motion fallback for every animation
  (crossfade instead of transform-heavy movement)

MOTION SYSTEM / TRANSITION RULES (apply everywhere, not just the hero)
1. Smooth scroll: initialize Lenis with lerp ~0.1, wheelMultiplier ~1, sync its `scroll`
   event to `ScrollTrigger.update` via `requestAnimationFrame` (the standard Lenis+GSAP
   integration) so every pinned/scrubbed animation tracks the eased scroll position, not
   raw scroll — this is the #1 lever for the "high frame-rate" feel.
2. Animate ONLY GPU-cheap properties: transform (translate/scale/rotate) and opacity.
   Never animate top/left/width/height/box-shadow directly — animate a wrapper's transform
   or use filter sparingly. Add `will-change: transform` on actively-animating elements only,
   and remove it after animation completes.
3. Easing: use custom cubic-bezier / GSAP "power" and "expo" eases for entrances
   (e.g. expo.out for reveals, power3.inOut for pinned scrubs) — never linear, never default
   ease-in-out for anything meant to feel premium.
4. Stagger everything that appears in groups (nav links, grid cards, headline words/chars)
   with 0.04–0.08s stagger and a slight y/opacity offset — avoid simultaneous pop-ins.
5. Scrollytelling pattern per chapter: pin the section (ScrollTrigger `pin: true`), scrub a
   timeline tied to scroll progress (`scrub: 0.5–1` for a slight smoothing lag), and animate:
     - background color / gradient shift
     - a large image or mockup that scales/rotates/parallaxes at a different speed than text
     - headline text splitting into words/characters that reveal progressively
     - a progress indicator (thin line or numbered counter) showing chapter progress
6. Page/route transitions: use Framer Motion's `AnimatePresence` + shared layoutId so a
   clicked project card visually morphs into the live-demo page hero (no hard cut, no
   default fade — a real shared-element transition).
7. Micro-interactions: magnetic hover on buttons/nav (element eases toward cursor within a
   radius), cursor-follower blob/label on project cards ("View Case Study"), underline-draw
   on link hover using an animated SVG path or scaleX transform-origin trick.
8. Performance budget: target consistent 60fps (this is the real ceiling in-browser; the
   "240fps video" feel comes from eased motion + zero jank, not literal refresh rate).
   Lazy-load below-the-fold sections, use `next/dynamic` for the Three.js hero, keep GSAP
   timelines killed/reverted on unmount, and test with Chrome's Performance panel — no long
   tasks over 50ms during scroll.

DESIGN SYSTEM
- Typography: one expressive variable display font for headlines (e.g. a grotesk like
  "General Sans" or "Clash Display" via next/font/local) + a clean neutral font for body
  (e.g. "Inter" or "Satoshi"). Large type scale — hero headline 8–14vw, generous negative
  tracking on display type.
- Color: a dark, moody base (near-black #0A0A0B) with one signature accent color, plus a
  light "paper" mode you toggle per section for contrast (alternate dark/light chapters as
  you scroll — this itself becomes a parallax/scroll-driven transition).
- Layout: full-bleed sections, asymmetric grids, generous whitespace, oversized numerals
  (01 / 02 / 03…) as section markers, editorial-style image cropping.
- Grain/texture overlay at low opacity for a premium, non-flat feel (SVG noise filter).

SITE STRUCTURE (build in this order)
1. Hero — full-viewport intro, animated headline (split-text reveal), ambient 3D/particle
   background, magnetic scroll-down indicator, subtle cursor-reactive parallax on hero
   graphic.
2. About / Approach — short manifesto-style statement with pinned scroll reveal, 2–3 stat
   counters that count up on scroll-into-view.
3. Work — 6 to 8 chapters, ONE per business vertical (see SECTION PROMPTS below). Each is a
   pinned, scrubbed scrollytelling sequence culminating in a project card that links to
   /work/[slug].
4. Process — how templates are built (Discover → Design → Animate → Deliver), horizontal
   scroll-jacked strip (scroll vertically, content moves horizontally) using
   ScrollTrigger's horizontal-scroll pattern.
5. Testimonials / Social proof — auto-advancing marquee or draggable carousel (Framer
   Motion drag with inertia), pause on hover.
6. Contact / CTA — bold closing statement, magnetic CTA button, animated gradient mesh
   background, simple form with floating-label inputs and success-state micro-animation.
7. Footer — minimal, with a large marquee of business-type tags.

DELIVERABLE
Scaffold the full Next.js project, install all dependencies, implement the motion system
in /lib/gsap.ts and /components/motion/, build the Hero + About + Process + Contact
sections fully, and build ONE complete Work chapter end-to-end (I will specify which
vertical first) as the reference pattern — then pause and show me the result before you
replicate the pattern across the remaining verticals. Verify in the built-in browser that
scroll performance is smooth and there is no layout shift before marking this task complete.
```

---

## 🎯 SECTION PROMPTS — one per business-type template (use after the master prompt)

Give the agent these one at a time (or batch 2–3 at once). Each keeps the same motion
system but gives each chapter a distinct visual identity so the 6–8 templates don't feel
repetitive.

### 1. Restaurant / Fine Dining
```
Build the "Restaurant" Work chapter using the established motion system. Concept: warm,
dark, editorial. Pinned section where a full-bleed dish photograph slowly scales down and
rotates into a framed position as the headline ("Taste, Reimagined") splits and reveals
word-by-word. Parallax a floating menu-price list and a garnish/ingredient graphic at
different scroll speeds. On chapter progress, background shifts from near-black to a deep
burgundy. End state: a reservation-widget mockup slides in from the right with a magnetic
"Reserve a Table" button. Link out to /work/restaurant.
```

### 2. Real Estate / Luxury Property
```
Build the "Real Estate" chapter. Concept: clean, light "paper" mode (this chapter flips the
site to light background — animate the flip as you scroll in). A property image sequence
(3–4 images) crossfades and parallaxes as a floating price/spec card follows with a slight
delayed easing (drag-behind parallax). Include a scroll-scrubbed horizontal filmstrip of
thumbnail properties. End with a "Browse Listings" CTA and a subtle map-pin marker animation.
Link to /work/real-estate.
```

### 3. SaaS / Tech Startup
```
Build the "SaaS/Startup" chapter. Concept: dark, neon-accent, glassmorphism UI mockups.
Animate a floating dashboard/app mockup with depth via multiple parallax layers (background
grid, mid-layer glow blobs using CSS/SVG, foreground UI card with subtle 3D tilt on
scroll-progress, not just hover). Feature counters (users, uptime%, integrations) count up
on scroll. Headline uses a gradient-text reveal. End with "See the Product" CTA morphing into
the live demo. Link to /work/saas.
```

### 4. Fashion / E-commerce
```
Build the "Fashion/E-commerce" chapter. Concept: bold, high-contrast, editorial fashion
photography feel. Large portrait image pinned while a secondary product-grid peels in from
below (staggered scale+opacity). Scroll-scrubbed "outfit swap" — 3 product images cycle
based on scroll progress within the pin (not autoplay, purely scroll-driven). Price tag
micro-interactions with magnetic hover. Link to /work/fashion.
```

### 5. Fitness / Gym
```
Build the "Fitness/Gym" chapter. Concept: high-energy, kinetic typography, sharp accent
color (e.g. electric lime or orange) on near-black. Headline text has a punchy scale+skew
entrance timed to scroll velocity. Parallax a trainer/action photo with a slight rotation
tied to scroll. Include a horizontal scrubbed "class schedule" strip. End with "Start Your
Program" CTA with a pulsing/magnetic hover state. Link to /work/fitness.
```

### 6. Law Firm / Corporate
```
Build the "Law/Corporate" chapter. Concept: restrained, confident, generous whitespace,
serif display font override for just this chapter's headline (contrast with the rest of the
site). Subtle, slow parallax (avoid anything playful) — a single architectural/office image
with a slow Ken Burns-style scale, and case-result stat counters revealing on scroll. End
with a minimal "Schedule a Consultation" CTA. Link to /work/law.
```

### 7. Photography / Creative Studio
```
Build the "Photography/Creative Studio" chapter. Concept: full-bleed image-forward, minimal
UI chrome. A scroll-scrubbed masonry/gallery where images enter from alternating directions
and settle with slight parallax depth differences (foreground images move faster than
background ones). Cursor-follower shows a "View Gallery" label that appears near the cursor
only inside this section. Link to /work/photography.
```

### 8. Healthcare / Clinic
```
Build the "Healthcare/Clinic" chapter. Concept: calm, light, trustworthy — soft pastel
accent, rounded UI elements, lots of breathing room. Gentle parallax (slower speeds and
softer eases than other chapters, e.g. sine.inOut) on an appointment-booking UI mockup that
assembles itself piece by piece as you scroll (calendar, time slots, confirm button fade/
slide in sequentially). End with "Book an Appointment" CTA. Link to /work/healthcare.
```

---

## 🔧 Follow-up refinement prompts (use once the base build exists)

```
Audit every scroll-triggered animation in the project for performance: confirm each only
animates transform/opacity, add will-change only during active animation, and remove it on
complete. Report any ScrollTrigger instances that aren't being killed/reverted on route
change or component unmount.
```

```
Add a full-page transition between "/" and each "/work/[slug]" route using Framer Motion
shared layoutId, so the clicked project image/card visually morphs into the demo page's
hero image instead of a hard navigation cut.
```

```
Implement prefers-reduced-motion handling globally: create a hook that disables GSAP
ScrollTrigger pinning/scrubbing and Lenis smooth scroll, replacing entrance animations with
simple opacity crossfades, when the user has reduced motion enabled.
```

```
Do a full Lighthouse + Chrome Performance pass on the built site. Fix any Cumulative Layout
Shift issues, ensure the Three.js hero is dynamically imported with a loading fallback, and
confirm the scroll timeline stays smooth (no long tasks >50ms) on a mid-tier laptop
simulation.
```

---

### Notes for you
- Antigravity works best when you let the agent produce an **implementation plan/Artifact**
  after the Master Prompt before it writes code — review that plan, then approve.
- Feed the **SECTION PROMPTS** one at a time in the same task thread (not a new task) so the
  agent reuses your established motion primitives instead of reinventing them per chapter.
- If Antigravity offers a model choice, Gemini 3 Pro is the strongest default for this kind
  of multi-file, animation-heavy frontend work; you can also point it at Claude Sonnet if
  the workspace allows dual-model routing.
