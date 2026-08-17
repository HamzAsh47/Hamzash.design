/**
 * Client reviews.
 *
 * Real, verified LinkedIn service reviews, transcribed verbatim from the
 * originals — including their own phrasing and grammar. Tidying a client's
 * wording is rewriting their testimonial, so nothing here has been smoothed
 * out. Service tags are the categories the reviews were actually left under,
 * not the site's three pillars: what someone bought is a fact, and mapping it
 * onto the positioning would be editing the record to fit the pitch.
 *
 * Source URLs are the public posts each review appears in, with the share
 * tracking stripped. The originals carried `utm_*` and an `rcm=` parameter,
 * and that last one encodes the sharing member's own id — there is no reason
 * to publish it on every card for the life of the site.
 *
 * Photos are the reviewers' own profile pictures, supplied for this use.
 */

import photoSantamaria from '../assets/images/review-santamaria.webp'
import photoSchoellkopf from '../assets/images/review-schoellkopf.webp'
import photoShah from '../assets/images/review-shah.webp'

export type Testimonial = {
  id: string
  name: string
  company: string
  year: string
  /** Rendered as initials when no photo is supplied. */
  photo?: string
  serviceTags: string[]
  quote: string
  /**
   * Public LinkedIn post the review appears in. A testimonial a reader can go
   * and check is worth more than one they have to take on trust — and this
   * page's whole claim is that the reviews on it are real.
   */
  sourceUrl?: string
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
    id: 'review-santamaria',
    name: 'Dr. Marc Anthony Santamaria, Esq, PhD',
    company: 'Santamaria Law Firm',
    photo: photoSantamaria,
    year: '2026',
    serviceTags: ['Video Editing'],
    sourceUrl:
      'https://www.linkedin.com/posts/hamzash47_videostrategy-motiongraphics-artdirection-ugcPost-7487929350504341504-Ab2b/',
    quote:
      "Hamza is an excellent video editor as he's helped my law firm with various videos with high quality. He's easy to work with and communicate quickly. He accepts feedback humbly and implements our suggestions rapidly. He understands our points without having to explain in too much detail. Thus, he's edited several of our videos and that's why I highly recommend him!",
    isPlaceholder: false,
  },
  {
    id: 'review-schoellkopf',
    name: 'Brian Schoellkopf',
    company: 'EZ Sports Apparel',
    photo: photoSchoellkopf,
    year: '2026',
    serviceTags: ['Packaging Design'],
    sourceUrl:
      'https://www.linkedin.com/posts/hamzash47_packagingdesign-designsystems-branddesign-ugcPost-7488347576308760576-B7hD/',
    quote:
      'If you are looking for graphic design work Hamza is reliable resource that can help you variety of graphics and designs... highly recommended!',
    isPlaceholder: false,
  },
  {
    id: 'review-shah',
    name: 'Mehul Shah',
    company: 'Uplift K12 / GoTeach.ai',
    photo: photoShah,
    year: '2026',
    serviceTags: ['Brand Design'],
    sourceUrl:
      'https://www.linkedin.com/posts/hamzash47_thank-you-mehul-shah-for-the-strong-recommendation-ugcPost-7485497650604040192-nwBQ/',
    quote: 'Hamza has incredible talent with design. I highly recommend his work!',
    isPlaceholder: false,
  },
]

/**
 * Optional scrolling client logo strip. Left empty on purpose — a logo wall is
 * a trust claim, so it only gets populated with companies that are cleared to
 * appear. Add `{ name, logo }` entries to switch the strip on.
 */
export const clientLogos: { name: string; logo?: string }[] = []
