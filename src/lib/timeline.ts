/**
 * Turns a list of "Oct 2015 — Jan 2019" strings into a branch diagram: which
 * lane each entry runs in, and which lanes pass through each row.
 *
 * The dates are already in the copy, so nothing here is a second source of
 * truth — the shape of the graphic is derived from the same strings the reader
 * sees. Roles that ran at the same time end up in parallel lanes, which is the
 * whole point: a plain list flattens six concurrent engagements into six rows
 * that look sequential.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Months since year zero for today, so a range ending "Present" has a length. */
function currentMonth(): number {
  const now = new Date()
  return now.getFullYear() * 12 + now.getMonth()
}

/** Months since year zero, so ranges compare as plain numbers. */
function parseMonth(token: string): number {
  const value = token.trim()
  if (/^present$/i.test(value)) return Number.POSITIVE_INFINITY
  const [name, year] = value.split(/\s+/)
  const month = MONTHS.indexOf(name)
  if (month < 0 || !/^\d{4}$/.test(year ?? '')) return Number.NaN
  return Number(year) * 12 + month
}

/** Splits on an em dash, en dash or hyphen — the copy uses an em dash. */
export function parseRange(range: string): [number, number] {
  const [from, to] = range.split(/\s[—–-]\s/)
  return [parseMonth(from ?? ''), parseMonth(to ?? '')]
}

/**
 * A range as two month numbers, with "Present" resolved to today rather than
 * left at infinity — the map's scrubber compares against a real end.
 */
export function monthRange(range: string): [number, number] {
  const [start, end] = parseRange(range)
  return [start, Number.isFinite(end) ? end : currentMonth()]
}

/** A month number back to "Sep 2023", for the scrubber's readout. */
export function monthLabel(month: number): string {
  return `${MONTHS[((month % 12) + 12) % 12]} ${Math.floor(month / 12)}`
}

export type LaneSegment = {
  lane: number
  /** This row is where the branch leaves the trunk. */
  startsHere: boolean
  /** This row is the last one the branch runs through, so it rejoins here. */
  endsHere: boolean
  /** Still running: the line leaves the bottom of the diagram rather than
      rejoining, because a role dated "Present" has not ended. */
  open: boolean
}

export type BranchRow = {
  /** The lane this row's own entry sits in. 0 is the trunk. */
  lane: number
  /** Every lane with a line passing through this row, the trunk included. */
  segments: LaneSegment[]
  /** How long the role ran, in months, inclusive of both end months. */
  months: number
  /** The same figure in words — "1 yr 6 mos". */
  duration: string
}

function formatDuration(months: number): string {
  if (!Number.isFinite(months) || months < 1) return ''
  const years = Math.floor(months / 12)
  const rest = months % 12
  const parts = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`)
  return parts.join(' ')
}

export function layoutBranches(ranges: string[]): { rows: BranchRow[]; lanes: number } {
  const spans = ranges.map(parseRange)

  /* How far down the list each entry is still running: the last row whose
     entry had already started before this one ended. An entry that nothing
     overlaps only reaches its own row. */
  const through = spans.map(([, end], index) => {
    let last = index
    for (let other = index + 1; other < spans.length; other++) {
      if (spans[other][0] < end) last = other
    }
    return last
  })

  /* Smallest free lane, so the earliest run of work holds the trunk and later
     concurrent roles fan out beside it rather than displacing it. A range we
     could not parse falls back to lane 0 for its own row only. */
  const lane: number[] = []
  for (let index = 0; index < spans.length; index++) {
    if (Number.isNaN(spans[index][0])) {
      lane[index] = 0
      through[index] = index
      continue
    }
    let candidate = 0
    while (lane.some((value, other) => other < index && value === candidate && through[other] >= index)) {
      candidate++
    }
    lane[index] = candidate
  }

  const today = currentMonth()

  const rows = spans.map((span, index) => {
    /* The trunk, which is whichever lane-0 entry is still running at this row.
       It only closes off if that entry has actually ended. */
    const holder = lane.findIndex((value, entry) => value === 0 && entry <= index && through[entry] >= index)
    const trunkOngoing = holder >= 0 && !Number.isFinite(spans[holder][1])
    const segments: LaneSegment[] = [
      { lane: 0, startsHere: false, endsHere: false, open: trunkOngoing && through[holder] === index },
    ]
    for (let entry = 0; entry <= index; entry++) {
      if (lane[entry] === 0 || through[entry] < index) continue
      const last = through[entry] === index
      const ongoing = !Number.isFinite(spans[entry][1])
      segments.push({
        lane: lane[entry],
        startsHere: entry === index,
        endsHere: last && !ongoing,
        open: last && ongoing,
      })
    }
    /* Inclusive of both end months, so a role listed "Apr 2019 — Nov 2019" is
       eight months rather than seven. A range still running is measured to
       today. */
    const finish = Number.isFinite(span[1]) ? span[1] : today
    const months = Number.isNaN(span[0]) ? 0 : Math.max(1, finish - span[0] + 1)

    return { lane: lane[index], segments, months, duration: formatDuration(months) }
  })

  return { rows, lanes: Math.max(1, ...lane.map((value) => value + 1)) }
}
