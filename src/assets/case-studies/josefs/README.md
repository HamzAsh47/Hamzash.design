# Josef's Buffalo Wings — case study images

Drop files in here named exactly as listed. The case study picks them up
automatically: `caseFigures.ts` globs this folder at build time, so a name that
matches appears on the page and a name that is missing is simply skipped. No
code change, no broken build either way.

Source gallery:
https://www.behance.net/gallery/204631775/Josefs-360-Visual-Identity-Social-Motion

Accepted extensions: `.webp` `.avif` `.jpg` `.jpeg` `.png`
Prefer `.webp` — everything else on the site is webp, and these are photographs.

| File name          | What belongs here                                                        |
| ------------------ | ------------------------------------------------------------------------ |
| `hero`             | Wide hero — Hamza holding a wing / the Josef's storefront sign            |
| `moodboard`        | Early moodboard and inspiration references, before any brand existed      |
| `palette`          | Old-vs-new colour palette with hex codes (Jewel green, Black Bean, …)     |
| `mascot-sketches`  | Early buffalo-head explorations from the mascot development panels        |
| `mascot-final`     | Final mascot mark alone, on the solid green background                    |
| `emblem-logo`      | Secondary oval badge — "QUALITY & TASTE · JOSEF'S · BUFFALO WINGS"        |
| `logo-lockup`      | Primary lockup: buffalo head above "JOSEF'S / BUFFALO WINGS"              |
| `packaging`        | Wing tub with wrapping pattern, takeout box and bag                       |
| `storefront`       | Facade signage — Phoenix Center Harburg and/or Europa Passage             |
| `menu-screens`     | Animated LED menu boards (flavour list, Hot Bowl / Exotic Bowl)           |
| `interior`         | Wide interior: counter, screens, signage together                         |
| `social-grid`      | @josefs_hamburg profile and post grid                                     |
| `social-content`   | One or two individual reel/post examples                                  |

Numbered variants work too, and stack in order under the same heading:
`packaging-1.webp`, `packaging-2.webp`, `packaging-3.webp`.

Alt text is written in `src/content/caseStudies.ts`, not derived from the file
name — if you add a variant, add its alt text there so the page stays readable
to a screen reader and to a crawler.
