import { useEffect } from 'react'
import type { CaseFigureSlot, CaseStudy as CaseStudyType } from '../content'
import { caseStudies, caseStudySections, figuresFor, pillarFilters, site } from '../content'
import { navigateHome, navigateToCase } from '../hooks/useHashRoute'
import { useSpotlight } from '../hooks/useSpotlight'
import { goToSection } from '../lib/scroll'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

const pillarLabel = (value: string) =>
  pillarFilters.find((option) => option.value === value)?.label ?? value

/**
 * Renders whatever images exist for one slot, or nothing at all.
 *
 * A slot names a file that may not have been supplied yet, so the empty case
 * is the normal case, not an error — the section simply reads as text until the
 * photograph arrives. Several files sharing a slot stack in variant order under
 * the paragraph they illustrate, which is where they explain something; a
 * gallery bolted to the end of the page explains nothing.
 */
function CaseFigures({ study, figure }: { study: string; figure: CaseFigureSlot }) {
  const sources = figuresFor(study, figure.slot)
  if (sources.length === 0) return null

  return (
    <>
      {sources.map((item, index) => {
        /* One alt string across a stacked set would have a screen reader read
           the same sentence three times. */
        const alt =
          sources.length > 1 ? `${figure.alt} (${index + 1} of ${sources.length})` : figure.alt
        /* A caption parsed out of the filename beats the authored one — it is
           the thing that distinguishes this shot from its siblings. */
        const caption = item.caption ?? figure.caption

        return (
          <figure
            className={`case__figure${figure.wide ? ' case__figure--wide' : ''}`}
            key={item.src}
          >
            {item.kind === 'video' ? (
              /* Muted, looping and inline so it behaves like the animated
                 stills beside it rather than like a video player. */
              <video
                className="case__media"
                src={item.src}
                aria-label={alt}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              /* A plain image, deliberately, and at its own proportions.
                 Two things were wrong before.

                 It went through CrtImage, which is the photography treatment —
                 scanlines, vignette, RGB split. These are PDF page exports and
                 UI screenshots: text and interface, exactly what that treatment
                 is scoped never to touch, and running it over small type makes
                 the work harder to read rather than more atmospheric.

                 And every one was forced into a 16/10 box with object-fit:
                 cover. The real range here is 1.00 to 2.56 — square logo marks
                 through to wide document spreads — so thirteen of twenty-one
                 were having a third of themselves cropped away. Intrinsic width
                 and height let the browser hold each one's own shape and still
                 reserve the box before it loads. */
              <img
                className="case__media"
                src={item.src}
                alt={alt}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
              />
            )}
            {caption && <figcaption className="case__figure-caption">{caption}</figcaption>}
          </figure>
        )
      })}
    </>
  )
}

export function CaseStudy({ study }: { study: CaseStudyType }) {
  const { hot, handlers } = useSpotlight()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [study.slug])

  /* The cover is resolved through the same index as the figures, so it carries
     intrinsic dimensions too. */
  const coverSize = [
    ...figuresFor(study.slug, 'thumbnail'),
    ...figuresFor(study.slug, 'thumb'),
    ...figuresFor(study.slug, 'thum'),
    ...figuresFor(study.slug, 'hero'),
  ].find((item) => item.src === study.cover)

  const currentIndex = caseStudies.findIndex((item) => item.slug === study.slug)
  const next = caseStudies[(currentIndex + 1) % caseStudies.length]

  /* Derived from the entry, not authored: the year it ran, the pillars it was
     filed under, and how many things were handed over. */
  const facts = [
    /* Dropped rather than filled with a guess when the dates are not
       established — an invented year on a portfolio is a claim, not a gap. */
    ...(study.year ? [{ label: 'Year', value: study.year }] : []),
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

        {/* The published gallery, where there is one. A portfolio claim the
            reader can go and verify is worth more than one they cannot. */}
        {study.externalUrl && (
          <a
            className="case__external"
            href={study.externalUrl}
            target="_blank"
            rel="noreferrer"
          >
            {study.externalLabel ?? 'View the full gallery'}
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      <div className="container case__cover-wrap">
        {/* The cover is a work sample like every figure below it, so it gets
            the same treatment: its own proportions, no CRT. Forced to 16/10 the
            two supplied thumbnails (1.28 and 1.20) were losing a quarter of
            their height before anyone saw them. */}
        <img
          className="case__media case__cover"
          src={study.cover}
          alt={study.coverAlt}
          width={coverSize?.width}
          height={coverSize?.height}
          fetchPriority="high"
          decoding="async"
        />
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
            <div className="case__section-copy">
              <p className="body">{study.body[section.key].copy}</p>
              {study.body[section.key].more?.map((paragraph) => (
                <p className="body" key={paragraph.slice(0, 40)}>
                  {paragraph}
                </p>
              ))}
              {study.body[section.key].figures
                ?.filter((figure) => !figure.wide)
                .map((figure) => (
                  <CaseFigures key={figure.slot} study={study.slug} figure={figure} />
                ))}
            </div>

            {/* Wide figures are grid children of the section, not of the
                measured column, so they span the heading rail as well. Doing
                this with a viewport-width breakout instead pushed the page
                296px wider than the screen. */}
            {study.body[section.key].figures
              ?.filter((figure) => figure.wide)
              .map((figure) => (
                <CaseFigures key={figure.slot} study={study.slug} figure={figure} />
              ))}
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
