# GoTeach.ai — case study images

Drop files in here named exactly as listed. The case study picks them up
automatically: `caseFigures.ts` globs this folder at build time, so a name that
matches appears on the page and a name that is missing is simply skipped. No
code change, no broken build either way.

Accepted extensions: `.webp` `.avif` `.jpg` `.jpeg` `.png` `.mp4`
Run `npm run images` after adding anything — it resizes, converts and records
each file's dimensions, which is what stops the page shifting as they load.

Most of these are already in the Figma brand manual and the product file.

| File name             | What belongs here                                                          |
| --------------------- | -------------------------------------------------------------------------- |
| `Thumbnail`           | The card and page cover. Wins over `hero` if both exist                     |
| `challenge`           | The technology-vs-humanity positioning board from the brand manual          |
| `mascot-concept`      | The "Go" wordmark turning into the character — construction, ideally        |
| `logo-lockup`         | Primary lockup: symbol, wordmark and the "Teaching Meets Innovation" line   |
| `logo-secondary`      | Symbol-only mark, for favicon and app-icon sizes                            |
| `colour-palette`      | Three primary tones with hex values, plus the accent set                     |
| `typography`          | Quadaptor-Regular against Oxanium, showing what each one is for             |
| `mascot-poses`        | The full nine-pose character set on one sheet                               |
| `stationery`          | Letterhead and envelope                                                     |
| `splash-screens`      | Laptop and smartphone splash screens                                        |
| `component-library`   | Fields, radios, checkboxes, toggles, primary and secondary buttons          |
| `icon-font`           | The icon set in both styles — rounded beside square                         |
| `interface-palette`   | The extended UI colour system with tint and shade ranges                    |
| `landing-page`        | The landing page, full scroll or the hero plus value props                  |
| `auth-flows`          | Sign-in and register, showing the teacher/student toggle                    |
| `practice-dashboard`  | The Practice Tools library with the subject and grade filters visible       |

`logo-lockup` and `logo-secondary` pair on one line, as do `colour-palette`
and `typography`, and `stationery` and `splash-screens` — the copy above each
pair is comparing them, so they are laid out to a common height.

Two files can share a slot by numbering them — `practice-dashboard-1`,
`practice-dashboard-2`. Parentheses in a file name become that image's
caption: `component-library (buttons and form fields).webp`.
