import { useMemo, useState } from 'react'
import type { Pillar } from '../content'
import { caseStudies, pillarFilters, portfolioIntro, site } from '../content'
import { navigateToCase } from '../hooks/useHashRoute'
import { CrtImage } from './CrtImage'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

export function Portfolio() {
  const [filter, setFilter] = useState<'all' | Pillar>('all')

  const visible = useMemo(
    () => (filter === 'all' ? caseStudies : caseStudies.filter((item) => item.pillars.includes(filter))),
    [filter],
  )

  const hasPlaceholders = caseStudies.some((item) => item.isPlaceholder)

  return (
    <section className="section section--hairline portfolio" id="portfolio">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow>{portfolioIntro.eyebrow}</Eyebrow>
          <Heading text={portfolioIntro.headline} className="headline--lg" />
          <p className="section__lede">{portfolioIntro.lede}</p>

          {hasPlaceholders && site.showPlaceholderTags && (
            <p className="section__draft">
              <span className="draft-chip">{portfolioIntro.draftLabel}</span>
              <span className="section__draft-copy">{portfolioIntro.placeholderNotice}</span>
            </p>
          )}
        </Reveal>

        <Reveal className="portfolio__filters" delayMs={80}>
          <div role="tablist" aria-label="Filter work by pillar" className="filters">
            {pillarFilters.map((option) => (
              <button
                key={option.value}
                role="tab"
                aria-selected={filter === option.value}
                className={`filters__btn${filter === option.value ? ' is-active' : ''}`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <span className="filters__count">
            {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          </span>
        </Reveal>

        <ul className="portfolio__grid">
          {visible.map((item, index) => (
            <Reveal as="li" key={item.slug} delayMs={index * 80} className="portfolio__cell">
              <article className="work-card">
                <button
                  className="work-card__hit"
                  onClick={() => navigateToCase(item.slug)}
                  aria-label={`Open case study: ${item.client} — ${item.projectType}`}
                >
                  {/* CRT treatment applies to the cover image only, never the card chrome. */}
                  <CrtImage
                    src={item.cover}
                    alt={item.coverAlt}
                    aspectRatio="16 / 10"
                    className="work-card__cover"
                  />

                  <div className="work-card__body">
                    <div className="work-card__meta">
                      <span className="work-card__client">{item.client}</span>
                      <span className="work-card__year">{item.year}</span>
                    </div>
                    <span className="work-card__type">{item.projectType}</span>

                    <div className="work-card__tags">
                      <span className="result-note">{item.resultStat}</span>
                    </div>

                    <span className="work-card__link">
                      Read case study
                      <span className="btn__arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </div>
                </button>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
