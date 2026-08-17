import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

/**
 * True only where a real pointer can hover — a mouse or trackpad.
 *
 * Hover-only decoration is not free on a phone just because it never shows.
 * The CRT channel-split ghosts are two extra full-size copies of every photo,
 * each carrying an SVG filter; on touch they can never be revealed, but the
 * browser still decodes the images and rasterises the filtered layers. Gating
 * the markup on this keeps the effect identical where it exists and removes
 * the work entirely where it does not.
 *
 * Starts false so a touch device never renders the ghosts even for one frame;
 * a desktop picks them up on the effect that runs immediately after mount,
 * before anything has been hovered.
 */
export function useHoverCapable() {
  const [hoverable, setHoverable] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const sync = () => setHoverable(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return hoverable
}
