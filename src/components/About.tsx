import { useEffect } from 'react'
import portrait from '../assets/images/portrait.webp'
import {
  aboutBio,
  aboutEducation,
  aboutIntro,
  aboutStats,
  aboutTimeline,
} from '../content'
import { navigateHome } from '../hooks/useHashRoute'
import { CareerMap } from './CareerMap'
import { layoutBranches } from '../lib/timeline'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

/* Derived once at module scope: the ranges never change between renders, and
   the layout is a pure function of them. */
const branches = layoutBranches(aboutTimeline.map((entry) => entry.range))

/* The diagram for one row: one element per lane with a line passing through
   it, each the full height of the row. Drawn per row rather than as wires
   spanning several, because row heights are set by their copy — a spanning
   element would have to be measured, while these butt up against the ones
   above and below and read as continuous.
   Rendered twice per row: once in hairline as the resting state, once in
   crimson as a layer that is clipped away and wipes downward when the row
   scrolls in. Identical geometry, so the fill lands exactly on the line. */
function Lanes({ row, fill }: { row: (typeof branches.rows)[number]; fill?: boolean }) {
  return (
    <span className={'branch__lanes' + (fill ? ' branch__lanes--fill' : '')} aria-hidden="true">
      {row.segments.map((segment) => (
        <span
          key={segment.lane}
          className={
            'branch__seg' +
            (segment.startsHere ? ' branch__seg--start' : '') +
            (segment.endsHere ? ' branch__seg--end' : '') +
            (segment.open ? ' branch__seg--open' : '')
          }
          style={{ '--lane': segment.lane } as React.CSSProperties}
        />
      ))}
    </span>
  )
}

export function About() {
  /* Hash routing swaps the view without moving the scroll position, so
     arriving from a link near the bottom of the home page landed on the
     footer. Same pattern CaseStudy.tsx uses for the same reason. */
  useEffect(() => {
    /* 'instant', not 'auto'. base.css sets `html { scroll-behavior: smooth }`,
       and 'auto' defers to that — so this reset animated the full height of
       the page the reader had just left, which is what made arriving here
       look like it had dropped them at the footer. */
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <article className="case" id="top">
      <div className="container case__head">
        <button className="case__back" onClick={navigateHome}>
          <span aria-hidden="true">←</span> Home
        </button>

        <Reveal className="about__head">
          <Eyebrow>{aboutIntro.eyebrow}</Eyebrow>
          <Heading text={aboutIntro.headline} as="h1" className="headline--lg" />
          <p className="section__lede">{aboutIntro.lede}</p>
        </Reveal>
      </div>

      <div className="container">
        <Reveal className="about__bio">
          {/* Decorative: the name and the whole biography sit beside it, so a
              description here would only repeat what a reader already has. */}
          <img
            className="about__portrait"
            src={portrait}
            alt=""
            width={900}
            height={1205}
          />
          <div className="about__bio-copy">
            {aboutBio.paragraphs.map((paragraph) => (
              <p className="body" key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}
            <p className="about__personal-line">{aboutBio.personalLine}</p>
          </div>
        </Reveal>

        <Reveal className="about__stats" delayMs={80}>
          {aboutStats.map((stat) => (
            <div className="about__stat" key={stat.label}>
              <span className="about__stat-value">{stat.value}</span>
              <span className="about__stat-label">{stat.label}</span>
            </div>
          ))}
        </Reveal>

        <CareerMap />

        <section className="about__section" aria-labelledby="about-timeline-heading">
          <Reveal>
            <Heading
              id="about-timeline-heading"
              text="The [timeline.]"
              as="h2"
              className="headline--lg"
            />
            <p className="about__section-note">
              Lines that run side by side ran side by side. The trunk is whatever the main
              engagement was at the time; every branch beside it is a role held at the same
              time, and each line is as long as the engagement was. A line that curves back
              has ended; one that fades off the bottom is still running.
            </p>
          </Reveal>

          <ol
            className="timeline__list timeline--branch"
            style={{ '--lanes': branches.lanes } as React.CSSProperties}
          >
            {aboutTimeline.map((entry, index) => {
              const row = branches.rows[index]
              return (
                <Reveal
                  as="li"
                  key={`${entry.org}-${entry.range}`}
                  delayMs={index * 60}
                  className="timeline__item"
                  /* The row is at least as tall as the engagement was long, so
                     a year and a half does not occupy the same space as three
                     months. Capped in CSS, and copy still wins when it needs
                     more room. */
                  style={{ '--months': row.months } as React.CSSProperties}
                >
                  <Lanes row={row} />
                  <Lanes row={row} fill />

                  <span
                    className="timeline__node"
                    aria-hidden="true"
                    style={{ '--lane': row.lane } as React.CSSProperties}
                  >
                    {entry.logo ? (
                      <img className="timeline__logo" src={entry.logo} alt="" loading="lazy" />
                    ) : (
                      <span className="timeline__index">{String(index + 1).padStart(2, '0')}</span>
                    )}
                  </span>

                  <span className="timeline__range">
                    {entry.range}
                    {row.duration ? <span className="timeline__duration">{row.duration}</span> : null}
                  </span>
                  <div className="timeline__copy">
                    <h3 className="timeline__title">{entry.title}</h3>
                    <p className="timeline__org">
                      {entry.org}
                      {entry.location ? ` · ${entry.location}` : ''}
                    </p>
                    <p className="body">{entry.copy}</p>
                  </div>
                </Reveal>
              )
            })}
          </ol>
        </section>

        <section className="about__section" aria-labelledby="about-education-heading">
          <Reveal>
            <Heading
              id="about-education-heading"
              text="[Education.]"
              as="h2"
              className="headline--lg"
            />
          </Reveal>

          {/* A plain rail, not the branch diagram. Three entries with no
              meaningful concurrency would make the branching read as decoration
              rather than as information. */}
          <ol className="timeline__list timeline--rail">
            {aboutEducation.map((entry, index) => (
              <Reveal as="li" key={`${entry.org}-${entry.range}`} delayMs={index * 60} className="timeline__item">
                <span className="timeline__node" aria-hidden="true">
                  <span className="timeline__index">{String(index + 1).padStart(2, '0')}</span>
                </span>
                <span className="timeline__range">{entry.range}</span>
                <div className="timeline__copy">
                  <h3 className="timeline__title">{entry.title}</h3>
                  <p className="timeline__org">{entry.org}</p>
                  <p className="body">{entry.copy}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </section>
      </div>
    </article>
  )
}
