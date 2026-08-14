import heroPortrait from '../assets/images/hero-portrait.webp'
import heroPortrait2x from '../assets/images/hero-portrait@2x.webp'

export const hero = {
  eyebrow: 'SYS.01 :: SENIOR ART DIRECTOR',

  /** Bracketed words render Archivo Black + Crimson. */
  headline: 'Building brand, product, and motion as [one system.]',

  /** Fraunces italic, directly under the headline. */
  subtitle: 'From old-school craft to the AI-driven future.',

  /**
   * Substring of `subtitle` that carries the Electric Cyan accent. Cyan is
   * reserved for AI/system context, so this must stay on the AI phrase — it is
   * not a decorative highlight. Set to '' to remove the accent entirely.
   */
  subtitleAccent: 'AI-driven future',

  intro:
    'Most startups hire a brand designer, a UI/UX designer and a motion editor, then spend the next six months keeping three people in sync. I own all three and deliver them as one connected system.',

  primaryCta: { label: 'See the system', target: 'portfolio' },
  secondaryCta: { label: 'Start a project', target: 'contact' },

  /**
   * The signature portrait: oxblood corduroy overshirt over an oatmeal
   * sweater, with a crimson rim-light tracing the silhouette. Re-encoded from
   * the 6.8 MB source PNG to WebP at two widths (110 KB / 163 KB).
   *
   * The source is 3:4, so the 4:5 frame trims roughly 3.5% from the top and
   * bottom under object-fit: cover. Change `aspectRatio` to '3 / 4' to show the
   * full frame uncropped.
   */
  portrait: {
    src: heroPortrait,
    src2x: heroPortrait2x,
    alt: 'Hamza Ashraf, in an oxblood corduroy overshirt, lit with a crimson rim-light',
    aspectRatio: '4 / 5',
    isPlaceholder: false,
    /**
     * 'selective' is the locked hero treatment — black & white except the
     * crimson rim-light, applied in-filter so an ordinary full-colour
     * photograph drops straight in. Use 'full' to keep the photo in colour.
     */
    treatment: 'selective',
  },

  /** Small system-log readouts sitting on the portrait frame. */
  portraitLabels: { left: 'VIEWPORT :: 01', right: 'SYS.2026' },

  /** Thin looping ticker under the hero — the three pillars, stated up front. */
  ticker: ['BRAND', 'UI/UX', 'MOTION'],
} as const
