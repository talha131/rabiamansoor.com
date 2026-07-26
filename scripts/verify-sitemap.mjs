#!/usr/bin/env node
// Post-build guardrail: fail the deploy if the generated sitemap is missing,
// empty, out of date, wrong-origin, or missing a valid `lastmod`.
//
// The sitemap is generated automatically by @astrojs/sitemap on every build,
// so "keeping it up to date" is really about making sure a regression can never
// ship. Netlify aborts a deploy on any non-zero build exit, so this script —
// wired into `make build` after `astro build` — makes a broken or stale sitemap
// impossible to publish. No dependencies: plain Node + a little regex.

import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const INDEX = path.join(DIST, 'sitemap-index.xml');

// The origin every <loc> must use — same source of truth as astro.config.mjs.
const EXPECTED_ORIGIN = new URL(process.env.SITE || 'https://rabiamansoor.com')
  .origin;

const errors = [];
const fail = (msg) => errors.push(msg);

const routeKey = (pathname) =>
  `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');

// --- 1. The index and at least one child sitemap exist and are non-empty. ---
function readNonEmpty(file) {
  if (!fs.existsSync(file)) {
    fail(`missing: ${file}`);
    return '';
  }
  const text = fs.readFileSync(file, 'utf8').trim();
  if (!text) fail(`empty: ${file}`);
  return text;
}

const indexXml = readNonEmpty(INDEX);

// Child sitemaps referenced by the index (usually just sitemap-0.xml).
const childFiles = [...indexXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(
  (m) => path.join(DIST, path.basename(new URL(m[1]).pathname))
);
if (childFiles.length === 0 && indexXml) {
  fail(`no child sitemaps referenced in ${INDEX}`);
}

// --- 2/3/4. Collect every <url> across all child sitemaps. ---
const entries = []; // { loc, lastmod }
for (const child of childFiles) {
  const xml = readNonEmpty(child);
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block[1].match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1] ?? null;
    const lastmod = block[1].match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/)?.[1] ?? null;
    entries.push({ loc, lastmod, child });
  }
}

if (childFiles.length > 0 && entries.length === 0) {
  fail('sitemap contains zero <url> entries');
}

// --- 3. Every <loc> uses the expected production origin. ---
// --- 4. Every <loc> carries a valid, parseable <lastmod>. ---
const locRoutes = new Set();
for (const { loc, lastmod, child } of entries) {
  if (!loc) {
    fail(`<url> without <loc> in ${child}`);
    continue;
  }
  let url;
  try {
    url = new URL(loc);
  } catch {
    fail(`unparseable <loc>: ${loc}`);
    continue;
  }
  // Hard rules, independent of config, so a bad SITE can't ship a useless
  // sitemap: production URLs must be https and never point at a dev host.
  const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']);
  if (url.protocol !== 'https:') {
    fail(`non-https <loc>: ${loc}`);
  }
  if (LOCAL_HOSTS.has(url.hostname)) {
    fail(`localhost <loc>: ${loc}`);
  }
  // And they must match the configured production origin.
  if (url.origin !== EXPECTED_ORIGIN) {
    fail(`wrong origin (expected ${EXPECTED_ORIGIN}): ${loc}`);
  }
  locRoutes.add(routeKey(url.pathname));

  if (!lastmod) {
    fail(`missing <lastmod>: ${loc}`);
  } else if (Number.isNaN(Date.parse(lastmod))) {
    fail(`invalid <lastmod> "${lastmod}": ${loc}`);
  }
}

// --- 2. The <loc> set matches the pages actually built in dist/. ---
// Walk for index.html files and normalise each to its route. This catches both
// accidental exclusions and stale/missing entries — the core freshness check.
function builtRoutes(dir, base = dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      // Skip Astro's asset bundle — it holds no HTML pages.
      if (path.relative(base, full) === '_astro') continue;
      out.push(...builtRoutes(full, base));
    } else if (name === 'index.html') {
      const rel = path.relative(base, path.dirname(full));
      out.push(rel === '' ? '/' : routeKey(rel));
    }
  }
  return out;
}

const pageRoutes = new Set(fs.existsSync(DIST) ? builtRoutes(DIST) : []);

const missingFromSitemap = [...pageRoutes].filter((r) => !locRoutes.has(r));
const extraInSitemap = [...locRoutes].filter((r) => !pageRoutes.has(r));

if (missingFromSitemap.length) {
  fail(
    `pages built but absent from sitemap (${missingFromSitemap.length}):\n    ` +
      missingFromSitemap.sort().join('\n    ')
  );
}
if (extraInSitemap.length) {
  fail(
    `sitemap URLs with no matching built page (${extraInSitemap.length}):\n    ` +
      extraInSitemap.sort().join('\n    ')
  );
}

// --- Report. ---
if (errors.length) {
  console.error('\n✗ sitemap verification failed:');
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✓ sitemap verified: ${entries.length} URLs, origin ${EXPECTED_ORIGIN}, ` +
    `all with valid lastmod, matching ${pageRoutes.size} built pages.`
);
