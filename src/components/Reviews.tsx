import { clientLogos, reviewsIntro, site, testimonials, type Testimonial } from '../content'
import { Eyebrow } from './Eyebrow'
import { Icon } from './Icon'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

/**
 * Drawn as SVG rather than set as the ★ glyph.
 *
 * The character renders at whatever weight and shape the fallback font
 * happens to have, and at 0.9rem in a serif stack it came out as five small
 * smudges nobody could read as stars. A path is the same shape at every size
 * on every machine, and it can be sized properly.
 */
function Rating({ value = 5 }: { value?: number }) {
  return (
    <span className="rating">
      <span className="rating__stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            className={`rating__star${i < value ? ' is-on' : ''}`}
            key={i}
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="currentColor"
          >
            <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44 6.19 20.5l1.11-6.47L2.6 9.45l6.5-.95z" />
          </svg>
        ))}
      </span>
      <span className="rating__value" aria-hidden="true">
        {value.toFixed(1)}
      </span>
      <span className="visually-hidden">Rated {value} out of 5 on LinkedIn</span>
    </span>
  )
}

/**
 * Attribution leads, the quote follows.
 *
 * A testimonial's job is to lend someone else's credibility, and that only
 * works once the reader knows whose it is — leading with an anonymous
 * paragraph asks them to invest in the words before they have a reason to.
 * Name, rating and role first, then what they said.
 *
 * No box either. Three bordered cards of very different lengths left two of
 * them mostly empty, and the frames drew more attention than the words inside
 * them. The quote carries a crimson rule down its left instead — the same
 * device the system section uses to mark a block — so each review is defined
 * by where it starts, not by a rectangle around it.
 */
function Review({ item }: { item: Testimonial }) {
  return (
    <figure className="review">
      <div className="review__head">
        <span className="review__avatar" aria-hidden="true">
          {item.photo ? (
            /* Intrinsic size declared so the avatar reserves its box before it
               loads — three of these arriving late is three layout shifts. */
            <img src={item.photo} alt="" width={96} height={96} loading="lazy" decoding="async" />
          ) : (
            initialsOf(item.name)
          )}
        </span>
        <span className="review__id">
          <span className="review__name">{item.name}</span>
          <span className="review__company">
            {item.company} · {item.year}
          </span>
        </span>
      </div>

      <Rating />

      <blockquote className="review__quote">{item.quote}</blockquote>

      <figcaption className="review__foot">
        <span className="review__tags">
          {item.serviceTags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </span>

        {/* The claim on this section is that the reviews are real, so each one
            carries a way to go and check. Named and iconed rather than a bare
            "Verify ↗": the destination is the whole point of the link. */}
        {item.sourceUrl && (
          <a
            className="review__verify"
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="linkedin" />
            Read on LinkedIn
            <span className="visually-hidden">
              — {item.name}&rsquo;s review, opens in a new tab
            </span>
          </a>
        )}
      </figcaption>
    </figure>
  )
}

export function Reviews() {
  const hasPlaceholders = testimonials.some((item) => item.isPlaceholder)

  return (
    <section className="section section--hairline reviews" id="reviews">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow>{reviewsIntro.eyebrow}</Eyebrow>
          <Heading text={reviewsIntro.headline} className="headline--lg" />
          {hasPlaceholders && site.showPlaceholderTags && (
            <p className="section__draft">
              <span className="draft-chip">{reviewsIntro.draftLabel}</span>
              <span className="section__draft-copy">{reviewsIntro.placeholderNotice}</span>
            </p>
          )}
        </Reveal>

        {/* Logo strip only renders once real, cleared client logos are added. */}
        {clientLogos.length > 0 && (
          <Reveal className="logo-strip" delayMs={60}>
            <div className="logo-strip__track">
              {clientLogos.map((client) => (
                <span className="logo-strip__item" key={client.name}>
                  {client.logo ? <img src={client.logo} alt={client.name} /> : client.name}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        <ul className="reviews__grid">
          {testimonials.map((item, index) => (
            <Reveal as="li" key={item.id} delayMs={index * 80}>
              <Review item={item} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
