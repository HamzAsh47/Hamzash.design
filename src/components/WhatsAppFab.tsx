import { site } from '../content'
import { Icon } from './Icon'

/**
 * Persistent WhatsApp route, pinned to the bottom-right of every page.
 *
 * Deliberately not WhatsApp green. The palette is Obsidian dominant with
 * Crimson as a sparing accent, and dropping #25D366 onto it would be the
 * loudest off-brand element on the site — the same category of mistake as the
 * cyan tap highlight. The glyph carries the recognition on its own; the
 * treatment matches the site's ghost button, and crimson arrives only on
 * hover, where the palette already spends it.
 *
 * A link, not a button: it navigates, so it belongs in the tab order as one
 * and works with middle-click and long-press like every other link.
 */
export function WhatsAppFab() {
  const href = `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(
    site.whatsapp.prefill,
  )}`

  return (
    <a
      className="wa-fab"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Message Hamza on WhatsApp at ${site.whatsapp.display}`}
    >
      <span className="wa-fab__glyph" aria-hidden="true">
        <Icon name="whatsapp" />
      </span>
      {/* Widens into a label on a pointer device, where there is room and a
          cursor to reveal it. On touch the glyph stands alone. */}
      <span className="wa-fab__label">WhatsApp</span>
    </a>
  )
}
