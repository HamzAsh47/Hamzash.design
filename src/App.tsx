import { CaseStudy, CaseStudyNotFound } from './components/CaseStudy'
import { Contact } from './components/Contact'
import { CrtFilters } from './components/CrtImage'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Portfolio } from './components/Portfolio'
import { Pricing } from './components/Pricing'
import { Process } from './components/Process'
import { Reviews } from './components/Reviews'
import { Services } from './components/Services'
import { SystemSection } from './components/SystemSection'
import { StructuredData } from './components/StructuredData'
import { brand, caseStudies, site } from './content'
import { useDocumentMeta } from './hooks/useDocumentMeta'
import { useHashRoute } from './hooks/useHashRoute'

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <SystemSection />
      <Portfolio />
      <Pricing />
      <Reviews />
      <Process />
      <Faq />
      <Contact />
    </>
  )
}

export default function App() {
  const route = useHashRoute()
  const study = route.name === 'case' ? caseStudies.find((item) => item.slug === route.slug) : null

  /* One document, a hash router and therefore one set of head tags unless
     something keeps them in step. Every case study would otherwise be indexed
     and shared under the home page's title and description. */
  useDocumentMeta(
    study
      ? {
          title: `${study.client} — ${study.projectType} case study | ${brand.name}`,
          description: study.body.problem,
          url: `${site.url}/#/case/${study.slug}`,
        }
      : route.name === 'case'
        ? {
            title: `Case study not found | ${brand.name}`,
            description: site.description,
            url: `${site.url}/`,
          }
        : { title: site.title, description: site.description, url: `${site.url}/` },
  )

  return (
    <>
      <StructuredData />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CrtFilters />
      <Nav />

      <main id="main">
        {route.name === 'home' ? (
          <HomePage />
        ) : study ? (
          <CaseStudy study={study} />
        ) : (
          <CaseStudyNotFound />
        )}
      </main>

      <Footer />
    </>
  )
}
