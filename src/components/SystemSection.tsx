import { useState } from 'react'
import { system } from '../content'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Icon } from './Icon'
import { Reveal } from './Reveal'

/**
 * The differentiator section: one system, not three vendors.
 *
 * The proof is structural rather than illustrative — the left column is three
 * disconnected blocks that each stop at their own edge, the right column is one
 * continuous rail running through all three disciplines into a single output.
 * No abstract node-and-circle graphic; the layout carries the argument.
 *
 * Stacked, that argument disappears: two columns become one long scroll and
 * there is nothing left to compare at a glance. Below the breakpoint the two
 * panels share a single cell and a segmented control switches between them, so
 * the comparison stays a comparison. It opens on the system — the stronger of
 * the two things being said.
 *
 * The control is plain buttons rather than an ARIA tablist. Above the
 * breakpoint both panels are on screen at once, which is not what a tablist
 * describes, and the control is display:none there — so assistive tech sees
 * two panels and no tabs on desktop, and one panel and a two-state switch on
 * mobile, each of which is true.
 */
export function SystemSection() {
  const [lane, setLane] = useState<'old' | 'new'>('new')

  return (
    <section className="section section--hairline section--tint section--mark-line system" id="system">
      <div className="container">
        <Reveal className="section__head">
          <Eyebrow>{system.eyebrow}</Eyebrow>
          <Heading text={system.headline} className="headline--lg" />
          <p className="section__lede">{system.lede}</p>
        </Reveal>

        <div className="system__switch" role="group" aria-label="Compare the two approaches">
          <button
            className="system__switch-option"
            onClick={() => setLane('old')}
            aria-pressed={lane === 'old'}
          >
            Old way
          </button>
          <button
            className="system__switch-option"
            onClick={() => setLane('new')}
            aria-pressed={lane === 'new'}
          >
            System
          </button>
        </div>

        <div className="system__compare" data-lane={lane}>
          <Reveal className="system__panel system__panel--old">
            <div className="system__panel-head">
              <span className="system__label">{system.oldWay.label}</span>
            </div>

            <ol className="system__fragments">
              {system.oldWay.nodes.map((node) => (
                <li className="system__fragment" key={node.title}>
                  <span className="system__fragment-title">{node.title}</span>
                  <span className="system__fragment-note">{node.note}</span>
                </li>
              ))}
            </ol>

            <p className="system__outcome system__outcome--old">{system.oldWay.outcome}</p>
            <p className="system__caption">{system.oldWay.caption}</p>
          </Reveal>

          <Reveal className="system__panel system__panel--new" delayMs={120}>
            <span className="bleed-glyph system__glyph" aria-hidden="true">
              <Icon name="system" />
            </span>
            <div className="system__panel-head">
              <span className="system__label system__label--new">{system.newWay.label}</span>
            </div>

            <ol className="system__chain">
              {system.newWay.chain.map((link, index) => (
                <li className="system__chain-link" key={link}>
                  <span className="system__chain-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="system__chain-label">{link}</span>
                </li>
              ))}
            </ol>

            <p className="system__outcome system__outcome--new">{system.newWay.outcome}</p>
            <p className="system__caption">{system.newWay.caption}</p>
          </Reveal>
        </div>

        <Reveal className="system__footnote">
          <p className="lede">{system.footnote}</p>
        </Reveal>
      </div>
    </section>
  )
}
