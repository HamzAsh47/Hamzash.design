import { useEffect, useState } from 'react'
import logoLockup from '../assets/logo/Header logo.svg'
import { navCta, navLinks } from '../content'
import { navigateToAbout } from '../hooks/useHashRoute'
import { goToSection } from '../lib/scroll'

/* About is the only entry that leaves the page rather than scrolling down it,
   so it carries a sentinel id instead of a section anchor. */
const ABOUT_ID = '__about'

/* One list drives both the desktop bar and the drawer, so the two can never
   drift out of order — and the drawer's 01, 02, 03 numbering stays sequential
   without an offset to maintain. The slot is found by id, not by index, so
   reordering navLinks moves About with Work instead of silently stranding it. */
const links = (() => {
  const work = navLinks.findIndex((link) => link.id === 'portfolio')
  const slot = work < 0 ? navLinks.length : work + 1
  return [...navLinks.slice(0, slot), { id: ABOUT_ID, label: 'About' }, ...navLinks.slice(slot)]
})()

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
    if (id === ABOUT_ID) {
      navigateToAbout()
      return
    }
    goToSection(id)
  }

  return (
    <>
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <div className="container nav__inner">
        <button className="nav__brand" onClick={() => navigate('top')} aria-label="Hamza Ashraf — back to top">
          {/* The supplied file is a full lockup — mark and wordmark together —
              so the HTML wordmark that used to sit beside the monogram is gone
              with it, rather than setting the name twice in two typefaces.
              The button carries its own aria-label, so the image stays
              decorative. */}
          <img className="nav__logo" src={logoLockup} alt="" width={894} height={318} />
        </button>

        <nav className="nav__links" aria-label="Primary">
          {links.map((link) => (
            <button key={link.id} className="nav__link" onClick={() => navigate(link.id)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="nav__actions">
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
      </header>

      {/* Deliberately a sibling of the header, not a child of it.
          .nav--scrolled applies backdrop-filter, and a filtered element becomes
          the containing block for its position:fixed descendants — so nested
          here the drawer stopped resolving against the viewport the moment the
          page scrolled. Its `inset: var(--header-height) 0 0 0` then measured
          against a bar exactly --header-height tall and collapsed to zero
          height: the toggle flipped to an X and no menu ever appeared. */}
      <div id="mobile-nav" className={`nav__drawer${open ? ' is-open' : ''}`} hidden={!open}>
        <nav className="container nav__drawer-inner" aria-label="Mobile">
          {links.map((link, index) => (
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
          <button className="btn btn--ghost nav__drawer-cta" onClick={() => navigate(navCta.id)}>
            {navCta.label}
          </button>
        </nav>
      </div>
    </>
  )
}
