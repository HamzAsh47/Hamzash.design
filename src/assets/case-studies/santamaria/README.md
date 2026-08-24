# Santamaria Law Firm — case study images

Drop files in here named exactly as listed. The case study picks them up
automatically: `caseFigures.ts` globs this folder at build time, so a name that
matches appears on the page and a name that is missing is simply skipped. No
code change, no broken build either way.

Accepted extensions: `.webp` `.avif` `.jpg` `.jpeg` `.png` `.mp4`
Run `npm run images` after adding anything — it resizes, converts and records
each file's dimensions, which is what stops the page shifting as they load.

Frame grabs from delivered episodes are the material here. An `.mp4` works for
the icon system if a still cannot show it moving.

| File name          | What belongs here                                                          |
| ------------------ | ---------------------------------------------------------------------------|
| `Thumbnail`        | The card and page cover — a frame from a delivered episode                  |
| `raw-footage`      | The attorney on the raw green screen, before anything was applied           |
| `brand-extraction` | The firm's logo, palette and type beside the layout system built from them  |
| `compositing`      | Key and branded backdrop, ideally before-and-after in one image             |
| `icon-system`      | The animated icon library — several topics together, or a short clip        |
| `kids-series`      | Frames from the children's line, with the Lenin character visible           |
| `episode-frames`   | Three grabs across different topics: identity documents, a numbered         |
|                    | checklist, deportation risk — the icon system doing its job across subjects |

`episode-frames` is the one that most needs to be several files: number them
`episode-frames-1`, `episode-frames-2`, `episode-frames-3` and they lay out on
one line at a common height, which is what makes the point that it is one
system across different topics rather than one nice-looking still.

Nothing from the UC Berkeley or University of San Francisco collaborations —
that work is under NDA and the case study says so rather than showing it.
