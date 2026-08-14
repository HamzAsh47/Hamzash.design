import { useEffect, useState } from 'react'
// The official horizontal lockup — monogram, wordmark and tagline with their
// kerning locked in the vector. Never rebuild this from live text.
// (Named "Vertical" in the kit, but this is the wide single-row lockup.)
import lockup from '../assets/logo/Logo_Vertical_Dark_BG.svg'
import { navCta, navLinks } from '../content'
import { goToSection } from '../lib/scroll'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The mobile drawer covers the page, so the body must not scroll behind it.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navigate = (id: string) => {
    setOpen(false)
    goToSection(id)
  }

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <button className="nav__brand" onClick={() => navigate('top')} aria-label="Hamza Ashraf — back to top">
          <img className="nav__lockup" src={lockup} alt="Hamza Ashraf" />
        </button>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((link) => (
            <button key={link.id} className="nav__link" onClick={() => navigate(link.id)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="nav__actions">
          {/* Ghost, so the hero's solid-crimson primary CTA stays the one
              focal point in the first viewport. */}
          <button className="btn btn--ghost nav__cta" onClick={() => navigate(navCta.id)}>
            {navCta.label}
          </button>
          <button
            className="nav__toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className={`nav__toggle-bar${open ? ' is-open' : ''}`} />
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={`nav__drawer${open ? ' is-open' : ''}`} hidden={!open}>
        <nav className="container nav__drawer-inner" aria-label="Mobile">
          {navLinks.map((link, index) => (
            <button
              key={link.id}
              className="nav__drawer-link"
              onClick={() => navigate(link.id)}
              style={{ '--word-index': index } as React.CSSProperties}
            >
              <span className="nav__drawer-index">{String(index + 1).padStart(2, '0')}</span>
              {link.label}
            </button>
          ))}
          <button className="btn btn--primary nav__drawer-cta" onClick={() => navigate(navCta.id)}>
            {navCta.label}
          </button>
        </nav>
      </div>
    </header>
  )
}
