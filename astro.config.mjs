// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// The public production URL. Override with the SITE env var on Netlify if the
// custom domain differs. Used for canonical URLs, sitemap and OG tags.
const SITE = process.env.SITE || 'https://rabiamansoor.com';

// A single build timestamp (date-only, for a stable same-day sitemap). Static
// pages whose content lives in code get this as their `lastmod` — an honest
// "last changed at this deploy" signal.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// Normalise a pathname to the site's canonical `/foo/` shape so sitemap URLs
// and our frontmatter-derived map compare cleanly regardless of trailing slash.
const routeKey = (pathname) => `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');

// Scan article frontmatter once at config load — a tiny `key: value` read,
// rather than a YAML dependency or the astro:content runtime, which isn't
// available this early. Yields two things per article route:
//   - lastmods: ISO date for the sitemap `<lastmod>` (`updated` wins over
//     `datePublished`; pages with neither fall back to BUILD_DATE in serialize).
//   - draftRoutes: routes flagged `draft: true`, so the sitemap can drop them
//     defensively even though getStaticPaths already excludes them from the build.
const ARTICLES_DIR = 'src/content/articles';

function scanArticles() {
  const lastmods = new Map();
  const draftRoutes = new Set();
  let files = [];
  try {
    files = fs.readdirSync(ARTICLES_DIR);
  } catch {
    return { lastmods, draftRoutes }; // no articles dir yet — nothing to map
  }
  for (const file of files) {
    if (!/\.mdx?$/.test(file)) continue;
    const slug = file.replace(/\.mdx?$/, '');
    const route = routeKey(`/articles/${slug}`);
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
    const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!block) continue;
    const front = block[1];
    const scalar = (key) => {
      const m = front.match(new RegExp(`^${key}:[ \\t]*(.+?)[ \\t]*$`, 'm'));
      return m ? m[1].replace(/^['"]|['"]$/g, '').trim() : null;
    };
    const iso = scalar('updated') || scalar('datePublished');
    if (iso) lastmods.set(route, iso);
    if (scalar('draft') === 'true') draftRoutes.add(route);
  }
  return { lastmods, draftRoutes };
}

const { lastmods: ARTICLE_LASTMOD, draftRoutes: DRAFT_ROUTES } = scanArticles();

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      // Belt-and-braces: drop any draft article route. getStaticPaths already
      // excludes drafts from the build, so this only matters if that filter
      // ever regresses — a draft must never leak into the sitemap.
      filter: (url) => !DRAFT_ROUTES.has(routeKey(new URL(url).pathname)),
      // Give every URL a `lastmod`: articles use their frontmatter date; all
      // other pages use the build date. Emitted as YYYY-MM-DD for consistency.
      serialize(item) {
        const { pathname } = new URL(item.url);
        item.lastmod = ARTICLE_LASTMOD.get(routeKey(pathname)) ?? BUILD_DATE;
        return item;
      },
    }),
  ],
  image: {
    // Emit modern formats; sharp is the default service.
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
  // Allow tunneling `astro dev`/`astro preview` through ngrok. A leading dot
  // matches the domain and all subdomains, so regenerated free-tier URLs keep
  // working. Harmless for production (Netlify serves the static dist directly).
  server: {
    allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.app'],
  },
});
