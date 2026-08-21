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
 * The three real client projects. Kept here by hand, unlike everything else on
 * this page, because caseStudies.ts imports image assets that cannot be
 * bundled into a Worker. Four short lines — if a case study is added to the
 * site, add it here too.
 */
const portfolio = `
Josef's Buffalo Wings (Sep 2023—Mar 2026) — full system: brand identity, mascot, packaging, interior and facade for two Hamburg locations, animated LED menus, and the social presence. Grew @josefs_hamburg from 0 to ~5,000 followers; the business went from one location to two.
CultureLancer (2024) — UI/UX and product design for a two-sided job-matching platform. Brand already existed; built the design system, both dashboards, onboarding, messaging, courses and membership. Live and operating.
WACA / WA Cricket (2024) — ANZPCC 2024 tournament guide. A 64-page interactive guide built on a repeatable design system in three to four days, then a matching A5 print edition in another 48 hours. Worked as art director with a collaborator.
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
  `HOW TO GET IN TOUCH`,
  `Brief form on the site (four short steps, best for real enquiries — it reaches ${site.contactEmail}). WhatsApp ${site.whatsapp.display} for quick questions. LinkedIn: ${brand.handles.linkedin.href}.`,
].join('\n')
