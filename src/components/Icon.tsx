import { Children, cloneElement, isValidElement } from 'react'

/**
 * The site's monoline glyph set.
 *
 * Hand-drawn as simple geometry rather than pulled from an icon package: the
 * set needed is eight marks at 16px, and a dependency for that is more weight
 * than the whole footer. They are deliberately schematic — enough to place a
 * platform at a glance, never a redrawn trademark.
 */

export type IconName =
  | 'linkedin'
  | 'instagram'
  | 'youtube'
  | 'x'
  | 'facebook'
  | 'figma'
  | 'artstation'
  | 'behance'
  | 'whatsapp'
  | 'assistant'
  | 'calendar'
  /* Direction. Drawn rather than set as → and ↗, which arrive at whatever
     weight the fallback font has and sit on the text baseline instead of the
     optical centre of the label beside them. */
  | 'arrow-right'
  | 'arrow-up-right'
  /* The three pillars. Each one says what the discipline produces, not what
     it is about: a system of parts, a screen with a flow through it, a frame
     in motion. */
  | 'brand'
  | 'uiux'
  | 'motion'
  /* The four process steps, in order. */
  | 'call'
  | 'plan'
  | 'build'
  | 'handoff'
  /* The four form steps, in order. */
  | 'you'
  | 'budget'
  | 'scope'
  | 'details'
  /* The two halves of the comparison: three pieces that do not meet, and the
     same three held in one frame. */
  | 'fragments'
  | 'system'
  /* List markers. */
  | 'check'

const PATHS: Record<IconName, React.ReactNode> = {
  linkedin: (
    <>
      <rect x="2.5" y="2.5" width="15" height="15" rx="2.5" />
      <path d="M6.2 8.6v5.2M6.2 6.3v.1" />
      <path d="M9.6 13.8V8.6m0 1.6a2 2 0 0 1 4 0v3.6" />
    </>
  ),
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="15" height="15" rx="4.5" />
      <circle cx="10" cy="10" r="3.6" />
      <path d="M14.3 5.8v.1" />
    </>
  ),
  youtube: (
    <>
      <rect x="1.8" y="4.6" width="16.4" height="10.8" rx="3.2" />
      <path d="M8.4 7.6 13 10l-4.6 2.4z" />
    </>
  ),
  x: (
    <>
      <path d="M3.4 3.4 16.6 16.6M16.6 3.4 3.4 16.6" />
    </>
  ),
  facebook: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M12 6.6h-1.2a1.6 1.6 0 0 0-1.6 1.6v9.1M7.9 10.4h4" />
    </>
  ),
  figma: (
    <>
      <circle cx="12.2" cy="10" r="2.6" />
      <path d="M10 2.8h2.2a2.6 2.6 0 0 1 0 5.2H10zM10 2.8H7.8a2.6 2.6 0 0 0 0 5.2H10zM10 8h-2.2a2.6 2.6 0 0 0 0 5.2H10zM10 13.2H7.8a2.6 2.6 0 1 0 2.2 2.6z" />
    </>
  ),
  artstation: (
    <>
      <path d="M2.6 14.4 9.1 3.2l6.5 11.2z" />
      <path d="M5.6 17h11.8l-1.6-2.6" />
    </>
  ),
  behance: (
    <>
      <path d="M2.6 5.6h4.1a2.2 2.2 0 0 1 0 4.4H2.6zM2.6 10h4.6a2.4 2.4 0 0 1 0 4.8H2.6z" />
      <path d="M12.2 12.1h5.2a2.6 2.6 0 1 0-5.2 0 2.6 2.6 0 0 0 4.7 1.6" />
      <path d="M13 5.9h3.6" />
    </>
  ),
  /* Speech bubble with the tail bottom-left, and the handset inside it. Drawn
     to the same monoline rules as the rest of the set — schematic enough to
     read at 16px, never a redraw of the trademark. */
  /* A speech bubble with a four-point spark inside it: the conversation, and
     the thing that is generating it. Reads at 24px without needing the word
     "AI" spelled out beside it, which is what it replaced. */
  assistant: (
    <>
      <path d="M3 8.4A3.4 3.4 0 0 1 6.4 5h7.2A3.4 3.4 0 0 1 17 8.4v3.9a3.4 3.4 0 0 1-3.4 3.4H8.2L4.6 18.3a.4.4 0 0 1-.6-.35v-2.5A3.4 3.4 0 0 1 3 12.3Z" />
      <path d="M10 7.8l.85 2.1 2.1.85-2.1.85L10 13.7l-.85-2.1-2.1-.85 2.1-.85Z" />
    </>
  ),
  /* Drawn rather than set as a glyph, for the same reason the rating stars
     are: a character renders at whatever weight the fallback font happens to
     have, and a clock at 16px came out as a smudge. */
  calendar: (
    <>
      <path d="M3.6 5.4h12.8v11H3.6zM3.6 8.6h12.8" />
      <path d="M6.8 3.6v2.4M13.2 3.6v2.4" />
      <path d="M6.6 11.4h2M11.4 11.4h2M6.6 13.8h2M11.4 13.8h2" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M3.6 10h12.8M11.4 5.2 16.4 10l-5 4.8" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M5.4 14.6 14.6 5.4M7.2 5.4h7.4v7.4" />
    </>
  ),
  /* Brand: a system of parts held in one frame — the outer rule is the
     system, the parts inside are what a team is handed. */
  brand: (
    <>
      <rect x="2.6" y="2.6" width="14.8" height="14.8" rx="2.4" />
      <path d="M2.6 8.2h14.8M8.2 8.2v9.2" />
      <circle cx="5.4" cy="5.4" r="1" />
    </>
  ),
  /* UI/UX: a screen with a path traced across it and a cursor at the end —
     the interface and the route somebody takes through it. */
  uiux: (
    <>
      <rect x="2.6" y="3.4" width="14.8" height="11" rx="2" />
      <path d="M2.6 6.6h14.8" />
      <path d="M6 12.4c1.8-3 3.4-3 5.2-.6" />
      <path d="m11.2 11.8 2.8 4.4.6-2 2-.5z" />
    </>
  ),
  /* Motion: a frame with a play triangle, and the trailing marks that say it
     is moving rather than paused. */
  motion: (
    <>
      <rect x="2.6" y="4" width="10.4" height="12" rx="2" />
      <path d="M6.4 7.6 10 10l-3.6 2.4z" />
      <path d="M15.4 6.6v6.8M17.8 8.4v3.2" />
    </>
  ),
  /* Discovery call. */
  call: (
    <>
      <path d="M3 8A3.2 3.2 0 0 1 6.2 4.8h7.6A3.2 3.2 0 0 1 17 8v3.4a3.2 3.2 0 0 1-3.2 3.2H8.4L5 17.2a.4.4 0 0 1-.6-.34v-2.3A3.2 3.2 0 0 1 3 11.4Z" />
      <path d="M7 8.8h6M7 11.2h3.6" />
    </>
  ),
  /* The written proposal. */
  plan: (
    <>
      <path d="M4.6 2.8h6.6l4.2 4.2v10.2H4.6z" />
      <path d="M11.2 2.8V7h4.2" />
      <path d="M7.4 10.4h5M7.4 13.2h5" />
    </>
  ),
  /* Build: layers going up, the last one still landing. */
  build: (
    <>
      <path d="M10 2.8 17 6.4 10 10 3 6.4z" />
      <path d="m3 10.6 7 3.6 7-3.6" />
      <path d="m3 14.6 7 3.6 7-3.6" />
    </>
  ),
  /* Handoff: the work leaving the box it was built in. */
  handoff: (
    <>
      <path d="M16.4 11.6v3.6a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2v-3.6" />
      <path d="M10 12.6V3.4M6.6 6.6 10 3.2l3.4 3.4" />
    </>
  ),
  you: (
    <>
      <circle cx="10" cy="7" r="3.2" />
      <path d="M4.2 16.8a5.8 5.8 0 0 1 11.6 0" />
    </>
  ),
  budget: (
    <>
      <rect x="2.6" y="5.4" width="14.8" height="9.6" rx="2" />
      <circle cx="10" cy="10.2" r="2.2" />
      <path d="M5.4 8.4v3.6M14.6 8.4v3.6" />
    </>
  ),
  scope: (
    <>
      <path d="M3.2 5.2h13.6M3.2 5.2v9.6M16.8 5.2v9.6M3.2 14.8h13.6" strokeDasharray="3 2.4" />
      <path d="M7.2 10h5.6M10 7.2v5.6" />
    </>
  ),
  details: (
    <>
      <path d="M4.6 3.4h10.8v13.2H4.6z" />
      <path d="M7.4 7h5.2M7.4 10h5.2M7.4 13h3" />
    </>
  ),
  /* Three separate pieces, deliberately not touching. */
  fragments: (
    <>
      <rect x="2.4" y="2.4" width="6.4" height="6.4" rx="1.4" />
      <rect x="11.6" y="5.4" width="6" height="6" rx="1.4" />
      <rect x="4.6" y="12.2" width="6.6" height="5.4" rx="1.4" />
    </>
  ),
  /* The same pieces, held in one frame and joined. */
  system: (
    <>
      <rect x="2.4" y="2.4" width="15.2" height="15.2" rx="2.6" />
      <circle cx="6.6" cy="6.6" r="1.6" />
      <circle cx="13.4" cy="6.6" r="1.6" />
      <circle cx="10" cy="13.6" r="1.6" />
      <path d="M8.2 6.6h3.6M7.4 8.1l1.8 4M12.6 8.1l-1.8 4" />
    </>
  ),
  check: (
    <>
      <path d="m4.4 10.4 3.6 3.6 7.6-8" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M10 2.8a7.2 7.2 0 0 0-6.2 10.9L2.8 17.2l3.6-1a7.2 7.2 0 1 0 3.6-13.4Z" />
      <path d="M7.4 7.1c.3-.1.6 0 .8.3l.6 1c.1.2.1.5-.1.7l-.4.4a4.6 4.6 0 0 0 2.2 2.2l.4-.4c.2-.2.5-.2.7-.1l1 .6c.3.2.4.5.3.8-.2.6-.8 1-1.5 1-2.4-.1-4.7-2.4-4.8-4.8 0-.7.3-1.3 1-1.5Z" />
    </>
  ),
}

/**
 * Stamps pathLength="1" onto every shape in a glyph, recursing through the
 * fragments the set is written in.
 *
 * Without it a stroke-dash animation is unusable here: dash lengths are in
 * user units, every one of these paths is a different length, and a single
 * dasharray would come out as dashes on one mark and a solid line on the next.
 * Normalising each path to a length of 1 lets one CSS rule draw all of them.
 */
function normalise(node: React.ReactNode): React.ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child
    const props = child.props as { children?: React.ReactNode }
    return cloneElement(
      child as React.ReactElement<Record<string, unknown>>,
      { pathLength: 1 },
      props.children ? normalise(props.children) : undefined,
    )
  })
}

export function Icon({
  name,
  size = 16,
  draw = false,
}: {
  name: IconName
  size?: number
  /** Draws itself when its Reveal ancestor arrives. See .icon--draw. */
  draw?: boolean
}) {
  return (
    <svg
      className={'icon' + (draw ? ' icon--draw' : '')}
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {draw ? normalise(PATHS[name]) : PATHS[name]}
    </svg>
  )
}
