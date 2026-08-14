/**
 * Pricing data.
 *
 * One-time tiers are the $45/hr brand-guide rate card (the Upwork-facing
 * repricing), NOT the live Freelancer.com listing prices — those differ and
 * conflating the two has caused confusion before. Every figure below is
 * hours x $45 against real scope; do not add a tier without the hours behind it.
 *
 * Retainer tiers are capped monthly-hour packages at the same $45/hr rate.
 * Deliberately not "unlimited requests" — that is an agency model and would
 * set a false expectation for a solo practitioner.
 */

export type Tier = {
  name: string
  price: string
  meta: string
  points: string[]
  featured?: boolean
}

export type Package = {
  id: string
  title: string
  summary: string
  tiers: Tier[]
  addOns?: { label: string; price: string }[]
  /** Electric Cyan is reserved for AI/system context only. */
  isAiContext?: boolean
}

export const pricingIntro = {
  eyebrow: 'SYS.05 :: PRICING',
  headline: 'Clear scope, [clear price.]',
  lede: 'Every tier is priced from real hours at a flat $45/hour rate — no round numbers pulled out of the air, and no agency markup.',
  tabs: [
    { id: 'one-time', label: 'One-Time Project' },
    { id: 'retainer', label: 'Ongoing Retainer' },
  ],
  hourlyRate: '$45/hr',
}

export const oneTimePackages: Package[] = [
  {
    id: 'brand',
    title: 'Brand Identity & Visual Systems',
    summary: 'Naming, identity and the rules that keep it consistent.',
    tiers: [
      { name: 'Starter', price: '$270', meta: '6 hrs', points: ['Core identity essentials', 'Primary logo delivery', 'Editable source files'] },
      { name: 'Standard', price: '$675', meta: '15 hrs', points: ['Full identity system', 'Colour and type architecture', 'Brand guidelines document'], featured: true },
      { name: 'Advanced', price: '$1,125', meta: '25 hrs', points: ['Extended brand architecture', 'Applied asset set', 'Full guidelines and handoff pack'] },
    ],
  },
  {
    id: 'uiux',
    title: 'UI/UX & Product Design',
    summary: 'The product interface extension of the brand system.',
    tiers: [
      { name: 'Starter', price: '$270', meta: '~6 hrs', points: ['Focused screen set', 'Core user flow', 'Figma source file'] },
      { name: 'Standard', price: '$630', meta: '~14 hrs', points: ['Multi-page product design', 'Reusable component set', 'Developer-ready handoff'], featured: true },
      { name: 'Advanced', price: '$1,080', meta: '~24 hrs', points: ['Full product design system', 'Extended screen coverage', 'Documented usage rules'] },
    ],
  },
  {
    id: 'motion',
    title: 'Motion Branding',
    summary: 'Brand-consistent motion for teams that already have identity assets.',
    tiers: [
      { name: 'Starter', price: '$225', meta: '5 hrs · 3-day delivery', points: ['30s video', '1 revision', 'Brand-consistent animation'] },
      { name: 'Standard', price: '$400', meta: '9 hrs · 7-day delivery', points: ['60s video', '2 revisions', 'Scriptwriting included', 'Product imagery included'], featured: true },
      { name: 'Advanced', price: '$720', meta: '16 hrs · 10-day delivery', points: ['90s video', '3 revisions', 'Voice-over recording included'] },
    ],
  },
  {
    id: 'ai-video',
    title: 'AI Video Production',
    summary: 'Zero-to-finished video when there is no script, storyboard or moodboard yet.',
    isAiContext: true,
    tiers: [
      { name: 'Starter', price: '$225', meta: '5 hrs · 3-day delivery', points: ['Up to 30s', '1 revision', 'Single-pass generation'] },
      { name: 'Standard', price: '$450', meta: '10 hrs · 5-day delivery', points: ['Up to 60s', '2 revisions', 'Shot variations tested', 'Basic AI voice-over'], featured: true },
      { name: 'Advanced', price: '$765', meta: '17 hrs · 8-day delivery', points: ['Up to 90s', '3 revisions', 'Multi-option scenes', 'Premium AI voice-over', 'One pre-production module free'] },
    ],
    addOns: [
      { label: 'Scriptwriting from brief (+2 days)', price: '$90' },
      { label: 'Concept & visual moodboard (+1 day)', price: '$90' },
      { label: 'Shot-by-shot storyboard (+2 days)', price: '$135' },
      { label: 'Raw footage / non-branded edit (+1 day)', price: '$90' },
      { label: 'Full Creative Development Package (script + moodboard + storyboard, +3 days)', price: '$345' },
    ],
  },
]

export const retainer = {
  /** Spec copy line, shown directly under the toggle. */
  note: 'Same system, ongoing — capped monthly hours, one dedicated designer, work rolls across brand, UI/UX, or motion as your product grows.',

  /**
   * Configurable rather than baked into the copy above. Flip to true and the
   * roll-over line changes with it.
   */
  hoursRollOver: false,
  rollOverCopy: {
    off: 'Unused hours do not roll over to the next month.',
    on: 'Unused hours roll over to the following month.',
  },

  tiers: [
    { name: 'Retainer Lite', price: '$450', meta: '10 hrs / month', points: ['Steady small-scope work', 'Rolls across all three pillars', 'One dedicated designer'] },
    { name: 'Retainer Standard', price: '$900', meta: '20 hrs / month', points: ['Continuous feature and campaign work', 'Rolls across all three pillars', 'One dedicated designer'], featured: true },
    { name: 'Retainer Pro', price: '$1,575', meta: '35 hrs / month', points: ['Primary design capacity', 'Rolls across all three pillars', 'One dedicated designer'] },
  ] satisfies Tier[],

  footnote:
    'Retainers suit teams past launch: new features need UI, campaigns need motion, and the brand needs periodic refreshes. Scope is agreed month to month within the capped hours.',
}
