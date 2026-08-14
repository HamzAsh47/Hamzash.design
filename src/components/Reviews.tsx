import { clientLogos, reviewsIntro, site, testimonials } from '../content'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

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
              <figure className="review">
                <blockquote className="review__quote">{item.quote}</blockquote>

                <figcaption className="review__meta">
                  <span className="review__avatar" aria-hidden="true">
                    {item.photo ? <img src={item.photo} alt="" /> : initialsOf(item.name)}
                  </span>
                  <span className="review__id">
                    <span className="review__name">{item.name}</span>
                    <span className="review__company">
                      {item.company} · {item.year}
                    </span>
                  </span>
                </figcaption>

                <div className="review__tags">
                  {item.serviceTags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
