import { useEffect, useState } from 'react'

/**
 * Minimal hash router. Case studies live at `#/case/<slug>`; everything else
 * is the single scrolling page. Hash routing means the site deploys to any
 * subpath on GitHub Pages with no 404 rewrite rules and no router dependency.
 */
export type Route = { name: 'home' } | { name: 'case'; slug: string } | { name: 'about' }

function parse(hash: string): Route {
  const path = hash.replace(/^#/, '')
  const caseMatch = path.match(/^\/case\/([\w-]+)$/)
  if (caseMatch) return { name: 'case', slug: caseMatch[1] }
  if (path === '/about') return { name: 'about' }
  return { name: 'home' }
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    parse(typeof window === 'undefined' ? '' : window.location.hash),
  )

  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function navigateToCase(slug: string) {
  window.location.hash = `/case/${slug}`
}

export function navigateToAbout() {
  window.location.hash = '/about'
}

export function navigateHome() {
  // Clearing the hash without pushing an empty `#` entry keeps the back button clean.
  history.pushState('', '', window.location.pathname + window.location.search)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}
