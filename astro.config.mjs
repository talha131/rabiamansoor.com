// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The public production URL. Override with the SITE env var on Netlify if the
// custom domain differs. Used for canonical URLs, sitemap and OG tags.
const SITE = process.env.SITE || 'https://rabiamansoor.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [sitemap()],
  image: {
    // Emit modern formats; sharp is the default service.
    responsiveStyles: true,
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
