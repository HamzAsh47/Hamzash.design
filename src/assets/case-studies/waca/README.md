# WACA — ANZPCC 2024 tournament guide — case study images

These are exports from the delivered PDF. **Drop them in with the names they
already have** — `hero-01.png`, `index-02.png`, `rules-46.png` and so on. The
trailing number is read as variant order, not as part of the name, so the PDF
page number survives in the filename and still resolves to the right slot.

`caseFigures.ts` globs this folder at build time: a name that matches a slot
appears on the page, a name with no slot is ignored, and a slot with no file is
skipped. Nothing breaks either way.

Accepted extensions: `.webp` `.avif` `.jpg` `.jpeg` `.png`
PNG is fine here — these are page exports with flat colour and type, which is
exactly what PNG is good at. Keep the 150dpi renders; the page scales them down.

| Slot       | Files already exported | What belongs here                                  |
| ---------- | ---------------------- | -------------------------------------------------- |
| `hero`     | `hero-01.png`          | Tournament guide cover                              |
| `index`    | `index-02.png`         | The interactive index linking all 13 sections       |
| `welcome`  | `welcome-03.png`       | Welcome letter from the WA Cricket CEO              |
| `schedule` | `schedule-05.png`      | Match schedule page                                 |
| `venue`    | `venue-11.png`         | Venue profile page                                  |
| `team`     | `team-23.png`          | Team / player profile page                          |
| `merch`    | `merch-19.png`         | Official tournament merchandise page                |
| `rules`    | `rules-46.png`         | ANZPCC championship rules page                      |

More pages from the same PDF slot straight in: export at 150dpi, name it
`<slot>-<page>.png`, and it stacks in page order under the same heading —
`team-23.png`, `team-24.png`, `team-25.png`.

Alt text lives in `src/content/caseStudies.ts`, not in the file name. Add it
there for any page you add, so the guide stays readable to a screen reader and
to a crawler.
