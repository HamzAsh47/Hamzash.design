import { useEffect } from 'react'

type Meta = {
  title: string
  description: string
  /** Absolute URL for this view. Drives both the canonical tag and og:url. */
  url: string
}

/**
 * Keeps the document head in step with the current route.
 *
 * The site is one document with a hash router, so without this every case
 * study shares the home page's title and description — in a search result or a
 * shared link they are all indistinguishable from each other and from the
 * front page. Each tag is created on first use and then mutated, so nothing
 * accumulates across navigations.
 */
export function useDocumentMeta({ title, description, url }: Meta) {
  useEffect(() => {
    document.title = title

    const setMeta = (key: 'name' | 'property', value: string, content: string) => {
      const selector = `meta[${key}="${value}"]`
      let tag = document.head.querySelector<HTMLMetaElement>(selector)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(key, value)
        document.head.appendChild(tag)
      }
      tag.content = content
    }

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, url])
}
