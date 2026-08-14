import { brand } from './brand'

export const footer = {
  /** Fraunces italic, reflective closing line. */
  tagline: brand.tagline,
  positioning: brand.positioning,

  navHeading: 'Navigate',
  socialHeading: 'Elsewhere',
  portfolioHeading: 'Portfolio',

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
