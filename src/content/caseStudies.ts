import cover01 from '../assets/images/cover-01.svg'
import { coverFor } from './caseFigures'
import cover02 from '../assets/images/cover-02.svg'
import cover03 from '../assets/images/cover-03.svg'
import cover04 from '../assets/images/cover-04.svg'

export type Pillar = 'brand' | 'uiux' | 'motion'

export type CaseStudy = {
  slug: string
  /** Shown on the card and case-study header. */
  client: string
  projectType: string
  /** Pillars this project belongs to — drives the portfolio filter. */
  pillars: Pillar[]
  /** Omitted when the run dates are not established — never guessed. */
  year?: string
  cover: string
  coverAlt: string
  /** One-line headline result. Keep it verifiable — no invented numbers. */
  resultStat: string
  /**
   * Real client this entry is reserved for. Swapping in the real work means
   * replacing the copy below and clearing `isPlaceholder` — no structural
   * change to the grid or the case-study template.
   */
  plannedClient: string
  isPlaceholder: boolean
  /**
   * Live project page, where one exists — the gallery the work was published
   * in. A case study a reader can go and check is worth more than one they
   * have to take on trust.
   */
  externalUrl?: string
  externalLabel?: string
  /** Locked case-study structure. Never a flat "what was designed" list. */
  body: {
    problem: CaseSection
    systemBuilt: CaseSection
    deliverable: CaseSection
    result: CaseSection
  }
  deliverables: string[]
}

/**
 * One section of the locked spine.
 *
 * `copy` carries the argument and is the only required part, so a study reads
 * completely before a single photograph exists. `more` holds the paragraphs a
 * real project needs and a placeholder does not, and `figures` names image
 * slots — a slot with no file on disk is skipped, never rendered as a gap.
 */
export type CaseSection = {
  copy: string
  more?: string[]
  figures?: CaseFigureSlot[]
}

export type CaseFigureSlot = {
  /** Matches the file name in `src/assets/case-studies/<slug>/`. */
  slot: string
  alt: string
  caption?: string
  /** Runs the full container width instead of the measured text column. */
  wide?: boolean
}

export const portfolioIntro = {
  eyebrow: 'SYS.04 :: PORTFOLIO',
  headline: 'Systems built, start to [finish.]',
  lede: 'Every project below follows the same structure: the business problem, the system built to solve it, what shipped, and what it changed.',
  /** Build-state note, rendered as a small chip rather than body copy. */
  draftLabel: 'Draft',
  placeholderNotice:
    'Entries marked Draft are placeholders while that work is prepared — everything else on this page is real, shipped client work.',
}

export const pillarFilters: { value: 'all' | Pillar; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'brand', label: 'Brand Identity' },
  { value: 'uiux', label: 'UI/UX' },
  { value: 'motion', label: 'Motion Branding' },
]

const PLACEHOLDER_BODY = {
  problem: {
    copy: '[Business problem placeholder] — what the company was actually losing before the work started, in their terms: the audience they were failing to reach, the conversion that was leaking, or the inconsistency that was costing them credibility.',
  },
  systemBuilt: {
    copy: '[System built placeholder] — the rules, architecture and components created to solve it: naming and brand architecture, the design system underneath the product UI, and the motion language that carries both into video.',
  },
  deliverable: {
    copy: '[Deliverable placeholder] — the concrete assets handed over, in editable production-ready form, plus the guidelines that let the team keep applying the system without me.',
  },
  result: {
    copy: '[Result / value placeholder] — the measurable outcome, with the real figure and the timeframe it was measured over.',
  },
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'josefs',
    client: "Josef's Buffalo Wings",
    projectType: 'Full System — Brand, Space, Motion & Social',
    pillars: ['brand', 'uiux', 'motion'],
    year: 'Sep 2023—Mar 2026',
    /* The supplied hero, the moment it is dropped in; the placeholder plate
       until then, so a real case study never sits behind a broken image. */
    cover: coverFor('josefs') ?? cover01,
    coverAlt: "Josef's Buffalo Wings brand hero image",
    resultStat: '0 to ~5,000 followers and one location to two, over two years and seven months',
    plannedClient: "Josef's Buffalo Wings",
    isPlaceholder: false,
    externalUrl:
      'https://www.behance.net/gallery/204631775/Josefs-360-Visual-Identity-Social-Motion',
    externalLabel: 'Full gallery on Behance',
    body: {
      problem: {
        copy: "When Josef's came to me there was nothing to build from. No logo, no colour system, no visual language. What they had was a product worth believing in — bold, flavourful buffalo wings — and a plan to open a stall inside Phoenix Center, a busy shopping mall in Hamburg.",
        more: [
          'Two things made the brief harder than it looked on paper. The wings category already had a dominant reference point in Buffalo Wild Wings, one of the biggest wing chains in the US, so this needed an identity that read as its own brand rather than a regional copy. At the same time the business had to be unmistakably halal friendly from day one, and that promise had to live in the visuals themselves, not in a line of text on the menu.',
          'It was also never scoped down to a logo and a style guide. I came on as the sole creative behind everything the brand would ever put in front of a customer, from the mark on the packaging to the walls of the restaurant.',
        ],
        figures: [
          {
            slot: 'hero',
            alt: "Josef's Buffalo Wings brand identity in motion",
            wide: true,
          },
          {
            slot: 'moodboard',
            alt: "Early moodboard and inspiration references for Josef's brand development",
            caption: 'The starting point: references and product shots, no brand assets yet.',
          },
        ],
      },
      systemBuilt: {
        copy: "Rather than borrowing from Buffalo Wild Wings' visual language, I used it only as a category benchmark — a way to understand what a wings brand has to communicate — so Josef's could build something recognisably its own.",
        more: [
          'The halal positioning became the anchor for the entire colour system. Green was chosen deliberately, because it carries an immediate association with halal trust for this audience. The point was to make the promise visible at a glance rather than something a customer had to read to understand.',
          'One early call shaped everything downstream: this had to feel warm and family friendly, not loud or sports-bar coded. That single decision guided the mascot, the typography and the shape language across the whole system.',
          'The mascot went through several rounds before it landed. Two decisions defined it. I used the buffalo\u2019s face rather than its full body, which kept the mark distinctive in the category and clean at small sizes — packaging, app icons. And I chose rounded forms over angular ones, since sharp edges read as aggressive where rounded ones feel approachable. Wings were worked into the mascot itself to tie it back to the product.',
          'Alongside the primary mark I designed a second, emblem-style logo: a more classical tray-inspired badge, used where the primary mark felt too casual — packaging seals, select in-store signage — to give the brand a sense of heritage and quality.',
        ],
        figures: [
          {
            slot: 'palette',
            alt: "Josef's brand colour palette, built on a halal-associated green system",
            caption: 'Green as the anchor: the halal promise, made visible before it is read.',
          },
          {
            slot: 'mascot-sketches',
            alt: "Early sketches of the Josef's buffalo mascot development",
          },
          {
            slot: 'mascot-final',
            alt: "Final Josef's buffalo mascot logo mark",
            caption: 'Face over full body, rounded over angular — distinctive small, warm at any size.',
          },
          {
            slot: 'emblem-logo',
            alt: "Josef's emblem-style badge logo with construction breakdown",
          },
          {
            slot: 'logo-lockup',
            alt: "Josef's primary logo lockup on brand green background",
            wide: true,
          },
        ],
      },
      deliverable: {
        copy: 'Designing for a screen is one thing. Designing a storefront that has to hold attention inside a moving mall crowd is another.',
        more: [
          'I extended the identity into the packaging system — boxes, bags and wing tubs built to stay practical for takeout while reading as one brand across every touchpoint. The interior and facade followed the same logic, with signage, lighting and colour coordinated so the storefront would be recognisable from a distance: first at Phoenix Center Harburg, later at Europa Passage Hamburg.',
          'The animated LED menu screens were a deliberate choice, not a decorative one. In a mall, foot traffic never stops moving and static graphics get looked past. Motion holds attention in a way flat signage cannot, and it let the boards carry more content in the same amount of screen space.',
          'Beyond the physical brand I built and ran the social presence from scratch — strategy, content, and every asset that went out. Gen Z and Gen Alpha are the core audience for a fast-casual concept like this, and they find new places through what looks good online. Social was not an add-on to the brand; it was one of the most direct routes to the people the business needed to reach.',
        ],
        figures: [
          {
            slot: 'packaging',
            alt: "Josef's Buffalo Wings final packaging design",
          },
          {
            slot: 'storefront',
            alt: "Josef's Buffalo Wings storefront at Phoenix Center and Europa Passage, Hamburg",
            wide: true,
          },
          {
            slot: 'menu-screens',
            alt: "Animated LED menu screens inside Josef's Buffalo Wings",
            caption: 'Motion on the boards, because static signage loses to a moving crowd.',
          },
          {
            slot: 'interior',
            alt: "Interior view of Josef's Buffalo Wings restaurant counter and menu displays",
            wide: true,
          },
          {
            slot: 'social-grid',
            alt: "Josef's Buffalo Wings Instagram profile and content grid",
          },
          {
            slot: 'social-content',
            alt: "Sample social media content created for Josef's Buffalo Wings",
          },
        ],
      },
      result: {
        copy: '@josefs_hamburg grew from zero to roughly five thousand followers over two years and seven months, built entirely on original content and brand assets created from the ground up. In the same period the business went from one location to two, opening at Europa Passage Hamburg alongside the original at Phoenix Center Harburg — funded by the success of the first location rather than outside investment.',
        more: [
          'Throughout that growth I remained the sole creative across the brand: identity, packaging, interior, motion and social. No team, no outsourcing, continuously from September 2023 until the engagement closed in March 2026.',
          'These figures describe the growth of the brand over the period I led its creative direction. They speak to the consistency and reach of the work rather than a claim of direct causation on revenue.',
        ],
      },
    },
    deliverables: [
      'Brand identity, mascot and emblem logo system',
      'Colour and type system anchored on halal positioning',
      'Packaging: boxes, bags and wing tubs',
      'Interior and facade design, two locations',
      'Animated LED menu screens',
      'Advertising assets, motion and animation',
      'Social media strategy, content and every asset',
    ],
  },
  {
    slug: 'culturelancer',
    client: 'CultureLancer',
    projectType: 'UI/UX & Product Design System',
    pillars: ['uiux'],
    year: '2024',
    cover: coverFor('culturelancer') ?? cover02,
    coverAlt: 'CultureLancer job-matching platform interface',
    resultStat: 'Live and operating — a two-sided platform built from a design system, not screen by screen',
    plannedClient: 'CultureLancer',
    isPlaceholder: false,
    body: {
      problem: {
        copy: 'CultureLancer set out to solve a real problem: Black professionals were consistently facing barriers to job access, and existing platforms were not built with that audience or that problem in mind. The concept was a freelancer and hiring platform connecting Black job seekers with employers through a fairer, more direct matching system.',
        more: [
          'By the time the project reached me, CultureLancer already had a brand identity — a logo, typography, a colour palette. What it did not have was a product. No defined target audience for the interface itself, no UX direction, and no design system to build from: no rules for icons, textures or shapes, and nothing describing how components should behave and repeat across a real, functioning site.',
        ],
        figures: [
          {
            slot: 'brand-starting-point',
            alt: "CultureLancer's existing brand guideline before UI/UX design began",
            caption: 'What existed at the start: a brand, and no product to put it on.',
          },
        ],
      },
      systemBuilt: {
        copy: 'Two product realities shaped the direction from day one. This was never a single-sided app — it needed two distinct experiences, one for job seekers and one for employers, each with its own dashboard, its own data, and its own relationship to the other side. And the brand had to read as bold and forward-looking rather than soft or generic, to stand out in a crowded hiring-platform space.',
        more: [
          'That produced two core visual decisions. Icon architecture was built on sharp, angular edges rather than rounded ones, to project a confident, new-tech feel instead of a safe, approachable one. And rather than illustrations or a mascot, the platform leans entirely on real human photography — signup screens, empty states, hero sections — because a platform built on trust between real people benefits more from real faces than from stylised art. AI image generation was not mature enough at the time to be a credible substitute, so every photograph used is genuine.',
          'The site was then built around a component system rather than screen by screen. Navigation bars, cards, buttons, form fields and typography styles were each defined once and reused with variants and states across every page, on a consistent type scale. New pages could be assembled instead of redesigned, and it is what keeps over a dozen distinct page types reading as one coherent product rather than a patchwork of screens.',
        ],
        figures: [
          {
            slot: 'icon-shape-language',
            alt: "CultureLancer's sharp-edged icon system",
          },
          {
            slot: 'photography-usage',
            alt: 'Real photography used across CultureLancer to build trust',
          },
          {
            slot: 'component-library',
            alt: 'CultureLancer component library and design system overview',
            caption: 'Defined once, reused everywhere — the reason a dozen page types read as one product.',
            wide: true,
          },
          {
            slot: 'navbar-states',
            alt: 'CultureLancer navigation bar states across user roles',
          },
        ],
      },
      deliverable: {
        copy: 'The entry point had to work for two audiences without feeling like two products. Job seekers and employers each get their own path from the very first screen, with the choice presented clearly upfront rather than buried in a settings toggle later.',
        more: [
          'For job seekers the platform front-loads profile information deliberately: personal details, experience, education, portfolio projects, awards and certifications, specialisations and social links, all collected in a structured multi-step flow. That is not friction for its own sake — richer profile data upfront is what makes the matching sharper later. Once the profile exists, the seeker gets a dashboard with a skills assessment, a match-based job feed, and messaging with the employers who responded to their application, rather than the other way round.',
          'The employer dashboard is built around candidate discovery rather than job browsing: best-matched candidates, applied candidates per job, and analytics on job performance and applications over time. Posting a job includes an AI-assisted description tool, so an employer with a rough idea still ends up with a complete, well-matched listing. Candidates apply to specific postings rather than messaging cold, which keeps the employer inbox to people who actually fit.',
          'Three shared systems tie the two sides together: direct messaging between matched employers and candidates, a courses and certifications section that lets job seekers build verifiable skills on-platform, and a tiered membership structure for employers who need more postings or advanced search.',
        ],
        figures: [
          {
            slot: 'signup-flow',
            alt: 'CultureLancer signup flow for job seekers and employers',
            caption: 'The fork comes first, on screen one — not as a setting found later.',
          },
          {
            slot: 'profile-builder',
            alt: 'CultureLancer job seeker profile builder flow',
          },
          {
            slot: 'jobseeker-dashboard',
            alt: 'CultureLancer job seeker dashboard',
            wide: true,
          },
          {
            slot: 'job-listing-detail',
            alt: 'CultureLancer job listing detail page',
          },
          {
            slot: 'employer-dashboard',
            alt: 'CultureLancer employer dashboard',
            wide: true,
          },
          {
            slot: 'post-job-flow',
            alt: 'CultureLancer job posting flow with AI assistance',
          },
          {
            slot: 'candidate-profile',
            alt: 'CultureLancer candidate profile view for employers',
          },
          {
            slot: 'messaging',
            alt: 'CultureLancer messaging interface',
          },
          {
            slot: 'courses',
            alt: 'CultureLancer courses and certifications section',
          },
          {
            slot: 'membership-plans',
            alt: 'CultureLancer employer membership plans',
          },
        ],
      },
      result: {
        copy: 'The project delivered more than a UI layer. It delivered the product\u2019s actual interaction logic, translated into a design system the client could understand and build from with confidence. CultureLancer is live and operating today.',
      },
    },
    deliverables: [
      'Design system architecture and component library',
      'Two-sided onboarding and signup flows',
      'Job seeker profile builder and dashboard',
      'Employer dashboard, posting flow and candidate views',
      'Messaging, courses and membership systems',
      'Icon system and photography direction',
    ],
  },
  {
    slug: 'waca',
    client: 'WACA — WA Cricket',
    projectType: 'Interactive Tournament Guide & Design System',
    pillars: ['brand', 'uiux'],
    year: '2024',
    cover: coverFor('waca') ?? cover01,
    coverAlt: 'WACA ANZPCC 2024 tournament guide cover',
    resultStat: 'A 64-page interactive guide in three to four days, then a matching A5 print edition in another 48 hours',
    plannedClient: 'WACA',
    isPlaceholder: false,
    body: {
      problem: {
        copy: 'The project began small. A police-affiliated cricket body connected to WACA needed a member catalogue for their police cricket club — a quick, low-stakes job.',
        more: [
          'They liked it, and that changed the scope entirely. What came back was a request for something far bigger: a large interactive guide for the Australia & New Zealand Police Cricket Championships in Perth, scoped at roughly 150 pages, covering match schedules, venue profiles, official merchandise, team rosters and championship rules. WACA had a brand to start from — a yellow and black colour system built around a custom typeface — but no precedent for a document this size that still had to feel fast in someone\u2019s hand on the sidelines of a match.',
          'The real constraint was time. The client needed it complete within three to four days. I brought in Sheraz Nawaz to execute under my direction and led the build as art director rather than as the sole hand on every page. The interactive version landed inside that window. Roughly 48 hours later came a second request: an A5 printable version of the same design, in another 48 hours.',
        ],
      },
      systemBuilt: {
        copy: 'A document this size cannot be designed page by page, not on this timeline. Every section — match schedules, team rosters, merchandise — had to share the same visual grammar, or the guide would read as dozens of pages stitched together rather than one product.',
        more: [
          'So the work went into a repeatable system first: a consistent header treatment, a colour and type language pulled directly from WACA\u2019s brand guideline, and a page architecture that could absorb any number of teams, venues or match days without being reinvented each time. That system is the only reason a second, A5 edition of the whole thing was possible inside 48 hours.',
          'A guide this size is also easy to get lost in, especially when someone needs one fact quickly in the middle of a live tournament. It is built around a central navigation hub: a full interactive index linking straight to 13 major sections, each reachable in a single tap rather than a long scroll.',
        ],
        figures: [
          {
            slot: 'hero',
            alt: 'WACA ANZPCC 2024 tournament guide cover',
            wide: true,
          },
          {
            slot: 'index',
            alt: 'The tournament guide\u2019s interactive index, linking to all 13 sections',
            caption: 'One tap to any of 13 sections — the alternative was scrolling a 64-page document mid-match.',
            wide: true,
          },
        ],
      },
      deliverable: {
        copy: 'Every good guide earns trust before it turns functional. The opening pages carry a welcome letter from the WA Cricket CEO, giving the document a sense of occasion before the reader reaches schedules and logistics.',
        more: [
          'Match schedules are the pages people return to most, usually in a hurry. They are laid out to read instantly: clear match-ups, ground assignments and start times at high contrast, so nothing is missed at a glance.',
          'Beyond logistics the guide carries real editorial weight. Venue pages tell the story of each participating club, some with a century behind them, paired with photography of the grounds. Team pages introduce every squad with player photography and short personal bios, giving the tournament a human face beyond the fixtures.',
          'It doubles as a retail touchpoint: official merchandise is presented in the same visual system as everything else, product photography against bold typography and pricing, so buying reads as part of the guide rather than a catalogue bolted to the back. The final third holds the full championship rules — a dense reference section that still had to stay legible and on-brand across dozens of pages of regulation text.',
        ],
        figures: [
          {
            slot: 'welcome',
            alt: 'Welcome letter page from the WA Cricket CEO',
          },
          {
            slot: 'schedule',
            alt: 'ANZPCC match schedule page',
            caption: 'The page people open under pressure, built to be read at a glance.',
            wide: true,
          },
          {
            slot: 'venue',
            alt: 'Venue profile page for a participating cricket club',
          },
          {
            slot: 'team',
            alt: 'Team and player profile page with photography and bios',
          },
          {
            slot: 'merch',
            alt: 'Official ANZPCC tournament merchandise page',
          },
          {
            slot: 'rules',
            alt: 'ANZPCC championship rules reference page',
          },
        ],
      },
      result: {
        copy: 'What started as a small member catalogue became a full digital ecosystem: a 64-page interactive guide with instant section navigation, followed by a matching A5 print edition delivered within 48 hours of the second request. Together the two came to roughly 100-plus pages of consistent, on-brand material.',
        more: [
          'Built and delivered across roughly two weeks in the lead-up to the tournament, working as art director alongside a collaborator, on a timeline that left no room for a second draft.',
        ],
      },
    },
    deliverables: [
      'Interactive 64-page tournament guide',
      'Matching A5 printable edition',
      'Design system and page architecture',
      'Interactive index across 13 sections',
      'Venue and team profile layouts',
      'Merchandise and commercial pages',
      'Championship rules reference section',
    ],
  },
  {
    slug: 'case-02',
    client: 'Client Name',
    projectType: 'UI/UX & Product Design',
    pillars: ['uiux', 'brand'],
    year: '2026',
    cover: cover02,
    coverAlt: 'Placeholder cover for a UI/UX case study',
    resultStat: 'result coming soon',
    plannedClient: 'Uplift K12',
    isPlaceholder: true,
    body: PLACEHOLDER_BODY,
    deliverables: [
      'Product design system in Figma',
      'Core application screens',
      'Component library and usage rules',
      'Developer handoff specs',
    ],
  },
  {
    slug: 'case-03',
    client: 'Client Name',
    projectType: 'Full System — Brand, Product & Motion',
    pillars: ['brand', 'uiux', 'motion'],
    year: '2026',
    cover: cover03,
    coverAlt: 'Placeholder cover for a full system case study',
    resultStat: 'result coming soon',
    plannedClient: 'GoTeach.ai',
    isPlaceholder: true,
    body: PLACEHOLDER_BODY,
    deliverables: [
      'Brand identity system',
      'Product UI and design system',
      'Motion identity and launch film',
      'Campaign asset templates',
    ],
  },
  {
    slug: 'case-04',
    client: 'Client Name',
    projectType: 'Motion Branding',
    pillars: ['motion'],
    year: '2026',
    cover: cover04,
    coverAlt: 'Placeholder cover for a motion branding case study',
    resultStat: 'result coming soon',
    plannedClient: 'Santamaria Law Firm',
    isPlaceholder: true,
    body: PLACEHOLDER_BODY,
    deliverables: [
      'Animated logo and identity system',
      'Social motion templates',
      'Campaign film',
      'Editable project files',
    ],
  },
]

export const caseStudySections = [
  { key: 'problem', label: 'Business problem', eyebrow: 'CASE :: 01' },
  { key: 'systemBuilt', label: 'The system built', eyebrow: 'CASE :: 02' },
  { key: 'deliverable', label: 'The deliverable', eyebrow: 'CASE :: 03' },
  { key: 'result', label: 'Result / value', eyebrow: 'CASE :: 04' },
] as const
