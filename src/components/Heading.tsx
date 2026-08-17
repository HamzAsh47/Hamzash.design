import { memo, useMemo } from 'react'
import type { ElementType } from 'react'

type HeadingProps = {
  /** Highlighted words are wrapped in square brackets: "as [one system]." */
  text: string
  as?: ElementType
  className?: string
  /** Runs the kinetic word-by-word entrance. Reserved for the hero. */
  animate?: boolean
  delayMs?: number
  id?: string
}

type Token = { word: string; highlighted: boolean }

/**
 * Splits the heading into words, tagging the ones inside brackets.
 * Base words render Archivo Medium + White; highlighted words render
 * Archivo Black + Crimson — the locked heading rule.
 */
function tokenize(text: string): Token[] {
  const tokens: Token[] = []

  for (const segment of text.split(/(\[[^\]]*\])/g)) {
    if (!segment) continue
    const highlighted = segment.startsWith('[') && segment.endsWith(']')
    const body = highlighted ? segment.slice(1, -1) : segment

    for (const word of body.split(/(\s+)/g)) {
      if (!word) continue
      // Whitespace rides along with the preceding word so wrapping stays natural.
      if (/^\s+$/.test(word) && tokens.length > 0) {
        tokens[tokens.length - 1].word += word
        continue
      }
      tokens.push({ word, highlighted })
    }
  }

  return tokens
}

function HeadingBase({
  text,
  as: Tag = 'h2',
  className = '',
  animate = false,
  delayMs = 0,
  id,
}: HeadingProps) {
  /* Every heading on the page re-tokenises on each render of its parent.
     Harmless in isolation, but the contact form re-renders its whole
     subtree on every keystroke, and this was doing the split-and-rebuild
     work per character typed. */
  const tokens = useMemo(() => tokenize(text), [text])
  const classes = ['headline', animate ? 'headline--animate' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      className={classes}
      id={id}
      style={delayMs ? ({ '--headline-delay': `${delayMs}ms` } as React.CSSProperties) : undefined}
    >
      {/* Screen readers get the plain sentence, not word-by-word fragments. */}
      <span className="visually-hidden">{text.replace(/[[\]]/g, '')}</span>
      <span aria-hidden="true">
        {tokens.map((token, index) => (
          <span
            key={index}
            className={`headline__word${token.highlighted ? ' headline__word--hl' : ''}`}
            style={{ '--word-index': index } as React.CSSProperties}
            /* The tear layers are drawn from this, so they carry the word's own
               trailing space and never close a gap between two words. */
            data-word={token.highlighted ? token.word : undefined}
          >
            {token.word}
          </span>
        ))}
      </span>
    </Tag>
  )
}

/* Headings are pure functions of their props, and they sit inside subtrees
   that re-render for reasons the heading does not care about — a keystroke in
   a form field, a step change. */
export const Heading = memo(HeadingBase)
