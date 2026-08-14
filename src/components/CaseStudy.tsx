import { useEffect } from 'react'
import type { CaseStudy as CaseStudyType } from '../content'
import { caseStudies, caseStudySections, site } from '../content'
import { navigateHome, navigateToCase } from '../hooks/useHashRoute'
import { goToSection } from '../lib/scroll'
import { CrtImage } from './CrtImage'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

/**
 * Full case study, always in the locked order:
 * Business Problem -> The System Built -> The Deliverable -> Result / Value.
 */
export function CaseStudy({ study }: { study: CaseStudyType }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [study.slug])

  const currentIndex = caseStudies.findIndex((item) => item.slug === study.slug)
  const next = caseStudies[(currentIndex + 1) % caseStudies.length]

  return (
    <article className="case" id="top">
      <div className="container container--narrow case__head">
        <button className="case__back" onClick={navigateHome}>
          <span aria-hidden="true">←</span> All work
        </button>

        <Eyebrow>{`CASE :: ${study.slug.replace('case-', '')}`}</Eyebrow>

        <h1 className="headline headline--lg case__title">
          <span className="case__client">{study.client}</span>
          <span className="case__type">{study.projectType}</span>
        </h1>

        <div className="case__facts">
          <span className="tag">{study.year}</span>
          <span className="result-note">{study.resultStat}</span>
          {study.isPlaceholder && site.showPlaceholderTags && (
            <span className="draft-chip">Draft</span>
          )}
        </div>
      </div>

      <div className="container case__cover-wrap">
        <CrtImage src={study.cover} alt={study.coverAlt} aspectRatio="16 / 10" priority />
      </div>

      <div className="container container--narrow case__body">
        {caseStudySections.map((section, index) => (
          <Reveal className="case__section" key={section.key} delayMs={index * 60}>
            <Eyebrow>{section.eyebrow}</Eyebrow>
            <h2 className="case__section-title">{section.label}</h2>
            <p className="body case__section-copy">{study.body[section.key]}</p>
          </Reveal>
        ))}

        <Reveal className="case__section">
          <Eyebrow>CASE :: 05</Eyebrow>
          <h2 className="case__section-title">Delivered</h2>
          <ul className="case__deliverables">
            {study.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="container container--narrow case__footer">
        <button className="case__next" onClick={() => navigateToCase(next.slug)}>
          <span className="case__next-label">Next project</span>
          <span className="case__next-title">
            {next.client} — {next.projectType}
          </span>
        </button>

        <button className="btn btn--primary" onClick={() => goToSection('contact')}>
          Start a project
          <span className="btn__arrow" aria-hidden="true">
            →
          </span>
        </button>
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
