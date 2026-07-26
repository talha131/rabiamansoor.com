/* Citation generation for the reading pages. Turns an article's frontmatter
   into (a) a human-readable reference line and (b) a correctly-typed BibTeX
   entry, so readers can cite the work in one click. */
import { SITE_NAME } from './site';

export interface CiteInput {
  slug: string;
  title: string;
  kind: 'dispatch' | 'peer-reviewed' | 'book-review' | 'book-chapter' | 'thesis';
  kindLabel?: string;
  venue?: string;
  date?: string;
  datePublished?: string;
  doi?: string;
  isbn?: string;
  url: string;
}

const AUTHOR_BIB = 'Mansoor, Rabia';

/** Four-digit year from an ISO date, else the first year found in `date`. */
function yearOf(a: CiteInput): string {
  if (a.datePublished) return a.datePublished.slice(0, 4);
  const m = (a.date ?? '').match(/\d{4}/);
  return m ? m[0] : '';
}

function bibKey(a: CiteInput): string {
  const word = a.slug.split('-').find((w) => w.length > 3) ?? a.slug;
  return `mansoor${yearOf(a) || 'nd'}${word}`;
}

/** Escape the handful of characters that are special in BibTeX field values. */
function esc(s: string): string {
  return s.replace(/([&%$#_])/g, '\\$1');
}

/** A clean book title for @incollection, dropping a leading "in " and any
    trailing "(year)" the display venue carries. */
function bookTitle(venue: string): string {
  return venue
    .replace(/^in\s+/i, '')
    .replace(/\s*\(\d{4}\)\s*$/, '')
    .trim();
}

export function toBibtex(a: CiteInput): string {
  const year = yearOf(a);
  const key = bibKey(a);
  const fields: [string, string][] = [
    ['author', AUTHOR_BIB],
    ['title', `{${esc(a.title)}}`],
  ];

  let type: string;
  switch (a.kind) {
    case 'book-chapter':
      type = 'incollection';
      if (a.venue) fields.push(['booktitle', esc(bookTitle(a.venue))]);
      if (a.isbn) fields.push(['isbn', a.isbn]);
      break;
    case 'thesis':
      type = 'mastersthesis';
      fields.push(['type', a.kindLabel?.split('·')[0].trim() || 'Thesis']);
      break;
    case 'dispatch':
      type = 'misc';
      fields.push(['howpublished', esc(a.venue ?? SITE_NAME)]);
      break;
    default: // peer-reviewed, book-review
      type = 'article';
      if (a.venue) fields.push(['journal', esc(a.venue)]);
  }

  if (year) fields.push(['year', year]);
  if (a.doi) fields.push(['doi', a.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '')]);
  fields.push(['url', a.url]);

  const body = fields
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(',\n');
  return `@${type}{${key},\n${body}\n}`;
}

/** A plain reference line shown above the button. */
export function formatCitation(a: CiteInput): string {
  const year = yearOf(a);
  const yr = year ? ` (${year})` : '';
  const parts = [`${SITE_NAME}${yr}. ${a.title}.`];
  if (a.venue) parts.push(`${a.venue}.`);
  else if (a.kindLabel) parts.push(`${a.kindLabel}.`);
  if (a.doi) parts.push(a.doi);
  else if (a.isbn) parts.push(`ISBN ${a.isbn}`);
  else parts.push(a.url);
  return parts.join(' ');
}
