import { useEffect } from 'react'
import {
  aboutBio,
  aboutEducation,
  aboutIntro,
  aboutStats,
  aboutTimeline,
} from '../content'
import { navigateHome } from '../hooks/useHashRoute'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

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
          {aboutBio.paragraphs.map((paragraph) => (
            <p className="body" key={paragraph.slice(0, 24)}>
              {paragraph}
            </p>
          ))}
          <p className="about__personal-line">{aboutBio.personalLine}</p>
        </Reveal>

        <Reveal className="about__stats" delayMs={80}>
          {aboutStats.map((stat) => (
            <div className="about__stat" key={stat.label}>
              <span className="about__stat-value">{stat.value}</span>
              <span className="about__stat-label">{stat.label}</span>
            </div>
          ))}
        </Reveal>

        <section className="about__section" aria-labelledby="about-timeline-heading">
          <Reveal>
            <Heading
              id="about-timeline-heading"
              text="The [timeline.]"
              as="h2"
              className="headline--lg"
            />
          </Reveal>

          <ol className="timeline__list timeline--rail">
            {aboutTimeline.map((entry, index) => (
              <Reveal as="li" key={`${entry.org}-${entry.range}`} delayMs={index * 60} className="timeline__item">
                {/* The node sits on the rail: the company mark where one
                    exists, the entry's number where it does not. The org is
                    already named in the copy beside it, so the mark is
                    decorative and the alt stays empty. */}
                <span className="timeline__node" aria-hidden="true">
                  {entry.logo ? (
                    <img className="timeline__logo" src={entry.logo} alt="" loading="lazy" />
                  ) : (
                    <span className="timeline__index">{String(index + 1).padStart(2, '0')}</span>
                  )}
                </span>
                <span className="timeline__range">{entry.range}</span>
                <div className="timeline__copy">
                  <h3 className="timeline__title">{entry.title}</h3>
                  <p className="timeline__org">
                    {entry.org}
                    {entry.location ? ` · ${entry.location}` : ''}
                  </p>
                  <p className="body">{entry.copy}</p>
                </div>
              </Reveal>
            ))}
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
