import { brand, faq, services, site, testimonials } from '../content'

/**
 * schema.org graph for the site.
 *
 * A ProfessionalService and the Person who is that service — which is the
 * literal shape of a one-person studio, and the shape the whole page argues
 * for. The reviews carry through as AggregateRating so the star count in a
 * search result is backed by entries a reader can go and check; only reviews
 * with a public source URL are counted, since an unverifiable rating is
 * exactly the kind of claim structured data gets penalised for.
 *
 * Rendered as a plain script tag rather than injected, so it is in the markup
 * the first time the page paints.
 *
 * `includeFaq` is not a convenience switch. Google requires FAQ markup to
 * describe questions actually visible on the page it is served with, and the
 * FAQ section only exists on the home route — emitting it on a case study
 * would be marking up content that is not there.
 */
export function StructuredData({ includeFaq = false }: { includeFaq?: boolean }) {
  const verified = testimonials.filter((item) => !item.isPlaceholder && item.sourceUrl)

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: brand.name,
        jobTitle: 'Senior Art Director',
        description: brand.positioning,
        url: site.url,
        sameAs: [
          brand.handles.linkedin.href,
          brand.handles.instagram.href,
          brand.handles.youtube.href,
          brand.handles.x.href,
          ...brand.portfolioLinks.map((link) => link.href),
        ],
        knowsAbout: [
          'Brand identity',
          'Design systems',
          'UI/UX design',
          'Product design',
          'Motion branding',
          'Art direction',
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${site.url}/#service`,
        name: `${brand.name} — Brand, Product and Motion`,
        description: site.description,
        url: site.url,
        slogan: brand.tagline,
        founder: { '@id': `${site.url}/#person` },
        provider: { '@id': `${site.url}/#person` },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Design services',
          itemListElement: services.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.title,
              description: service.description,
            },
          })),
        },
        ...(verified.length > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5',
            bestRating: '5',
            reviewCount: verified.length,
          },
          review: verified.map((item) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: item.name },
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
            reviewBody: item.quote,
            url: item.sourceUrl,
          })),
        }),
      },
      ...(includeFaq
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${site.url}/#faq`,
              mainEntity: faq.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <script
      type="application/ld+json"
      // The payload is built from local content, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
