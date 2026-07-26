import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* Long-form reading pages ("Medium-style"). Each article's body is the verbatim
   full text (source of truth: the Markdown files in src/content/articles/).
   Frontmatter carries the bibliographic metadata that drives the header, SEO
   and JSON-LD. */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      kind: z.enum([
        'dispatch',
        'peer-reviewed',
        'book-review',
        'book-chapter',
        'thesis',
      ]),
      /** Human label for the `kind` eyebrow (e.g. "Peer-Reviewed Publication"). */
      kindLabel: z.string().optional(),
      venue: z.string().optional(),
      /** Free-text date exactly as given (e.g. "July 2026") — no fabricated day-precision. */
      date: z.string().optional(),
      /** ISO date, only where a real published date exists — feeds JSON-LD datePublished. */
      datePublished: z.string().optional(),
      /** ISO date of the last substantive revision — feeds the sitemap `lastmod`
          (falls back to `datePublished`, then the build date, when absent). */
      updated: z.string().optional(),
      doi: z.string().url().optional(),
      isbn: z.string().optional(),
      impact: z.string().optional(),
      fields: z.array(z.string()).optional(),
      heroImage: image().optional(),
      hue: z.enum(['amber', 'emerald', 'rose', 'indigo', 'ink']),
      /** Section the teaser lives on, for the "← Back to …" footer link. */
      backTo: z
        .object({ label: z.string(), href: z.string() })
        .optional(),
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

export const collections = { articles };
