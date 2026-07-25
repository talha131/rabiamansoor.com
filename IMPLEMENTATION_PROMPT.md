# Build Prompt — Rabia Mansoor Scholar Website

You are building a **personal scholarly website** for **Rabia Mansoor**, a PhD
scholar and researcher in geopolitics, world literature, and popular geopolitics.
This site is both her academic home page **and her online résumé/CV**. Ship a
production-ready site that deploys to **Netlify**.

The client's brief, verbatim in spirit: *"The content is boring, so the UI must
not be. Make the website come alive — interactive, visual, plenty of animation,
bold solid colors (shades of pink / yellow and more) that parallax as you scroll.
Make people go 'wow'. Optimal on mobile and desktop. It also serves as a résumé."*

Your job is to honor that while keeping it fast, accessible, and tasteful — "wow"
through craft (motion, color, typography, layout), not clutter.

---

## 0. Before you write code

1. **Invoke the `frontend-design` skill** and follow it — this project lives or
   dies on visual craft. Also skim `dataviz` if you build any stat/number
   visuals.
2. **Read the content.** All copy is pre-extracted and cleaned in
   **`content/site-content.md`** — that is your source of truth for every word,
   title, DOI, date, and number. Do not invent facts or alter titles/quotes.
3. **Look at the images** in:
   - `content/Images for homepage/` — `r1.jpg … r10.jpg`, ten geopolitics book
     covers (her intellectual "library"). Captions are in `site-content.md`.
   - `content/ Geopolitical Journal National Security Cinema_ Hollywood as a Geopolitical Apparatus/`
     — `l1.jpg … l5.jpg`, film posters/covers illustrating the featured essay
     (l1 = *The Hunt for Red October*). ⚠️ This folder name has a **leading
     space** and spaces throughout — copy these into a clean `src/assets/…` path
     with sane filenames rather than referencing them in place.

---

## 1. Tech stack (decided — don't re-litigate)

- **Astro** (latest), TypeScript, **static output** (`output: 'static'`). Multi-page,
  one route per section. No React/Vue needed; use Astro components + vanilla TS
  islands where interactivity is required.
- **Styling:** plain CSS (or CSS modules / `<style>` blocks) with CSS custom
  properties for the color system. Tailwind is acceptable if you prefer, but the
  color system and motion must be first-class either way. Do **not** pull in a
  heavy UI kit.
- **Motion:** use **GSAP + ScrollTrigger** for scroll-driven parallax and
  reveals, and **Lenis** for smooth scrolling. Keep the JS budget lean; load
  motion libs only where used. Everything must degrade gracefully and honor
  `prefers-reduced-motion` (see §5).
- **Images:** use Astro's `<Image />` / `astro:assets` (sharp) to emit responsive,
  optimized, lazy-loaded images (AVIF/WebP with fallback). Book covers must stay
  crisp but must not tank LCP.
- **Fonts:** self-host via `@fontsource` (no external font CDN — better privacy &
  performance). Pick a distinctive pairing (see §3).
- Node LTS. Commit a working `package.json`, `astro.config.mjs`, `tsconfig.json`.

## 2. Site map (5 routes + shared shell)

| Route | Page | Signature color | Notes |
|-------|------|-----------------|-------|
| `/` | Home | Rose/Pink | Hero poem + tagline, animated "Library" of book covers, quick nav to the 4 sections, résumé highlights strip |
| `/journal` | Geopolitical Journal | Amber/Yellow | Intro, 3 focus-area cards, featured dispatch "National Security Cinema" as a scrollytelling timeline of 5 eras with the film posters |
| `/lab` | The Lab | Teal/Emerald | Manifesto, Active Experiment (PhD) with the 3 "topographies", Archived (MPhil, MA), Publications list |
| `/classroom` | The Classroom | Violet/Indigo | Philosophy, certification badge, course catalog (grouped), signature course highlights |
| `/about` | About Me | Deep ink/Navy + accent | The résumé page: bio, animated Research Trajectory timeline, grants, stat counters, external scholarly links |

Shared shell: sticky/animated top nav (with active-state + mobile menu), page
transitions, and a global footer (§7). Each page opens with a full-bleed colored
hero and is composed of **stacked full-width solid-color panels that parallax at
different scroll speeds** — this is the core visual device the client asked for.

## 3. Design system

**Concept:** *"Cartography of narrative."* Her work is about **mapping** power
through stories ("Narrative Topographies", "spatialization of the enemy"). Lean
into an editorial + cartographic aesthetic: bold color fields, map/contour-line
motifs, coordinate ticks, route lines (a nod to Frost's "two roads"). Keep it
sophisticated — this is a scholar, not a startup.

**Color:** solid, saturated, confident. Give each page a signature hue (table
above) plus 2–3 supporting solids so a single page scrolls through contrasting
color panels. Suggested anchors (tune for contrast/taste): rose `#FF5D8F`,
amber `#FFC93C`, emerald `#2EC4A6`, indigo `#6C5CE7`, ink `#141B33`, cream
`#FFF7EC`. **Always meet WCAG AA** for text on every panel; never rely on color
alone to convey meaning.

**Typography:** a strong **display serif** for headings (literary/editorial —
e.g. Fraunces, Playfair Display, or Bricolage Grotesque as a modern alt) paired
with a clean, legible **sans** for body (e.g. Inter, Geist, or Sohne-like). Big,
expressive headline scale; generous measure and line-height for the long
scholarly copy so it stays readable.

**Layout:** mobile-first, fluid type (`clamp()`), CSS grid. Long-form academic
text must be genuinely readable — don't sacrifice legibility for effect. Use
whitespace and rhythm.

## 4. Motion & interaction (the "wow")

Deliver a rich but purposeful set — not everything at once on every page:

- **Parallax color panels:** stacked solid-color sections move at different
  scroll speeds; foreground content and background decorations (contour lines,
  coordinate grids, oversized numerals) travel at different rates.
- **Scroll-reveal:** headings, cards, list items fade/slide/clip-in on enter
  (staggered). Use `ScrollTrigger` batch; never leave content invisible if JS
  fails (see §5).
- **Home "Library":** the 10 book covers as a 3D-ish floating/parallax cluster or
  an infinite marquee of spines that reacts to scroll/hover; hover reveals
  title + author caption; deep-link the Klaus Dodds cover (`r10`) to the cinema
  dispatch.
- **Journal cinema essay:** a **scrollytelling timeline** — the 5 eras advance as
  you scroll, film posters sliding in, an era "spine" or map that progresses.
- **About timeline:** MA → MPhil → PhD trajectory draws/animates as it enters
  view. Add **count-up stat tiles** (11+ years, publications, grant, CGPA 3.68).
- **Micro-interactions:** animated nav underline/active state, magnetic or
  spring buttons, custom link hovers, a subtle animated hero (the Frost poem
  can type-in or reveal line by line). A custom cursor is optional — only if it
  stays out of the way on desktop and is disabled on touch.
- **Page transitions:** use Astro **View Transitions** for smooth route changes.

Keep 60fps: animate `transform`/`opacity` only, use `will-change` sparingly,
avoid layout thrash. Budget the JS; lazy-init heavy effects.

## 5. Accessibility & resilience (non-negotiable)

- Fully honor **`prefers-reduced-motion: reduce`** — disable parallax/scrollytelling
  transforms, replace with instant/opacity-only states. Content must be complete
  and readable with motion off.
- **No-JS / JS-fail safety:** all text content renders in static HTML; reveal
  animations must start from a visible state and only be *hidden then animated*
  when JS is present (e.g. add an `is-animated` class via JS, or use CSS
  `@media (scripting: enabled)`). Never ship content that's invisible without JS.
- Semantic HTML, one `<h1>` per page, logical heading order, `alt` text on every
  image (use the captions), keyboard-navigable nav + focus-visible styles,
  skip-to-content link. Tap targets ≥ 44px. AA contrast everywhere.
- Respect the long-form reading experience: real `<article>`/`<section>`
  structure, not div soup.

## 6. Google Analytics

- Integrate **GA4** via `gtag.js`. Read the measurement ID from an env var
  **`PUBLIC_GA_ID`** (Astro public env). If unset, **do not** emit the script
  (so dev/preview stay clean). Add `PUBLIC_GA_ID=G-XXXXXXXXXX` to `.env.example`
  and document it in the README as a Netlify environment variable the owner sets.
- Load GA only in production, `defer`/async, after content. Respect DNT if
  trivial. Do not block render on it.

## 7. Footer (required, exact)

Every page's footer includes, in **small font**:

> Developed by [Talha Mansoor](https://talhamansoor.com)

Link target: `https://talhamansoor.com` (open in new tab, `rel="noopener"`).
Keep it understated and elegant.

## 8. SEO / metadata

- Per-page `<title>` + meta description, Open Graph + Twitter cards, canonical
  URLs, an OG image (generate a branded one). `sitemap` (@astrojs/sitemap) and
  `robots.txt`. Add **JSON-LD `Person`** structured data on `/about` (name,
  jobTitle, sameAs → Google Scholar + ORCID). Sensible `<html lang="en">`.

## 9. Netlify deploy

- Static build. Add **`netlify.toml`**: `build.command = "npm run build"`,
  `build.publish = "dist"`, appropriate Node version, and sensible security +
  caching headers (long cache for hashed assets, no-cache for HTML). Ensure
  `npm run build` succeeds from a clean clone. Document the one-time setup:
  connect repo → set `PUBLIC_GA_ID` → deploy.

## 10. Repo hygiene & commits

- This repo is on branch `master` (git user: Talha, GPG signing on — let git sign
  naturally, never pass `--no-gpg-sign`). Create a working branch.
- **One commit per logical change** (scaffold, design system, shared layout, each
  page, GA, netlify config, etc.) — small, focused, independently revertable.
  Refactors, behavior, and any tests are separate commits. Push after committing.
- Keep the `content/` source files; add a short **README** (run, build, deploy,
  env vars).

---

## 11. Testing — you MUST verify with Chrome DevTools MCP

Do not claim "done" from code inspection. Run the site and **drive a real browser
via the `chrome-devtools` MCP tools** (invoke the `chrome-devtools` skill). Start
the dev/preview server (`npm run dev` or `npm run preview`) and:

1. **Navigate** to every route (`/`, `/journal`, `/lab`, `/classroom`, `/about`).
2. **Console:** `list_console_messages` on each page → **zero errors** (no 404s,
   no uncaught exceptions, no GSAP/Lenis warnings). Fix anything that appears.
3. **Network:** `list_network_requests` → confirm images load (no broken assets),
   fonts self-host, and GA is **absent** when `PUBLIC_GA_ID` is unset (and present
   when set — test both).
4. **Responsive:** `resize_page` to **375×812 (mobile)**, **768×1024 (tablet)**,
   and **1440×900 (desktop)**. `take_screenshot` full-page at each on every route.
   Confirm: no horizontal overflow, no overlapping text, mobile nav works, images
   scale, color panels/parallax read correctly.
5. **Interaction & motion:** scroll each page (`evaluate_script` to scroll, or
   drive it) and screenshot mid-scroll to confirm parallax layers separate,
   scroll-reveals fire, the Journal scrollytelling advances, the About timeline
   and stat counters animate. Hover the Home library covers and confirm captions.
6. **Reduced motion:** `emulate` (or set the CSS media feature) `prefers-reduced-motion: reduce`
   and confirm the site is fully readable with animations disabled and nothing
   stays hidden.
7. **Links:** click through nav on desktop and mobile; verify the footer
   "Talha Mansoor" link points to `https://talhamansoor.com`, and external
   scholarly links (Google Scholar, ORCID, DOIs) are correct and open in a new
   tab.
8. **Lighthouse:** run `lighthouse_audit` (or `performance_start_trace`) on `/`
   and `/about`. Targets: **Performance ≥ 90, Accessibility ≥ 95, Best-Practices
   ≥ 95, SEO ≥ 95** on desktop; investigate/report any CLS or LCP issues (book
   covers are the usual LCP culprit — size/lazy them correctly).
9. Iterate: fix, re-run, and only then report. Include a short summary of the
   screenshots/audit results in your final message.

## 12. Definition of done

- [ ] All 5 pages built from `content/site-content.md`, copy accurate.
- [ ] Bold multi-color parallax panels + rich, purposeful animation on every page.
- [ ] Flawless on mobile (375), tablet (768), desktop (1440) — verified by
      screenshots. No overflow, no overlap.
- [ ] `prefers-reduced-motion` fully respected; content readable with JS/motion off.
- [ ] GA4 wired via `PUBLIC_GA_ID` env (off when unset), documented for Netlify.
- [ ] Footer credit "Developed by Talha Mansoor → https://talhamansoor.com" on
      every page, small font.
- [ ] SEO metadata, OG image, sitemap, robots, JSON-LD Person on /about.
- [ ] `netlify.toml` present; `npm run build` succeeds from clean clone.
- [ ] Zero console errors; Lighthouse targets met (§11.8).
- [ ] Clean, logically-split, signed commits pushed; README written.
- [ ] Verified in-browser via chrome-devtools MCP; summary + screenshots reported.

**North star:** a scholar's site that makes people go *wow* on first scroll, reads
as a serious résumé on closer look, and loads fast on a phone. Craft over clutter.
