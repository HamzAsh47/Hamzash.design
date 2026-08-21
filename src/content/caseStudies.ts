import cover01 from '../assets/images/cover-01.svg'
import { figuresFor } from './caseFigures'
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
  year: string
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
    year: '2023—present',
    /* The supplied hero, the moment it is dropped in; the placeholder plate
       until then, so a real case study never sits behind a broken image. */
    cover: figuresFor('josefs', 'hero')[0] ?? cover01,
    coverAlt: "Josef's Buffalo Wings brand hero image",
    resultStat: '0 to ~5,000 followers and one location to two, over two years',
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
        copy: '@josefs_hamburg grew from zero to roughly five thousand followers over two years, built entirely on original content and brand assets created from the ground up. In the same period the business went from one location to two, opening at Europa Passage Hamburg alongside the original at Phoenix Center Harburg — funded by the success of the first location rather than outside investment.',
        more: [
          'Throughout that growth I remained the sole creative across the brand: identity, packaging, interior, motion and social. No team, no outsourcing, for two continuous years.',
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
    slug: 'case-01',
    client: 'Client Name',
    projectType: 'Brand Identity & Visual System',
    pillars: ['brand'],
    year: '2026',
    cover: cover01,
    coverAlt: 'Placeholder cover for a brand identity case study',
    resultStat: 'result coming soon',
    plannedClient: 'WACA',
    isPlaceholder: true,
    body: PLACEHOLDER_BODY,
    deliverables: [
      'Logo system and brand architecture',
      'Colour and type system',
      'Brand guidelines document',
      'Asset handoff pack',
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
