import { useEffect, useMemo, useRef, useState } from 'react'
import { aboutTimeline } from '../content'
import { project, worldMap } from '../content/worldMap'
import { monthRange, monthLabel } from '../lib/timeline'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

/* Every entry that has somewhere to sit on the map, with its range already in
   months so the scrubber only ever compares numbers. */
const stops = aboutTimeline
  .map((entry) => {
    if (!entry.place) return null
    const [start, end] = monthRange(entry.range)
    if (Number.isNaN(start)) return null
    return { entry, place: entry.place, start, end, point: project(entry.place.lat, entry.place.lon) }
  })
  .filter((stop): stop is NonNullable<typeof stop> => stop !== null)

const FIRST = Math.min(...stops.map((s) => s.start))
const LAST = Math.max(...stops.map((s) => (Number.isFinite(s.end) ? s.end : 0)))
const SPAN = LAST - FIRST

/* One pin per place, not per role: five of these ran out of Karachi and five
   overlapping dots on one city is a smudge, not a map. */
const pins = [...new Map(stops.map((s) => [s.place.label, s])).values()]

export function CareerMap() {
  const [month, setMonth] = useState(LAST)
  const [scrubbing, setScrubbing] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  /* Everything running in the selected month. More than one is the point —
     five of these overlapped at the peak. */
  const active = useMemo(
    () => stops.filter((s) => s.start <= month && month <= s.end),
    [month],
  )
  const activePlaces = new Set(active.map((s) => s.place.label))

  const scrubTo = (clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const box = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - box.left) / box.width))
    setMonth(FIRST + Math.round(ratio * SPAN))
  }

  /* Bound to the window rather than the track, so a drag that leaves the bar
     keeps scrubbing instead of stopping the moment the pointer slips off it. */
  useEffect(() => {
    if (!scrubbing) return
    const move = (event: PointerEvent) => scrubTo(event.clientX)
    const stop = () => setScrubbing(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [scrubbing])

  const progress = SPAN === 0 ? 1 : (month - FIRST) / SPAN

  return (
    <section className="about__section map" aria-labelledby="about-map-heading">
      <Reveal>
        <Heading
          id="about-map-heading"
          text="Where the work [went.]"
          as="h2"
          className="headline--lg"
        />
        <p className="about__section-note">
          Ten years of clients, plotted. Drag the bar — or use the arrow keys — to move
          through the decade and see who was live in any given month.
        </p>
      </Reveal>

      <Reveal className="map__frame" delayMs={80}>
        <svg
          className="map__svg"
          viewBox={`0 ${worldMap.cropTop} ${worldMap.width} ${worldMap.height - worldMap.cropTop}`}
          role="img"
          aria-label="World map showing the cities the work was delivered to"
        >
          <path className="map__land" d={worldMap.path} />

          {/* Drawn from the base to each live city. The line is the claim the
              section makes: one person in Karachi, clients on three
              continents. */}
          {pins
            .filter((pin) => activePlaces.has(pin.place.label) && pin.place.label !== HOME)
            .map((pin) => {
              const home = pins.find((p) => p.place.label === HOME)
              if (!home) return null
              return (
                <path
                  key={`arc-${pin.place.label}`}
                  className="map__arc"
                  d={arc(home.point, pin.point)}
                />
              )
            })}

          {pins.map((pin) => {
            const live = activePlaces.has(pin.place.label)
            return (
              <g
                key={pin.place.label}
                className={`map__pin${live ? ' is-live' : ''}`}
                transform={`translate(${pin.point.x} ${pin.point.y})`}
              >
                <circle className="map__pin-halo" r="14" />
                <circle className="map__pin-dot" r="4" />
              </g>
            )
          })}
        </svg>

        <div className="map__readout" role="status" aria-live="polite">
          <p className="map__month">{monthLabel(month)}</p>
          {active.length === 0 ? (
            <p className="map__empty">Between engagements.</p>
          ) : (
            <ul className="map__list">
              {active.map((stop) => (
                <li className="map__item" key={stop.entry.org}>
                  <span className="map__item-org">{stop.entry.org}</span>
                  <span className="map__item-place">{stop.place.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>

      <Reveal className="map__scrub" delayMs={140}>
        <div
          className="map__track"
          ref={trackRef}
          onPointerDown={(event) => {
            setScrubbing(true)
            scrubTo(event.clientX)
          }}
        >
          <span className="map__track-fill" style={{ '--progress': progress } as React.CSSProperties} />
          {stops.map((stop) => (
            <span
              key={`${stop.entry.org}-${stop.start}`}
              className="map__tick"
              style={{ '--at': (stop.start - FIRST) / SPAN } as React.CSSProperties}
            />
          ))}
        </div>

        {/* The real control. The track above is a hit area and a drawing; this
            is what a keyboard and a screen reader get. */}
        <input
          className="map__range"
          type="range"
          min={FIRST}
          max={LAST}
          value={month}
          onChange={(event) => setMonth(Number(event.target.value))}
          aria-label="Month"
          aria-valuetext={monthLabel(month)}
        />

        <div className="map__ends" aria-hidden="true">
          <span>{monthLabel(FIRST)}</span>
          <span>{monthLabel(LAST)}</span>
        </div>
      </Reveal>
    </section>
  )
}

const HOME = 'Karachi, Pakistan'

/* A shallow curve rather than a straight line — two cities on the same
   latitude would otherwise draw a line indistinguishable from a parallel. */
function arc(from: { x: number; y: number }, to: { x: number; y: number }) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const lift = Math.hypot(to.x - from.x, to.y - from.y) * 0.18
  return `M${from.x} ${from.y}Q${midX} ${midY - lift} ${to.x} ${to.y}`
}
