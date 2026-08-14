/**
 * "The System" — the section that carries the core differentiator:
 * one system, not three vendors.
 *
 * Deliberately typographic rather than an abstract node-and-circle diagram:
 * the proof is the layout itself (three fragmented columns collapsing into one
 * continuous row), not a decorative vector graphic.
 */

export const system = {
  eyebrow: 'SYS.03 :: THE DIFFERENTIATOR',
  headline: 'Three vendors, or [one system.]',
  lede: 'Startups building a product normally need two to three separate specialists — a brand designer, a UI/UX designer, a motion editor. I am the one person who owns and delivers the entire system.',

  oldWay: {
    label: 'The old way',
    caption: 'Three contracts, three interpretations of the brand, and a consistency problem that grows with every new screen and every new campaign.',
    nodes: [
      { title: 'Brand designer', note: 'Owns the logo and the guidelines' },
      { title: 'UI/UX designer', note: 'Reinterprets them in the product' },
      { title: 'Motion editor', note: 'Reinterprets them again on video' },
    ],
    outcome: 'Three outputs that nearly match',
  },

  newWay: {
    label: 'The Hamza Ashraf way',
    caption: 'One person holds the whole picture, so the identity that ships in the product is the identity that shows up in the launch film.',
    chain: ['Brand', 'Product', 'Motion'],
    outcome: 'One consistent output',
  },

  /** Reinforces that the system keeps paying off after launch. */
  footnote:
    'The system does not stop at launch. New features need UI, campaigns need motion, and the brand needs periodic refreshes — all of it stays inside the same system rather than starting over.',
} as const
