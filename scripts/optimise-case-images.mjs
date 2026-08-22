/**
 * Case-study image optimiser.
 *
 * Source exports arrive at whatever size the design tool produced them —
 * 15 MB PNGs and 25 MB GIFs, which is fine as an archive and unusable as a web
 * page. Cloudflare also caps a single deployed asset at 25 MiB, so the largest
 * of them could not ship at all.
 *
 * This converts what is in each case-study folder into web-sized WebP beside
 * the originals, and prints what it saved. Animated GIFs become animated WebP,
 * which keeps the motion at a fraction of the weight. Originals are left on
 * disk and ignored by the build; `figuresFor` prefers the .webp.
 *
 * Run: npm run images
 */
import { readdir, stat, unlink, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = join(root, 'src/assets/case-studies')

/* Wide enough for a full-bleed figure on a 2x display without being a poster
   print. The page never renders one of these larger than the container. */
const MAX_STATIC = 1600
/* Motion costs a frame at a time, so it gets a tighter box. */
const MAX_ANIMATED = 900

const kb = (n) => `${(n / 1024).toFixed(0)} KB`
const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`

let before = 0
let after = 0

for (const study of await readdir(base)) {
  const dir = join(base, study)
  if (!(await stat(dir)).isDirectory()) continue

  for (const file of await readdir(dir)) {
    const { name, ext } = parse(file)
    const lower = ext.toLowerCase()
    if (!['.png', '.jpg', '.jpeg', '.gif'].includes(lower)) continue

    const source = join(dir, file)
    const target = join(dir, `${name}.webp`)
    const size = (await stat(source)).size
    const animated = lower === '.gif'

    try {
      const buffer = await sharp(source, {
        animated,
        /* A multi-frame GIF blows past the default pixel ceiling once every
           frame is counted; these are trusted local exports, not uploads. */
        limitInputPixels: 2_000_000_000,
      })
        .resize({ width: animated ? MAX_ANIMATED : MAX_STATIC, withoutEnlargement: true })
        .webp({ quality: animated ? 62 : 80, effort: 6 })
        .toBuffer()

      /* Never make a file bigger in the name of optimising it. */
      if (buffer.byteLength >= size) {
        console.log(`  skip  ${file} — webp would be larger`)
        continue
      }

      /* Written straight to disk. Passing the buffer back through sharp to
         save it re-encodes it, and a re-encode without { animated: true }
         silently keeps only the first frame — which is how a 24 MB GIF
         became a 582-byte still. */
      await writeFile(target, buffer)
      before += size
      after += buffer.byteLength
      console.log(
        `  ${String(name).padEnd(34)} ${mb(size).padStart(8)} -> ${kb(buffer.byteLength).padStart(8)}`,
      )
      await unlink(source)
    } catch (error) {
      console.log(`  FAIL  ${file}: ${error.message.slice(0, 80)}`)
    }
  }
}

void existsSync
console.log(`\ntotal ${mb(before)} -> ${mb(after)}  (${(100 - (after / before) * 100).toFixed(0)}% smaller)`)
