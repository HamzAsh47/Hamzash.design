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
   *
   * Split rather than a plain sentence, because a busy reader scans this box
   * the same way they scan the page: `lead` is the claim, two to five words,
   * set to be read on its own; `note` is what qualifies it, for whoever
   * carries on reading. A full sentence per bullet gets skimmed and lands
   * nothing.
   */
  atAGlance?: { lead: string; note: string }[]
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
   * The id of a review in `testimonials.ts`, quoted at the end of this
   * section. A reference rather than the words themselves, so a case study
   * cannot carry a tidied-up version of a testimonial the reviews section
   * publishes verbatim — and so nothing can appear here that is not already
   * in the record as real and attributable.
   */
  quoteFrom?: string
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
    year: 'Sep 2023 – Mar 2026',
    /* The supplied hero, the moment it is dropped in; the placeholder plate
       until then, so a real case study never sits behind a broken image. */
    cover: coverFor('josefs') ?? cover01,
    coverAlt: "Josef's Buffalo Wings brand hero image",
    resultStat: '0 to ~4,800 followers and one location to two, over two years and six months',
    plannedClient: "Josef's Buffalo Wings",
    isPlaceholder: false,
    atAGlance: [
      { lead: '0 → ~4,800 followers', note: 'over 2 years 6 months, built entirely on original content' },
      { lead: 'One location to two', note: 'the second funded by the success of the first, not outside investment' },
      { lead: 'Sole creative throughout', note: 'identity, packaging, interior, motion and social — no team, no outsourcing' },
      {
        lead: 'Word of mouth became a channel',
        note: 'people repeatedly asked staff who was behind the branding, and that brought in new clients directly',
      },
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
    atAGlance: [
      { lead: 'Live and operating', note: 'a two-sided hiring platform in use today' },
      { lead: 'A brand, and no product', note: 'logo and palette existed; no UX direction, no system, no rules for how anything behaved' },
      { lead: 'Structure before pixels', note: 'mindmap, sitemap, annotated flows and low-fi wireframes signed off before high fidelity' },
      { lead: 'One component system', note: 'a dozen distinct page types read as one product instead of a patchwork of screens' },
      { lead: 'Two sides, one platform', note: 'separate dashboards, onboarding and data for job seekers and employers' },
    ],
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
    atAGlance: [
      { lead: '64-page interactive guide', note: 'built in about a week, on a page system rather than page by page' },
      { lead: 'A5 print edition in 3–4 days', note: 'the same system re-flowed — the only reason a second edition was possible at all' },
      { lead: '13 sections, one tap each', note: 'an interactive index instead of scrolling a 64-page document mid-match' },
      { lead: '100+ pages across both editions', note: 'refined down from a ~150-page brief to a leaner interactive core' },
      { lead: 'Art director, not sole hand', note: 'brought in a collaborator and led the build on a timeline with no room for a second draft' },
    ],
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
    year: 'Oct 2023 – Oct 2025',
    cover: coverFor('upliftk12') ?? cover02,
    coverAlt: 'Uplift K12 interactive math games and teaching platform',
    resultStat:
      '2 sample games to a 270+ game library, plus sole ownership of the platform’s UI/UX, over two years',
    plannedClient: 'Uplift K12',
    isPlaceholder: false,
    atAGlance: [
      { lead: '2 samples → 270+ games', note: 'brand-matched first at 50, then a full interactive math library across grades K–8' },
      { lead: 'Took over platform UI/UX', note: 'from a bootcamp-hired team — dashboard, login and shared whiteboard rebuilt from scratch' },
      { lead: 'Built in Adobe Captivate', note: 'Java and occasional C++ for the interactive logic, CSS carrying the visual layer' },
      { lead: '20-game physical edition', note: 'box dieline, cover, cards, manipulatives and an instruction booklet' },
      { lead: 'Two years, two roles', note: 'an 11-month contract, then a freelance creative-director partnership until it closed' },
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
        quoteFrom: 'review-shah',
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
    slug: 'ez-sports',
    client: 'EZ Sports Apparel',
    projectType: 'Team Uniform Mockups & Vendor Production Graphics',
    /* Brand only. Apparel design and production graphics are neither product
       UI nor motion, and stretching either tag to cover them would misdescribe
       the work to anyone filtering for it. */
    pillars: ['brand'],
    year: 'Apr 2024 – Present',
    cover: coverFor('ez-sports') ?? cover04,
    coverAlt: 'EZ Sports Apparel team uniform mockup and production graphics',
    resultStat:
      'A standing seasonal partner since 2024 — BCLL, LTYA, Outlaws and others returning each season rather than one-off jobs',
    plannedClient: 'EZ Sports Apparel',
    isPlaceholder: false,
    atAGlance: [
      { lead: 'Running since April 2024', note: 'the seasonal design partner, not a job-by-job supplier' },
      { lead: 'One repeatable deck structure', note: 'a ten-team league clears approval without a new process per team' },
      { lead: 'Mockups and vendor files, always separate', note: 'what was approved and what gets printed can never be confused' },
      { lead: '6 sports, 6 recurring accounts', note: 'BCLL, Prodigy, Outlaws, Texas Bombers, Power Soccer, LTYA' },
    ],
    body: {
      problem: {
        copy: 'Brian runs EZ Sports Apparel, a custom-uniform and team-store business based in Cypress, Texas, serving clubs, schools and leagues across baseball, softball, football, basketball, soccer and volleyball. He found me through Freelancer.com; the working relationship then moved into ongoing, direct work outside the platform, running continuously since April 2024.',
        more: [
          'The problem EZ Sports Apparel needed solved sits before manufacturing ever starts: a school or league signs up for a new season, and someone has to show every team — often several teams inside the same league — exactly what their jersey, pants and other gear will look like, in their own colours and branding, before anything gets approved and sent to a vendor to print. Get that step wrong and the league is ordering blind on colours, logo placement, and name-and-number layout.',
        ],
        figures: [
          {
            after: 1,
            caption: 'The step before manufacturing: what a team sees before it signs off.',
            slots: [
              {
                slot: 'approval-mockup',
                alt: 'EZ Sports Apparel client-facing uniform approval mockup',
              },
            ],
          },
        ],
      },
      systemBuilt: {
        copy: 'Every team’s apparel got the same repeatable structure, so a league with ten different team names could move through it fast without each one needing its own process invented from scratch: a brand identity and vision intro, a colour palette and font/logo asset sheet with exact CMYK, RGB and HEX values specified for the printer, a spring jersey design spread, and a pant design spread — closing with the full team lockup.',
        more: [
          'Once a client signed off on the look, the same design got rebuilt as a production-ready file — sized, labelled, and in some cases explicitly marked “FOR VENDOR” — separate from the client-facing presentation, so there was never ambiguity between what the client approved and what gets sent to print.',
        ],
        figures: [
          {
            after: 0,
            caption: 'The deck structure, unchanged from team to team: identity, palette and specs, jersey, pants, lockup.',
            slots: [
              {
                slot: 'deck-structure',
                alt: 'EZ Sports Apparel repeatable mockup deck structure',
              },
            ],
          },
          {
            after: 0,
            caption: 'Exact CMYK, RGB and HEX on the sheet, because the printer cannot guess a club colour.',
            slots: [
              {
                slot: 'colour-specs',
                alt: 'Colour palette and logo asset sheet with CMYK, RGB and HEX values',
              },
            ],
          },
          {
            after: 1,
            caption: 'Two files, deliberately: the one that gets approved, and the one that gets printed.',
            slots: [
              {
                slot: 'vendor-file',
                alt: 'Vendor-ready production file, sized and labelled for print',
              },
            ],
          },
        ],
      },
      deliverable: {
        copy: 'The accounts differ in sport, cut and colourway; the route from mockup to vendor file does not.',
        more: [
          {
            heading: 'Recurring league work',
            copy: 'Bear Creek Little League (BCLL) is a standing client — a full season meant producing individual mockup decks for each team in the league: Hooks, Blue Rocks, TinCaps, Storm, Bulls, Rattlers, Rail Riders, Marauders and Red Wings, each with its own colour story and jersey/pant design built off the same repeatable deck structure.',
          },
          {
            heading: 'Prodigy',
            copy: 'A recurring baseball and softball client with the widest range of any single account — button-downs, crewnecks and softball-specific cuts across multiple colourways (Armed Forces green, Awareness pink, Black Ops, American white, and more), plus fabric-specific variants like a 160 GSM interlock option.',
          },
          {
            heading: 'Outlaws',
            copy: 'Full team identity work including a red colourway with a combined mockup-and-die-cut sublimation layout, and a separate black colourway. Die-cut sheets are their own deliverable, since sublimated jerseys print differently than a standard screen-printed design.',
          },
          {
            heading: 'Additional recurring accounts',
            copy: 'Texas Bombers, Power Soccer and LTYA Softball League are among the longer-standing relationships — teams that return season after season rather than one-off requests, plus other one-off school and club jobs as they come in.',
          },
          'Across every account the work isn’t limited to baseball — soccer, softball and other school sports get the same mockup-to-vendor treatment. Alongside the core apparel work, smaller packaging pieces — bags and branded soft goods for EZ Sports Apparel itself — have come up as one-off add-ons within the same working relationship.',
        ],
        figures: [
          {
            after: 1,
            caption: 'Nine teams, one league, one deck structure — only the colour story changes.',
            slots: [
              {
                slot: 'bcll-teams',
                alt: 'Bear Creek Little League team uniform mockups across the league',
              },
            ],
          },
          {
            after: 2,
            caption: 'One account, every cut and colourway it orders.',
            slots: [
              {
                slot: 'prodigy-colourways',
                alt: 'Prodigy button-down, crewneck and softball cuts across colourways',
              },
            ],
          },
          {
            after: 3,
            caption: 'Sublimation prints differently, so the die-cut sheet is its own deliverable.',
            slots: [
              {
                slot: 'outlaws-diecut',
                alt: 'Outlaws die-cut sublimation layout alongside the uniform mockup',
              },
            ],
          },
          {
            after: 5,
            slots: [
              {
                slot: 'packaging',
                alt: 'Branded bags and soft goods for EZ Sports Apparel',
              },
            ],
          },
        ],
      },
      result: {
        copy: 'Several of these accounts — BCLL, LTYA and Outlaws among them — are recurring, multi-season relationships rather than single projects, with new team decks produced each time a league’s roster changes or a new season starts.',
        more: [
          'The repeatable deck structure is what makes that turnaround possible: a new team’s colours and logo drop into an existing system rather than requiring a new design process each time. That is the difference between a supplier who is called when there is work and a partner a season is planned around.',
        ],
        quoteFrom: 'review-schoellkopf',
      },
    },
    deliverables: [
      'Team-by-team apparel mockup decks — brand identity, colour palette (CMYK/RGB/HEX), font and logo assets, jersey and pant designs',
      'Vendor-ready production files, sized and labelled for print',
      'Die-cut sublimation layouts for sublimated jerseys',
      'Multiple fabric and cut variants per client — button-down, crewneck, softball-specific',
      'Ongoing seasonal design support across recurring league and club accounts',
      'Occasional packaging and soft-goods design for EZ Sports Apparel’s own branded materials',
    ],
  },
  {
    slug: 'goteach',
    client: 'GoTeach.ai',
    projectType: 'AI-Driven EdTech Brand & Product Design System',
    /* Brand and UI/UX. No motion: the deliverables are an identity, a design
       system and product screens, and there is no motion work to claim. */
    pillars: ['brand', 'uiux'],
    /* The brand manual is dated March 2025 and the work ran inside the Uplift
       K12 freelance window. The exact start month was never established, so
       the year is as precise as this gets rather than a guessed month. */
    year: '2025',
    cover: coverFor('goteach') ?? cover03,
    coverAlt: 'GoTeach.ai brand identity and product interface',
    /* Careful wording. "Shipped" on a portfolio card reads as launched, and
       what is established here is the design: brand, system and screens. No
       build or launch is claimed anywhere in this entry. */
    resultStat:
      'A brand system, a UI/UX design system and the core product screens, all built from one visual language',
    plannedClient: 'GoTeach.ai',
    isPlaceholder: false,
    atAGlance: [
      { lead: 'A brand system from zero', note: 'mascot-led logo, three primary tones plus accents, dual typefaces, clear-space rules' },
      { lead: 'A nine-pose mascot cast', note: 'so the identity can answer what a screen is saying, not just appear on it' },
      { lead: 'Brand extended into a UI system', note: 'components, a two-style icon font, shadows, an interface palette, a full type scale' },
      { lead: 'Core product screens on it', note: 'landing page, auth flows, and a TEKS-aligned worksheet dashboard, grades 3–8' },
      { lead: 'Designed, not built', note: 'no development work is claimed on this one' },
    ],
    body: {
      problem: {
        copy: 'Mehul — the same contact as Uplift K12 — brought me onto a second, related project inside that freelance-era relationship: GoTeach.ai, an AI-driven EdTech platform aimed at teachers. The idea was to give teachers smart tools for lesson planning and classroom engagement, centred on a syllabus maker and an auto-generated, TEKS-aligned test-prep library — STAAR Math, STAAR Reading, STAAR Social Studies and Bluebonnet Math, across grades 3 through 8.',
        more: [
          'GoTeach.ai started with nothing built: no logo, no colour system, no visual language. And the brief had a specific tension in it. The platform had to stand out in an increasingly crowded, AI-saturated EdTech market without reading as cold or purely technological. Teachers are the primary user, and a tool that leans too hard on "AI" as a brand risks feeling impersonal to exactly the audience it is trying to win. The identity had to hold technology and humanity at the same time.',
        ],
        figures: [
          {
            after: 1,
            caption: 'The brief in one line: read as intelligent without reading as a machine.',
            slots: [
              {
                slot: 'challenge',
                alt: 'The GoTeach.ai brand challenge — balancing technology and humanity',
              },
            ],
          },
        ],
      },
      systemBuilt: {
        copy: 'The answer was a mascot-led identity rather than a purely typographic or abstract mark — a symbol for connectivity and knowledge-sharing, built by turning the word "Go" into a friendly, glasses-wearing character that reads as approachable rather than robotic. A face is the shortest route to warmth in a category that mostly signals intelligence, and it settled the technology-versus-humanity tension in the mark itself rather than in the copy around it.',
        more: [
          'That mascot became the anchor everything else was built around. Colour, typography and clear-space rules were all defined so the mark stayed legible and consistent at every size, from a favicon to a letterhead.',
          'Rather than stopping at a brand manual, the same colour and typography system was extended directly into a full UI/UX design system — components, icons, shadows and an interface-specific palette — so the product and the brand collateral around it could never read as two different companies.',
        ],
        figures: [
          {
            after: 0,
            caption: 'The wordmark, given a face: "Go" as a character rather than a logotype.',
            slots: [
              {
                slot: 'mascot-concept',
                alt: 'The GoTeach.ai mascot built from the "Go" wordmark',
              },
            ],
          },
          {
            after: 1,
            caption: 'Full lockup and symbol-only mark, so the identity survives being shrunk to a favicon.',
            slots: [
              {
                slot: 'logo-lockup',
                alt: 'GoTeach.ai primary logo lockup with wordmark and tagline',
              },
              {
                slot: 'logo-secondary',
                alt: 'GoTeach.ai symbol-only secondary mark',
              },
            ],
          },
        ],
      },
      deliverable: {
        copy: 'Seven things came out of it, and each one is built on the one before rather than beside it.',
        more: [
          {
            heading: 'Brand identity & logo system',
            copy: 'The mascot carries the brand’s core idea: a character built from the "Go" wordmark, given a face, glasses and a posture library rather than left as a static shape — the point being that a teaching tool should feel like a helpful presence in the room, not a piece of software. The primary logo pairs that symbol with the GoTeach.ai wordmark and the tagline "Teaching Meets Innovation"; a symbol-only mark handles the places the full lockup will not fit legibly — a favicon, an app icon, a watermark. Minimum clear-space rules were defined for every lockup variation, so the mark never gets crowded by whatever sits next to it.',
          },
          {
            heading: 'Colour and typography',
            copy: 'Colour is built on three primary tones — Deep Blue #2D10DD, Vibrant Purple #5A38F6 and Dark Gray #39393A — plus a set of accents (Pink #FF69B4, Teal #A1E3D8, Yellow #FEC601) reserved for energy and highlight moments rather than core brand surfaces. That reservation is the whole point: the accents keep the palette warm without tipping it into looking like a children’s toy brand. Typography splits logo from body use — Quadaptor-Regular carries the wordmark specifically, Oxanium handles everything else — so the logo keeps a distinct identity from the interface type without the two feeling unrelated.',
          },
          {
            heading: 'The mascot cast',
            copy: 'A nine-pose character set, with different expressions and gestures, gives the brand something to draw from across marketing and product moments. One static illustration pasted everywhere it appears stops being a character after the second time you see it; a cast can respond to what the screen is actually saying.',
          },
          {
            heading: 'Brand collateral & stationery',
            copy: 'The identity was applied across physical and digital touchpoints — laptop and smartphone splash screens, letterhead and envelope design — so the system had proof it worked somewhere other than a logo lockup on a white background.',
          },
          {
            heading: 'Design system for the product',
            copy: 'Underneath the product UI sits a full component library: input fields, radio buttons, checkboxes and toggles, primary and secondary buttons, all built to the same visual language rather than left as browser defaults with brand colours dropped on top. An icon font was built in two parallel styles — rounded and square line icons — covering navigation, media, communication and data, so a designer or developer always has a matching pair whichever style a screen calls for. A shadow system, both neutral and primary-colour, gives cards and modals depth without relying on borders alone, and a type scale running Display 10 down to Display 1 plus a separate paragraph scale covers everything from a hero headline to fine print.',
          },
          {
            heading: 'An interface palette on top of the brand one',
            copy: 'Brand colour and interface colour are not the same job, so the system carries both. On top of the core palette sits an extended digital set built for interface use — Purple Magic, Purple Blue, Cyan/Teal and Blue, each with its own tint and shade range, plus a full neutral grey scale for text, borders and backgrounds. That gives the product room to express state — hover, active, disabled, error — without ever reaching outside the brand’s own colour language for it.',
          },
          {
            heading: 'Product UI/UX',
            copy: 'The landing page leads with "Master Your Test Preparation" and lays out the platform’s core value props — PDF generation, progress tracking, TEKS-aligned content, custom assessments, smart search and subject coverage — followed by an available-subjects grid and an FAQ answering the questions a teacher or parent actually has before signing up. Sign-in and registration include a teacher/student account-type toggle at registration, since the platform serves the two roles differently and needed to route each into the right experience from the first screen rather than after the fact.',
          },
          'The core of the product is the Practice Tools dashboard: a subject- and grade-filtered library across STAAR Math, STAAR Reading, STAAR Social Studies and Bluebonnet Math, grades 3 through 8. Each worksheet card shows its TEKS learning objective, a live HTML preview so a teacher can check the content before committing to it, a downloadable PDF, and quantity controls for printing multiple copies. The filtering is what makes a large library usable rather than overwhelming — narrow by subject and grade first, then scan covers rather than titles alone.',
        ],
        figures: [
          {
            after: 2,
            caption: 'Three primary tones, accents held back for highlights, and two typefaces doing separate jobs.',
            slots: [
              {
                slot: 'colour-palette',
                alt: 'GoTeach.ai primary colour palette and accent colours',
              },
              {
                slot: 'typography',
                alt: 'GoTeach.ai typography system: Quadaptor-Regular and Oxanium',
              },
            ],
          },
          {
            after: 3,
            caption: 'Nine poses, so the brand can answer what a screen is saying instead of just appearing on it.',
            slots: [
              {
                slot: 'mascot-poses',
                alt: 'The nine-pose GoTeach.ai mascot character set',
              },
            ],
          },
          {
            after: 4,
            slots: [
              {
                slot: 'stationery',
                alt: 'GoTeach.ai letterhead and envelope design',
              },
              {
                slot: 'splash-screens',
                alt: 'GoTeach.ai laptop and smartphone splash screens',
              },
            ],
          },
          {
            after: 5,
            caption: 'Components, and an icon font in two styles so a screen never has to mix them.',
            slots: [
              {
                slot: 'component-library',
                alt: 'GoTeach.ai component library: fields, toggles, buttons',
              },
            ],
          },
          {
            after: 5,
            slots: [
              {
                slot: 'icon-font',
                alt: 'GoTeach.ai icon font in rounded and square line styles',
              },
            ],
          },
          {
            after: 6,
            caption: 'Interface colour with tint and shade ranges, so state never needs a colour from outside the brand.',
            slots: [
              {
                slot: 'interface-palette',
                alt: 'GoTeach.ai extended interface colour palette with tints and shades',
              },
            ],
          },
          {
            after: 7,
            slots: [
              {
                slot: 'landing-page',
                alt: 'GoTeach.ai landing page',
              },
            ],
          },
          {
            after: 7,
            caption: 'Teacher or student, chosen on the first screen rather than corrected later.',
            slots: [
              {
                slot: 'auth-flows',
                alt: 'GoTeach.ai sign-in and registration flows with account-type toggle',
              },
            ],
          },
          {
            after: 8,
            caption: 'Filter by subject and grade first — a large library only works if you never see all of it at once.',
            slots: [
              {
                slot: 'practice-dashboard',
                alt: 'GoTeach.ai Practice Tools worksheet dashboard',
              },
            ],
          },
        ],
      },
      result: {
        copy: 'GoTeach.ai was designed as one system rather than a logo in isolation: brand identity, a full UI/UX design system, and the core product screens — landing page, auth flows and the Practice Tools worksheet library — all drawn from the same visual language, so nothing in the product reads as bolted onto a separate brand exercise.',
        more: [
          'The identity and the interface were never separate pieces of work handed to each other. The interface palette extends the brand palette, the component library uses the brand type scale, and the mascot appears in the product rather than only in the marketing around it — which is the difference between a brand a product carries and a brand a product happens to be painted in.',
        ],
        quoteFrom: 'review-shah',
      },
    },
    deliverables: [
      'Brand identity and logo system — primary lockup, symbol-only mark, logo philosophy and clear-space guidelines',
      'Colour palette and typography system — primary tones plus accents, Quadaptor-Regular for the logo, Oxanium throughout',
      'Mascot character system — a nine-pose "Go" cast for marketing and product use',
      'Brand stationery and digital collateral — letterhead, envelope, laptop and smartphone splash screens',
      'Full UI/UX design system — component library, two-style icon font, shadow system, interface palette, complete type scale',
      'Core product UI/UX — landing page, sign-in and register flows, Practice Tools worksheet dashboard',
      'TEKS-aligned worksheet templates — STAAR Math, STAAR Reading, STAAR Social Studies and Bluebonnet Math, grades 3–8',
    ],
  },
  {
    slug: 'santamaria',
    client: 'Santamaria Law Firm',
    projectType: 'Video-First Legal Education System',
    /* Motion alone. This is a video production system — no identity work, no
       product interface — and stretching either tag over it would misdescribe
       the work to anyone filtering for one. */
    pillars: ['motion'],
    year: 'Jan 2021 – Jun 2022',
    cover: coverFor('santamaria') ?? cover04,
    coverAlt: 'Santamaria Law Firm legal education video with animated icon overlays',
    resultStat:
      'A channel from 1,000 to 30–40K subscribers over 18 months, on 10+ videos a month with no gaps',
    plannedClient: 'Santamaria Law Firm',
    isPlaceholder: false,
    atAGlance: [
      { lead: '1,000 → 30–40K subscribers', note: 'across the 18-month engagement' },
      { lead: '10+ videos every month', note: 'for eighteen months, with no gaps' },
      { lead: '2 university partnerships', note: 'UC Berkeley and the University of San Francisco followed from the channel’s visibility' },
      { lead: 'Two content lines, one pipeline', note: 'legal updates and a kids’ English series, without breaking visual consistency' },
      { lead: 'Where “lock it once” came from', note: 'the layout churn on this project is why branding-first became the default on every one after' },
    ],
    body: {
      problem: {
        copy: 'Santamaria Law Firm needed to explain U.S. immigration law to people who are not lawyers — clearly, consistently, and at volume. Static content was not doing that job.',
        more: [
          'What they had was raw green-screen footage of the attorney and no visual system to put it in. What they needed was not a video style but a video engine: something that could turn dense legal procedure into content people would actually watch, understand, and act on, at ten or more episodes a month for as long as the channel ran.',
        ],
        figures: [
          {
            after: 1,
            caption: 'The raw material: an attorney, a green screen, and nothing else agreed.',
            slots: [
              {
                slot: 'raw-footage',
                alt: 'Raw green-screen footage before any visual system was applied',
              },
            ],
          },
        ],
      },
      systemBuilt: {
        copy: 'The engine had to come out of the firm’s own brand rather than be invented alongside it, or every episode would drift a little further from the practice it represented.',
        more: [
          {
            heading: 'Branding first, then everything else',
            copy: 'The layout system was pulled directly from the firm’s existing logo, colour palette and typography, and built on top of them — so every icon, popup and callout that followed stayed inside one visual language instead of being decided per episode.',
          },
          {
            heading: 'Green-screen compositing',
            copy: 'The raw background was keyed out and replaced with a custom backdrop colour-graded to the firm’s palette. Every single episode, not a template applied once and left to drift.',
          },
          {
            heading: 'A motion and icon system',
            copy: 'Animated, keyframed icon sets were built per legal topic — a birth-certificate mock-up for identity documents, a numbered checklist for disclosures, an arrest icon for deportation risk. Synced to the script, they work almost as a visual subtitle track: someone who loses the thread of a sentence about procedure still has something on screen telling them what is being discussed.',
          },
          {
            heading: 'The audio layer',
            copy: 'Voiceover enhancement and sound design on every episode, for pacing and for clarity. Legal explanation is dense by nature, and audio is what gives a viewer somewhere to breathe in it.',
          },
          {
            heading: 'A second content line on the same pipeline',
            copy: 'Alongside the legal updates ran a parallel series: Dora-the-Explorer-style English tutorials for children, hosted around a cat character called Lenin, who put questions directly to the viewer before the host answered. Same production pipeline, an entirely different audience, and no loss of visual consistency between them.',
          },
          {
            heading: 'One lesson, kept',
            copy: 'Three or four layout and animation variations were tested early, while the colour system stayed locked throughout. That layout churn is exactly why branding-first, locked once, became the default on every project after this one — including the ones on this site.',
          },
        ],
        figures: [
          {
            after: 1,
            caption: 'The firm’s own logo, palette and type, turned into a layout system rather than applied over one.',
            slots: [
              {
                slot: 'brand-extraction',
                alt: 'The Santamaria video layout system derived from the firm’s brand',
              },
            ],
          },
          {
            after: 2,
            caption: 'Keyed, then graded to the firm’s palette — every episode, not a template left to drift.',
            slots: [
              {
                slot: 'compositing',
                alt: 'Green-screen key and branded backdrop, before and after',
              },
            ],
          },
          {
            after: 3,
            caption: 'A visual subtitle track: identity documents, disclosure checklists, deportation risk.',
            slots: [
              {
                slot: 'icon-system',
                alt: 'Animated icon library built per legal topic',
              },
            ],
          },
          {
            after: 5,
            caption: 'Lenin the cat: the same pipeline, pointed at an audience of children.',
            slots: [
              {
                slot: 'kids-series',
                alt: 'Frames from the children’s English tutorial series with the Lenin character',
              },
            ],
          },
        ],
      },
      deliverable: {
        copy: 'Every episode left as a finished package rather than a cut of footage: keyed and colour-graded to the firm’s branding, topic-specific animated overlays, a full voiceover and sound pass, and the same branded intro and outro carrying across the whole run.',
        more: [
          'The children’s line shipped on the same terms — a distinct, character-led format, produced through the identical pipeline, so running two audiences never meant running two productions.',
          'Two university collaborations came out of the channel as well, with UC Berkeley and the University of San Francisco. That work is under NDA and is not shown here.',
          'The scope also widened past video during the contract: the firm’s presentation and document assets were rebranded on top of the video work, so what an attorney handed a client in a meeting matched what a viewer saw on the channel.',
        ],
        figures: [
          {
            after: 0,
            caption: 'The same system across topics — the icons change, the language does not.',
            slots: [
              {
                slot: 'episode-frames',
                alt: 'Frame grabs from delivered episodes across different legal topics',
              },
            ],
          },
        ],
      },
      result: {
        copy: 'The channel went from roughly 1,000 subscribers to 30–40K across the eighteen-month engagement, on a delivery rate of ten or more videos a month with no gaps. Two university partnerships — UC Berkeley and the University of San Francisco — followed from that visibility.',
        more: [
          'What made the volume possible was that it was one production system rather than a style reapplied each time. It carried two content lines with different audiences and did not break visual consistency between them, and it absorbed a scope expansion into presentation and document design without a rebuild.',
          /* Same honesty as the Josef's numbers: this describes the channel
             over the period, not a causal claim about what a single hand
             produced. */
          'These figures describe the channel’s growth over the period I ran its video production. They speak to the consistency and reach of the work rather than a claim of sole causation.',
        ],
        quoteFrom: 'review-santamaria',
      },
    },
    deliverables: [
      'Green-screen keying and branded colour-grading pipeline',
      'Animated icon and callout system — an immigration-law visual library',
      'Voiceover enhancement and sound design on every episode',
      'Branded intro and outro carried across the full run',
      'Parallel English-tutorial line for children — character-led format',
      'Presentation and document asset rebrand, added to the video contract',
    ],
  },
]

export const caseStudySections = [
  { key: 'problem', label: 'Business problem', eyebrow: 'CASE :: 01' },
  { key: 'systemBuilt', label: 'The system built', eyebrow: 'CASE :: 02' },
  { key: 'deliverable', label: 'The deliverable', eyebrow: 'CASE :: 03' },
  { key: 'result', label: 'Result / value', eyebrow: 'CASE :: 04' },
] as const
