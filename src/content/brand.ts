/**
 * Locked brand system + global site settings.
 *
 * Headline convention used across all content files:
 *   wrap the highlighted word(s) in square brackets.
 *   "Building brand, product, and motion as [one system]."
 * The <Heading> component renders bracketed words in Archivo Black + Crimson
 * and everything else in Archivo Medium + White. Max 2 highlighted words per
 * heading, prefer 1, ideally landing on the first or last word.
 */

export const brand = {
  name: 'Hamza Ashraf',
  tagline: 'From old-school craft to the AI-driven future.',
  positioning: 'Senior Art Director | UI/UX & Product Strategist | Motion & Brand',

  colors: {
    obsidian: '#0D1526',
    crimson: '#C81E3A',
    gunmetal: '#4A4E58',
    cyan: '#22D3EE',
  },

  handles: {
    instagram: { label: '@hamzash.47', href: 'https://instagram.com/hamzash.47' },
    youtube: { label: '@hamzash.47', href: 'https://youtube.com/@HamzAshArts' },
    facebook: { label: '@hamzash.47', href: 'https://facebook.com/hamzash.47' },
    x: { label: '@hamzash_47', href: 'https://x.com/hamzash_47' },
    linkedin: { label: 'in/hamzash47', href: 'https://linkedin.com/in/hamzash47' },
  },

  portfolioLinks: [
    { label: 'UI/UX & Game Design', platform: 'Figma', href: 'https://figma.com/design/zH429oDMwezoditunlFtDV' },
    { label: 'Video & Motion Graphics', platform: 'YouTube', href: 'https://youtube.com/@HamzAshArts' },
    { label: 'Illustration (2D)', platform: 'ArtStation', href: 'https://artstation.com/ashrafhamza1' },
    { label: 'Branding', platform: 'Behance', href: 'https://behance.net/Hamza_Ashraf' },
  ],
} as const

export const site = {
  title: 'Hamza Ashraf — Senior Art Director, UI/UX & Motion',
  description:
    'Brand identity, product UI/UX and motion built as one connected system by a single senior designer — instead of three separate vendors.',

  /**
   * TODO (open item): set the real business inbox before launch.
   * While this is empty the contact form stays in review-only mode and tells
   * the visitor to reach out on LinkedIn instead of silently losing leads.
   */
  contactEmail: '',

  /**
   * Optional POST endpoint for the contact form (Formspree, Basin, Netlify
   * Forms, a Worker, etc). When set it takes priority over the mailto
   * fallback. Leave empty to use mailto with `contactEmail`.
   */
  formEndpoint: '',

  /**
   * Portfolio and reviews currently ship with dummy content. While this is
   * true the site renders a small PLACEHOLDER tag on affected cards so nothing
   * fabricated can be mistaken for a real client result. Flip to false once
   * real case studies and verified reviews are in.
   */
  showPlaceholderTags: true,
} as const
