/**
 * Section eyebrow in JetBrains Mono — "SYS.03 :: THE DIFFERENTIATOR".
 *
 * Split at the `::` so the two halves can carry different weight: the index is
 * the crimson token, the label sits back in gunmetal, and a hairline divides
 * them. The old treatment set the whole string in one flat gunmetal behind a
 * decorative crimson dash, which gave the index no more standing than the
 * words after it.
 *
 * Used sparingly; mono never appears in headlines or body copy.
 */
export function Eyebrow({ children, ai = false }: { children: string; ai?: boolean }) {
  const [index, label] = children.split(/\s*::\s*/, 2)

  return (
    <span className={`eyebrow${ai ? ' eyebrow--ai' : ''}`}>
      <span className="eyebrow__index">{index}</span>
      {label && <span className="eyebrow__label">{label}</span>}
    </span>
  )
}
