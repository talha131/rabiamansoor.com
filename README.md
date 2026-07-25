# Rabia Mansoor — Scholar Website & CV

A personal scholarly website and online résumé for **Rabia Mansoor**, PhD scholar
in geopolitics, world literature and popular geopolitics. Built as a fast, static,
accessible site with a bold, animated **“Cartography of Narrative”** design.

- **Framework:** [Astro](https://astro.build) (static output), TypeScript
- **Motion:** [GSAP](https://gsap.com) + ScrollTrigger, [Lenis](https://lenis.darkroom.engineering) smooth scroll
- **Images:** `astro:assets` (sharp) → responsive AVIF/WebP, lazy-loaded
- **Fonts:** self-hosted via `@fontsource` — Fraunces (display), Instrument Sans (body), Space Mono (data)
- **Deploy:** Netlify (static)

## Pages

| Route | Page | Signature hue |
|-------|------|---------------|
| `/` | Home — hero poem, animated “Library” of book covers, résumé strip | Rose |
| `/journal` | Geopolitical Journal — focus areas + National Security Cinema scrollytelling | Amber |
| `/lab` | The Lab — PhD/MPhil/MA research and publications | Emerald |
| `/classroom` | The Classroom — teaching philosophy, certifications, course catalog | Indigo |
| `/about` | About Me — the résumé: bio, animated trajectory, stat counters, grants | Ink/Navy |

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build & preview

```bash
npm run build      # → dist/
npm run preview
```

The build must succeed from a clean clone (`npm ci && npm run build`).

## Environment variables

Copy `.env.example` → `.env` and fill in as needed.

| Variable | Purpose |
|----------|---------|
| `PUBLIC_GA_ID` | GA4 measurement ID (`G-XXXXXXXXXX`). **When unset, no analytics script is emitted** — dev/preview stay clean. Only loads in a production build. |
| `SITE` | Optional. Overrides the production URL used for canonical/OG/sitemap. Defaults to `https://rabiamansoor.com`. |

## Deploy to Netlify (one-time setup)

1. **Connect the repository** in Netlify → *Add new site → Import an existing project*.
2. Build settings are read from `netlify.toml` (command `npm run build`, publish `dist`, Node 22). No manual config needed.
3. Under **Site configuration → Environment variables**, add `PUBLIC_GA_ID` with the real GA4 ID (and optionally `SITE` for a custom domain).
4. **Deploy.** Netlify sets long-cache immutable headers for hashed assets and no-cache for HTML (see `netlify.toml`).

## Accessibility & resilience

- All text renders in static HTML; reveal animations only hide-then-animate once JS has loaded, so the site is fully readable with JS off.
- `prefers-reduced-motion: reduce` disables parallax, marquee, scrollytelling and count-ups — content resolves to its final visible state.
- Semantic landmarks, one `<h1>` per page, skip link, visible focus, ≥44px tap targets, AA contrast on every color panel.

## Content

All copy is authored from `content/site-content.md` (the source of truth).
Original assets live under `content/`; production images are imported from
`src/assets/`.

---

Developed by [Talha Mansoor](https://talhamansoor.com).
