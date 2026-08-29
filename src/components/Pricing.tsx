import { lazy, Suspense, useEffect, useState } from 'react'
import type { Tier } from '../content'
import { oneTimePackages, pricingIntro, retainer } from '../content'
import { useSpotlight } from '../hooks/useSpotlight'
import { goToSection } from '../lib/scroll'
import { Icon } from './Icon'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Reveal } from './Reveal'
import type { TierContext } from './TierDetail'

/* The tier dialog is the largest thing in this section and nothing sees it
   until a card is opened, so it loads on demand instead of riding along with
   the home page. The chunk is warmed on idle below, which means the click
   itself almost never waits on the network. */
const TierDetail = lazy(() =>
  import('./TierDetail').then((m) => ({ default: m.TierDetail })),
)

function TierCard({
  tier,
  ai = false,
  onOpen,
}: {
  tier: Tier
  ai?: boolean
  onOpen: () => void
}) {
  const { hot, handlers } = useSpotlight()

  /* The AI package swaps the panel accent to Electric Cyan. It is the one
     place on the page the palette allows cyan — an AI/system moment — and the
     tier keeps it instead of falling in with the crimson everything else uses. */
  return (
    <li
      className={`panel tier${ai ? ' panel--ai tier--ai' : ''}${tier.featured ? ' tier--featured' : ''}${hot ? ' is-hot' : ''}`}
      {...handlers}
    >
      {/* The whole card opens the detail. The CTA inside it is a different
          action, so it stops the click from reaching this one. */}
      <button className="tier__open" onClick={onOpen}>
        <span className="visually-hidden">
          {tier.name} — {tier.price}. See full details
        </span>
      </button>

      <div className="tier__head">
        <span className="tier__name">{tier.name}</span>
        {tier.featured && <span className="tier__badge">Most chosen</span>}
      </div>

      {/* Price and hours share a baseline. Stacked they were two separate
          lines of type doing one job, and the card had no block a reader's eye
          could land on. */}
      <p className="tier__price">
        {tier.price}
        <span className="tier__meta">{tier.meta}</span>
      </p>

      <ul className="tier__points">
        {tier.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>

      {/* Both ways out of the card, ruled off from the scope above them: the
          card itself opens the detail, the button skips to the brief. */}
      <div className="tier__foot">
        <span className="tier__more" aria-hidden="true">
          See full details
          <span className="btn__arrow"><Icon name="arrow-right" size={14} /></span>
        </span>

        <button
          className="btn btn--ghost tier__cta"
          onClick={(event) => {
            event.stopPropagation()
            goToSection('contact')
          }}
        >
          Start here
        </button>
      </div>
    </li>
  )
}

export function Pricing() {
  const [detail, setDetail] = useState<TierContext | null>(null)

  /* Warm the dialog chunk once the browser is idle. It stays out of the
     critical path, and by the time anyone has scrolled to pricing and picked
     a tier the code is already parsed — the split costs the visitor nothing. */
  useEffect(() => {
    const warm = () => void import('./TierDetail')
    const idle = window.requestIdleCallback
    if (idle) {
      const id = idle(warm, { timeout: 4000 })
      return () => window.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(warm, 2500)
    return () => window.clearTimeout(id)
  }, [])
  const [tab, setTab] = useState<'one-time' | 'retainer'>('one-time')
  const [packageId, setPackageId] = useState(oneTimePackages[0].id)

  const activePackage = oneTimePackages.find((item) => item.id === packageId) ?? oneTimePackages[0]

  return (
    <section className="section section--hairline section--tint section--mark-dot pricing" id="pricing">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow>{pricingIntro.eyebrow}</Eyebrow>
          <Heading text={pricingIntro.headline} className="headline--lg" />
          <p className="section__lede">{pricingIntro.lede}</p>
        </Reveal>

        <Reveal className="pricing__tabs" delayMs={80}>
          <div className="toggle" role="tablist" aria-label="Pricing model">
            {pricingIntro.tabs.map((option) => (
              <button
                key={option.id}
                role="tab"
                aria-selected={tab === option.id}
                className={`toggle__btn${tab === option.id ? ' is-active' : ''}`}
                onClick={() => setTab(option.id as 'one-time' | 'retainer')}
              >
                {option.label}
              </button>
            ))}
          </div>
          <span className="pricing__rate">All tiers priced at {pricingIntro.hourlyRate}</span>
        </Reveal>

        {tab === 'one-time' ? (
          <Reveal className="pricing__panel" delayMs={60}>
            <div className="packages" role="tablist" aria-label="Service">
              {oneTimePackages.map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={packageId === item.id}
                  className={`packages__btn${packageId === item.id ? ' is-active' : ''}${
                    item.isAiContext ? ' packages__btn--ai' : ''
                  }`}
                  onClick={() => setPackageId(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>

            <p className="pricing__summary">{activePackage.summary}</p>

            <ul className="tiers">
              {activePackage.tiers.map((tier) => (
                <TierCard
                  key={tier.name}
                  tier={tier}
                  ai={activePackage.isAiContext}
                  onOpen={() =>
                    setDetail({
                      tier,
                      packageTitle: activePackage.title,
                      packageSummary: activePackage.summary,
                      addOns: activePackage.addOns,
                      ai: activePackage.isAiContext,
                    })
                  }
                />
              ))}
            </ul>

            {/* No standalone add-ons block. Every tier's dialog already lists
                them, and printing the same list again under the grid made the
                AI package the only one that said everything twice. */}
          </Reveal>
        ) : (
          <Reveal className="pricing__panel" delayMs={60}>
            <p className="pricing__summary pricing__summary--wide">{retainer.note}</p>

            <ul className="tiers">
              {retainer.tiers.map((tier) => (
                <TierCard
                  key={tier.name}
                  tier={tier}
                  onOpen={() =>
                    setDetail({
                      tier,
                      packageTitle: 'Ongoing retainer',
                      packageSummary: retainer.note,
                    })
                  }
                />
              ))}
            </ul>

            <p className="pricing__footnote">
              {retainer.hoursRollOver ? retainer.rollOverCopy.on : retainer.rollOverCopy.off}{' '}
              {retainer.footnote}
            </p>
          </Reveal>
        )}
      </div>

      {detail && (
        <Suspense fallback={null}>
          <TierDetail context={detail} onClose={() => setDetail(null)} />
        </Suspense>
      )}
    </section>
  )
}
