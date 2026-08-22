/**
 * Case-study media, resolved from the filesystem rather than imported.
 *
 * A static `import` of an image that has not been supplied yet fails the
 * build, which makes a half-illustrated case study impossible to ship.
 * Globbing inverts that: whatever is in the folder appears, whatever is
 * missing is skipped, and the copy stands on its own until the file arrives.
 * Dropping a correctly named file into `src/assets/case-studies/<study>/` is
 * the whole publishing step.
 *
 * Only web-ready formats are matched. Source exports (.gif, oversized .png)
 * are converted to .webp by `npm run images` and the originals are removed;
 * anything left unconverted simply does not resolve, rather than shipping a
 * 25 MB GIF to a phone.
 */

const media = import.meta.glob<string>(
  '../assets/case-studies/*/*.{webp,avif,jpg,jpeg,png,mp4}',
  { eager: true, import: 'default' },
)

export type Figure = { src: string; kind: 'image' | 'video'; caption?: string }

/**
 * Filenames arrive however the design tool exported them, so the parser is
 * forgiving in three specific ways:
 *
 *   `Hero.webp`                  -> slot `hero`      (case is not meaningful)
 *   `packaging-2.webp`           -> slot `packaging`, order 2
 *   `storefront (Europa Passage)`-> slot `storefront`, and the parenthesised
 *                                   text becomes the figure's caption, since
 *                                   it is almost always the thing that
 *                                   distinguishes one shot from another.
 */
function parse(path: string) {
  const match = path.match(/case-studies\/([^/]+)\/(.+)\.([a-z0-9]+)$/i)
  if (!match) return null
  const [, study, rawName, ext] = match

  let name = rawName.trim()
  let caption: string | undefined

  const parenthesised = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (parenthesised) {
    name = parenthesised[1].trim()
    caption = parenthesised[2].trim()
  }

  let order = 0
  const numbered = name.match(/^(.*?)[-_](\d+)$/)
  if (numbered) {
    name = numbered[1]
    order = Number(numbered[2])
  }

  return {
    study: study.toLowerCase(),
    slot: name.toLowerCase(),
    order,
    caption,
    kind: ext.toLowerCase() === 'mp4' ? ('video' as const) : ('image' as const),
  }
}

type Entry = Figure & { slot: string; order: number }

const byStudy = new Map<string, Entry[]>()
for (const [path, src] of Object.entries(media)) {
  const parsed = parse(path)
  if (!parsed) continue
  const list = byStudy.get(parsed.study) ?? []
  list.push({
    slot: parsed.slot,
    order: parsed.order,
    src,
    kind: parsed.kind,
    caption: parsed.caption,
  })
  byStudy.set(parsed.study, list)
}

/**
 * Every file supplied for a slot, in variant order. Empty when nothing has
 * been added yet, which the renderer treats as "this section is text only".
 */
export function figuresFor(study: string, slot: string): Figure[] {
  return (byStudy.get(study.toLowerCase()) ?? [])
    .filter((entry) => entry.slot === slot.toLowerCase())
    .sort((a, b) => a.order - b.order)
    .map(({ src, kind, caption }) => ({ src, kind, caption }))
}

/**
 * The still used on cards and as the case-study cover.
 *
 * Prefers a dedicated thumbnail over the lead figure on purpose: the Josef's
 * hero is a 160-frame animation, and a card grid that autoplays one of those
 * per card is not a card grid. Falls back to `hero`, then to nothing.
 */
export function coverFor(study: string): string | undefined {
  for (const slot of ['thumbnail', 'thumb', 'thum', 'hero']) {
    const found = figuresFor(study, slot).find((f) => f.kind === 'image')
    if (found) return found.src
  }
  return undefined
}
