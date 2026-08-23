# Uplift K12 — case study images

Drop files in here named exactly as listed. The case study picks them up
automatically: `caseFigures.ts` globs this folder at build time, so a name that
matches appears on the page and a name that is missing is simply skipped. No
code change, no broken build either way.

Accepted extensions: `.webp` `.avif` `.jpg` `.jpeg` `.png` `.mp4`
Prefer `.webp` for stills. Run `npm run images` after adding anything — it
resizes, converts and records each file's dimensions, which is what stops the
page shifting as the images load.

| File name                | What belongs here                                                        |
| ------------------------ | ------------------------------------------------------------------------ |
| `Thumbnail`              | The card and page cover. Wins over `hero` if both exist                   |
| `sample-games`           | The first two sample game variations, before the ask grew to fifty        |
| `legacy-ui`              | The inherited interface — colour used decoratively, before the rebuild    |
| `dashboard-redesign`     | The rebuilt teacher dashboard                                             |
| `live-session`           | A live class in progress: teacher controls and the student's view         |
| `game-library`           | The library filtered by grade or topic — several game formats visible     |
| `lesson-playlist`        | A lesson playlist: Welcome → Introduction → Warm Up → Teach → Practice    |
| `whiteboard-tools`       | The whiteboard's drawing set, text tools, timer and session controls      |
| `manipulatives`          | Virtual manipulatives — arrays, ten-frames, number lines, hundreds charts |
| `quiz-cards`             | The card-based live quiz: face-down deck, four options, player tracker    |
| `curriculum-map`         | The K1–K4 syllabus structure, chapter by chapter                          |
| `pitch-deck`             | Pitch deck spreads and promotional graphic assets                         |
| `board-game-box`         | The physical box: dieline and cover design                                |
| `board-game-components`  | Boards, cards and manipulative pieces laid out                            |

Two files can share a slot by numbering them — `whiteboard-tools-1`,
`whiteboard-tools-2`. They then lay out side by side at a common height, which
is the right call when the point is the comparison between them.

Parentheses in a file name become the caption for that image:
`board-game-box (dieline and cover).webp`.
