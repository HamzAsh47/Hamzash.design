import type { CSSProperties } from 'react'

/**
 * CRT treatment — scoped to photography only.
 *
 * Layers: scanline overlay, soft phosphor glow, light vignette, and a
 * chromatic-aberration RGB split that only fires on hover. Deliberately no
 * barrel curvature and no looping flicker: this is a texture, not a gimmick,
 * and it never wraps UI chrome (buttons, nav, cards, text blocks).
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
}

export function CrtImage({
  src,
  alt,
  aspectRatio,
  className = '',
  labels,
  showRec = false,
  priority = false,
}: CrtImageProps) {
  const style = aspectRatio ? ({ aspectRatio } as CSSProperties) : undefined

  return (
    <figure className={`crt ${className}`.trim()} style={style}>
      {/* Channel-split ghosts sit behind the real image and screen-blend on hover. */}
      <span className="crt__ghost crt__ghost--r" aria-hidden="true">
        <img src={src} alt="" />
      </span>
      <span className="crt__ghost crt__ghost--c" aria-hidden="true">
        <img src={src} alt="" />
      </span>

      <img
        className="crt__media"
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />

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
