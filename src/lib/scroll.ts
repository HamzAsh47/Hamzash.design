import { navigateHome } from '../hooks/useHashRoute'

/**
 * Scrolls to a page section. If a case study is open, returns to the main page
 * first and waits a frame so the target section exists before scrolling.
 */
export function goToSection(id: string) {
  const scroll = () => {
    const target = document.getElementById(id)
    if (!target) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  if (window.location.hash.startsWith('#/case/')) {
    navigateHome()
    requestAnimationFrame(() => requestAnimationFrame(scroll))
    return
  }

  scroll()
}
