import { useEffect, useMemo, useState } from 'react'
import type { CaseFigureRow, CaseStudy as CaseStudyType, CaseSection } from '../content'
import { CrtImage } from './CrtImage'
import { Lightbox, type LightboxItem } from './Lightbox'
import { caseStudies, caseStudySections, figuresFor, pillarFilters, site } from '../content'
import { navigateHome, navigateToCase } from '../hooks/useHashRoute'
import { useSpotlight } from '../hooks/useSpotlight'
import { goToSection } from '../lib/scroll'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

const pillarLabel = (value: string) =>
  pillarFilters.find((option) => option.value === value)?.label ?? value

/** Fallback shape for an asset whose dimensions were never measured. */
const FALLBACK_RATIO = 1.5

/**
 * Beyond this the row is too wide to be worth keeping on one line. Two 2.5
 * document spreads side by side inside a 1240px container are two 240px
 * strips of body text — technically a comparison, practically unreadable —
 * so they stack instead.
 */
const MAX_ROW_RATIO = 3.4

type BandItem = {
  src: string
  kind: 'image' | 'video'
  alt: string
  caption?: string
  width?: number
  height?: number
  ratio: number
}

/** Every file a row resolves to, in slot order, with its measured shape. */
function bandItems(study: string, row: CaseFigureRow): BandItem[] {
  return row.slots.flatMap((slot) => {
    const files = figuresFor(study, slot.slot)
    return files.map((file, index) => ({
      src: file.src,
      kind: file.kind,
      alt: files.length > 1 ? `${slot.alt} (${index + 1} of ${files.length})` : slot.alt,
      caption: file.caption ?? slot.caption,
      width: file.width,
      height: file.height,
      ratio: file.width && file.height ? file.width / file.height : FALLBACK_RATIO,
    }))
  })
}

/**
 * One band of imagery, sized to its own contents.
 *
 * The band is exactly as wide as the work inside it needs to be: the height
 * ceiling multiplied by the combined shape of its contents, never past the
 * container. Everything is centred on the same axis as a result, so a square
 * mark and a full-width strip share a centre line instead of one sitting in
 * the text column with a hole beside it and the next running edge to edge.
 *
 * Items share a height rather than a width. Flex grow is set to each asset's
 * own ratio against a zero basis, which distributes width in proportion to
 * shape — the arithmetic that makes a 1:1 mark and a 4:3 lockup line up along
 * the top and the bottom without either being cropped to get there.
 */
function CaseFigureBand({
  study,
  row,
  onZoom,
}: {
  study: string
  row: CaseFigureRow
  onZoom: (src: string) => void
}) {
  const items = bandItems(study, row)
  if (items.length === 0) return null

  const sumRatio = items.reduce((total, item) => total + item.ratio, 0)
  const stacked = items.length > 1 && sumRatio > MAX_ROW_RATIO
  const rowRatio = stacked ? Math.max(...items.map((item) => item.ratio)) : sumRatio
  const gaps = stacked ? 0 : items.length - 1
  const caption = row.caption ?? items.find((item) => item.caption)?.caption

  return (
    <figure
      className={[
        'case__figure',
        row.tall ? 'case__figure--tall' : '',
        stacked ? 'case__figure--stack' : '',
        items.length > 1 ? 'case__figure--set' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        {
          '--row-ar': rowRatio.toFixed(4),
          '--row-gaps': gaps,
        } as React.CSSProperties
      }
      /* Deters the two casual routes to the file — right-click on a desktop,
         long-press on a phone. It is a speed bump, not protection: anything
         the browser renders is in the network tab. */
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="case__figure-items">
        {items.map((item) => (
          <div
            className="case__slot"
            key={item.src}
            style={{ '--media-ar': item.ratio.toFixed(4) } as React.CSSProperties}
          >
            {item.kind === 'video' ? (
              <span className="case__frame">
                <video
                  className="case__media"
                  src={item.src}
                  aria-label={item.alt}
                  width={item.width}
                  height={item.height}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  disablePictureInPicture
                  controlsList="nodownload"
                />
              </span>
            ) : (
              <button
                type="button"
                className="case__frame case__frame--zoom"
                onClick={() => onZoom(item.src)}
                aria-label={`Open full size: ${item.alt}`}
              >
                <img
                  className="case__media"
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* One caption for the band. A row is one idea; repeating a line under
          each half says the same thing twice about two different things. */}
      {caption && <figcaption className="case__figure-caption">{caption}</figcaption>}
    </figure>
  )
}

/**
 * A section's paragraphs, with each band of imagery cut in directly beneath
 * the paragraph that argues for it.
 *
 * Figures used to be collected and dumped at the foot of the section, which
 * is how a packaging photograph ended up four paragraphs below the sentence
 * about packaging, sitting under copy about social media. Nothing about that
 * was visible in the source — the list looked fine. Interleaving by index
 * makes the pairing the thing you author.
 */
function CaseSectionBody({
  study,
  section,
  onZoom,
}: {
  study: string
  section: CaseSection
  onZoom: (src: string) => void
}) {
  const paragraphs = [section.copy, ...(section.more ?? [])]
  const rows = section.figures ?? []
  const blocks: React.ReactNode[] = []
  let run: string[] = []

  const flushCopy = () => {
    if (run.length === 0) return
    const paragraphsInRun = run
    run = []
    blocks.push(
      <div className="case__section-copy" key={`copy-${paragraphsInRun[0].slice(0, 24)}`}>
        {paragraphsInRun.map((paragraph) => (
          <p className="body" key={paragraph.slice(0, 40)}>
            {paragraph}
          </p>
        ))}
      </div>,
    )
  }

  paragraphs.forEach((paragraph, index) => {
    run.push(paragraph)
    /* An index past the last paragraph anchors to the last one rather than
       vanishing, so a trimmed paragraph never silently drops its figure. */
    const here = rows.filter(
      (figureRow) => Math.min(figureRow.after, paragraphs.length - 1) === index,
    )
    if (here.length === 0) return
    flushCopy()
    here.forEach((figureRow) =>
      blocks.push(
        <CaseFigureBand
          key={figureRow.slots.map((slot) => slot.slot).join('+')}
          study={study}
          row={figureRow}
          onZoom={onZoom}
        />,
      ),
    )
  })

  flushCopy()
  return <>{blocks}</>
}

export function CaseStudy({ study }: { study: CaseStudyType }) {
  const { hot, handlers } = useSpotlight()
  const [zoomed, setZoomed] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setZoomed(null)
  }, [study.slug])

  /* Every still on the page, in reading order, so the viewer's arrows walk
     the case study rather than the one band the reader happened to open.
     Video is left out: it is already playing, and a paused frame blown up to
     full screen is not the thing anyone clicked for. */
  const zoomable = useMemo<LightboxItem[]>(
    () =>
      caseStudySections.flatMap((section) =>
        (study.body[section.key].figures ?? []).flatMap((row) =>
          row.slots.flatMap((slot) =>
            figuresFor(study.slug, slot.slot)
              .filter((file) => file.kind === 'image')
              .map((file) => ({
                src: file.src,
                alt: slot.alt,
                caption: row.caption ?? file.caption ?? slot.caption,
                width: file.width,
                height: file.height,
              })),
          ),
        ),
      ),
    [study],
  )

  const openZoom = (src: string) => {
    const index = zoomable.findIndex((item) => item.src === src)
    if (index >= 0) setZoomed(index)
  }

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
        {/* The cover carries the CRT treatment; the figures below it do not.
            That split is deliberate rather than inconsistent. The cover is the
            one place a case study is being *presented* — it sets the tone the
            same way the hero portrait does — while every figure under it is
            evidence, and scanlines over a rate card or a wireframe make the
            work harder to read. Its own ratio either way; the thumbnails are
            1.28 and 1.20 and were losing a quarter of their height to 16/10. */}
        <CrtImage
          src={study.cover}
          alt={study.coverAlt}
          aspectRatio={
            coverSize?.width && coverSize?.height
              ? `${coverSize.width} / ${coverSize.height}`
              : undefined
          }
          priority
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

            <CaseSectionBody
              study={study.slug}
              section={study.body[section.key]}
              onZoom={openZoom}
            />
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

      {zoomed !== null && (
        <Lightbox
          items={zoomable}
          index={zoomed}
          onIndex={setZoomed}
          onClose={() => setZoomed(null)}
        />
      )}
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
