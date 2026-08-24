/* ---------------------------------------------------------------------------
   Generates the two SEO files that have to exist on disk rather than in
   runtime markup: sitemap.xml and robots.txt. Both land in `public/`, so a
   normal build copies them to the site root.

   Run with `npm run seo`. Deliberately zero-dependency — this runs on plain
   node, and adding a headless browser to the toolchain for two text files
   would be the wrong trade.

   The Open Graph card is the exception: it is rendered from
   `scripts/og-image.html` and committed as `public/og-image.png`, since it
   changes about once a year. To regenerate after editing that file:

     npx playwright screenshot --viewport-size=1200,630 \
       scripts/og-image.html public/og-image.png
--------------------------------------------------------------------------- */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const publicDir = resolve(root, 'public')

/** Must match the default in brand.ts, or the sitemap and the canonical tags
 *  disagree about which origin the site lives on. */
const SITE_URL = (process.env.VITE_SITE_URL ?? 'https://hamzash47.com').replace(/\/+$/, '')

/* --- Case-study slugs, read straight from the content file ---------------- */
/* Parsed rather than imported: this is a plain node script and the content
   module is TypeScript that imports image assets Vite resolves, not node. */
const caseSource = readFileSync(resolve(root, 'src/content/caseStudies.ts'), 'utf8')
const slugs = [...caseSource.matchAll(/^\s{4}slug: '([\w-]+)',$/gm)].map((m) => m[1])
if (slugs.length === 0) throw new Error('No case-study slugs found — has the content shape changed?')

/* --- Sitemap -------------------------------------------------------------- */
/* Hash fragments are not separate URLs to a crawler, so the sitemap lists the
   one document. The case studies are listed as fragments anyway: harmless to
   crawlers that ignore them, useful to the humans who read sitemaps. */
const today = new Date().toISOString().slice(0, 10)
const urls = [
  { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'monthly' },
  ...slugs.map((slug) => ({
    loc: `${SITE_URL}/#/case/${slug}`,
    priority: '0.6',
    changefreq: 'yearly',
  })),
]

writeFileSync(
  resolve(publicDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`,
)

/* --- robots.txt ----------------------------------------------------------- */
writeFileSync(
  resolve(publicDir, 'robots.txt'),
  `User-agent: *
Allow: /

# The email signature. Publicly reachable because it has to be — Gmail
# fetches those images anonymously when it renders a message, so anything
# behind a login or a token shows a visitor a row of broken boxes. What it
# is not is part of the website: nothing links to it, it is absent from the
# sitemap, and this keeps it out of search results. See public/_headers,
# which sends the same instruction as a header for the images themselves.
Disallow: /assets/signature/

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

console.log(`sitemap.xml    ${urls.length} urls`)
console.log(`robots.txt     sitemap -> ${SITE_URL}/sitemap.xml`)
