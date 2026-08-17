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

  /* `network` names the platform so the footer can show it alongside the
     handle — "@hamzash.47" on its own says nothing about where it points. */
  handles: {
    linkedin: { network: 'LinkedIn', icon: 'linkedin', label: 'in/hamzash47', href: 'https://linkedin.com/in/hamzash47' },
    instagram: { network: 'Instagram', icon: 'instagram', label: '@hamzash.47', href: 'https://instagram.com/hamzash.47' },
    youtube: { network: 'YouTube', icon: 'youtube', label: '@hamzash.47', href: 'https://youtube.com/@HamzAshArts' },
    x: { network: 'X', icon: 'x', label: '@hamzash_47', href: 'https://x.com/hamzash_47' },
    facebook: { network: 'Facebook', icon: 'facebook', label: '@hamzash.47', href: 'https://facebook.com/hamzash.47' },
  },

  portfolioLinks: [
    { label: 'UI/UX & Game Design', platform: 'Figma', icon: 'figma', href: 'https://figma.com/design/zH429oDMwezoditunlFtDV' },
    { label: 'Video & Motion Graphics', platform: 'YouTube', icon: 'youtube', href: 'https://youtube.com/@HamzAshArts' },
    { label: 'Illustration (2D)', platform: 'ArtStation', icon: 'artstation', href: 'https://artstation.com/ashrafhamza1' },
    { label: 'Branding', platform: 'Behance', icon: 'behance', href: 'https://behance.net/Hamza_Ashraf' },
  ],
} as const

export const site = {
  title: 'Hamza Ashraf — Brand Identity, UI/UX & Motion Branding as One System',
  description:
    'Senior art director building brand identity, product UI/UX and motion branding as one connected design system for funded startups and edtech teams — instead of three separate vendors.',

  /**
   * Absolute origin, needed by canonical tags, Open Graph and the sitemap —
   * all three are meaningless relative. This is the primary domain, so it is
   * the default rather than something the build has to be told: an unset env
   * var ships the right canonical instead of a GitHub Pages URL. Override with
   * VITE_SITE_URL only for a preview deployment on another origin.
   */
  url: (import.meta.env.VITE_SITE_URL ?? 'https://hamzash47.com').replace(/\/+$/, ''),

  /**
   * Both read from the environment first so the inbox can be wired without a
   * code change — set them in `.env.local` for a local run and in the host's
   * environment for a deploy. See `.env.example`.
   *
   * While both are empty the form stays in review-only mode and points the
   * visitor at LinkedIn rather than silently swallowing a lead.
   */
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL ?? '',

  /**
   * POST endpoint for the contact form (Formspree, Basin, Netlify Forms, a
   * Worker). Takes priority over the mailto fallback when set.
   */
  formEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT ?? '',

  /**
   * Portfolio and reviews currently ship with dummy content. While this is
   * true the site renders a small PLACEHOLDER tag on affected cards so nothing
   * fabricated can be mistaken for a real client result. Flip to false once
   * real case studies and verified reviews are in.
   */
  showPlaceholderTags: true,
} as const
