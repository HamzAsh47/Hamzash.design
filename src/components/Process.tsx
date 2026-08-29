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

        <ol className="process__list">
          {processSteps.map((step, index) => (
            <Reveal as="li" key={step.number} delayMs={index * 90} className="process__step">
              <span className="process__number" aria-hidden="true">{step.number}</span>
              <div className="process__copy">
                {/* Title and glyph share a row, so the mark lands on the right
                    edge of the step rather than stacking above its number —
                    which on a phone read as a bullet the number then repeated. */}
                <div className="process__heading">
                  <h3 className="process__title">{step.title}</h3>
                  <span className="process__glyph" aria-hidden="true">
                    <Icon name={step.icon} size={24} />
                  </span>
                </div>
                <p className="body">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
