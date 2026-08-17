import { useCallback, useState, type PointerEvent, type TouchEvent } from 'react'

/**
 * The interaction behind the `.panel` primitive: a crimson spotlight that
 * tracks the pointer across a card, and a `hot` flag for anything that has to
 * react in React rather than in CSS.
 *
 * Touch is tracked separately from pointer events on purpose. The browser
 * fires `pointercancel` the moment it claims a drag for scrolling, and
 * `:hover` never reliably lands on a finger at all — so on a phone the effect
 * died the instant the page started moving. Touch events keep reporting for
 * the whole gesture and stay bound to the element the touch began on, which
 * lets the spotlight follow the finger while the page scrolls underneath it.
 */
export function useSpotlight() {
  const [hot, setHot] = useState(false)

  const track = useCallback((card: HTMLElement, clientX: number, clientY: number) => {
    const bounds = card.getBoundingClientRect()
    card.style.setProperty('--spot-x', `${clientX - bounds.left}px`)
    card.style.setProperty('--spot-y', `${clientY - bounds.top}px`)
  }, [])

  const onTouch = useCallback(
    (event: TouchEvent<HTMLElement>) => {
      const touch = event.touches[0]
      if (!touch) return
      setHot(true)
      track(event.currentTarget, touch.clientX, touch.clientY)
    },
    [track],
  )

  const handlers = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'touch') setHot(true)
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'touch') setHot(false)
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'touch') track(event.currentTarget, event.clientX, event.clientY)
    },
    onTouchStart: onTouch,
    onTouchMove: onTouch,
    onTouchEnd: () => setHot(false),
    onTouchCancel: () => setHot(false),
  }

  return { hot, handlers }
}
