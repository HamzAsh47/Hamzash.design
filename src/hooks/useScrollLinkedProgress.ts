import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Writes an element's position through the viewport onto itself, as a number
 * from -1 to 1, continuously and in both directions.
 *
 * -1 is the element's centre at the top of the window, 0 is dead centre, 1 is
 * the bottom. Unlike `Reveal` this never latches: scroll back up and the value
 * runs back the other way, which is the whole point — a one-shot reveal is an
 * arrival, this is a response.
 *
 * The value lands on the node as `--sl-progress` rather than in React state.
 * A `setState` per frame would re-render the subtree sixty times a second to
 * change one number that only CSS reads; writing the custom property skips
 * React entirely and lets the compositor do the rest.
 *
 * Measuring is deferred to `requestAnimationFrame` and coalesced, so a burst
 * of scroll events produces one layout read per frame rather than one each —
 * calling `getBoundingClientRect()` straight from a scroll handler is the
 * classic way to make a page stutter.
 */
export function useScrollLinkedProgress(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    /* Nothing is attached under reduced motion — no listener, no property.
       The CSS falls back to 0 and the text simply sits still. */
    if (!node || reduced) return

    let frame = 0
    let queued = false

    const measure = () => {
      queued = false
      const box = node.getBoundingClientRect()
      const centre = box.top + box.height / 2
      const half = window.innerHeight / 2
      const progress = Math.max(-1, Math.min(1, (centre - half) / half))
      node.style.setProperty('--sl-progress', progress.toFixed(4))
    }

    const schedule = () => {
      if (queued) return
      queued = true
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      node.style.removeProperty('--sl-progress')
    }
  }, [ref, reduced])
}
