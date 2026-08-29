/**
 * Fails the build if anything the Worker imports pulls in an image, video or
 * font.
 *
 * The Worker bundles with esbuild, which has no loader for those — so a single
 * `import x from './thing.webp'` anywhere in its import graph makes
 * `wrangler deploy` fail. That is a bad place to find out: `vite build`
 * succeeds, the client bundle is fine, and the failure only appears at the
 * deploy step after everything else has passed.
 *
 * It has already happened twice. content/botContext pulls in the whole content
 * layer for the assistant's knowledge, so any content file that grows an asset
 * import silently becomes a Worker file. caseStudies.ts is kept out by hand for
 * this reason; serviceMedia.ts exists for it too. This makes the rule
 * enforceable instead of remembered.
 */

import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const ENTRY = 'worker/index.ts'
const ASSETS = /\.(webp|png|jpe?g|gif|svg|avif|mp4|webm|woff2?|ttf|otf)$/i
const CODE = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx']

/** Only relative specifiers — a bare one is a package, not our source. */
const IMPORTS = /(?:^|\n)\s*(?:import|export)[^'"\n]*?from\s*['"](\.[^'"]+)['"]/g

const seen = new Set()
const problems = []

function resolveFile(from, spec) {
  const base = resolve(dirname(from), spec)
  if (ASSETS.test(spec)) return base
  for (const ext of ['', ...CODE]) {
    if (existsSync(base + ext) && !existsSync(base + ext + '/')) return base + ext
  }
  return null
}

function walk(file, trail) {
  if (seen.has(file)) return
  seen.add(file)

  let source
  try {
    source = readFileSync(file, 'utf8')
  } catch {
    return
  }

  for (const match of source.matchAll(IMPORTS)) {
    const spec = match[1]
    const target = resolveFile(file, spec)
    if (!target) continue

    if (ASSETS.test(spec)) {
      problems.push({ file, spec, trail: [...trail, file] })
      continue
    }
    walk(target, [...trail, file])
  }
}

walk(resolve(ENTRY), [])

if (problems.length) {
  console.error(`\n${ENTRY} reaches ${problems.length} asset import(s) it cannot bundle:\n`)
  for (const p of problems) {
    console.error(`  ${p.file.replace(process.cwd() + '/', '')}`)
    console.error(`    imports ${p.spec}`)
    console.error(`    reached via ${p.trail.map((f) => f.replace(process.cwd() + '/', '')).join(' -> ')}\n`)
  }
  console.error('Move the asset import into a module only the client imports.\n')
  process.exit(1)
}

console.log(`worker imports clean (${seen.size} modules checked)`)
