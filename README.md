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
make build         # npm run build → dist/, then verifies the sitemap
make preview       # serve dist/ locally
make verify        # re-check an existing dist/ sitemap
```

`make build` is what Netlify runs. It builds to `dist/` and then runs
`scripts/verify-sitemap.mjs`, which **fails the build** if the sitemap is
missing, stale (its URL set no longer matches the built pages), wrong-origin,
or missing a valid `lastmod` — so a broken sitemap can never deploy. The build
must succeed from a clean clone (`npm ci && make build`).

## Environment variables

Copy `.env.example` → `.env` and fill in as needed.

| Variable | Purpose |
|----------|---------|
| `PUBLIC_GA_ID` | GA4 measurement ID (`G-XXXXXXXXXX`). **When unset, no analytics script is emitted** — dev/preview stay clean. Only loads in a production build. |
| `SITE` | Optional. Overrides the production URL used for canonical/OG/sitemap. Defaults to `https://rabiamansoor.com`. |

## Deploy to Netlify (one-time setup)

1. **Connect the repository** in Netlify → *Add new site → Import an existing project*.
2. Build settings are read from `netlify.toml` (command `make build`, publish `dist`, Node 22). No manual config needed.
3. Under **Site configuration → Environment variables**, add `PUBLIC_GA_ID` with the real GA4 ID (and optionally `SITE` for a custom domain).
4. **Deploy.** Netlify sets long-cache immutable headers for hashed assets and no-cache for HTML (see `netlify.toml`).

## Sitemap & SEO

The sitemap is generated automatically by `@astrojs/sitemap` on every build, so
it stays in sync with the pages that actually ship — add a page and it appears
in the next deploy's `/sitemap-index.xml` with no manual step. Every URL carries
a `<lastmod>`: articles use their `updated` (or `datePublished`) frontmatter
date; other pages use the build date. `make build` verifies the result and
**fails the deploy** on any regression (see *Build & preview* above).

- **Origin** — every `<loc>` uses the `SITE` value (default
  `https://rabiamansoor.com`). If the live domain ever changes, set the `SITE`
  environment variable in Netlify rather than hard-coding a second value;
  `robots.txt` and `<link rel="sitemap">` already point at `/sitemap-index.xml`.
- **Search-engine submission is a one-time human step.** Submit
  `https://rabiamansoor.com/sitemap-index.xml` once in
  [Google Search Console](https://search.google.com/search-console) and
  [Bing Webmaster Tools](https://www.bing.com/webmasters). There is **no** deploy
  "sitemap ping" — Google removed that endpoint in 2023 and Bing in 2022;
  crawlers rediscover the sitemap via the `Sitemap:` line in `robots.txt`.

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
