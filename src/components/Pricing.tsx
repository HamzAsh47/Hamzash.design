import { useState } from 'react'
import type { Tier } from '../content'
import { oneTimePackages, pricingIntro, retainer } from '../content'
import { goToSection } from '../lib/scroll'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

function TierCard({ tier, ai = false }: { tier: Tier; ai?: boolean }) {
  return (
    <li className={`tier${tier.featured ? ' tier--featured' : ''}${ai ? ' tier--ai' : ''}`}>
      <div className="tier__head">
        <span className="tier__name">{tier.name}</span>
        {tier.featured && <span className="tier__badge">Most chosen</span>}
      </div>
      <span className="tier__price">{tier.price}</span>
      <span className="tier__meta">{tier.meta}</span>
      <ul className="tier__points">
        {tier.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <button className="btn btn--ghost tier__cta" onClick={() => goToSection('contact')}>
        Start here
      </button>
    </li>
  )
}

export function Pricing() {
  const [tab, setTab] = useState<'one-time' | 'retainer'>('one-time')
  const [packageId, setPackageId] = useState(oneTimePackages[0].id)

  const activePackage = oneTimePackages.find((item) => item.id === packageId) ?? oneTimePackages[0]

  return (
    <section className="section section--hairline pricing" id="pricing">
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
                <TierCard key={tier.name} tier={tier} ai={activePackage.isAiContext} />
              ))}
            </ul>

            {activePackage.addOns && (
              <div className="addons">
                <span className="addons__title">Add-ons</span>
                <ul className="addons__list">
                  {activePackage.addOns.map((addOn) => (
                    <li key={addOn.label}>
                      <span>{addOn.label}</span>
                      <span className="addons__price">{addOn.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        ) : (
          <Reveal className="pricing__panel" delayMs={60}>
            <p className="pricing__summary pricing__summary--wide">{retainer.note}</p>

            <ul className="tiers">
              {retainer.tiers.map((tier) => (
                <TierCard key={tier.name} tier={tier} />
              ))}
            </ul>

            <p className="pricing__footnote">
              {retainer.hoursRollOver ? retainer.rollOverCopy.on : retainer.rollOverCopy.off}{' '}
              {retainer.footnote}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
