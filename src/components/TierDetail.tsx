import { useEffect, useRef } from 'react'
import type { Tier } from '../content'
import { pricingIntro } from '../content'
import { useSpotlight } from '../hooks/useSpotlight'
import { goToSection } from '../lib/scroll'

export type TierContext = {
  tier: Tier
  packageTitle: string
  packageSummary: string
  addOns?: { label: string; price: string; includedWhen?: string }[]
  ai?: boolean
}

/**
 * The three rows worth reading before anything else.
 *
 * The spec sheet is a ten-row table, and the two questions every brief opens
 * with — how long, and how many rounds — were buried in it at the same weight
 * as "vector file". These are the same rows, pulled up and set large. Rows
 * whose value is a tick or a dash carry no number, so they are skipped.
 */
const glanceOf = (tier: Tier) =>
  (tier.spec ?? []).filter((row) => row.value !== '—' && row.value !== 'Included').slice(0, 3)

/**
 * Everything a tier holds, on one surface.
 *
 * The cards can only show three or four bullets before they stop being
 * scannable, so the rest of the scope was simply not on the page. This is a
 * modal dialog rather than an expanding card: the detail belongs to one tier
 * and shows it against nothing else, and the grid behind it does not reflow.
 *
 * Focus is moved in on open and the page behind is inert to scroll, so the
 * dialog is not a panel you can lose your place inside.
 */
export function TierDetail({ context, onClose }: { context: TierContext; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { hot, handlers } = useSpotlight()
  const { tier, packageTitle, packageSummary, addOns, ai } = context
  const glance = glanceOf(tier)
  /* The glance band is the top of this same sheet, not a separate summary, so
     the table below does not print those rows a second time — three lines of
     "7 days / 3 / 15" repeated 200px apart was what pushed the rest of the
     card past the bottom edge. */
  const spec = (tier.spec ?? []).filter((row) => !glance.includes(row))
  /* The retainer tiers carry no rate card and no add-ons — three bullets in a
     16:9 box is 400px of empty panel. Those size to their content instead. */
  /* Add-ons are published per package, but whether a line is already in the
     scope is per tier. Without this filter the Advanced brand dialog offered
     "Vector file — +$50" directly under its own rate card saying "Vector file
     — Included", which reads as a contradiction rather than an upsell. */
  const extras = (addOns ?? []).filter(
    (addOn) =>
      !addOn.includedWhen ||
      !tier.spec?.some((row) => row.label === addOn.includedWhen && row.value === 'Included'),
  )
  const lean = spec.length === 0 && extras.length === 0

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const previous = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [onClose])

  return (
    <div
      className="tier-detail"
      /* The backdrop closes, but only when the backdrop itself is the target —
         a drag that starts inside the panel and ends outside must not. */
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={`tier-detail__panel panel${lean ? ' tier-detail__panel--lean' : ''}${
          ai ? ' panel--ai' : ''
        }${hot ? ' is-hot' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tier-detail-title"
        tabIndex={-1}
        ref={panelRef}
        {...handlers}
      >
        <button className="tier-detail__close" onClick={onClose} aria-label="Close details">
          ✕
        </button>

        {/* Header and action bar sit outside the scroll body. With everything
            in one scroller the spec sheet pushed "Start with this tier" past
            the bottom edge, so the dialog's only action was the one thing you
            could not see. */}
        <header className="tier-detail__header">
            <div className="tier-detail__id">
              {/* The AI package swaps the accent everywhere else in the
                  dialog; a crimson tier index above cyan block titles was the
                  one thing left saying otherwise. */}
              <span className={`eyebrow tier-detail__eyebrow${ai ? ' eyebrow--ai' : ''}`}>
                <span className="eyebrow__index">{tier.name}</span>
                <span className="eyebrow__label">{packageTitle}</span>
              </span>

              <h3 className="tier-detail__price" id="tier-detail-title">
                {tier.price}
                <span className="tier-detail__meta">{tier.meta}</span>
              </h3>

              <p className="tier-detail__summary">{packageSummary}</p>
            </div>

            {/* The one band that is allowed to be loud. It answers "when" and
                "how many" at a glance, so the tables below are reference rather
                than the only way to find out. Beside the price on a wide
                screen, under it on a narrow one — as a full-width row it cost
                the spec sheet the height it needed. */}
          {glance.length > 0 && (
            <dl className="tier-detail__glance">
              {glance.map((row) => (
                <div className="glance__cell" key={row.label}>
                  <dd className="glance__value">{row.value}</dd>
                  <dt className="glance__label">{row.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </header>

        {/* The scroll body is a separate element from the panel so the
            spotlight and the border stay put while the content moves under
            them. */}
        <div className="tier-detail__body">
          <div className="tier-detail__scroll">
            {/* Three named columns rather than blocks flowing into a grid.
                Flowing them put a three-line list beside a ten-row table and
                dropped the next block into the gap underneath, which is what
                made the whole dialog look mis-set. */}
            <div className="tier-detail__col">
              <div className="tier-detail__block">
                <span className="tier-detail__block-title">What is included</span>
                <ul className="tier-detail__points">
                  {tier.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="tier-detail__col">
              {spec.length > 0 && (
                <div className="tier-detail__block">
                  <span className="tier-detail__block-title">Rate card</span>
                  <dl className="tier-detail__spec">
                    {spec.map((row) => (
                      <div className="tier-detail__spec-row" key={row.label}>
                        <dt>{row.label}</dt>
                        <dd className={row.value === '—' ? 'is-off' : undefined}>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            <div className="tier-detail__col">
              {extras.length > 0 && (
                <div className="tier-detail__block">
                  <span className="tier-detail__block-title">Add-ons available</span>
                  <ul className="tier-detail__addons">
                    {extras.map((addOn) => (
                      <li key={addOn.label}>
                        <span>{addOn.label}</span>
                        <span className="addons__price">{addOn.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* The spec sheet is longer than a 16:9 box on some tiers. A hard
              edge at the bottom gives no sign there is more; a fade does,
              without adding chrome. */}
          <div className="tier-detail__fade" aria-hidden="true" />
        </div>

        <footer className="tier-detail__footer">
          {/* One rate line, not two. The dialog was stacking "priced from real
              hours" under "priced on request" and saying two things about the
              same number. */}
          <p className="tier-detail__rate">
            Every tier is priced from real hours at {pricingIntro.hourlyRate}.
            {extras.length > 0 ? ' Add-on prices are fixed and stack onto the tier.' : ''}
          </p>

          <button
            className="btn btn--ghost tier-detail__cta"
            onClick={() => {
              onClose()
              goToSection('contact')
            }}
          >
            Start with this tier
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </footer>
      </div>
    </div>
  )
}
