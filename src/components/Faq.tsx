import { useState } from 'react'
import { faq, faqIntro } from '../content'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="section section--hairline faq" id="faq">
      <div className="container faq__inner">
        <Reveal className="faq__head">
          <Eyebrow>{faqIntro.eyebrow}</Eyebrow>
          <Heading text={faqIntro.headline} className="headline--lg" />
        </Reveal>

        <Reveal className="faq__list" delayMs={80}>
          {faq.map((item, index) => {
            const isOpen = open === index
            return (
              <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={item.question}>
                <h3 className="faq__question-wrap">
                  <button
                    className="faq__question"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq__sign" aria-hidden="true" />
                  </button>
                </h3>

                <div
                  className="faq__answer"
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  hidden={!isOpen}
                >
                  <p className="body">{item.answer}</p>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
