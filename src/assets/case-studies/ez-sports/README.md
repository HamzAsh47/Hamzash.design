# EZ Sports Apparel — case study images

Drop files in here named exactly as listed. The case study picks them up
automatically: `caseFigures.ts` globs this folder at build time, so a name that
matches appears on the page and a name that is missing is simply skipped. No
code change, no broken build either way.

Accepted extensions: `.webp` `.avif` `.jpg` `.jpeg` `.png` `.mp4`
Run `npm run images` after adding anything — it resizes, converts and records
each file's dimensions, which is what stops the page shifting as they load.

| File name             | What belongs here                                                        |
| --------------------- | ------------------------------------------------------------------------ |
| `Thumbnail`           | The card and page cover. Wins over `hero` if both exist                   |
| `approval-mockup`     | A client-facing mockup as a team sees it before signing off               |
| `deck-structure`      | The deck laid out end to end: identity, palette, jersey, pants, lockup    |
| `colour-specs`        | The palette and logo asset sheet showing CMYK / RGB / HEX values          |
| `vendor-file`         | A production file, sized and labelled — the "FOR VENDOR" version          |
| `bcll-teams`          | Several Bear Creek Little League teams together, one colour story each    |
| `prodigy-colourways`  | Prodigy cuts and colourways side by side                                  |
| `outlaws-diecut`      | The Outlaws die-cut sublimation layout, ideally beside its mockup         |
| `packaging`           | Bags and branded soft goods for EZ Sports Apparel itself                  |

Two files can share a slot by numbering them — `vendor-file-1`,
`vendor-file-2`. They then lay out side by side at a common height, which is
the right call when the point is the comparison between them: the approved
mockup against the vendor file is exactly that pairing.

Parentheses in a file name become the caption for that image:
`bcll-teams (Hooks, Blue Rocks and TinCaps).webp`.

Nothing here should be a client's own logo presented as work of mine — these
are uniform designs built around clubs' existing marks, and the mockups are
the deliverable.
