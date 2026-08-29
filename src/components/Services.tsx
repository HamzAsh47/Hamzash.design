import { services, servicesIntro, type Service } from '../content'
import { useScramble } from '../hooks/useScramble'
import { useSpotlight } from '../hooks/useSpotlight'
import { goToSection } from '../lib/scroll'
import { Icon } from './Icon'
import { serviceMedia } from '../content/serviceMedia'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

/**
 * One tier. The card surface and its spotlight come from `.panel`, shared with
 * the work cards and the pricing tiers; what belongs to this card alone is the
 * index scrambling like a readout resolving, and the body stepping back so the
 * CTA can step forward.
 */
function ServiceCard({ service }: { service: Service }) {
  const { hot, handlers } = useSpotlight()
  const index = useScramble(service.index, hot)

  const media = serviceMedia[service.id]

  return (
    <button
      className={`panel service-card${hot ? ' is-hot' : ''}`}
      onClick={() => goToSection('portfolio')}
      aria-label={`Pillar ${service.index}: ${service.title} — see related work`}
      {...handlers}
    >
      {/* The scrambling glyphs are decoration; the real index is already in the
          button's label, so assistive tech never hears the noise. */}
      {/* Real work from this pillar rather than a picture of the idea of it.
          Desaturated at rest so three different client palettes in a row read
          as one system, full colour on hover. */}
      <span className="service-card__media">
        <img src={media.src} alt={media.alt} loading="lazy" width={760} height={428} />
      </span>
      {/* Index left, glyph pushed to the right corner of the copy — the top
          of the card is the photograph, and nothing goes over that. */}
      <span className="service-card__meta">
        <span className="service-card__index" aria-hidden="true">
          {index}
        </span>
        <span className="service-card__glyph" aria-hidden="true">
          <Icon name={service.icon} size={22} />
        </span>
      </span>
      <span className="service-card__title">{service.title}</span>
      <span className="service-card__body">{service.description}</span>
      <span className="service-card__link">
        See the work
        <span className="btn__arrow" aria-hidden="true">
          <Icon name="arrow-right" size={14} />
        </span>
      </span>
    </button>
  )
}

/** Three-card pillar preview. Each card drops into the portfolio filter below. */
export function Services() {
  return (
    <section className="services-slide" id="services">
      <div className="container services-slide__inner">
        <div className="services">
          <Reveal className="services__head">
            <Eyebrow>{servicesIntro.eyebrow}</Eyebrow>
          </Reveal>

          <ul className="services__grid">
            {services.map((service, index) => (
              <Reveal as="li" key={service.id} delayMs={index * 90} variant="settle" index={index}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
