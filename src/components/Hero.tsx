import { hero } from '../content'
import { goToSection } from '../lib/scroll'
import { CrtImage } from './CrtImage'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Ticker } from './Ticker'

/**
 * Splits the subtitle around the Electric Cyan phrase so the accent lands on
 * the AI reference only. Returns the whole string unaccented when the phrase
 * is empty or not found, so a copy edit can never silently drop the line.
 */
function splitOnAccent(text: string, accent: string) {
  const at = accent ? text.indexOf(accent) : -1
  if (at === -1) return [{ text, accent: false }]

  return [
    { text: text.slice(0, at), accent: false },
    { text: accent, accent: true },
    { text: text.slice(at + accent.length), accent: false },
  ].filter((part) => part.text.length > 0)
}

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
            {splitOnAccent(hero.subtitle, hero.subtitleAccent).map((part, i) =>
              part.accent ? (
                <span className="hero__subtitle-ai" key={i}>
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
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
            src2x={hero.portrait.src2x}
            alt={hero.portrait.alt}
            aspectRatio={hero.portrait.aspectRatio}
            labels={{ left: hero.portraitLabels.left, right: hero.portraitLabels.right }}
            showRec
            priority
            treatment={hero.portrait.treatment}
          />
        </div>
      </div>

      <Ticker items={hero.ticker} />
    </section>
  )
}
