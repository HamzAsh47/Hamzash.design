import { navigateHome } from '../hooks/useHashRoute'

/**
 * Scrolls to a page section. If a case study or the about page is open,
 * returns to the main page first and waits a frame so the target section
 * exists before scrolling.
 */
export function goToSection(id: string) {
  const scroll = () => {
    const target = document.getElementById(id)
    if (!target) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const hash = window.location.hash
  if (hash.startsWith('#/case/') || hash === '#/about') {
    navigateHome()
    requestAnimationFrame(() => requestAnimationFrame(scroll))
    return
  }

  scroll()
}
