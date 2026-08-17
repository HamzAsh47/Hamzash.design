import { useRef, type CSSProperties } from 'react'
import { useHoverCapable } from '../hooks/useHoverCapable'
import { useLiquidReveal } from '../hooks/useLiquidReveal'

/**
 * CRT treatment — scoped to photography only.
 *
 * Layers: scanline overlay, soft phosphor glow, light vignette, and a
 * chromatic-aberration RGB split that only fires on hover. Deliberately no
 * barrel curvature and no looping flicker: this is a texture, not a gimmick,
 * and it never wraps UI chrome (buttons, nav, cards, text blocks).
 *
 * Opting in with `reveal` adds the liquid cursor-trail on top: a canvas that
 * paints a hotter grade of the same photograph along the pointer path. Purely
 * additive — the graded base image below it is always the fallback.
 */

type CrtImageProps = {
  src: string
  alt: string
  /** CSS aspect-ratio string, e.g. "4 / 5". Keeps the swap-in crop honest. */
  aspectRatio?: string
  className?: string
  labels?: { left?: string; right?: string }
  /** Adds the blinking-free REC dot to the right-hand label. */
  showRec?: boolean
  priority?: boolean
  /** Turns on the cursor-trail reveal. Off everywhere except the hero. */
  reveal?: boolean
  /**
   * Image painted along the trail. Defaults to `src`, which the canvas then
   * regrades — pass a second file here if a dedicated variant exists.
   */
  revealSrc?: string
  /**
   * Which part of the photo to hold when the frame crops it, normalised 0–1
   * (0.5/0.5 = centre). One value drives both the CSS object-position and the
   * canvas crop, so the revealed layer can never drift off the base image.
   */
  focalPoint?: { x: number; y: number }
  /**
   * Optional second focal point for narrow screens, where the frame turns
   * portrait and the crop swings from vertical to horizontal. The stylesheet
   * picks which one applies; the canvas reads back whichever won.
   */
  focalPointNarrow?: { x: number; y: number }
  /**
   * The artwork is a transparent cut-out rather than a filled frame. The CRT
   * chrome then has to follow the subject's own silhouette — painted across
   * the whole box it would draw a rectangle on the page.
   */
  cutout?: boolean
}

export function CrtImage({
  src,
  alt,
  aspectRatio,
  className = '',
  labels,
  showRec = false,
  priority = false,
  reveal = false,
  revealSrc,
  focalPoint,
  focalPointNarrow,
  cutout = false,
}: CrtImageProps) {
  const frameRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRef = useRef<HTMLImageElement>(null)
  const hoverable = useHoverCapable()

  // The frame carries the focal point as a custom property so the base image
  // and both channel-split ghosts crop identically.
  const style: CSSProperties = {}
  if (aspectRatio) style.aspectRatio = aspectRatio
  const asPosition = (point: { x: number; y: number }) =>
    `${point.x * 100}% ${point.y * 100}%`
  if (focalPoint) {
    ;(style as Record<string, string>)['--crt-object-position'] = asPosition(focalPoint)
  }
  if (focalPointNarrow) {
    ;(style as Record<string, string>)['--crt-object-position-narrow'] =
      asPosition(focalPointNarrow)
  }
  if (cutout) {
    // Lets the scanline layer be masked by the artwork's own alpha.
    ;(style as Record<string, string>)['--crt-mask'] = `url("${src}")`
  }

  // A distinct reveal file is already the hot state, so the canvas paints it
  // straight rather than synthesising a grade on top of it.
  const hasVariant = Boolean(revealSrc && revealSrc !== src)

  useLiquidReveal(canvasRef, frameRef, reveal ? { base: src, reveal: revealSrc ?? src } : undefined, {
    regrade: !hasVariant,
    focalX: focalPoint?.x,
    focalY: focalPoint?.y,
    baseRef: mediaRef,
  })

  return (
    <figure
      ref={frameRef}
      className={`crt ${cutout ? 'crt--cutout' : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      style={style}
    >
      {/* Channel-split ghosts sit behind the real image and screen-blend on
          hover. Same URL as the plate, so they cost one cached fetch — but
          they are invisible until hover, and at low priority they stop
          competing with the plate itself for the first paint.

          Rendered only where hover exists. On touch these were two extra
          full-size photo copies per image, each on an SVG-filtered layer, for
          an effect no touch visitor can ever trigger — ten filtered layers
          across the page, decoded and rasterised for nothing. */}
      {hoverable && (
        <>
          <span className="crt__ghost crt__ghost--r" aria-hidden="true">
            <img src={src} alt="" fetchPriority="low" decoding="async" />
          </span>
          <span className="crt__ghost crt__ghost--c" aria-hidden="true">
            <img src={src} alt="" fetchPriority="low" decoding="async" />
          </span>
        </>
      )}

      <img
        ref={mediaRef}
        className="crt__media"
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        /* The hero plate is the mobile LCP element; everything else can wait
           for it. */
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
      />

      {/* Shares z-index 1 with the ghosts and wins on DOM order, so the trail
          still sits under the scanlines, vignette and glow. */}
      {reveal && <canvas ref={canvasRef} className="crt__reveal" aria-hidden="true" />}

      <span className="crt__scanlines" aria-hidden="true" />
      <span className="crt__vignette" aria-hidden="true" />
      <span className="crt__glow" aria-hidden="true" />

      {labels && (
        <figcaption className="crt__label">
          <span>{labels.left}</span>
          <span className={showRec ? 'crt__rec' : undefined}>{labels.right}</span>
        </figcaption>
      )}
    </figure>
  )
}

/**
 * feColorMatrix filters powering the RGB split. Rendered once per document;
 * the CSS references them by id.
 */
export function CrtFilters() {
  return (
    <svg className="visually-hidden" aria-hidden="true" focusable="false">
      <defs>
        <filter id="crt-red" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="crt-cyan" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  )
}
