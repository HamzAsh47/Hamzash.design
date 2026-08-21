/**
 * Case-study photography, resolved from the filesystem rather than imported.
 *
 * A static `import` of an image that has not been supplied yet fails the
 * build, which makes a half-illustrated case study impossible to ship. Globbing
 * inverts that: whatever is in the folder appears, whatever is missing is
 * skipped, and the copy stands on its own until the file arrives. Dropping a
 * correctly named file into `src/assets/case-studies/<study>/` is the whole
 * publishing step.
 */

const files = import.meta.glob<string>('../assets/case-studies/*/*.{webp,avif,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
})

/** `../assets/case-studies/josefs/packaging-2.webp` -> `josefs` / `packaging` / 2 */
function parse(path: string) {
  const match = path.match(/case-studies\/([^/]+)\/([^/]+)\.[a-z]+$/i)
  if (!match) return null
  const [, study, name] = match
  const variant = name.match(/^(.*?)-(\d+)$/)
  return {
    study,
    slot: variant ? variant[1] : name,
    order: variant ? Number(variant[2]) : 0,
  }
}

type Entry = { slot: string; order: number; src: string }

const byStudy = new Map<string, Entry[]>()
for (const [path, src] of Object.entries(files)) {
  const parsed = parse(path)
  if (!parsed) continue
  const list = byStudy.get(parsed.study) ?? []
  list.push({ slot: parsed.slot, order: parsed.order, src })
  byStudy.set(parsed.study, list)
}

/**
 * Every image supplied for a slot, in variant order — `packaging-1`,
 * `packaging-2`, then plain `packaging`. Empty when nothing has been added yet,
 * which the renderer treats as "this section is text only".
 */
export function figuresFor(study: string, slot: string): string[] {
  return (byStudy.get(study) ?? [])
    .filter((entry) => entry.slot === slot)
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.src)
}

/** True when a study has at least one image on disk. */
export function hasFigures(study: string): boolean {
  return (byStudy.get(study) ?? []).length > 0
}
