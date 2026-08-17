import { brand } from './brand'

export const footer = {
  /**
   * Fraunces italic, reflective closing line. Deliberately not the hero's
   * tagline verbatim: the same sentence twice on one page reads as a template
   * repeating itself rather than as a brand with something to say. This is the
   * same claim closed off at the end of the visit instead of opened at the
   * start of it — the locked tagline still leads the hero, untouched.
   */
  tagline: 'One person, one system — brand, product and motion in the same hand.',
  positioning: brand.positioning,

  navHeading: 'Navigate',
  socialHeading: 'Follow',
  /**
   * Not "Portfolio". These four are platform profiles — Figma, YouTube,
   * ArtStation, Behance — and two of them (Game Design, 2D Illustration) sit
   * outside the locked three pillars and the AI Video Production tier
   * entirely. Headed "Portfolio" they read as a fifth and sixth service and
   * quietly argue against the positioning the rest of the page makes.
   */
  portfolioHeading: 'More work',

  socials: [
    brand.handles.linkedin,
    brand.handles.instagram,
    brand.handles.youtube,
    brand.handles.x,
    brand.handles.facebook,
  ],

  portfolioLinks: brand.portfolioLinks,

  copyright: `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`,
  builtLine: 'SYS.2026 :: BUILT AS ONE SYSTEM',
} as const
