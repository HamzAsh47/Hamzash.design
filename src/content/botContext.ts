import { brand, site } from './brand'
import { faq } from './faq'
import { oneTimePackages, pricingIntro, retainer } from './pricing'
import { processSteps } from './process'
import { services } from './services'
import { system } from './system'

/**
 * The assistant's entire knowledge, assembled from the same content the page
 * renders.
 *
 * Built rather than written out, so the bot cannot quote a rate the site no
 * longer charges. Change a tier price in pricing.ts and the answer changes
 * with it; there is no second copy to remember to update.
 *
 * Deliberately not a vector store. This is roughly three thousand tokens of
 * stable, structured fact — small enough to hand the model in full on every
 * turn, which removes retrieval as a source of wrong answers entirely.
 */

const line = (label: string, value: string) => `${label}: ${value}`

function pricingSection() {
  const out: string[] = [
    `All pricing is derived from a flat ${pricingIntro.hourlyRate} rate. ${pricingIntro.lede}`,
    '',
    'ONE-TIME PROJECT PACKAGES',
  ]

  for (const pkg of oneTimePackages) {
    out.push('', `${pkg.title} — ${pkg.summary}`)
    for (const tier of pkg.tiers) {
      out.push(
        `  ${tier.name}: ${tier.price} (${tier.meta})${tier.featured ? ' [most chosen]' : ''}`,
      )
      out.push(`    Includes: ${tier.points.join('; ')}`)
      if (tier.spec?.length) {
        const spec = tier.spec
          .filter((s) => s.value !== '—')
          .map((s) => `${s.label} ${s.value}`)
          .join(', ')
        out.push(`    Spec: ${spec}`)
      }
    }
    if (pkg.addOns?.length) {
      out.push(`  Add-ons: ${pkg.addOns.map((a) => `${a.label} ${a.price}`).join(', ')}`)
    }
  }

  out.push('', 'MONTHLY RETAINERS', retainer.note)
  for (const tier of retainer.tiers) {
    out.push(
      `  ${tier.name}: ${tier.price} (${tier.meta})${tier.featured ? ' [most chosen]' : ''} — ${tier.points.join('; ')}`,
    )
  }
  out.push(
    retainer.hoursRollOver ? retainer.rollOverCopy.on : retainer.rollOverCopy.off,
  )

  return out.join('\n')
}

/**
 * The real client projects. Kept here by hand, unlike everything else on this
 * page, because caseStudies.ts imports image assets that cannot be bundled
 * into a Worker.
 *
 * That hand-copying is a liability, and it has already bitten once: the
 * follower count and the WACA timeline here went on being quoted by the bot
 * after both were corrected in the case studies. If a study is added or a
 * figure changes, change it here in the same edit.
 */
const portfolio = `
Josef's Buffalo Wings (Sep 2023—Mar 2026) — full system: brand identity, mascot, packaging, interior and facade for two Hamburg locations, animated LED menus, and the social presence. Grew @josefs_hamburg from 0 to ~4,800 followers over two years six months; the business went from one location to two, funded by the first.
CultureLancer (2024) — UI/UX and product design for a two-sided job-matching platform. Brand already existed; built the design system, both dashboards, onboarding, messaging, courses and membership. Live and operating.
WACA / WA Cricket (2024) — ANZPCC 2024 tournament guide. A 64-page interactive guide built on a repeatable design system in about a week, then a matching A5 print edition in a further three to four days. Worked as art director with a collaborator.
Uplift K12 (Oct 2023—Oct 2025) — a funded home-schooling math platform. Started at 2 sample games, grew to 270+ interactive math games across grades K-8, then full ownership of the platform's UI/UX: dashboard, lesson playlists and a shared interactive whiteboard. Also the K1-K4 curriculum structure and a 20-game physical board game adaptation.
EZ Sports Apparel (Apr 2024—present) — standing seasonal design partner for a Texas custom-uniform business. Client-facing team uniform mockup decks and vendor-ready production files, across recurring league accounts (Bear Creek Little League, Prodigy, Outlaws, Texas Bombers, Power Soccer, LTYA).
GoTeach.ai (2025) — AI-driven EdTech platform for teachers, for the same client as Uplift K12. Brand identity from zero: mascot-led logo, colour and type system, a nine-pose mascot cast. Extended into a full UI/UX design system and the core product screens — landing page, auth flows, and a TEKS-aligned worksheet dashboard. Designed, not built: no development work is claimed on this one.
Full case studies are on the site under Work. More work: ${brand.portfolioLinks.map((l) => `${l.label} on ${l.platform}`).join(', ')}.
`.trim()

export const botKnowledge = [
  `WHO THIS IS`,
  `${brand.name} — ${brand.positioning}. Tagline: "${brand.tagline}".`,
  '',
  `THE CORE DIFFERENTIATOR (lead with this when asked what makes him different, or why choose him)`,
  `Most startups need two or three separate specialists to stay visually consistent: a brand designer, a UI/UX designer, and a motion editor. That fragmentation causes coordination friction and inconsistency. Hamza is one person who owns and delivers all three as a single connected system — brand, product interface, and motion — so the identity that ships in the product is the identity in the launch film. One system, not three vendors.`,
  '',
  `WHO HE WORKS WITH`,
  `Funded and early-growth tech and edtech startups needing a unified brand + product + motion system. Not one-off logo requests.`,
  '',
  `SERVICES`,
  ...services.map((s) => line(s.title, s.description)),
  '',
  `THE ARGUMENT FOR A SYSTEM`,
  system.lede,
  '',
  `PRICING`,
  pricingSection(),
  '',
  `HOW A PROJECT RUNS`,
  ...processSteps.map((s) => `${s.number}. ${s.title} — ${s.description}`),
  '',
  `SELECTED WORK`,
  portfolio,
  '',
  `FAQ`,
  ...faq.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
  '',
  `LANGUAGES`,
  `Hamza works in English and Urdu. Client-facing work — writing, presentations, calls — is in English.`,
  '',
  /* So "tell me about the site" or "what's on your portfolio" gets an answer
     rather than a deflection into a pitch. The bot is a guide to this page
     first and an intake conversation second. */
  `THE SITE ITSELF (answer questions about it directly, from this)`,
  `hamzash47.com is Hamza's portfolio. Top to bottom it runs: a hero; The System (why brand, product and motion are one system rather than three vendors); Work (the case studies, filterable by Brand Identity, UI/UX and Motion Branding); Pricing (packages and tiers, plus monthly retainers); Reviews (real LinkedIn reviews from named clients, each linking to the public post it appears in); Process (how a project runs); FAQ; and the brief form at the bottom. Each case study opens as its own page with the same four-part structure — business problem, the system built, the deliverable, result — and images that can be clicked to open full size.`,
  `The reviews on the site are real and verifiable, each linked to the public LinkedIn post it came from. Named reviewers: Dr. Marc Anthony Santamaria (Santamaria Law Firm), Brian Schoellkopf (EZ Sports Apparel), Mehul Shah (Uplift K12 / GoTeach.ai).`,
  '',
  `HOW TO GET IN TOUCH`,
  `Brief form on the site (four short steps, best for real enquiries — it reaches ${site.contactEmail}). WhatsApp ${site.whatsapp.display} for quick questions. LinkedIn: ${brand.handles.linkedin.href}.`,
  `Discovery call — ${site.scheduling.label}: ${site.scheduling.url}. Offer this whenever someone asks to book a call or speak to Hamza, and alongside the brief form when a question needs him rather than you.`,
].join('\n')
