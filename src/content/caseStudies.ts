import cover01 from '../assets/images/cover-01.svg'
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
  /** Locked case-study structure. Never a flat "what was designed" list. */
  body: {
    problem: string
    systemBuilt: string
    deliverable: string
    result: string
  }
  deliverables: string[]
}

export const portfolioIntro = {
  eyebrow: 'SYS.04 :: PORTFOLIO',
  headline: 'Systems built, start to [finish.]',
  lede: 'Every project below follows the same structure: the business problem, the system built to solve it, what shipped, and what it changed.',
  /** Build-state note, rendered as a small chip rather than body copy. */
  draftLabel: 'Draft',
  placeholderNotice: 'Covers, copy and result figures are placeholders while the real work is prepared.',
}

export const pillarFilters: { value: 'all' | Pillar; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'brand', label: 'Brand Identity' },
  { value: 'uiux', label: 'UI/UX' },
  { value: 'motion', label: 'Motion Branding' },
]

const PLACEHOLDER_BODY = {
  problem:
    '[Business problem placeholder] — what the company was actually losing before the work started, in their terms: the audience they were failing to reach, the conversion that was leaking, or the inconsistency that was costing them credibility.',
  systemBuilt:
    '[System built placeholder] — the rules, architecture and components created to solve it: naming and brand architecture, the design system underneath the product UI, and the motion language that carries both into video.',
  deliverable:
    '[Deliverable placeholder] — the concrete assets handed over, in editable production-ready form, plus the guidelines that let the team keep applying the system without me.',
  result:
    '[Result / value placeholder] — the measurable outcome, with the real figure and the timeframe it was measured over.',
}

export const caseStudies: CaseStudy[] = [
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
