// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// The public production URL. Override with the SITE env var on Netlify if the
// custom domain differs. Used for canonical URLs, sitemap and OG tags.
const SITE = process.env.SITE || 'https://rabiamansoor.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [mdx(), sitemap()],
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
