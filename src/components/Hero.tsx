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
 *
 * The portrait is the ground here, not an inset panel: it fills the frame
 * edge to edge, with an obsidian scrim carrying the copy over it. The frame
 * stops short of the ticker so the CRT readouts never collide with it.
 */
export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__frame">
        <div className="hero__media">
          <CrtImage
            src={hero.portrait.src}
            alt={hero.portrait.alt}
            priority
            reveal
            revealSrc={hero.portrait.revealSrc}
            focalPoint={hero.portrait.focalPoint}
            focalPointNarrow={hero.portrait.focalPointNarrow}
            cutout
          />
        </div>

        <span className="hero__scrim" aria-hidden="true" />

        {/* Oversized, near-transparent marquee riding the background — the
            pillars stated as texture rather than as a strip of chrome. Placed
            after the scrim so it is not dimmed by the same gradient that
            darkens the photograph, and still under the copy. */}
        <Ticker items={hero.ticker} className="ticker--watermark" />

        {/* The CRT readouts ride above the scrim rather than inside the frame:
            the figure is its own stacking context, so labels left in there get
            washed out by the very gradient that makes the copy readable. */}
        <div className="crt__label hero__readout" aria-hidden="true">
          <span>{hero.portraitLabels.left}</span>
          <span className="crt__rec">{hero.portraitLabels.right}</span>
        </div>

        <div className="container hero__inner">
          <div className="hero__copy">
            <div
              className="hero__eyebrow hero__stage"
              style={{ '--stage': 0 } as React.CSSProperties}
            >
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </div>

            <Heading text={hero.headline} as="h1" className="headline--hero" animate delayMs={180} />

            <p
              className="lede hero__subtitle hero__stage"
              style={{ '--stage': 7 } as React.CSSProperties}
            >
              {hero.subtitle}
            </p>

            <p
              className="body hero__intro hero__stage"
              style={{ '--stage': 8 } as React.CSSProperties}
            >
              {hero.intro}
            </p>

            {/* TODO (backlog): consider referrer-based dynamic hero CTA —
                swap primary/secondary emphasis for warm traffic
                (LinkedIn/direct) vs cold/organic traffic. Needs traffic-source
                detection logic first. Not in scope for the current fix pass. */}
            <div className="hero__ctas hero__stage" style={{ '--stage': 9 } as React.CSSProperties}>
              <button
                className="btn btn--primary"
                onClick={() => goToSection(hero.primaryCta.target)}
              >
                {hero.primaryCta.label}
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => goToSection(hero.secondaryCta.target)}
              >
                {hero.secondaryCta.label}
              </button>
            </div>

            {hero.portrait.isPlaceholder && (
              <p
                className="hero__media-note hero__stage"
                style={{ '--stage': 10 } as React.CSSProperties}
              >
                Placeholder crop — the signature portrait drops straight into this frame with the
                CRT treatment already applied.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
