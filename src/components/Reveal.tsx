import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ElementType, ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Stagger within a group, in milliseconds. Keep it restrained. */
  delayMs?: number
  id?: string
}

/**
 * Scroll-triggered fade + slight rise. Reveals once and then stops observing —
 * content never animates back out, so nothing flickers on scroll-up.
 */
export function Reveal({ children, as: Tag = 'div', className = '', delayMs = 0, id }: RevealProps) {
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

  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delayMs ? ({ '--reveal-delay': `${delayMs}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
