import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Terminal glyphs only. The scramble has to read as a system readout
 * resolving, not as noise, so the pool is punctuation and hex-ish digits —
 * nothing decorative, nothing that could be mistaken for a real label.
 */
const GLYPHS = '&%#/\\<>[]{}=+*:0123456789ABCDEF'

/** Held for one frame mid-run, since the value it replaces is a system index. */
const SYSTEM_TOKEN = 'SYS'

const FRAME_MS = 45
const FRAMES = 7

function token(length: number) {
  let out = ''
  for (let i = 0; i < length; i += 1) {
    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  }
  return out
}

/**
 * Scrambles a short label while `active`, then settles back on the real value.
 * The whole run is about 300ms — long enough to register as a machine
 * resolving something, short enough that the number is never really gone.
 *
 * Reduced-motion callers just get the settled text.
 */
export function useScramble(text: string, active: boolean) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (reduced || !active) {
      setDisplay(text)
      return
    }

    let frame = 0
    const id = setInterval(() => {
      frame += 1
      if (frame >= FRAMES) {
        setDisplay(text)
        clearInterval(id)
        return
      }
      setDisplay(frame === 2 ? SYSTEM_TOKEN : token(text.length))
    }, FRAME_MS)

    return () => clearInterval(id)
  }, [text, active, reduced])

  return display
}
