import heroBase from '../assets/images/hero-base.webp'
import heroReveal from '../assets/images/hero-reveal.webp'

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
   * Two purpose-shot layers of the same framing, not one photo graded twice.
   *
   * `src` is the resting state: desaturated, plain tee, no glasses. `revealSrc`
   * is what the cursor uncovers — crimson key light, tinted glasses, the
   * oxblood corduroy. Because the variant is already the hot state, the canvas
   * paints it straight instead of synthesising a grade over it.
   *
   * Both files are exported at an identical 2400x750 so the two layers stay in
   * exact register under the same cover crop. Keep that rule if either is
   * re-shot: a different aspect between them makes the reveal slide off the
   * base image.
   */
  portrait: {
    src: heroBase,
    revealSrc: heroReveal,
    alt: 'Hamza Ashraf in profile against a dark ground',

    /**
     * Which part of the photo to hold as the frame crops it, normalised 0–1.
     * The shot is 3.2:1 and the crop is almost entirely horizontal. Held a
     * little right of centre: far enough that the copy clears him on the
     * left, close enough that a wide window does not open a dead gap between
     * the two.
     *
     * This one value drives the CSS object-position and the reveal canvas
     * crop together — they cannot drift apart.
     */
    focalPoint: { x: 0.56, y: 0.5 },

    /**
     * Narrow screens turn the frame portrait, which swings the crop from
     * mostly-vertical to almost entirely horizontal — the desktop value would
     * fill the phone with the empty half of the shot and slide his face off
     * the right edge. Held further right so the face lands centre-frame.
     */
    focalPointNarrow: { x: 0.71, y: 0.5 },

    isPlaceholder: false,
  },

  /** Small system-log readouts sitting on the portrait frame. */
  portraitLabels: { left: 'VIEWPORT :: 01', right: 'SYS.2026' },

  /** Thin looping ticker under the hero — the three pillars, stated up front. */
  ticker: ['BRAND', 'UI/UX', 'MOTION'],
} as const
