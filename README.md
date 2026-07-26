# rabiamansoor.com

Personal scholarly website & CV for **Rabia Mansoor** — a cartography of
narrative and power. A fast, static, accessible site with a bold, animated
**“Cartography of Narrative”** design.

**Live:** <https://rabiamansoor.com>

## Stack

- **[Astro 5](https://astro.build)** — static output, TypeScript
- **MDX content collections** — long-form writing under `src/content/articles/`
- **Motion** — [GSAP](https://gsap.com) + ScrollTrigger, [Lenis](https://lenis.darkroom.engineering) smooth scroll
- **Fonts** — self-hosted via `@fontsource`: Fraunces (display), Instrument Sans (body), Space Mono (data)
- **Images** — `astro:assets` (sharp) → responsive AVIF/WebP, lazy-loaded
- **Deploy** — [Netlify](https://www.netlify.com) (static)

## Local development

Requires **Node 22**.

```bash
make install       # install dependencies
make dev           # dev server → http://localhost:4321
make build         # build to dist/ (also verifies the sitemap)
make preview       # serve the production build locally
```

`make build` is what Netlify runs. It builds to `dist/` and then runs
`scripts/verify-sitemap.mjs`, which **fails the build** if the sitemap is
missing, stale, wrong-origin, or missing a valid `lastmod` — so a broken
sitemap can never deploy.

## Environment variables

Copy `.env.example` → `.env` and fill in as needed.

| Variable | Purpose |
|----------|---------|
| `PUBLIC_GA_ID` | GA4 measurement ID (`G-XXXXXXXXXX`). **When unset, no analytics script is emitted** — dev/preview stay clean; it loads only in a production build. |
| `SITE` | Production origin used for canonical/OG URLs and the sitemap. Defaults to `https://rabiamansoor.com`. |

## Structure

- `src/pages/` — five section routes (`/`, `/journal`, `/lab`, `/classroom`,
  `/about`), the writing index (`/articles/`), and `articles/[...slug]` for
  individual pieces.
- `src/content/articles/` — MDX articles (the content collection).
- `src/components/` — Astro components (header, footer, panels, …).
- `src/styles/global.css` — design tokens and the panel/color system.
- `src/scripts/motion.ts` — GSAP + Lenis motion, gated on `prefers-reduced-motion`.

## Deploy

Netlify runs `make build` → publishes `dist/` on every push (settings live in
`netlify.toml`, Node 22). The sitemap is generated automatically by
`@astrojs/sitemap` and stays in sync with the pages that ship. Submitting the
sitemap to Google/Bing is a one-time human step; there is no deploy-time ping.

## License & attribution

This repository mixes three kinds of material under three licenses — see
[`LICENSE`](./LICENSE) for the overview:

- **Written content** (essays, research summaries, reviews, bio, page copy, and
  everything under `src/content/`) — © Rabia Mansoor, licensed
  **[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)**.
  Share verbatim with attribution; no adaptations, commercial use, or model
  training. Full text in [`LICENSE-CONTENT`](./LICENSE-CONTENT).
- **Website source code** — © Talha Mansoor, licensed **MIT**
  ([`LICENSE-CODE`](./LICENSE-CODE)).
- **Book covers and film posters** — property of their respective publishers
  and studios, used for identification and scholarly commentary. They are **not
  ours** and are **not** covered by the licenses above.

## Credits

Designed & developed by [Talha Mansoor](https://talhamansoor.com).
