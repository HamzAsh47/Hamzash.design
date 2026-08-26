import { useMemo, useState } from 'react'
import type { Pillar } from '../content'
import { caseStudies, pillarFilters, portfolioIntro, site } from '../content'
import { navigateToCase } from '../hooks/useHashRoute'
import { useSpotlight } from '../hooks/useSpotlight'
import { CrtImage } from './CrtImage'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

type Study = (typeof caseStudies)[number]

/** Shares the `.panel` surface with the pillar cards and the pricing tiers. */
function WorkCard({ item, index }: { item: Study; index: number }) {
  const { hot, handlers } = useSpotlight()

  return (
    <button
      className={`panel work-card__hit${hot ? ' is-hot' : ''}`}
      onClick={() => navigateToCase(item.slug)}
      aria-label={`Open case study: ${item.client} — ${item.projectType}`}
      {...handlers}
    >
      {/* A frame around the cover so the image can move inside a fixed crop.
          Scaling the image itself without one just resizes the card. */}
      <span className="work-card__frame">
        {/* CRT treatment applies to the cover image only, never the card chrome. */}
        <CrtImage
          src={item.cover}
          alt={item.coverAlt}
          aspectRatio="16 / 10"
          className="work-card__cover"
        />
        <span className="work-card__scrim" aria-hidden="true" />
        <span className="work-card__index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="work-card__year" aria-hidden="true">
          {item.year}
        </span>
      </span>

      <span className="work-card__body">
        <span className="work-card__client">{item.client}</span>
        <span className="work-card__type">{item.projectType}</span>

        <span className="work-card__foot">
          <span className="result-note">{item.resultStat}</span>
          <span className="work-card__link">
            Read case study
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}

export function Portfolio() {
  const [filter, setFilter] = useState<'all' | Pillar>('all')

  const visible = useMemo(
    () => (filter === 'all' ? caseStudies : caseStudies.filter((item) => item.pillars.includes(filter))),
    [filter],
  )

  const hasPlaceholders = caseStudies.some((item) => item.isPlaceholder)

  return (
    <section className="section section--hairline section--mark-rule portfolio" id="portfolio">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow>{portfolioIntro.eyebrow}</Eyebrow>
          {/* The one place this is switched on for now. Adding it elsewhere is
              a single prop — worth looking at live before it spreads. */}
          <Heading text={portfolioIntro.headline} className="headline--lg" scrollLinked />
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
            <Reveal
              as="li"
              key={item.slug}
              delayMs={index * 80}
              variant="settle"
              index={index}
              className="portfolio__cell"
            >
              <article className="work-card">
                <WorkCard item={item} index={index} />
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
