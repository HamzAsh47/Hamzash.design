import { hero } from '../content'
import { goToSection } from '../lib/scroll'
import { CrtImage } from './CrtImage'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Ticker } from './Ticker'

/**
 * The one orchestrated entrance on the site. Everything downstream uses the
 * quieter scroll reveal instead, so the sequence stays a single moment rather
 * than a page full of competing effects.
 */
export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__copy">
          <div className="hero__eyebrow hero__stage" style={{ '--stage': 0 } as React.CSSProperties}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </div>

          <Heading text={hero.headline} as="h1" className="headline--hero" animate delayMs={180} />

          <p
            className="lede hero__subtitle hero__stage"
            style={{ '--stage': 7 } as React.CSSProperties}
          >
            {hero.subtitle}
          </p>

          <p className="body hero__intro hero__stage" style={{ '--stage': 8 } as React.CSSProperties}>
            {hero.intro}
          </p>

          <div className="hero__ctas hero__stage" style={{ '--stage': 9 } as React.CSSProperties}>
            <button className="btn btn--primary" onClick={() => goToSection(hero.primaryCta.target)}>
              {hero.primaryCta.label}
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </button>
            <button className="btn btn--ghost" onClick={() => goToSection(hero.secondaryCta.target)}>
              {hero.secondaryCta.label}
            </button>
          </div>
        </div>

        <div className="hero__media hero__stage" style={{ '--stage': 4 } as React.CSSProperties}>
          <CrtImage
            src={hero.portrait.src}
            alt={hero.portrait.alt}
            aspectRatio={hero.portrait.aspectRatio}
            labels={{ left: hero.portraitLabels.left, right: hero.portraitLabels.right }}
            showRec
            priority
          />
          {hero.portrait.isPlaceholder && (
            <p className="hero__media-note">
              Placeholder crop — the signature portrait drops straight into this frame with the
              CRT treatment already applied.
            </p>
          )}
        </div>
      </div>

      <Ticker items={hero.ticker} />
    </section>
  )
}
