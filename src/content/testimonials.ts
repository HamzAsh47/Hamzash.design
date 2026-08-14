/**
 * Client reviews.
 *
 * OPEN ITEM: these are structural placeholders, not real quotes. The source of
 * truth is `/areas/client-testimonials.md` — only real, verifiable reviews go
 * here. Nothing in this file should be treated as a shippable quote until it
 * has been copied from that file.
 *
 * Client-sensitivity rule when real data goes in: Josef's Wings, Nana's
 * Steakdoner, Mamdouh, Fast & Ferocious and Roll Rice Sushi must never be
 * framed as trusted or ongoing relationships, and must never appear with
 * testimonial language.
 */

export type Testimonial = {
  id: string
  name: string
  company: string
  year: string
  /** Rendered as initials when no photo is supplied. */
  photo?: string
  serviceTags: string[]
  quote: string
  isPlaceholder: boolean
}

export const reviewsIntro = {
  eyebrow: 'SYS.06 :: REVIEWS',
  headline: 'What clients actually [said.]',
  draftLabel: 'Draft',
  placeholderNotice: 'Only real, verifiable client reviews will be published here.',
}

export const testimonials: Testimonial[] = [
  {
    id: 'review-01',
    name: 'Client Name',
    company: 'Company',
    year: '2026',
    serviceTags: ['Brand Identity'],
    quote:
      '[Verified client review placeholder — to be replaced with a real quote from the client testimonials source file.]',
    isPlaceholder: true,
  },
  {
    id: 'review-02',
    name: 'Client Name',
    company: 'Company',
    year: '2026',
    serviceTags: ['UI/UX', 'Brand Identity'],
    quote:
      '[Verified client review placeholder — to be replaced with a real quote from the client testimonials source file.]',
    isPlaceholder: true,
  },
  {
    id: 'review-03',
    name: 'Client Name',
    company: 'Company',
    year: '2026',
    serviceTags: ['Motion Branding'],
    quote:
      '[Verified client review placeholder — to be replaced with a real quote from the client testimonials source file.]',
    isPlaceholder: true,
  },
]

/**
 * Optional scrolling client logo strip. Left empty on purpose — a logo wall is
 * a trust claim, so it only gets populated with companies that are cleared to
 * appear. Add `{ name, logo }` entries to switch the strip on.
 */
export const clientLogos: { name: string; logo?: string }[] = []
