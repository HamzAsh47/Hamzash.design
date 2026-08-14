/**
 * Section eyebrow in JetBrains Mono — "SYS.03 :: PORTFOLIO".
 * Used sparingly; mono never appears in headlines or body copy.
 */
export function Eyebrow({ children, ai = false }: { children: string; ai?: boolean }) {
  return <span className={`eyebrow${ai ? ' eyebrow--ai' : ''}`}>{children}</span>
}
