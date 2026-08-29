import brandIdentity from '../assets/pillars/brand-identity.webp'
import motion from '../assets/pillars/motion.webp'
import uiUx from '../assets/pillars/ui-ux.webp'

/**
 * Pillar card imagery, kept out of services.ts on purpose.
 *
 * The Worker imports content/botContext, which imports services — so anything
 * services.ts pulls in has to survive being bundled for Workers, and an image
 * import does not: esbuild has no loader for .webp there. caseStudies.ts is
 * already kept out of the bot's reach for exactly this reason.
 *
 * Keeping the asset imports here means services.ts stays plain data, and only
 * the React component that renders the cards ever loads these.
 */
export const serviceMedia: Record<string, { src: string; alt: string }> = {
  brand: { src: brandIdentity, alt: "Branded takeaway packaging for JOSEF'S Buffalo Wings" },
  uiux: { src: uiUx, alt: 'Mobile screens from the WACA tournament guide' },
  motion: { src: motion, alt: "The animated mascot built for JOSEF'S Buffalo Wings" },
}
