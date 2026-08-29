import atWork from '../assets/images/at-work.webp'
import { processIntro, processSteps } from '../content'
import { Eyebrow } from './Eyebrow'
import { Icon } from './Icon'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

export function Process() {
  return (
    <section className="section section--hairline section--tint process" id="process">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow>{processIntro.eyebrow}</Eyebrow>
          <Heading text={processIntro.headline} className="headline--lg" />
          <p className="section__lede">{processIntro.lede}</p>
        </Reveal>

        <div className="process__body">
          <ol className="process__list">
            {processSteps.map((step, index) => (
              <Reveal as="li" key={step.number} delayMs={index * 90} className="process__step">
                <span className="process__marker" aria-hidden="true">
                  <span className="process__glyph">
                    <Icon name={step.icon} size={20} />
                  </span>
                  <span className="process__number">{step.number}</span>
                </span>
                <div className="process__copy">
                  <h3 className="process__title">{step.title}</h3>
                  <p className="body">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* Sticky beside the steps: the process is one person's, and the
              page should show whose. Sits out of the flow entirely below the
              breakpoint rather than stacking as a second thing to scroll. */}
          <Reveal className="process__figure" delayMs={120}>
            <img
              src={atWork}
              alt="Hamza Ashraf at his desk"
              width={1100}
              height={1467}
              loading="lazy"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
