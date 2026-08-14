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
import { caseStudies } from './content'
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

  return (
    <>
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
