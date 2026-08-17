import { useEffect, type RefObject } from 'react'
import { createLiquidReveal, type LiquidRevealOptions } from '../lib/liquidReveal'
import { useReducedMotion } from './useReducedMotion'

type UseLiquidRevealOptions = Omit<LiquidRevealOptions, 'baseElement'> & {
  /** The rendered resting image: the crop is read off it, and it is hidden
   *  while the canvas is drawing it. */
  baseRef?: RefObject<HTMLElement | null>
}

/**
 * Mounts the cursor-reveal trail onto an already-rendered canvas. Returns
 * nothing: the effect is entirely imperative, and it tears itself down (and
 * never starts) when the visitor asks for reduced motion.
 */
export function useLiquidReveal(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  sources: { base: string; reveal: string } | undefined,
  options: UseLiquidRevealOptions = {},
) {
  const reduced = useReducedMotion()
  const { brushRadius, maxDpr, regrade, rimIntensity, focalX, focalY, baseRef } = options
  const baseSrc = sources?.base
  const revealSrc = sources?.reveal

  useEffect(() => {
    if (reduced || !baseSrc || !revealSrc) return

    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    if (typeof ResizeObserver === 'undefined') return

    // Coarse pointers are phones: high dpr on a slower GPU. Capping the
    // backing store lower there is what keeps the trail feeling immediate.
    const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false

    const load = (src: string) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = src
      return image
    }

    // A decorative trail must never be able to take the page down with it, so
    // setup failures degrade to the plain CRT portrait instead of throwing.
    try {
      return createLiquidReveal(
        canvas,
        container,
        { base: load(baseSrc), reveal: load(revealSrc) },
        {
          brushRadius,
          maxDpr: maxDpr ?? (coarse ? 1.5 : undefined),
          regrade,
          rimIntensity,
          focalX,
          focalY,
          baseElement: baseRef?.current ?? null,
        },
      )
    } catch {
      canvas.style.display = 'none'
      return
    }
  }, [
    canvasRef,
    containerRef,
    baseSrc,
    revealSrc,
    reduced,
    brushRadius,
    maxDpr,
    regrade,
    rimIntensity,
    focalX,
    focalY,
    baseRef,
  ])
}
