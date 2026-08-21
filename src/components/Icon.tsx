/**
 * Monoline glyphs for the footer link lists.
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
  whatsapp: (
    <>
      <path d="M10 2.8a7.2 7.2 0 0 0-6.2 10.9L2.8 17.2l3.6-1a7.2 7.2 0 1 0 3.6-13.4Z" />
      <path d="M7.4 7.1c.3-.1.6 0 .8.3l.6 1c.1.2.1.5-.1.7l-.4.4a4.6 4.6 0 0 0 2.2 2.2l.4-.4c.2-.2.5-.2.7-.1l1 .6c.3.2.4.5.3.8-.2.6-.8 1-1.5 1-2.4-.1-4.7-2.4-4.8-4.8 0-.7.3-1.3 1-1.5Z" />
    </>
  ),
}

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
