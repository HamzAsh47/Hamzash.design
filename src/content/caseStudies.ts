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
  /**
   * Three to five proof points, read before the body. A case study is a long
   * argument and most readers scan the first screen before deciding to read
   * it — this is what they should leave with if they read nothing else.
   */
  atAGlance?: string[]
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
  more?: CaseParagraph[]
  figures?: CaseFigureRow[]
  /**
   * A real, attributed client quote. Never a paraphrase dressed as one: an
   * invented sentence in quotation marks is the one thing on a portfolio the
   * client can read and deny. Where the words are not on record, the
   * narrative says what happened in its own voice instead.
   */
  quote?: { text: string; author: string; role: string }
}

/**
 * A paragraph, or a paragraph under its own subheading.
 *
 * A deliverable section that covers six separate systems — games, class
 * management, a whiteboard, quizzes, curriculum, a physical box — is six
 * arguments, not one. Run together they read as a list of everything that
 * happened; broken under headings, each one is findable, and a figure can be
 * anchored to the part of the work it actually shows.
 */
export type CaseParagraph = string | { heading: string; copy: string }

export type CaseFigureSlot = {
  /** Matches the file name in `src/assets/case-studies/<slug>/`. */
  slot: string
  alt: string
  caption?: string
}

/**
 * One band of imagery, anchored to the paragraph it belongs under.
 *
 * `after` is the whole point of this type. Figures used to be listed per
 * section and rendered in a block at the end of it, which is why a packaging
 * photograph could land four paragraphs below the sentence about packaging,
 * under copy about social media. An image that is not beside its argument is
 * decoration. Naming the paragraph makes the pairing explicit and makes a
 * wrong one visible in the source.
 *
 * `slots` is a list because two or three things that are being discussed
 * together belong on one line — the two storefronts, the three marks in the
 * logo system. They are laid out to a common height, so the row reads as one
 * comparison rather than three separate exhibits.
 */
export type CaseFigureRow = {
  /**
   * Index into the section's paragraphs: 0 is `copy`, 1 is `more[0]`, and so
   * on. Past the end is clamped to the last paragraph.
   */
  after: number
  slots: CaseFigureSlot[]
  /** One caption for the row — the row is one idea, so it gets one line. */
  caption?: string
  /**
   * Raises the height ceiling for artwork that is genuinely tall — a full
   * sitemap, a stacked wireframe sheet — where the default cap would shrink it
   * past the point of being readable.
   */
  tall?: boolean
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
    /* Not UI/UX. The menu-board flow and the in-store journey are real user-
       experience work, but the tag reads as digital product design and this
       was a brand, a building and a feed. Claiming it invited a question the
       work could not answer. */
    pillars: ['brand', 'motion'],
    year: 'Sep 2023—Mar 2026',
    /* The supplied hero, the moment it is dropped in; the placeholder plate
       until then, so a real case study never sits behind a broken image. */
    cover: coverFor('josefs') ?? cover01,
    coverAlt: "Josef's Buffalo Wings brand hero image",
    resultStat: '0 to ~4,800 followers and one location to two, over two years and six months',
    plannedClient: "Josef's Buffalo Wings",
    isPlaceholder: false,
    atAGlance: [
      '0 → ~4,800 Instagram followers over 2 years 6 months, built entirely on original content',
      '1 → 2 physical locations — the second funded by the success of the first, not outside investment',
      'Sole creative across identity, packaging, interior, motion and social — no team, no outsourcing, start to finish',
      "Word of mouth became its own channel: people repeatedly asked Josef's staff who was behind their branding, and that visibility brought in new clients directly",
    ],
    externalUrl:
      'https://www.behance.net/gallery/204631775/Josefs-360-Visual-Identity-Social-Motion',
    externalLabel: 'Full gallery on Behance',
    body: {
      problem: {
        copy: "When Josef's came to me there was nothing to build from. No logo, no colour system, no visual language. What they had was a product worth believing in — bold, flavourful buffalo wings — and a plan to open a stall inside Phoenix Center, a busy shopping mall in Hamburg.",
        more: [
          'Two things made the brief harder than it looked on paper. The wings category already had a dominant reference point in Buffalo Wild Wings, one of the biggest wing chains in the US, so this needed an identity that read as its own brand rather than a regional copy. At the same time the business had to be unmistakably halal-friendly from day one, and that promise had to live in the visuals themselves, not in a line of text on the menu.',
          'It was also never scoped down to a logo and a style guide. I came on as the sole creative behind everything the brand would ever put in front of a customer, from the mark on the packaging to the walls of the restaurant.',
        ],
        figures: [
          {
            after: 0,
            caption: 'The starting point: references and product shots, no brand assets yet.',
            slots: [
              {
                slot: 'moodboard',
                alt: "Early moodboard and inspiration references for Josef's brand development",
              },
            ],
          },
        ],
      },
      systemBuilt: {
        copy: "Rather than borrowing from Buffalo Wild Wings' visual language, I used it only as a category benchmark — a way to understand what a wings brand has to communicate — so Josef's could build something recognisably its own.",
        more: [
          'The halal positioning became the anchor for the entire colour system. Green was chosen deliberately, because it carries an immediate association with halal trust for this audience. The point was to make the promise visible at a glance rather than something a customer had to read to understand.',
          'One early call shaped everything downstream: this had to feel warm and family-friendly, not loud or sports-bar coded. That single decision guided the mascot, the typography and the shape language across the whole system.',
          'The mascot went through several rounds before it landed. Two decisions defined it. I used the buffalo’s face rather than its full body, which kept the mark distinctive in the category and clean at small sizes — packaging, app icons. And I chose rounded forms over angular ones, since sharp edges read as aggressive while rounded ones feel approachable. Wings were worked into the mascot itself to tie it back to the product.',
          'Alongside the primary mark I designed a second, emblem-style logo: a more classical, tray-inspired badge, used where the primary mark felt too casual — packaging seals, select in-store signage — to give the brand a sense of heritage and quality. Those two, together with the full lockup that carries the name, are the three marks the rest of the system is built on.',
        ],
        figures: [
          {
            after: 1,
            caption: 'Green as the anchor: the halal promise, made visible before it is read.',
            slots: [
              {
                slot: 'palette',
                alt: "Josef's brand colour palette, built on a halal-associated green system",
              },
            ],
          },
          {
            after: 3,
            caption: 'Rounds of exploration, left to right: full body to face, angular to rounded.',
            slots: [
              {
                slot: 'mascot-sketches',
                alt: "Early sketches of the Josef's buffalo mascot development",
              },
            ],
          },
          /* Three marks discussed in one paragraph, so they share one line.
             Separately they read as three unrelated green tiles; together at a
             common height they read as what they are — one system, three
             registers. */
          {
            after: 4,
            caption:
              'One system, three registers: the mascot for small sizes, the badge where the brand needs heritage, the lockup where the name has to carry.',
            slots: [
              {
                slot: 'mascot-final',
                alt: "Final Josef's buffalo mascot logo mark",
              },
              {
                slot: 'emblem-logo',
                alt: "Josef's emblem-style badge logo",
              },
              {
                slot: 'logo-lockup',
                alt: "Josef's primary logo lockup on brand green background",
              },
            ],
          },
        ],
      },
      deliverable: {
        copy: 'Designing for a screen is one thing. Designing a storefront that has to hold attention inside a moving mall crowd is another.',
        more: [
          'I extended the identity into the packaging system — boxes, bags and wing tubs — built to stay practical for takeout while reading as one brand across every touchpoint. Packaging is the part of a restaurant that leaves the building, so it had to hold up as a brand surface long after the meal was finished.',
          'The interior and facade followed the same logic, with signage, lighting and colour coordinated so the storefront would be recognisable from a distance: first at Phoenix Center Harburg, later at Europa Passage Hamburg. The second build was not a second design. The system already existed, so opening a location became a matter of applying it.',
          'The animated LED menu screens were a deliberate choice, not a decorative one. In a mall, foot traffic never stops moving and static graphics get looked past. Motion holds attention in a way flat signage cannot, and it let the boards carry more content in the same amount of screen space.',
          'Beyond the physical brand I built and ran the social presence from scratch — strategy, content, and every asset that went out. Gen Z and Gen Alpha are the core audience for a fast-casual concept like this, and they find new places through what looks good online. Social was not an add-on to the brand; it was one of the most direct routes to the people the business needed to reach.',
          'The content itself was made for the feed rather than cut down from something else. Vertical first, shot and edited around the platform it was going to live on, and built from the same mascot, colour and type system as the packaging and the walls — so a reel and a wing box read as the same brand.',
        ],
        figures: [
          {
            after: 1,
            slots: [
              {
                slot: 'packaging',
                alt: "Josef's Buffalo Wings final packaging design",
              },
            ],
          },
          /* Two files in this slot, so the pair lands on one line — which is
             the comparison the paragraph is making. */
          {
            after: 2,
            caption: 'Two locations, one system: Phoenix Center Harburg and Europa Passage.',
            slots: [
              {
                slot: 'storefront',
                alt: "Josef's Buffalo Wings storefront in Hamburg",
              },
            ],
          },
          {
            after: 3,
            caption: 'Motion on the boards, because static signage loses to a moving crowd.',
            slots: [
              {
                slot: 'menu-screens',
                alt: "Animated LED menu screens inside Josef's Buffalo Wings",
              },
            ],
          },
          {
            after: 4,
            caption: 'The profile as a designed surface: grid, highlights and bio, not an afterthought.',
            slots: [
              {
                slot: 'social-grid',
                alt: "Josef's Buffalo Wings Instagram profile and content grid",
              },
            ],
          },
          {
            after: 5,
            caption: 'Content built for the feed, not cut down from something else.',
            slots: [
              {
                slot: 'social-content',
                alt: "Sample social media content created for Josef's Buffalo Wings",
              },
            ],
          },
        ],
      },
      result: {
        copy: '@josefs_hamburg grew from zero to roughly five thousand followers over two years and six months, built entirely on original content and brand assets created from the ground up. In the same period the business went from one location to two, opening at Europa Passage Hamburg alongside the original at Phoenix Center Harburg — funded by the success of the first location rather than outside investment.',
        more: [
          'Throughout that growth I remained the sole creative across the brand: identity, packaging, interior, motion and social. No team, no outsourcing, continuously from September 2023 until the engagement closed in March 2026.',
          "These figures describe the growth of the brand over the period I led its creative direction. They speak to the consistency and reach of the work rather than a claim of direct causation on revenue — the client's order-volume and footfall figures are confidential.",
          /* Paraphrase, deliberately. The words are real and the quotation
             marks would not be: no exact wording was ever recorded, and an
             invented sentence attributed to a client is the one claim on a
             portfolio that can be flatly denied. If the wording is ever
             obtained, this becomes a quote — a quote always beats a summary
             of one. */
          "Word of mouth turned into its own kind of proof: people repeatedly stopped by to ask staff who was designing Josef's branding, and that recognition led directly to new referral clients. Because the client is based in Germany and doesn't run a LinkedIn presence, there isn't a written testimonial to link here — but the growth numbers, the two live locations, and the repeat referral business speak for the work.",
        ],
        figures: [
          {
            after: 0,
            caption: 'The finished system, in the places a customer actually meets it.',
            slots: [
              {
                slot: 'hero',
                alt: "Josef's Buffalo Wings brand identity across street, product and menu boards",
              },
            ],
          },
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
            after: 1,
            caption: 'What existed at the start: a brand, and no product to put it on.',
            slots: [
              {
                slot: 'brand-starting-point',
                alt: "CultureLancer's existing brand guideline before UI/UX design began",
              },
            ],
          },
        ],
      },
      systemBuilt: {
        copy: 'Two product realities shaped the direction from day one. This was never a single-sided app — it needed two distinct experiences, one for job seekers and one for employers, each with its own dashboard, its own data, and its own relationship to the other side. And the brand had to read as bold and forward-looking rather than soft or generic, to stand out in a crowded hiring-platform space.',
        more: [
          'That produced two core visual decisions. Icon architecture was built on sharp, angular edges rather than rounded ones, to project a confident, new-tech feel instead of a safe, approachable one. And rather than illustrations or a mascot, the platform leans entirely on real human photography — signup screens, empty states, hero sections — because a platform built on trust between real people benefits more from real faces than from stylised art. AI image generation was not mature enough at the time to be a credible substitute, so every photograph used is genuine.',
          'None of it was designed straight into high fidelity. The project started in FigJam, where I mapped the full structure before a single real screen existed: a layout-instructions mindmap splitting the platform into its branches — Job Seekers, Employers, and the shared systems for support, mobile and onboarding — with every page each branch would need laid out underneath it.',
          'That mindmap became a sitemap: a flowchart running from the home page down through every page either side could reach, with role and location tagged on each node.',
          'Two annotated flow boards followed, one per journey, carrying UX recommendations directly on the diagram — guided profile setup and career-path suggestions for seekers, role templates and candidate comparison for employers.',
          'A timeline ran alongside the whole thing in two-to-three day sprints, from setup through wireframes, client reviews, prototypes and final adjustments.',
          'Before anything went to high fidelity I built low-fidelity wireframes for both sides myself, as a structuring tool: a way to lock layout and page logic and get sign-off before investing in visual design. That kept revisions cheap, and meant every high-fidelity screen that followed was already validated in structure.',
          'The site was then built around a component system rather than screen by screen. Navigation bars, cards, buttons, form fields and typography styles were each defined once and reused with variants and states across every page, on a consistent type scale. New pages could be assembled instead of redesigned, and it is what keeps over a dozen distinct page types reading as one coherent product rather than a patchwork of screens.',
        ],
        figures: [
          /* Two decisions named in one paragraph, so they are shown as one
             comparison rather than two separate exhibits. */
          {
            after: 1,
            caption: 'Sharp over rounded, real faces over illustration — the two calls the rest of the UI inherits.',
            slots: [
              {
                slot: 'icon-shape-language',
                alt: "CultureLancer's sharp-edged icon system",
              },
              {
                slot: 'photography-usage',
                alt: 'Real photography used across CultureLancer to build trust',
              },
            ],
          },
          {
            after: 2,
            caption: 'Structure first: every branch of the platform, and every page under it.',
            slots: [
              {
                slot: 'figjam-mindmap',
                alt: 'CultureLancer FigJam layout instructions mindmap',
              },
            ],
          },
          {
            after: 3,
            tall: true,
            slots: [
              {
                slot: 'sitemap-tree',
                alt: 'CultureLancer full sitemap and page hierarchy',
              },
            ],
          },
          {
            after: 4,
            caption: 'One board per journey, with the UX recommendation written on the diagram rather than in a separate document.',
            slots: [
              {
                slot: 'jobseeker-flow-annotated',
                alt: 'CultureLancer job seeker user flow with UX annotations',
              },
            ],
          },
          {
            after: 4,
            slots: [
              {
                slot: 'employer-flow-annotated',
                alt: 'CultureLancer employer user flow with UX annotations',
              },
            ],
          },
          {
            after: 5,
            slots: [
              {
                slot: 'project-timeline',
                alt: 'CultureLancer project timeline in FigJam',
              },
            ],
          },
          {
            after: 6,
            caption: 'Structure signed off in grey before a single colour decision was made.',
            slots: [
              {
                slot: 'lowfi-jobseeker',
                alt: 'CultureLancer job seeker low-fidelity wireframes',
              },
              {
                slot: 'lowfi-employer',
                alt: 'CultureLancer employer low-fidelity wireframes',
              },
            ],
          },
          {
            after: 7,
            caption: 'Defined once, reused everywhere — the reason a dozen page types read as one product.',
            slots: [
              {
                slot: 'component-library',
                alt: 'CultureLancer component library and design system overview',
              },
            ],
          },
          {
            after: 7,
            caption: 'One component, every state and every role it has to cover.',
            slots: [
              {
                slot: 'navbar-states',
                alt: 'CultureLancer navigation bar states across user roles',
              },
            ],
          },
        ],
      },
      deliverable: {
        copy: 'The entry point had to work for two audiences without feeling like two products. Job seekers and employers each get their own path from the very first screen, with the choice presented clearly upfront rather than buried in a settings toggle later.',
        more: [
          'For job seekers the platform front-loads profile information deliberately: personal details, experience, education, portfolio projects, awards and certifications, specialisations and social links, all collected in a structured multi-step flow. That is not friction for its own sake — richer profile data upfront is what makes the matching sharper later.',
          'Once the profile exists, the seeker gets a dashboard with a skills assessment, a match-based job feed, and messaging with the employers who responded to their application, rather than the other way round. A listing opens into the full role detail from the same feed, so applying never means leaving the page they were scanning.',
          'The employer dashboard is built around candidate discovery rather than job browsing: best-matched candidates, applied candidates per job, and analytics on job performance and applications over time.',
          'Posting a job includes an AI-assisted description tool, so an employer with a rough idea still ends up with a complete, well-matched listing. Candidates apply to specific postings rather than messaging cold, which keeps the employer inbox to people who actually fit.',
          'Three shared systems tie the two sides together: direct messaging between matched employers and candidates, a courses and certifications section that lets job seekers build verifiable skills on-platform, and a tiered membership structure for employers who need more postings or advanced search.',
        ],
        figures: [
          {
            after: 0,
            caption: 'The fork comes first, on screen one — not as a setting found later.',
            slots: [
              {
                slot: 'signup-flow',
                alt: 'CultureLancer signup flow for job seekers and employers',
              },
            ],
          },
          {
            after: 1,
            slots: [
              {
                slot: 'profile-builder',
                alt: 'CultureLancer job seeker profile builder flow',
              },
            ],
          },
          {
            after: 2,
            caption: 'The feed and the role it opens into, on the same surface.',
            slots: [
              {
                slot: 'jobseeker-dashboard',
                alt: 'CultureLancer job seeker dashboard',
              },
              {
                slot: 'job-listing-detail',
                alt: 'CultureLancer job listing detail page',
              },
            ],
          },
          {
            after: 3,
            slots: [
              {
                slot: 'employer-dashboard',
                alt: 'CultureLancer employer dashboard',
              },
            ],
          },
          {
            after: 4,
            caption: 'Posting a role, and the candidate view it produces.',
            slots: [
              {
                slot: 'post-job-flow',
                alt: 'CultureLancer job posting flow with AI assistance',
              },
              {
                slot: 'candidate-profile',
                alt: 'CultureLancer candidate profile view for employers',
              },
            ],
          },
          /* Three systems named in one sentence, so they are shown on one
             line. Stacked, they would read as three unrelated features. */
          {
            after: 5,
            caption: 'The three systems both sides share: messaging, courses, and employer membership tiers.',
            slots: [
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
        ],
      },
      result: {
        copy: 'The project delivered more than a UI layer. It delivered the product’s actual interaction logic — planned in FigJam, validated through low-fidelity wireframes, and translated into a design system the client could understand and build from with confidence. CultureLancer is live and operating today.',
      },
    },
    deliverables: [
      'Sitemap, user flows and annotated UX recommendations',
      'Low-fidelity wireframes, both sides, for client sign-off',
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
    resultStat: 'A 64-page interactive guide built in about a week, then a matching A5 print edition in a further three to four days',
    plannedClient: 'WACA',
    isPlaceholder: false,
    body: {
      problem: {
        copy: 'The project began small. A police-affiliated cricket body connected to WACA needed a member catalogue for their police cricket club — a quick, low-stakes job.',
        more: [
          'They liked it, and that changed the scope entirely. What came back was a request for something far bigger: a large interactive guide for the Australia & New Zealand Police Cricket Championships in Perth, scoped at roughly 150 pages, covering match schedules, venue profiles, official merchandise, team rosters and championship rules. WACA had a brand to start from — a yellow and black colour system built around a custom typeface — but no precedent for a document this size that still had to feel fast in someone’s hand on the sidelines of a match.',
        ],
        figures: [
          {
            after: 1,
            caption: 'The ask: a tournament guide that had to carry a championship and still open fast on a phone.',
            slots: [
              {
                slot: 'hero',
                alt: 'WACA ANZPCC 2024 tournament guide cover',
              },
            ],
          },
        ],
      },
      systemBuilt: {
        /* The constraint opens this section rather than the last one. It is
           not background to the problem — it is the reason the answer had to
           be a system instead of a stack of pages. */
        copy: 'The real constraint was time. The client gave us about a week to deliver the interactive guide complete. I brought in Sheraz Nawaz to execute under my direction and led the build as art director rather than as the sole hand on every page. The interactive version landed inside that window. Roughly 48 hours later came a second request: an A5 printable version of the same design, needed within a further three to four days.',
        more: [
          'A document this size cannot be designed page by page, not on this timeline. Every section — match schedules, team rosters, merchandise — had to share the same visual grammar, or the guide would read as dozens of pages stitched together rather than one product.',
          'So the work went into a repeatable system first: a consistent header treatment, a colour and type language pulled directly from WACA’s brand guideline, and a page architecture that could absorb any number of teams, venues or match days without being reinvented each time. That system is the only reason a second, A5 edition of the whole thing was possible within days rather than weeks.',
          'A guide this size is also easy to get lost in, especially when someone needs one fact quickly in the middle of a live tournament. It is built around a central navigation hub: a full interactive index linking straight to 13 major sections, each reachable in a single tap rather than a long scroll.',
        ],
        figures: [
          {
            after: 3,
            caption: 'One tap to any of 13 sections — the alternative was scrolling a 64-page document mid-match.',
            /* 1.15 and dense with type. The extra height is what makes it
               readable; width would only add empty page either side. */
            tall: true,
            slots: [
              {
                slot: 'index',
                alt: 'The tournament guide’s interactive index, linking to all 13 sections',
              },
            ],
          },
        ],
      },
      deliverable: {
        copy: 'Every good guide earns trust before it turns functional. The opening pages carry a welcome letter from the WA Cricket CEO, giving the document a sense of occasion before the reader reaches schedules and logistics.',
        more: [
          'Match schedules are the pages people return to most, usually in a hurry. They are laid out to read instantly: clear match-ups, ground assignments and start times at high contrast, so nothing is missed at a glance.',
          'Venue pages tell the story of each participating club, some with a century behind them, paired with photography of the grounds.',
          'Team pages introduce every squad with player photography and short personal bios, giving the tournament a human face beyond the fixtures.',
          'It doubles as a retail touchpoint: official merchandise is presented in the same visual system as everything else, product photography against bold typography and pricing, so buying reads as part of the guide rather than a catalogue bolted to the back.',
          'The final third holds the full championship rules — a dense reference section that still had to stay legible and on-brand across dozens of pages of regulation text.',
        ],
        figures: [
          /* Every spread here is 2.15 or wider. Two of them side by side would
             be two 240px strips of unreadable body text, so each takes its own
             line and the copy is split so each has a paragraph to sit under. */
          {
            after: 0,
            slots: [
              {
                slot: 'welcome',
                alt: 'Welcome letter page from the WA Cricket CEO',
              },
            ],
          },
          {
            after: 1,
            caption: 'The page people open under pressure, built to be read at a glance.',
            slots: [
              {
                slot: 'schedule',
                alt: 'ANZPCC match schedule page',
              },
            ],
          },
          {
            after: 2,
            slots: [
              {
                slot: 'venue',
                alt: 'Venue profile page for a participating cricket club',
              },
            ],
          },
          {
            after: 3,
            slots: [
              {
                slot: 'team',
                alt: 'Team and player profile page with photography and bios',
              },
            ],
          },
          {
            after: 4,
            slots: [
              {
                slot: 'merch',
                alt: 'Official ANZPCC tournament merchandise page',
              },
            ],
          },
          {
            after: 5,
            slots: [
              {
                slot: 'rules',
                alt: 'ANZPCC championship rules reference page',
              },
            ],
          },
        ],
      },
      result: {
        copy: 'What started as a small member catalogue became a full digital ecosystem: a 64-page interactive guide with instant section navigation, followed by a matching A5 print edition delivered within a further three to four days of the second request.',
        more: [
          /* The brief said ~150 pages and the result says 64, which reads as
             a shortfall until the arithmetic is shown. It is not one: the
             scope was refined down to a leaner interactive core, and the A5
             conversion reflowed it back up. */
          'The two versions weren’t identical in length. The 64-page interactive build reflowed to roughly 70–80 pages once converted for A5 print — page sizes shifted enough in the conversion that team roster pages needed to be split further, so each team could still be displayed properly on its own page. Together the two editions came to well over 100 pages of consistent, on-brand material, all built from the original ~150-page request refined down to a leaner, single interactive core.',
          'Built and delivered across roughly two weeks in the lead-up to the tournament — about a week for the interactive build, three to four more days for the A5 conversion, and the rest for revisions — working as art director alongside a collaborator, on a timeline that left no room for a second draft.',
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
    slug: 'upliftk12',
    client: 'Uplift K12',
    projectType: 'Game Design, UI/UX & Curriculum Platform System',
    pillars: ['brand', 'uiux', 'motion'],
    year: 'Oct 2023—Oct 2025',
    cover: coverFor('upliftk12') ?? cover02,
    coverAlt: 'Uplift K12 interactive math games and teaching platform',
    resultStat:
      '2 sample games to a 270+ game library, plus sole ownership of the platform’s UI/UX, over two years',
    plannedClient: 'Uplift K12',
    isPlaceholder: false,
    atAGlance: [
      '2 sample games → 50 games brought into brand identity first, with the platform’s game library eventually growing to 270+ interactive math games',
      'Took over full platform UI/UX from a bootcamp-hired team, rebuilding the dashboard, login and shared interactive whiteboard from scratch — including auto-checking, read-aloud and auto-grading',
      'Built and coded the games in Adobe Captivate, with Java (and occasionally C++) handling the interactive logic and CSS carrying the visual layer',
      'Later designed a 20-game physical board game adaptation — box dieline, cover, cards, manipulatives and instruction booklet',
      'Two years total: an 11-month contract role, then an ongoing freelance creative-director partnership until the engagement closed',
    ],
    body: {
      problem: {
        copy: 'In 2023, Mehul Shah — Product Manager at Uplift K12 — hired me through Freelancer.com to bring a set of 2D educational math games in line with the platform’s brand identity. I delivered two sample variations first; once those landed well, the ask expanded to 50 games needing the same brand treatment.',
        more: [
          'The games converted cleanly, but the wider platform had a separate, unresolved problem. Uplift K12 is a funded home-schooling math platform built around an interactive, teacher-led whiteboard tool — voice commands, an in-platform calculator, and games embedded directly into live teaching sessions for K–4 students. A bootcamp-hired design team had already built out the UI, but the brand’s playful colour system was being applied decoratively rather than structurally, and the resulting interface was difficult to navigate for the students and teachers actually using it live.',
        ],
        figures: [
          {
            after: 0,
            caption: 'The first two samples: the brand applied to a game, before the ask grew to fifty.',
            slots: [
              {
                slot: 'sample-games',
                alt: 'The first two Uplift K12 sample game variations',
              },
            ],
          },
          {
            after: 1,
            caption: 'The interface as inherited: brand colour used as decoration rather than as structure.',
            slots: [
              {
                slot: 'legacy-ui',
                alt: 'Uplift K12 platform interface before the redesign',
              },
            ],
          },
        ],
      },
      systemBuilt: {
        copy: 'Mehul asked me to take over UI/UX for the platform entirely. I rebuilt it from scratch, treating the brand’s colour and identity system as architecture rather than decoration — redesigning the dashboard, the login flow, and the full teacher/student experience around how a class actually runs in real time. As the redesign matured, the bootcamp team was phased out, and I owned UI/UX solely from that point forward.',
        more: [
          'The platform needed to support a teacher deciding, in the moment, what a student should do and how — raising hands, running voice commands, opening a shared whiteboard where both sides could write, draw shapes, and drop straight into a game mid-lesson. Every part of that flow had to stay legible for a young student while giving the teacher full control.',
        ],
        figures: [
          {
            after: 0,
            caption: 'Colour as architecture: the same palette, doing structural work instead of decorative work.',
            slots: [
              {
                slot: 'dashboard-redesign',
                alt: 'Redesigned Uplift K12 teacher dashboard',
              },
            ],
          },
          {
            after: 1,
            caption: 'A live class, in one view: what the teacher controls and what the student sees.',
            slots: [
              {
                slot: 'live-session',
                alt: 'Uplift K12 live teaching session with shared whiteboard',
              },
            ],
          },
        ],
      },
      deliverable: {
        copy: 'Six systems came out of the two years, each one its own build rather than a variation on the last.',
        more: [
          {
            heading: 'Game design & development',
            copy: 'The 270+ games were never one repeated template — they spanned racing-style games where players solve equations to advance (Fact Family Race, Division Race), puzzle games (Division Puzzle), matching and connect-style games (Buzz: Connect 3, Math Connect), spinner-and-board games (Monkey Madness), and card-deck games. Each one was built for a specific grade level, from Kindergarten through 8th, and a specific topic — addition, subtraction, multiplication, division, place value, fractions, money, number sense, spatial reasoning, geometry, patterns and algebra — all searchable and filterable inside the platform’s game library. Every game was designed and developed directly in Adobe Captivate, with Java (and occasionally C++) handling the interactive logic — scoring, win conditions, answer checking — while CSS carried the visual layer: transitions and directional effects layered on top of the Captivate builds.',
          },
          {
            heading: 'Platform UI/UX & class management',
            copy: 'Beyond the games themselves, the platform needed a full teacher-facing system to run a class day to day. That meant a dashboard where a teacher could add new classes, view and manage each class section individually, and control access with lock/unlock permissions per lesson. Lessons themselves were organised into playlists — an ordered sequence of activities per lesson (Welcome, Introduction, Warm Up, Teach, Practice, Game), each with its own thumbnail, duration and short description, so a teacher could see the shape of an entire lesson before starting it or jump straight into any one activity mid-session.',
          },
          {
            heading: 'The interactive whiteboard',
            copy: 'At the centre of a live session sat the shared whiteboard, built as its own toolkit rather than a single fixed screen. It carried a full drawing set — line, arrow, rectangle, ellipse, triangle, hexagon, star, speech bubble — plus text tools with style, colour and size controls, and an eraser that could clear a single object or the whole board. Session-level tools sat alongside it: a timer a teacher could set per activity, a celebration system to reward a learner mid-session, share and invite controls so a teacher could add a learner to a whiteboard by email, and an end-session confirmation flow. Layered onto the same canvas were the virtual manipulatives — arrays, hundreds charts, ten-frames, number lines, equal-groups templates, a subtraction standard-algorithm template and a rounding number line — plus the features that had to feel invisible when they worked: auto-checking, read-aloud and auto-grading, so a lesson kept pace with a live class instead of stalling on manual review.',
          },
          {
            heading: 'Quiz & card-game activities',
            copy: 'A separate card-based quiz system let a teacher run live multiple-choice practice: a face-down deck, a “Choose the Correct Answer” prompt with four options, and a player tracker for up to four learners at once, with shuffle, draw, and correct/incorrect feedback states built into the flow. A parallel board-style activity, “Let’s Commute”, turned equation practice into a path game — a token moved along a route toward a destination as each answer was solved, giving repetitive drills a sense of progress a static worksheet couldn’t.',
          },
          {
            heading: 'Curriculum',
            copy: 'Once the games and UI/UX were in a stable state, the work moved to curriculum: a full K1–K4 math syllabus structure, built chapter by chapter, laying out how each grade’s material would be sequenced through the platform.',
          },
          {
            heading: 'Promotional & marketing assets',
            copy: 'From there the focus shifted to growth and selling: promotional videos, graphic assets, and a full pitch deck for the platform, produced alongside content specialist Renee Lakamsani, who handled written content within the brand system I directed.',
          },
          {
            heading: 'Physical board game production',
            copy: 'Later, Mehul wanted to bring the platform’s strongest games into the physical world — a full board-game adaptation of the library’s most effective games, sold as a standalone product. This wasn’t a repackaging job; it was a complete production: 20 two-player games covering addition, subtraction, multiplication and division (Monkey Madness, Block the Array, Dinosaur Dig for Equations, Building Equations: Connect 3, Deep Sea Division Dive, Skunk Game, Square Up!, Division Detective, and others), each with its own game board, cards and manipulative pieces — plus the physical box dieline, cover design, an instruction booklet with a full table of contents and setup directions per game, and a QR-linked insert card tying the physical box back to the online platform.',
          },
          'Smaller graphic and branding tasks continued on an as-needed basis through to the end of the freelance contract.',
        ],
        figures: [
          {
            after: 1,
            caption: 'Not one template repeated: racing, puzzle, connect, spinner and card formats across grades K–8.',
            slots: [
              {
                slot: 'game-library',
                alt: 'Uplift K12 game library across formats and grade levels',
              },
            ],
          },
          {
            after: 2,
            caption: 'A lesson as a playlist: the whole shape of a class before it starts.',
            slots: [
              {
                slot: 'lesson-playlist',
                alt: 'Uplift K12 lesson playlist and class management dashboard',
              },
            ],
          },
          {
            after: 3,
            caption: 'The whiteboard as a toolkit: drawing set, session tools and virtual manipulatives on one canvas.',
            slots: [
              {
                slot: 'whiteboard-tools',
                alt: 'Uplift K12 interactive whiteboard drawing and session tools',
              },
              {
                slot: 'manipulatives',
                alt: 'Uplift K12 virtual manipulatives: arrays, ten-frames and number lines',
              },
            ],
          },
          {
            after: 4,
            slots: [
              {
                slot: 'quiz-cards',
                alt: 'Uplift K12 card-based live quiz activity',
              },
            ],
          },
          {
            after: 5,
            slots: [
              {
                slot: 'curriculum-map',
                alt: 'Uplift K12 K1–K4 math syllabus structure',
              },
            ],
          },
          {
            after: 6,
            slots: [
              {
                slot: 'pitch-deck',
                alt: 'Uplift K12 pitch deck and promotional graphic assets',
              },
            ],
          },
          {
            after: 7,
            caption: 'Twenty games off the screen: board, cards, manipulatives, box dieline and instruction booklet.',
            slots: [
              {
                slot: 'board-game-box',
                alt: 'Uplift K12 physical board game box and cover design',
              },
              {
                slot: 'board-game-components',
                alt: 'Uplift K12 board game boards, cards and manipulative pieces',
              },
            ],
          },
        ],
      },
      result: {
        copy: 'The engagement ran just over two years, across two roles. From October 2023 to August 2024, I worked as Game Designer & Web Graphics Designer on contract, designing mathematics game assets for K–4 students and shaping the platform’s visual identity in close collaboration with the development team. From September 2024 through October 2025, that became an ongoing freelance creative-director partnership — leading multimedia content creation across the platform’s educational products and maintaining visual and brand consistency as the platform’s design needs scaled, until the engagement closed.',
        more: [
          'Over that time the scope grew from a two-sample game request into full ownership of a funded platform’s UI/UX, its game library, its K1–K4 curriculum structure, and a physical product line — with Mehul as the client throughout.',
        ],
        quote: {
          text: 'Hamza has incredible talent with design. I highly recommend his work!',
          author: 'Mehul Shah',
          role: 'Product Manager, Uplift K12',
        },
      },
    },
    deliverables: [
      'Game design and development — 270+ interactive math games, grades K–8, built in Adobe Captivate',
      'Platform UI/UX and class management — dashboard, lesson playlists, lock/unlock permissions',
      'Interactive whiteboard — drawing tools, virtual manipulatives, timer, auto-checking, read-aloud, auto-grading',
      'Quiz and card-game activities — live multiple-choice decks and path-based board activities',
      'K1–K4 math syllabus structure and chapter planning',
      'Promotional videos, graphic assets and pitch deck',
      'Physical board game — 20 two-player games, box dieline, cover, cards, manipulatives and booklet',
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
