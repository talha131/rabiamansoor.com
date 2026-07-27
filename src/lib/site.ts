/* Shared site constants — single source of truth for identity, nav & links. */

export const SITE_NAME = 'Rabia Mansoor';
export const SITE_TAGLINE = 'Decoding Global Power through Stories.';
export const SITE_DESC =
  'Rabia Mansoor — independent researcher and PhD scholar mapping how global power is constructed through narration: classical geopolitics, world literature, popular geopolitics and the spatial humanities.';

export const SCHOLAR_URL =
  'https://scholar.google.com/citations?user=ky8HvIEAAAAJ&hl=en';
export const ORCID_URL = 'https://orcid.org/0009-0005-0134-9612';

export const DEVELOPER = {
  name: 'Talha Mansoor',
  url: 'https://talhamansoor.com',
};

export type HueName = 'rose' | 'amber' | 'emerald' | 'indigo' | 'ink';

export interface NavItem {
  label: string;
  href: string;
  hue: HueName;
  ref: string; // cartographic grid reference
  blurb?: string; // one-line description for the homepage tiles
}

export const NAV: NavItem[] = [
  { label: 'Home', href: '/', hue: 'rose', ref: '00·N' },
  { label: 'Journal', href: '/journal/', hue: 'amber', ref: '01·E', blurb: 'Dispatches on narrative & power' },
  { label: 'The Lab', href: '/lab/', hue: 'emerald', ref: '02·S', blurb: 'Narrative topographies & research' },
  { label: 'Classroom', href: '/classroom/', hue: 'indigo', ref: '03·W', blurb: 'The résumé — bio, trajectory & grants' },
  { label: 'Writing', href: '/articles/', hue: 'rose', ref: '05·E', blurb: 'Teaching philosophy & certifications' },
  { label: 'About', href: '/about/', hue: 'ink', ref: '04·N' },
];
