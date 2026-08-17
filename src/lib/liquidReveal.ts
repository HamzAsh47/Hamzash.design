/* ---------------------------------------------------------------------------
   Liquid cursor-reveal — a canvas trail that swaps one photograph for another
   wherever the cursor has just been, then lets it decay away.

   The two shots do not share a silhouette — the overshirt is wider than the
   tee — so simply painting one over the other leaves the resting layer showing
   through wherever the revealed one is transparent. The trail therefore paints
   a layer that is opaque across the union of both silhouettes: the page's own
   ground fills the resting shape, and the revealed shot sits on top of it.
   Anything outside both shapes stays transparent, so whatever is behind the
   portrait is never touched.

   Reduced-motion callers never mount it, and if setup fails the untouched
   <img> underneath is still the whole picture.
--------------------------------------------------------------------------- */

export type LiquidRevealOptions = {
  /** Brush radius in CSS pixels. */
  brushRadius?: number
  /** Hard ceiling on devicePixelRatio, so 3x phones don't pay 9x fill cost. */
  maxDpr?: number
  /**
   * Whether to synthesise the revealed grade from the resting photo. Leave on
   * when both layers are the same file. Turn it off when a purpose-shot
   * variant is supplied — that image is already the hot state, and regrading
   * it on top only over-cooks what the photographer already did.
   */
  regrade?: boolean
  /** Strength of the crimson rim-light push in the synthesised grade. */
  rimIntensity?: number
  /**
   * Fallback focal point for the cover crop, normalised 0–1 (0.5/0.5 = centre).
   * Only used when `baseElement` is absent or resolves to something other than
   * percentages.
   */
  focalX?: number
  focalY?: number
  /**
   * The rendered resting image. Its computed `object-position` is read straight
   * off the element, which makes CSS the single source of truth for the crop:
   * a breakpoint can retarget the focal point and the canvas follows without
   * anyone having to keep two numbers in step.
   */
  baseElement?: HTMLElement | null
}

const DEFAULTS: Required<LiquidRevealOptions> = {
  brushRadius: 143,
  maxDpr: 2,
  regrade: true,
  rimIntensity: 0.34,
  focalX: 0.5,
  focalY: 0.5,
  baseElement: null,
}

/** Locked brand crimson — the only colour this file is allowed to introduce. */
const CRIMSON = '#c81e3a'

/** Grade applied to the revealed layer when it is synthesised from the base. */
const REVEAL_GRADE = 'saturate(1.16) contrast(1.12) brightness(1.04)'

/** Crushes the photo to a black-and-white highlight map for the rim pass. */
const RIM_GRADE = 'grayscale(1) brightness(1.35) contrast(4)'

/**
 * How long after the pointer leaves before the surface is wiped, in
 * milliseconds rather than frames: the same 90 frames is 1.5s at 60fps and
 * 2.3s at 38, and the promise here is about wall-clock time.
 *
 * While the pointer is over the frame the reveal simply stays put.
 */
const CLEAR_MS = 1500

/**
 * Survival fraction per second. Decay is applied as `1 - keep^dt`, so the
 * result is the same however often frames actually land.
 * Drawing keeps a long tail; release is tuned to reach 1/255 in about 1.3s.
 */
const DRAW_KEEP = 0.38
const RELEASE_KEEP = 0.0143

const MAX_INTERPOLATED_STEPS = 60

type Point = { x: number; y: number }

function scratchCanvas() {
  const element = document.createElement('canvas')
  return { element, context: element.getContext('2d') }
}

/**
 * Wires the reveal to a container. Returns a disposer that cancels the frame
 * loop and detaches every listener.
 */
export function createLiquidReveal(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  images: { base: HTMLImageElement; reveal: HTMLImageElement },
  options: LiquidRevealOptions = {},
): () => void {
  // Destructured defaults rather than a spread: callers legitimately pass
  // `{ brushRadius: undefined }`, and a spread would let that clobber DEFAULTS.
  const {
    brushRadius = DEFAULTS.brushRadius,
    maxDpr = DEFAULTS.maxDpr,
    regrade = DEFAULTS.regrade,
    rimIntensity = DEFAULTS.rimIntensity,
    focalX = DEFAULTS.focalX,
    focalY = DEFAULTS.focalY,
    baseElement = DEFAULTS.baseElement,
  } = options

  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  // Offscreen buffers: the cover-fitted reveal layer, a reusable soft-brush
  // stamp, and the gradient mask that shapes it.
  const cover = scratchCanvas()
  const brush = scratchCanvas()
  const mask = scratchCanvas()
  if (!cover.context || !brush.context || !mask.context) return () => {}

  const supportsFilter = 'filter' in cover.context

  /** The ground the portrait sits on, read from the locked palette token. */
  const ground =
    getComputedStyle(container).getPropertyValue('--obsidian').trim() || '#0d1526'

  let dpr = 1
  let rect = container.getBoundingClientRect()
  let coverReady = false
  let last: Point | null = null
  /** When the trail last had a reason to exist. Drives the release timer. */
  let lastDrawAt = 0
  let lastFrameAt = 0
  let cleared = true
  const queue: Point[] = []

  // Kept in client coordinates, not canvas ones, so a resting cursor stays
  // correct after a scroll moves the container out from under it.
  let lastClient: Point | null = null
  let inside = false
  let lastFocal: Point | null = null

  // Bounding box of everything stamped since the last clear. The decay pass
  // only has to touch pixels that were actually painted, and at this canvas
  // size that is the difference between a full 4.6MP fill every frame and a
  // single brush-sized one while the cursor rests.
  let dirty: { x0: number; y0: number; x1: number; y1: number } | null = null

  function markDirty(x0: number, y0: number, x1: number, y1: number) {
    if (!dirty) {
      dirty = { x0, y0, x1, y1 }
      return
    }
    if (x0 < dirty.x0) dirty.x0 = x0
    if (y0 < dirty.y0) dirty.y0 = y0
    if (x1 > dirty.x1) dirty.x1 = x1
    if (y1 > dirty.y1) dirty.y1 = y1
  }

  /**
   * Reads the crop's focal point off the rendered image. Percentages are the
   * only form that maps cleanly onto a 0–1 fraction; anything else (px, edge
   * keywords with offsets) falls back to the option values.
   */
  function readFocal(): Point {
    if (!baseElement) return { x: focalX, y: focalY }
    const parts = getComputedStyle(baseElement).objectPosition.split(' ')
    const parse = (part: string | undefined, fallback: number) => {
      if (!part || !part.endsWith('%')) return fallback
      const value = Number.parseFloat(part)
      return Number.isFinite(value) ? value / 100 : fallback
    }
    return { x: parse(parts[0], focalX), y: parse(parts[1], focalY) }
  }

  /** Radial falloff: solid at the centre, 0.82 at 55%, gone at the rim. */
  function buildMask() {
    const radius = brushRadius * dpr
    if (!Number.isFinite(radius) || radius <= 0) return
    const size = Math.max(2, Math.ceil(radius * 2))
    mask.element.width = size
    mask.element.height = size
    brush.element.width = size
    brush.element.height = size

    const gradient = mask.context!.createRadialGradient(radius, radius, 0, radius, radius, radius)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.82)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    mask.context!.clearRect(0, 0, size, size)
    mask.context!.fillStyle = gradient
    mask.context!.fillRect(0, 0, size, size)
  }

  /** Cover-fit geometry shared by both layers, so they land in exact register. */
  function coverRect(image: HTMLImageElement, width: number, height: number) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const drawWidth = image.naturalWidth * scale
    const drawHeight = image.naturalHeight * scale
    // Mirrors whatever `object-position` the resting image actually resolved to.
    const focal = readFocal()
    lastFocal = focal
    return {
      x: (width - drawWidth) * focal.x,
      y: (height - drawHeight) * focal.y,
      width: drawWidth,
      height: drawHeight,
    }
  }

  function ready(image: HTMLImageElement) {
    return image.complete && image.naturalWidth > 0
  }

  /**
   * Builds the single layer the trail paints: the page's own ground filling
   * the resting silhouette, with the revealed shot composited over it. Opaque
   * across the union of both shapes, transparent outside them — which is what
   * stops the tee showing through the overshirt without ever covering what
   * sits behind the portrait.
   */
  function buildCover() {
    const width = canvas.width
    const height = canvas.height
    if (!width || !height || !ready(images.base) || !ready(images.reveal)) {
      coverReady = false
      return
    }

    cover.element.width = width
    cover.element.height = height
    const box = coverRect(images.base, width, height)
    const paint = cover.context!

    // The resting shape, flooded with the ground colour. Only its alpha
    // matters; the pixels underneath are replaced.
    paint.clearRect(0, 0, width, height)
    paint.globalCompositeOperation = 'source-over'
    paint.drawImage(images.base, box.x, box.y, box.width, box.height)
    paint.globalCompositeOperation = 'source-in'
    paint.fillStyle = ground
    paint.fillRect(0, 0, width, height)
    paint.globalCompositeOperation = 'source-over'

    if (supportsFilter && regrade) paint.filter = REVEAL_GRADE
    paint.drawImage(images.reveal, box.x, box.y, box.width, box.height)
    if (supportsFilter) paint.filter = 'none'

    if (supportsFilter && regrade && rimIntensity > 0) {
      const rim = scratchCanvas()
      rim.element.width = width
      rim.element.height = height
      if (rim.context) {
        rim.context.filter = RIM_GRADE
        rim.context.drawImage(images.reveal, box.x, box.y, box.width, box.height)
        rim.context.filter = 'none'
        // White highlights become crimson, everything else stays black.
        rim.context.globalCompositeOperation = 'multiply'
        rim.context.fillStyle = CRIMSON
        rim.context.fillRect(0, 0, width, height)

        paint.globalCompositeOperation = 'screen'
        paint.globalAlpha = rimIntensity
        paint.drawImage(rim.element, 0, 0)
        paint.globalAlpha = 1
        paint.globalCompositeOperation = 'source-over'
      }
    }

    coverReady = true
  }

  function measure() {
    rect = container.getBoundingClientRect()
    // Scrolling can carry the frame out from under a cursor that never moved,
    // so the hover state is re-derived rather than left stale.
    if (lastClient) inside = isInside(lastClient.x, lastClient.y)
  }

  function resize() {
    measure()
    dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    const width = Math.max(1, Math.round(rect.width * dpr))
    const height = Math.max(1, Math.round(rect.height * dpr))
    const sized = canvas.width === width && canvas.height === height

    if (sized) {
      // Same box, but a breakpoint may still have retargeted the crop.
      const focal = readFocal()
      if (lastFocal && focal.x === lastFocal.x && focal.y === lastFocal.y) return
      buildCover()
      return
    }

    canvas.width = width
    canvas.height = height
    queue.length = 0
    last = null
    cleared = true
    dirty = null
    buildMask()
    buildCover()
  }

  /** Punches one soft, image-filled dab of the reveal layer onto the trail. */
  function stamp(x: number, y: number) {
    const size = brush.element.width
    const originX = Math.round(x - size / 2)
    const originY = Math.round(y - size / 2)

    brush.context!.globalCompositeOperation = 'source-over'
    brush.context!.clearRect(0, 0, size, size)
    brush.context!.drawImage(mask.element, 0, 0)
    // Keep only the reveal-layer pixels that fall under the soft brush.
    brush.context!.globalCompositeOperation = 'source-in'
    brush.context!.drawImage(cover.element, originX, originY, size, size, 0, 0, size, size)

    ctx!.drawImage(brush.element, originX, originY)
    markDirty(originX, originY, originX + size, originY + size)
  }

  function isInside(clientX: number, clientY: number) {
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    )
  }

  /**
   * The one place a position enters the trail, whichever input reported it.
   * Coordinates are client-space, so a scroll underneath the finger maps to
   * real movement across the canvas rather than to a frozen dab.
   */
  function track(clientX: number, clientY: number) {
    if (!coverReady) return

    const wasInside = inside
    lastClient = { x: clientX, y: clientY }
    inside = isInside(clientX, clientY)

    // Pointer is elsewhere on the page and was already elsewhere: nothing to
    // draw, and no reason to keep the compositing loop awake.
    if (!inside && !wasInside) {
      last = null
      return
    }

    const x = (clientX - rect.left) * dpr
    const y = (clientY - rect.top) * dpr

    if (last) {
      const deltaX = x - last.x
      const deltaY = y - last.y
      const distance = Math.hypot(deltaX, deltaY)
      const step = Math.max(brushRadius * dpr * 0.3, 1)
      const steps = Math.min(Math.ceil(distance / step), MAX_INTERPOLATED_STEPS)
      for (let i = 1; i <= steps; i += 1) {
        const t = i / steps
        queue.push({ x: last.x + deltaX * t, y: last.y + deltaY * t })
      }
    } else {
      queue.push({ x, y })
    }

    last = { x, y }
  }

  let frameId = 0

  function frame() {
    frameId = requestAnimationFrame(frame)
    if (!coverReady) return

    const now = performance.now()
    // Clamped: a backgrounded tab can hand back a delta of many seconds, and
    // that would wipe the trail in a single visible jump on return.
    const dt = Math.min((now - lastFrameAt) / 1000, 0.1)
    lastFrameAt = now

    // The reveal stays wherever the pointer is, for as long as it is there.
    // It only starts letting go once the pointer is gone.
    const held = inside && lastClient !== null
    const drawing = queue.length > 0 || held
    if (drawing) lastDrawAt = now

    // Fully faded and nothing to draw — the surface cannot change, so skip it.
    if (!drawing && cleared) return

    const fade = 1 - Math.pow(drawing ? DRAW_KEEP : RELEASE_KEEP, dt)
    if (dirty) {
      const x = Math.max(0, dirty.x0)
      const y = Math.max(0, dirty.y0)
      const width = Math.min(canvas.width, dirty.x1) - x
      const height = Math.min(canvas.height, dirty.y1) - y
      if (width > 0 && height > 0) {
        ctx!.globalCompositeOperation = 'destination-out'
        ctx!.fillStyle = `rgba(0, 0, 0, ${fade})`
        ctx!.fillRect(x, y, width, height)
        ctx!.globalCompositeOperation = 'source-over'
      }
    }

    if (drawing) {
      for (const point of queue) stamp(point.x, point.y)
      queue.length = 0

      // Re-stamped every frame, so the disc under the cursor sits at full
      // strength while the trail behind it keeps decaying away. Recomputed
      // from client coords so it stays put when the page scrolls.
      if (held) {
        stamp((lastClient!.x - rect.left) * dpr, (lastClient!.y - rect.top) * dpr)
      }

      cleared = false
      return
    }

    if (now - lastDrawAt > CLEAR_MS) {
      ctx!.clearRect(0, 0, canvas.width, canvas.height)
      cleared = true
      dirty = null
      last = null
    }
  }

  const observer = new ResizeObserver(resize)
  observer.observe(container)

  const onImageLoad = () => {
    resize()
    buildCover()
  }

  const release = () => {
    inside = false
    last = null
    // The remembered position has to go too. `measure()` re-derives `inside`
    // from it on every scroll, so leaving it behind let a scroll resurrect a
    // reveal the pointer had already walked away from — the imprint that
    // stayed on screen until something else happened to clear it.
    lastClient = null
  }

  /* Touch is handled by the touch events below, not by the pointer ones. The
     browser fires `pointercancel` the instant it claims a gesture for
     scrolling, which killed the reveal the moment a drag turned into a scroll
     — the finger was still on the glass, the trail was already gone. Touch
     events keep reporting throughout a native scroll, so tracking them lets
     the page scroll normally *and* the trail follow the finger, instead of the
     two fighting over the gesture. */
  const fromTouch = (event: PointerEvent) => event.pointerType === 'touch'

  const onPointerMove = (event: PointerEvent) => {
    if (fromTouch(event)) return
    track(event.clientX, event.clientY)
  }

  /**
   * A press with no move still has a position. Treating it as the first point
   * makes a pen tap land the disc where it went down; `last` is cleared first
   * so the press does not interpolate a streak from wherever the previous one
   * ended.
   */
  const onPointerDown = (event: PointerEvent) => {
    if (fromTouch(event)) return
    last = null
    track(event.clientX, event.clientY)
  }

  // A pen has no hover state, so the reveal lets go when the press ends.
  const onPointerRelease = (event: PointerEvent) => {
    if (!fromTouch(event) && event.pointerType !== 'mouse') release()
  }

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    last = null
    track(touch.clientX, touch.clientY)
  }

  const onTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (touch) track(touch.clientX, touch.clientY)
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length === 0) release()
  }

  /** `relatedTarget` is null exactly when the cursor has left the window. */
  const onWindowOut = (event: MouseEvent) => {
    if (!event.relatedTarget) release()
  }

  images.base.addEventListener('load', onImageLoad)
  images.reveal.addEventListener('load', onImageLoad)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
  window.addEventListener('pointerup', onPointerRelease, { passive: true })
  window.addEventListener('pointercancel', onPointerRelease, { passive: true })
  // Passive throughout: nothing here may ever hold up a scroll.
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('touchcancel', onTouchEnd, { passive: true })
  window.addEventListener('blur', release)
  // Leaving matters more than arriving: without a reliable exit the reveal
  // stays frozen wherever the cursor was last seen, which is what made it look
  // like the trail only cleared once the page scrolled. `pointerleave` alone
  // is not dependable when the cursor exits the window, so the mouse-era
  // equivalents back it up.
  document.addEventListener('pointerleave', release)
  document.addEventListener('mouseleave', release)
  window.addEventListener('mouseout', onWindowOut)
  window.addEventListener('scroll', measure, { passive: true })
  window.addEventListener('resize', resize)

  resize()
  frameId = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(frameId)
    observer.disconnect()
    images.base.removeEventListener('load', onImageLoad)
    images.reveal.removeEventListener('load', onImageLoad)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointerup', onPointerRelease)
    window.removeEventListener('pointercancel', onPointerRelease)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('touchcancel', onTouchEnd)
    window.removeEventListener('blur', release)
    document.removeEventListener('pointerleave', release)
    document.removeEventListener('mouseleave', release)
    window.removeEventListener('mouseout', onWindowOut)
    window.removeEventListener('scroll', measure)
    window.removeEventListener('resize', resize)
  }
}
