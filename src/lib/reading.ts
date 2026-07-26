/* Estimated reading time (~200 wpm) from a raw markdown/MDX body. Strips MDX
   imports, JSX tags and markdown punctuation so the count reflects prose. */
export function readingMinutes(body: string | undefined): number {
  const prose = (body ?? '')
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~\-]/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
