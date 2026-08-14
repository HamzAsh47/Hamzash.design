import heroPortrait from '../assets/images/portrait-placeholder.svg'

export const hero = {
  eyebrow: 'SYS.01 :: SENIOR ART DIRECTOR',

  /** Bracketed words render Archivo Black + Crimson. */
  headline: 'Building brand, product, and motion as [one system.]',

  /** Fraunces italic, directly under the headline. */
  subtitle: 'From old-school craft to the AI-driven future.',

  intro:
    'Most startups hire a brand designer, a UI/UX designer and a motion editor, then spend the next six months keeping three people in sync. I own all three and deliver them as one connected system.',

  primaryCta: { label: 'See the system', target: 'portfolio' },
  secondaryCta: { label: 'Start a project', target: 'contact' },

  /**
   * Placeholder portrait at the exact 4:5 crop the real signature shot will
   * use — oxblood corduroy overshirt, top-down angle, selective crimson
   * rim-light. Swapping in the real photograph is a one-line import change;
   * the CRT treatment is already applied to this placeholder so the effect can
   * be tuned before the photography arrives.
   */
  portrait: {
    src: heroPortrait,
    alt: 'Placeholder for the signature portrait of Hamza Ashraf',
    aspectRatio: '4 / 5',
    isPlaceholder: true,
  },

  /** Small system-log readouts sitting on the portrait frame. */
  portraitLabels: { left: 'VIEWPORT :: 01', right: 'SYS.2026' },

  /** Thin looping ticker under the hero — the three pillars, stated up front. */
  ticker: ['BRAND', 'UI/UX', 'MOTION'],
} as const
