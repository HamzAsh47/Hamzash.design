/**
 * Thin looping strip stating the three pillars immediately.
 * The track is duplicated so the marquee wraps seamlessly; the duplicate is
 * hidden from assistive tech so the words are not announced twice.
 */
export function Ticker({
  items,
  className = '',
}: {
  items: readonly string[]
  className?: string
}) {
  const track = (
    <span className="ticker__track">
      {items.map((item) => (
        <span className="ticker__item" key={item}>
          {item}
        </span>
      ))}
    </span>
  )

  return (
    <div className={`ticker ${className}`.trim()} role="presentation">
      <div className="ticker__viewport">
        {track}
        <span aria-hidden="true" className="ticker__clone">
          {track}
        </span>
      </div>
    </div>
  )
}
