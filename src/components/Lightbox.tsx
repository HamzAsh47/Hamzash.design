import { useCallback, useEffect, useRef, useState } from 'react'

export type LightboxItem = {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

const MIN_SCALE = 1
const MAX_SCALE = 6
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Full-screen viewer for a case-study figure.
 *
 * A case study shows a 64-page guide and a component library at a few hundred
 * pixels tall. That is the right size for the argument the page is making and
 * the wrong size for actually reading the work, so any figure opens here at
 * whatever magnification the reader wants.
 *
 * Zoom is anchored to the pointer rather than to the centre. Centre-anchored
 * zoom means finding a detail, magnifying, losing it off-frame and dragging it
 * back — three actions where there should be one.
 */
export function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: LightboxItem[]
  index: number
  onIndex: (next: number) => void
  onClose: () => void
}) {
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const stageRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const drag = useRef<{ id: number; x: number; y: number } | null>(null)
  /* Distance between two fingers at the last pinch frame. */
  const pinch = useRef<number | null>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())

  const item = items[index]
  const reset = useCallback(() => {
    setScale(1)
    setPan({ x: 0, y: 0 })
  }, [])

  /* A new figure starts at fit-to-screen. Carrying 4x over from the last one
     drops the reader into a corner of an image they have not seen yet. */
  useEffect(reset, [index, reset])

  /* Zoom about a point, keeping whatever is under it in place. */
  const zoomAt = useCallback((factor: number, originX = 0, originY = 0) => {
    setScale((current) => {
      const next = clamp(current * factor, MIN_SCALE, MAX_SCALE)
      const ratio = next / current
      setPan((p) =>
        next === MIN_SCALE
          ? { x: 0, y: 0 }
          : { x: originX - (originX - p.x) * ratio, y: originY - (originY - p.y) * ratio },
      )
      return next
    })
  }, [])

  /* The page behind must not scroll while this is open, and the scrollbar
     disappearing must not shift the page underneath. */
  useEffect(() => {
    const { body, documentElement } = document
    const gap = window.innerWidth - documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
    }
  }, [])

  /* Focus moves in on open and back to whatever opened it on close, and Tab
     cannot escape to the page underneath while the viewer is up. */
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => opener?.focus?.()
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return onClose()
      if (event.key === 'ArrowRight' && items.length > 1) return onIndex((index + 1) % items.length)
      if (event.key === 'ArrowLeft' && items.length > 1)
        return onIndex((index - 1 + items.length) % items.length)
      if (event.key === '+' || event.key === '=') return zoomAt(1.4)
      if (event.key === '-' || event.key === '_') return zoomAt(1 / 1.4)
      if (event.key === '0') return reset()
      if (event.key !== 'Tab') return

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, items.length, onClose, onIndex, reset, zoomAt])

  /* Wheel and trackpad pinch both arrive here; both should zoom rather than
     scroll a page that is not scrolling. Non-passive, or preventDefault is
     ignored and the page behind moves. */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const box = stage.getBoundingClientRect()
      zoomAt(
        Math.exp(-event.deltaY * 0.0015),
        event.clientX - box.left - box.width / 2,
        event.clientY - box.top - box.height / 2,
      )
    }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const onPointerDown = (event: React.PointerEvent) => {
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size === 2) {
      drag.current = null
      const [a, b] = [...pointers.current.values()]
      pinch.current = Math.hypot(a.x - b.x, a.y - b.y)
      return
    }
    if (scale === MIN_SCALE) return
    drag.current = { id: event.pointerId, x: event.clientX - pan.x, y: event.clientY - pan.y }
    ;(event.target as Element).setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent) => {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      const box = stageRef.current?.getBoundingClientRect()
      if (box) {
        zoomAt(
          distance / pinch.current,
          (a.x + b.x) / 2 - box.left - box.width / 2,
          (a.y + b.y) / 2 - box.top - box.height / 2,
        )
      }
      pinch.current = distance
      return
    }

    if (drag.current?.id !== event.pointerId) return
    setPan({ x: event.clientX - drag.current.x, y: event.clientY - drag.current.y })
  }

  const endPointer = (event: React.PointerEvent) => {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (drag.current?.id === event.pointerId) drag.current = null
  }

  if (!item) return null

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      ref={dialogRef}
      onContextMenu={(event) => event.preventDefault()}
    >
      {/* Clicking the surround closes. Clicking the artwork does not, or
          dragging past the edge of a zoomed image would dismiss it. */}
      <button className="lightbox__scrim" aria-hidden="true" onClick={onClose} tabIndex={-1} />

      <div className="lightbox__bar">
        <span className="lightbox__count">
          {items.length > 1 ? `${index + 1} / ${items.length}` : ''}
        </span>

        <div className="lightbox__tools">
          <button
            className="lightbox__tool"
            onClick={() => zoomAt(1 / 1.4)}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5M8 11h6" />
            </svg>
          </button>

          <button className="lightbox__zoom" onClick={reset} aria-label="Reset zoom">
            {Math.round(scale * 100)}%
          </button>

          <button
            className="lightbox__tool"
            onClick={() => zoomAt(1.4)}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5M8 11h6M11 8v6" />
            </svg>
          </button>

          <button className="lightbox__tool lightbox__tool--close" onClick={onClose} ref={closeRef} aria-label="Close viewer">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`lightbox__stage${scale > MIN_SCALE ? ' is-zoomed' : ''}`}
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onDoubleClick={(event) => {
          const box = stageRef.current?.getBoundingClientRect()
          if (!box) return
          if (scale > MIN_SCALE) return reset()
          zoomAt(2.5, event.clientX - box.left - box.width / 2, event.clientY - box.top - box.height / 2)
        }}
      >
        <img
          className="lightbox__img"
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          draggable={false}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        />
        {/* Sits over the artwork so a long-press or right-click lands on an
            empty element rather than on the image itself. */}
        <span className="lightbox__shield" aria-hidden="true" />
      </div>

      {items.length > 1 && (
        <>
          <button
            className="lightbox__step lightbox__step--prev"
            onClick={() => onIndex((index - 1 + items.length) % items.length)}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            className="lightbox__step lightbox__step--next"
            onClick={() => onIndex((index + 1) % items.length)}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {item.caption && <p className="lightbox__caption">{item.caption}</p>}
    </div>
  )
}
