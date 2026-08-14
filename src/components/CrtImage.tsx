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
  /** Optional higher-resolution source, served to high-DPR screens only. */
  src2x?: string
  alt: string
  /** CSS aspect-ratio string, e.g. "4 / 5". Keeps the swap-in crop honest. */
  aspectRatio?: string
  className?: string
  labels?: { left?: string; right?: string }
  /** Adds the blinking-free REC dot to the right-hand label. */
  showRec?: boolean
  priority?: boolean
  /**
   * 'selective' drops skin and clothing to black & white while keeping the
   * crimson rim-light in colour — the locked treatment for hero/signature
   * shots. Everything else uses 'full'.
   */
  treatment?: 'full' | 'selective'
}

export function CrtImage({
  src,
  src2x,
  alt,
  aspectRatio,
  className = '',
  labels,
  showRec = false,
  priority = false,
  treatment = 'full',
}: CrtImageProps) {
  const style = aspectRatio ? ({ aspectRatio } as CSSProperties) : undefined
  // The ghosts reuse the same source, so the browser serves them from cache.
  const srcSet = src2x ? `${src} 1x, ${src2x} 2x` : undefined

  return (
    <figure
      className={`crt ${treatment === 'selective' ? 'crt--selective' : ''} ${className}`.trim()}
      style={style}
    >
      {/* Channel-split ghosts sit behind the real image and screen-blend on hover. */}
      <span className="crt__ghost crt__ghost--r" aria-hidden="true">
        <img src={src} srcSet={srcSet} alt="" />
      </span>
      <span className="crt__ghost crt__ghost--c" aria-hidden="true">
        <img src={src} srcSet={srcSet} alt="" />
      </span>

      <img
        className="crt__media"
        src={src}
        srcSet={srcSet}
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
        {/*
          Selective colour, per the locked hero photography direction: skin and
          clothing fall to black & white while the crimson rim-light keeps its
          colour. Done in-filter so the hero can run from an ordinary
          full-colour photograph — no separately masked file to keep in sync.

          The mask is red dominance, R - (G + B) / 2, pushed through a linear
          ramp. Saturated crimson clears the ramp; reddish-but-muted tones
          (skin, the oxblood corduroy) fall under it and desaturate. Tune with
          slope/intercept: colour starts at -intercept/slope and is full at
          (1 - intercept) / slope.
        */}
        <filter id="selective-crimson" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="mono" />

          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    1 -0.5 -0.5 0 0"
            result="redMask"
          />

          {/*
            Ramp runs 0.320 -> 0.420, measured against real swatches from the
            brand system and the portrait. Mask values: crimson rim 0.612,
            bright rim 0.788, dim rim edge 0.441 (all kept); lit corduroy
            0.294, skin midtone 0.247, oxblood 0.149, oatmeal 0.055 (all
            dropped). The widest offender is lit corduroy, so the ramp starts
            above it and completes below the dimmest part of the rim.
          */}
          <feComponentTransfer in="redMask" result="redMaskRamped">
            <feFuncA type="linear" slope="10" intercept="-3.2" />
          </feComponentTransfer>

          <feComposite in="SourceGraphic" in2="redMaskRamped" operator="in" result="crimsonOnly" />

          <feMerge>
            <feMergeNode in="mono" />
            <feMergeNode in="crimsonOnly" />
          </feMerge>
        </filter>

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
