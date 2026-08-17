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
  /**
   * The rate-card spec sheet for this tier — the numbers the cards have no
   * room for. Straight from the service rate cards; a dash means the tier does
   * not include that line. Prices are NOT taken from those PDFs: they did not
   * extract reliably, so the figures above remain the source of truth.
   */
  spec?: { label: string; value: string }[]
}

export type Package = {
  id: string
  title: string
  summary: string
  tiers: Tier[]
  /**
   * Priced extras for the whole package. `includedWhen` names the rate-card
   * line this add-on buys: a tier whose spec already marks that line Included
   * does not show it, because listing "Vector file — Included" in the rate
   * card and "Vector file — +$50" underneath it says two opposite things
   * about the same deliverable.
   */
  addOns?: { label: string; price: string; includedWhen?: string }[]
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
      { name: 'Starter', price: '$270', meta: '6 hrs', points: ['Core identity essentials', 'Primary logo delivery', 'Editable source files'], spec: [{ label: 'Delivery time', value: '3 days' }, { label: 'Revisions', value: '2' }, { label: 'Hours of work', value: '6' }, { label: 'Versions', value: '1' }, { label: 'Source files', value: 'Included' }, { label: 'Logo transparency', value: 'Included' }, { label: 'High resolution', value: 'Included' }, { label: '3D image', value: '—' }, { label: 'Stationery design', value: '—' }, { label: 'Vector file', value: 'Included' }] },
      { name: 'Standard', price: '$675', meta: '15 hrs', points: ['Full identity system', 'Colour and type architecture', 'Brand guidelines document'], featured: true, spec: [{ label: 'Delivery time', value: '7 days' }, { label: 'Revisions', value: '3' }, { label: 'Hours of work', value: '15' }, { label: 'Versions', value: '1' }, { label: 'Source files', value: 'Included' }, { label: 'Logo transparency', value: 'Included' }, { label: 'High resolution', value: 'Included' }, { label: '3D image', value: '—' }, { label: 'Stationery design', value: 'Included' }, { label: 'Vector file', value: 'Included' }] },
      { name: 'Advanced', price: '$1,125', meta: '25 hrs', points: ['Extended brand architecture', 'Applied asset set', 'Full guidelines and handoff pack'], spec: [{ label: 'Delivery time', value: '10 days' }, { label: 'Revisions', value: '4' }, { label: 'Hours of work', value: '25' }, { label: 'Versions', value: '2' }, { label: 'Source files', value: 'Included' }, { label: 'Logo transparency', value: 'Included' }, { label: 'High resolution', value: 'Included' }, { label: '3D image', value: 'Included' }, { label: 'Stationery design', value: 'Included' }, { label: 'Vector file', value: 'Included' }] },
    ],
    addOns: [
      { label: 'Additional revision', price: '+$25' },
      { label: 'Additional hour of work', price: '+$15' },
      { label: 'Additional version (+1 day)', price: '+$40' },
      { label: '3D image (+1 day)', price: '+$60', includedWhen: '3D image' },
      { label: 'Stationery designs (+1 day)', price: '+$60', includedWhen: 'Stationery design' },
      { label: 'Vector file (+1 day)', price: '+$50', includedWhen: 'Vector file' },
    ],
  },
  {
    id: 'uiux',
    title: 'UI/UX & Product Design',
    summary: 'The product interface extension of the brand system.',
    tiers: [
      { name: 'Starter', price: '$270', meta: '~6 hrs', points: ['Focused screen set', 'Core user flow', 'Figma source file'], spec: [{ label: 'Delivery time', value: '4 days' }, { label: 'Pages', value: '5' }, { label: 'Revisions', value: '1' }, { label: 'Source files', value: '—' }, { label: 'Commercial use', value: 'Included' }, { label: 'Convert to HTML/CSS', value: '—' }, { label: 'Responsive design', value: '—' }, { label: 'Interactive mockup', value: '—' }] },
      { name: 'Standard', price: '$630', meta: '~14 hrs', points: ['Multi-page product design', 'Reusable component set', 'Developer-ready handoff'], featured: true, spec: [{ label: 'Delivery time', value: '7 days' }, { label: 'Pages', value: '10' }, { label: 'Revisions', value: '2' }, { label: 'Source files', value: 'Included' }, { label: 'Commercial use', value: 'Included' }, { label: 'Convert to HTML/CSS', value: '—' }, { label: 'Responsive design', value: 'Included' }, { label: 'Interactive mockup', value: 'Included' }] },
      { name: 'Advanced', price: '$1,080', meta: '~24 hrs', points: ['Full product design system', 'Extended screen coverage', 'Documented usage rules'], spec: [{ label: 'Delivery time', value: '12 days' }, { label: 'Pages', value: '15' }, { label: 'Revisions', value: '3' }, { label: 'Source files', value: 'Included' }, { label: 'Commercial use', value: 'Included' }, { label: 'Convert to HTML/CSS', value: 'Included' }, { label: 'Responsive design', value: 'Included' }, { label: 'Interactive mockup', value: 'Included' }] },
    ],
    addOns: [
      { label: 'Additional page (+1 day)', price: '+$40' },
      { label: 'Additional revision', price: '+$25' },
      { label: 'Source file (+1 day)', price: '+$50', includedWhen: 'Source files' },
      { label: 'Responsive design (+2 days)', price: '+$100', includedWhen: 'Responsive design' },
    ],
  },
  {
    id: 'motion',
    title: 'Motion Branding',
    summary: 'Brand-consistent motion for teams that already have identity assets.',
    tiers: [
      { name: 'Starter', price: '$225', meta: '5 hrs · 3-day delivery', points: ['30s video', '1 revision', 'Brand-consistent animation'], spec: [{ label: 'Delivery time', value: '3 days' }, { label: 'Revisions', value: '1' }, { label: 'Running time', value: '30 seconds' }, { label: 'Length variations', value: '1' }, { label: 'Orientations', value: '1' }, { label: 'Video editing', value: 'Included' }, { label: 'Scriptwriting', value: '—' }, { label: 'Show product imagery', value: '—' }, { label: 'Background music', value: 'Included' }, { label: 'Voice-over recording', value: '—' }] },
      { name: 'Standard', price: '$400', meta: '9 hrs · 7-day delivery', points: ['60s video', '2 revisions', 'Scriptwriting included', 'Product imagery included'], featured: true, spec: [{ label: 'Delivery time', value: '7 days' }, { label: 'Revisions', value: '2' }, { label: 'Running time', value: '60 seconds' }, { label: 'Length variations', value: '2' }, { label: 'Orientations', value: '2' }, { label: 'Video editing', value: 'Included' }, { label: 'Scriptwriting', value: 'Included' }, { label: 'Show product imagery', value: 'Included' }, { label: 'Background music', value: 'Included' }, { label: 'Voice-over recording', value: '—' }] },
      { name: 'Advanced', price: '$720', meta: '16 hrs · 10-day delivery', points: ['90s video', '3 revisions', 'Voice-over recording included'], spec: [{ label: 'Delivery time', value: '10 days' }, { label: 'Revisions', value: '3' }, { label: 'Running time', value: '90 seconds' }, { label: 'Length variations', value: '3' }, { label: 'Orientations', value: '3' }, { label: 'Video editing', value: 'Included' }, { label: 'Scriptwriting', value: 'Included' }, { label: 'Show product imagery', value: 'Included' }, { label: 'Background music', value: 'Included' }, { label: 'Voice-over recording', value: 'Included' }] },
    ],
    addOns: [
      { label: 'Additional revision', price: '+$30' },
      { label: 'Scriptwriting (+2 days)', price: '+$50', includedWhen: 'Scriptwriting' },
      { label: 'Additional 10 sec running time (+1 day)', price: '+$25' },
      { label: 'Show product imagery (+1 day)', price: '+$40', includedWhen: 'Show product imagery' },
      { label: 'Additional length variation (+1 day)', price: '+$30' },
      { label: 'Voice-over (+1 day)', price: '+$60', includedWhen: 'Voice-over recording' },
      { label: 'Additional orientation (+1 day)', price: '+$20' },
      { label: 'Raw footage editing, non-branded (+1 day)', price: '+$80' },
    ],
  },
  {
    id: 'ai-video',
    title: 'AI Video Production',
    summary: 'Zero-to-finished video when there is no script, storyboard or moodboard yet.',
    isAiContext: true,
    tiers: [
      { name: 'Starter', price: '$225', meta: '5 hrs · 3-day delivery', points: ['Up to 30s', '1 revision', 'Single-pass generation'], spec: [{ label: 'Delivery time', value: '3 days' }, { label: 'Final video length', value: 'Up to 30s' }, { label: 'Revisions', value: '1' }, { label: 'AI scenes / shots', value: 'Single-pass' }, { label: 'Platform exports', value: '1' }, { label: 'Background music', value: 'Included' }, { label: 'AI voice-over', value: '—' }, { label: 'Free pre-production module', value: '—' }] },
      { name: 'Standard', price: '$450', meta: '10 hrs · 5-day delivery', points: ['Up to 60s', '2 revisions', 'Shot variations tested', 'Basic AI voice-over'], featured: true, spec: [{ label: 'Delivery time', value: '5 days' }, { label: 'Final video length', value: 'Up to 60s' }, { label: 'Revisions', value: '2' }, { label: 'AI scenes / shots', value: 'Shot variations tested' }, { label: 'Platform exports', value: '2' }, { label: 'Background music', value: 'Included' }, { label: 'AI voice-over', value: 'Basic' }, { label: 'Free pre-production module', value: '—' }] },
      { name: 'Advanced', price: '$765', meta: '17 hrs · 8-day delivery', points: ['Up to 90s', '3 revisions', 'Multi-option scenes', 'Premium AI voice-over', 'One pre-production module free'], spec: [{ label: 'Delivery time', value: '8 days' }, { label: 'Final video length', value: 'Up to 90s' }, { label: 'Revisions', value: '3' }, { label: 'AI scenes / shots', value: 'Multi-option per scene' }, { label: 'Platform exports', value: '3' }, { label: 'Background music', value: 'Included' }, { label: 'AI voice-over', value: 'Premium' }, { label: 'Free pre-production module', value: 'Choice of one' }] },
    ],
    addOns: [
      { label: 'Scriptwriting from brief (+2 days)', price: '+$90' },
      { label: 'Concept & visual moodboard (+1 day)', price: '+$90' },
      { label: 'Shot-by-shot storyboard (+2 days)', price: '+$135' },
      { label: 'Raw footage / non-branded edit (+1 day)', price: '+$90' },
      { label: 'Full Creative Development Package (+3 days)', price: '+$345' },
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
