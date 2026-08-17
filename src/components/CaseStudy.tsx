import { useEffect } from 'react'
import type { CaseStudy as CaseStudyType } from '../content'
import { caseStudies, caseStudySections, pillarFilters, site } from '../content'
import { navigateHome, navigateToCase } from '../hooks/useHashRoute'
import { useSpotlight } from '../hooks/useSpotlight'
import { goToSection } from '../lib/scroll'
import { CrtImage } from './CrtImage'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

const pillarLabel = (value: string) =>
  pillarFilters.find((option) => option.value === value)?.label ?? value

/**
 * Full case study, always in the locked order:
 * Business Problem -> The System Built -> The Deliverable -> Result / Value.
 */
export function CaseStudy({ study }: { study: CaseStudyType }) {
  const { hot, handlers } = useSpotlight()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [study.slug])

  const currentIndex = caseStudies.findIndex((item) => item.slug === study.slug)
  const next = caseStudies[(currentIndex + 1) % caseStudies.length]

  /* Derived from the entry, not authored: the year it ran, the pillars it was
     filed under, and how many things were handed over. */
  const facts = [
    { label: 'Year', value: study.year },
    { label: 'Discipline', value: study.pillars.map(pillarLabel).join(' · ') },
    { label: 'Scope', value: `${study.deliverables.length} deliverables` },
  ]

  return (
    <article className="case" id="top">
      {/* One container width for the whole page. The head used to be 860px
          while the cover under it ran to 1240px, so the title started at a
          left edge nothing else shared. */}
      <div className="container case__head">
        <button className="case__back" onClick={navigateHome}>
          <span aria-hidden="true">←</span> All work
        </button>

        <Eyebrow>{`CASE :: ${study.slug.replace('case-', '')}`}</Eyebrow>

        <h1 className="headline headline--lg case__title">
          <span className="case__client">{study.client}</span>
          <span className="case__type">{study.projectType}</span>
        </h1>

        {/* The same band the pricing dialog uses for its headline numbers, so
            "what is this at a glance" looks the same everywhere on the site. */}
        <dl className="case__facts">
          {facts.map((fact) => (
            <div className="case-fact" key={fact.label}>
              <dd className="case-fact__value">{fact.value}</dd>
              <dt className="case-fact__label">{fact.label}</dt>
            </div>
          ))}
        </dl>

        <p className="case__note">
          <span className="result-note">{study.resultStat}</span>
          {study.isPlaceholder && site.showPlaceholderTags && (
            <span className="draft-chip">Draft</span>
          )}
        </p>
      </div>

      <div className="container case__cover-wrap">
        <CrtImage src={study.cover} alt={study.coverAlt} aspectRatio="16 / 10" priority />
      </div>

      <div className="container case__body">
        {caseStudySections.map((section, index) => (
          <Reveal className="case__section" key={section.key} delayMs={index * 60}>
            {/* Heading in a left rail, copy in a measured column beside it.
                Stacked, four of these in a row read as a memo. */}
            <div className="case__section-head">
              <Eyebrow>{section.eyebrow}</Eyebrow>
              <h2 className="case__section-title">{section.label}</h2>
            </div>
            <p className="body case__section-copy">{study.body[section.key]}</p>
          </Reveal>
        ))}

        <Reveal className="case__section">
          <div className="case__section-head">
            <Eyebrow>CASE :: 05</Eyebrow>
            <h2 className="case__section-title">Delivered</h2>
          </div>

          <ol className="case__deliverables">
            {study.deliverables.map((item, index) => (
              <li key={item}>
                <span className="case__deliverable-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <div className="container case__footer">
        {/* The next project gets its cover. A text link at the bottom of a case
            study is the one place a portfolio can least afford to stop showing
            the work. */}
        <button
          className={`panel case__next${hot ? ' is-hot' : ''}`}
          onClick={() => navigateToCase(next.slug)}
          {...handlers}
        >
          <span className="case__next-thumb">
            <img src={next.cover} alt="" width={320} height={200} loading="lazy" />
          </span>

          <span className="case__next-copy">
            <span className="case__next-label">Next project</span>
            <span className="case__next-title">{next.client}</span>
            <span className="case__next-type">{next.projectType}</span>
          </span>

          <span className="case__next-arrow" aria-hidden="true">
            →
          </span>
        </button>

        <div className="case__cta">
          <p className="case__cta-copy">Have a system that needs building?</p>
          <button className="btn btn--primary" onClick={() => goToSection('contact')}>
            Start a project
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}

/** Shown when a hash points at a slug that no longer exists. */
export function CaseStudyNotFound() {
  return (
    <div className="container container--narrow case__missing">
      <Eyebrow>SYS :: 404</Eyebrow>
      <h1 className="headline headline--lg">That case study is not here.</h1>
      <button className="btn btn--primary" onClick={navigateHome}>
        Back to all work
      </button>
    </div>
  )
}
