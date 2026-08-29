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
      </div>
    </section>
  )
}
