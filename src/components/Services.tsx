import { services, servicesIntro } from '../content'
import { goToSection } from '../lib/scroll'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

/** Three-card pillar preview. Each card drops into the portfolio filter below. */
export function Services() {
  return (
    <section className="section section--hairline services" id="services">
      <div className="container">
        <Reveal className="services__head">
          <Eyebrow>{servicesIntro.eyebrow}</Eyebrow>
        </Reveal>

        <ul className="services__grid">
          {services.map((service, index) => (
            <Reveal as="li" key={service.id} delayMs={index * 90}>
              <button
                className="service-card"
                onClick={() => goToSection('portfolio')}
                aria-label={`${service.title} — see related work`}
              >
                <span className="service-card__index">{service.index}</span>
                <span className="service-card__title">{service.title}</span>
                <span className="service-card__body">{service.description}</span>
                <span className="service-card__link">
                  See the work
                  <span className="btn__arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
