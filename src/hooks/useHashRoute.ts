import { useEffect, useState } from 'react'

/**
 * Minimal hash router. Case studies live at `#/case/<slug>`; everything else
 * is the single scrolling page. Hash routing means the site deploys to any
 * subpath on GitHub Pages with no 404 rewrite rules and no router dependency.
 */
export type Route = { name: 'home' } | { name: 'case'; slug: string }

function parse(hash: string): Route {
  const match = hash.replace(/^#/, '').match(/^\/case\/([\w-]+)$/)
  return match ? { name: 'case', slug: match[1] } : { name: 'home' }
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

export function navigateHome() {
  // Clearing the hash without pushing an empty `#` entry keeps the back button clean.
  history.pushState('', '', window.location.pathname + window.location.search)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}
