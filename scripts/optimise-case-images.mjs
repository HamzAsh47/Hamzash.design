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
import { mkdir, readdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
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

/**
 * Reads a video track's presentation size out of an MP4's `tkhd` box.
 *
 * Videos need intrinsic dimensions for the same reason images do — without
 * them the element collapses and the page shows an empty bordered box, which
 * is exactly what the two social clips were doing. No ffmpeg here, but the
 * box tree is walkable directly: tkhd stores width and height as 16.16
 * fixed-point after the time block, the layer/volume reserved bytes and the
 * 36-byte display matrix.
 */
function mp4Dimensions(buf) {
  let best = null

  const walk = (start, end) => {
    let off = start
    while (off + 8 <= end) {
      const size = buf.readUInt32BE(off)
      if (size < 8) break
      const type = buf.toString('latin1', off + 4, off + 8)
      const bodyStart = off + 8
      const bodyEnd = Math.min(off + size, end)

      if (type === 'tkhd') {
        const version = buf[bodyStart]
        const base = bodyStart + 4 + (version === 1 ? 32 : 20)
        const w = buf.readUInt32BE(base + 52) / 65536
        const h = buf.readUInt32BE(base + 56) / 65536
        /* Largest track wins — audio tracks carry a zeroed size. */
        if (w > 0 && h > 0 && (!best || w * h > best.w * best.h)) {
          best = { w: Math.round(w), h: Math.round(h) }
        }
      }
      if (['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts'].includes(type)) walk(bodyStart, bodyEnd)
      off += size
    }
  }

  walk(0, buf.length)
  return best
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`
const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`

let before = 0
let after = 0

/* Intrinsic sizes, written out beside the files. The page needs them to
   reserve the right box before an image loads — without them every figure is
   a layout shift, and with a guessed aspect ratio every figure is a crop. */
const dimensions = {}

for (const study of await readdir(base)) {
  const dir = join(base, study)
  if (!(await stat(dir)).isDirectory()) continue

  for (const file of await readdir(dir)) {
    const { name, ext } = parse(file)
    const lower = ext.toLowerCase()

    /* A container check, not a codec check, but it catches the failure that
       actually happened: a raw MPEG-TS stream renamed .mp4. Every real MP4
       carries an `ftyp` box in its first bytes; this one started with 0x47,
       the transport-stream sync byte, and played as an empty black frame. */
    if (lower === '.mp4') {
      const head = await readFile(join(dir, file))
      if (!head.subarray(0, 64).includes(Buffer.from('ftyp'))) {
        const parked = join(dir, '_unplayable')
        await mkdir(parked, { recursive: true })
        await rename(join(dir, file), join(parked, file))
        console.log(`  PARKED ${file} — no ftyp box, not a playable MP4`)
        continue
      }

      const size = mp4Dimensions(head)
      if (size) {
        dimensions[study] ??= {}
        dimensions[study][file] = size
        console.log(`  ${name.padEnd(34)} video ${size.w}x${size.h}`)
      } else {
        console.log(`  ${file}: could not read dimensions — it will render collapsed`)
      }
      continue
    }

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

      const meta = await sharp(buffer, { animated, limitInputPixels: 2_000_000_000 }).metadata()
      /* An animated WebP reports the height of every frame stacked. */
      const height = meta.pages && meta.pages > 1 ? meta.height / meta.pages : meta.height
      dimensions[study] ??= {}
      dimensions[study][`${name}.webp`] = { w: meta.width, h: Math.round(height) }
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

/* Merge rather than overwrite: a run that only converts one new file must not
   forget the sizes of everything already converted. */
for (const [study, sizes] of Object.entries(dimensions)) {
  const file = join(base, study, 'dimensions.json')
  let existing = {}
  if (existsSync(file)) {
    try {
      existing = JSON.parse(await readFile(file, 'utf8'))
    } catch {
      existing = {}
    }
  }
  await writeFile(file, `${JSON.stringify({ ...existing, ...sizes }, null, 2)}\n`)
  console.log(`  wrote ${study}/dimensions.json`)
}

console.log(`\ntotal ${mb(before)} -> ${mb(after)}  (${(100 - (after / before) * 100).toFixed(0)}% smaller)`)
