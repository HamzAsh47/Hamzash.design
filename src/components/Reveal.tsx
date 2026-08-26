import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Stagger within a group, in milliseconds. Keep it restrained. */
  delayMs?: number
  id?: string
  /**
   * `fade` is the original: opacity and a small rise. `settle` starts the
   * element slightly rotated and offset and lets it come square as it
   * arrives — the un-aligned to aligned move that makes a grid read as
   * composed rather than placed. Default is `fade`, so every existing usage
   * on the site behaves exactly as it did.
   */
  variant?: 'fade' | 'settle'
  /**
   * Position in its group, used to vary the starting tilt. Derived rather
   * than random: `Math.random()` would give the server one arrangement and
   * the client another, and React would throw away the markup it was handed.
   */
  index?: number
}

/**
 * A stable number in 0–1 from an integer, so card three always starts at the
 * same angle — on every render, in every browser, on the server and after
 * hydration. The sine trick is the cheapest way to get an evenly spread
 * sequence out of consecutive integers without shipping a PRNG.
 */
function scatter(index: number, seed: number) {
  const wave = Math.sin((index + 1) * seed) * 10000
  return wave - Math.floor(wave)
}

/**
 * Restrained on purpose. Six degrees on a wide card is a lurch, and the
 * transform is live during the transition — enough tilt and the corner
 * swings past the viewport and the page grows a horizontal scrollbar
 * mid-animation.
 */
const MAX_TILT_DEG = 3.2
const MAX_SHIFT_PX = 12

/**
 * Scroll-triggered fade + slight rise. Reveals once and then stops observing —
 * content never animates back out, so nothing flickers on scroll-up.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delayMs = 0,
  id,
  variant = 'fade',
  index = 0,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Without IntersectionObserver, show everything rather than hiding content.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  /* The starting pose, handed to CSS. Computed here rather than in the
     stylesheet because it varies per card and CSS has no way to derive a
     value from an index. Reduced motion is handled in the stylesheet, which
     ignores these entirely — no need to branch twice. */
  const style: Record<string, string> = {}
  if (delayMs) style['--reveal-delay'] = `${delayMs}ms`
  if (variant === 'settle') {
    style['--settle-rot'] = `${((scatter(index, 12.9898) - 0.5) * 2 * MAX_TILT_DEG).toFixed(2)}deg`
    style['--settle-x'] = `${((scatter(index, 78.233) - 0.5) * 2 * MAX_SHIFT_PX).toFixed(1)}px`
  }

  return (
    <Tag
      ref={ref}
      id={id}
      className={[
        'reveal',
        variant === 'settle' ? 'reveal--settle' : '',
        visible ? 'is-visible' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={Object.keys(style).length ? (style as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
