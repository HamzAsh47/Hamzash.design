# CultureLancer — case study images

Drop files in here named exactly as listed. The case study picks them up
automatically: `caseFigures.ts` globs this folder at build time, so a name that
matches appears on the page and a name that is missing is simply skipped. No
code change, no broken build either way.

Accepted extensions: `.webp` `.avif` `.jpg` `.jpeg` `.png`
Prefer `.webp`. These are UI screens, so export at 2x and let the page scale
them down — thin type in a product screenshot falls apart at 1x.

| File name             | What belongs here                                                      |
| --------------------- | ---------------------------------------------------------------------- |
| `hero`                | Lead image — the finished product, ideally a strong dashboard screen     |
| `brand-starting-point`| The inherited brand guideline: logo, typography, colour palette          |
| `icon-shape-language` | The sharp-edged icon set / shape language                                |
| `photography-usage`   | Real human photography in place — signup split-screen, hero sections     |
| `figjam-mindmap`      | FigJam layout-instructions mindmap: the platform's branches               |
| `project-timeline`    | Sprint timeline board — setup through wireframes, reviews, prototypes     |
| `sitemap-tree`        | Full sitemap flowchart, home page down through both sides                 |
| `jobseeker-flow-annotated` | Job Seeker flow board with UX recommendations on the diagram         |
| `employer-flow-annotated`  | Employer flow board with UX recommendations on the diagram           |
| `lowfi-jobseeker`     | Low-fidelity wireframes, Job Seeker side                                  |
| `lowfi-employer`      | Low-fidelity wireframes, Employer side                                    |
| `component-library`   | Wide design-system sheet: navbars, buttons, cards, text styles together  |
| `navbar-states`       | Nav variants by role — guest, job seeker, employer, with notifications   |
| `signup-flow`         | "Job Seeker or Employer" choice screen and the split-image signup form   |
| `profile-builder`     | Multi-step profile builder: details, experience, projects, awards        |
| `jobseeker-dashboard` | Skills assessment, top skills, applied jobs, recommended jobs            |
| `job-listing-detail`  | Job detail page: budget, timeline, skills required, apply flow           |
| `employer-dashboard`  | Jobs posted, best recommended talent, applications, performance charts   |
| `post-job-flow`       | "Post a New Job", including the AI description assistant                 |
| `candidate-profile`   | Candidate as the employer sees them, with match score and skills         |
| `messaging`           | In-platform messaging between an employer and a candidate                |
| `courses`             | Courses and certifications: enrolled, completed, recommended             |
| `membership-plans`    | Employer membership tiers — Basic / Pro / Premium                        |

Numbered variants work too, and stack in order under the same heading:
`profile-builder-1.webp`, `profile-builder-2.webp`.

Alt text lives in `src/content/caseStudies.ts`, not in the file name — add it
there for any variant you add, so the page stays readable to a screen reader
and to a crawler.
