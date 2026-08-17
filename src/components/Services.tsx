import { services, servicesIntro, type Service } from '../content'
import { useScramble } from '../hooks/useScramble'
import { useSpotlight } from '../hooks/useSpotlight'
import { goToSection } from '../lib/scroll'
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

  return (
    <button
      className={`panel service-card${hot ? ' is-hot' : ''}`}
      onClick={() => goToSection('portfolio')}
      aria-label={`Pillar ${service.index}: ${service.title} — see related work`}
      {...handlers}
    >
      {/* The scrambling glyphs are decoration; the real index is already in the
          button's label, so assistive tech never hears the noise. */}
      <span className="service-card__index" aria-hidden="true">
        {index}
      </span>
      <span className="service-card__title">{service.title}</span>
      <span className="service-card__body">{service.description}</span>
      <span className="service-card__link">
        See the work
        <span className="btn__arrow" aria-hidden="true">
          →
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
              <Reveal as="li" key={service.id} delayMs={index * 90}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
