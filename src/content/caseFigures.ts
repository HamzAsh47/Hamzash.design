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

export type Figure = {
  src: string
  kind: 'image' | 'video'
  caption?: string
  /* Intrinsic size, so the page can reserve the right box before the file
     loads. Without it every figure is a layout shift; guessing one shared
     ratio instead is what cropped thirteen of these in half. */
  width?: number
  height?: number
}

/** Written by `npm run images`, one per case-study folder. */
const sizes = import.meta.glob<Record<string, { w: number; h: number }>>(
  '../assets/case-studies/*/dimensions.json',
  { eager: true, import: 'default' },
)

const sizeIndex = new Map<string, { w: number; h: number }>()
for (const [path, entries] of Object.entries(sizes)) {
  const study = path.match(/case-studies\/([^/]+)\//)?.[1]?.toLowerCase()
  if (!study) continue
  for (const [file, size] of Object.entries(entries)) {
    sizeIndex.set(`${study}/${file.toLowerCase()}`, size)
  }
}

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
    file: `${rawName}.${ext}`.toLowerCase(),
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
  const size = sizeIndex.get(`${parsed.study}/${parsed.file}`)
  list.push({
    slot: parsed.slot,
    order: parsed.order,
    src,
    kind: parsed.kind,
    caption: parsed.caption,
    width: size?.w,
    height: size?.h,
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
    .map(({ src, kind, caption, width, height }) => ({ src, kind, caption, width, height }))
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
