# Hamza Ashraf — Personal Brand Website

Static site built to the locked brand system: Obsidian-dominant, Crimson as
accent only, Archivo / Fraunces / JetBrains Mono, with a CRT treatment scoped
strictly to photography.

Stack: Vite + React + TypeScript. No CMS and no backend — all copy and data
live in `src/content/`.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve the built site
npm run lint
```

## Editing content

**You should never need to open a component file to change copy.** Everything
lives in `src/content/`:

| File | Controls |
| --- | --- |
| `brand.ts` | Palette, tagline, positioning, social handles, portfolio links, **site-wide settings** (contact email, form endpoint, placeholder tags) |
| `navigation.ts` | Header links and the header CTA |
| `hero.ts` | Hero headline, subtitle, intro, CTAs, portrait, ticker |
| `services.ts` | The three pillar cards |
| `system.ts` | "The System" — old way vs. Hamza Ashraf way |
| `caseStudies.ts` | Portfolio grid + full case studies |
| `pricing.ts` | One-time tiers, retainer tiers, add-ons |
| `testimonials.ts` | Client reviews and the optional logo strip |
| `faq.ts` | FAQ questions and answers |
| `process.ts` | The four process steps |
| `contact.ts` | Form steps, budget bands, scope options |
| `footer.ts` | Footer columns and copyright |

### The headline convention

Every heading uses one convention — wrap the highlighted word(s) in square
brackets:

```ts
headline: 'Three vendors, or [one system.]'
```

Bracketed words render in **Archivo Black + Crimson**; everything else renders
in Archivo Medium + White. Keep to a maximum of two highlighted words (one is
better), landing on the first or last word of the heading. Trailing punctuation
goes inside the brackets so it stays attached to the highlighted word.

## Swapping in the real assets

### Signature portrait

`src/assets/images/portrait-placeholder.svg` is a 4:5 stand-in sitting in the
exact crop the real photograph will occupy, with the CRT treatment already
applied so the effect can be tuned before the shoot. To swap it in, drop the
real file into `src/assets/images/` and change one import at the top of
`src/content/hero.ts`. Nothing else changes.

### Case studies

Each entry in `src/content/caseStudies.ts` is one self-contained object. Every
entry carries a `plannedClient` field naming the real client it is reserved for
(WACA, Uplift K12, GoTeach.ai, Santamaria Law Firm). To go live with one:

1. Replace `client`, `projectType`, `resultStat` and the four `body` sections.
2. Swap the `cover` import for the real cover image (16:10).
3. Set `isPlaceholder: false`.

The `body` object is locked to the case-study structure — Business Problem →
The System Built → The Deliverable → Result / Value. Never a flat list of what
was designed.

### Draft markers

While `site.showPlaceholderTags` is `true` in `src/content/brand.ts`, sections
carrying dummy content render a small `DRAFT` chip (JetBrains Mono, Gunmetal),
and unfilled figures read as a muted italic aside — "result coming soon" —
rather than a bracketed data tag. Both are deliberately low-contrast so they
register as build notes, never as finished copy. Set the flag to `false` once
real content is in.

### Border discipline

Borders are reserved for things that genuinely are cards or discrete
comparables: portfolio case-study cards, pricing tier cards, form controls, and
the CRT photo frames. FAQ and process rows use single dividers. Everything else
— section heads, the pillar strip, The System section, reviews, the pricing
toggle, add-ons — separates by whitespace. Adding a border to a plain text
block is what made the page read as a wireframe; don't reintroduce it.

## Connecting the contact form

The multi-step form is built and validated but not yet wired to an inbox. Two
options, both one-line changes in `src/content/brand.ts`:

- Set `VITE_CONTACT_ENDPOINT` in the environment (see `.env.example`) to a POST
  endpoint (Formspree, Basin, Netlify Forms,
  a Worker). The form submits JSON and shows the success state in place.
- Or set `site.contactEmail`, and the form composes a pre-filled email instead.

Until one of them is set, the last step tells the visitor to reach out on
LinkedIn rather than silently dropping leads.

## Deploying

Hosted on Cloudflare, served at **https://hamzash47.com**. `main` is the only
branch that deploys; there is no GitHub Actions workflow, because two deploy
paths pointing at the same repository is the fastest way to lose track of what
is actually live.

Cloudflare build settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |
| Node version | 22 |

The Vite `base` is `'./'` and case studies use a hash router (`#/case/<slug>`),
so the same build works from the apex domain, a preview deployment on a
`*.pages.dev` subdomain, or a local `dist` preview — with no rewrite rules, no
SPA fallback and no base-path reconfiguration.

`VITE_SITE_URL` does not need to be set: the origin defaults to the production
domain. Set it only on a preview deployment, so previews do not emit canonical
tags pointing at production.

## Brand rules baked into the build

- **CRT is scoped to photography only** (`CrtImage`). It never wraps buttons,
  nav, cards or text blocks. Layers are scanlines, phosphor glow, light
  vignette, and an RGB split that fires on hover only — no barrel curvature, no
  looping flicker.
- **Electric Cyan is reserved** for AI/system context. On this site it appears
  only on the AI Video Production pricing listing.
- **Mono is for system labels only** — section eyebrows (`SYS.03 :: PORTFOLIO`),
  viewport tags, small meta. Never headlines or body copy.
- **Motion is restrained**: one orchestrated hero entrance, then quiet
  fade-and-rise reveals. `prefers-reduced-motion` is fully honoured.
- **Logo files are the real vectors** from the brand kit, never redrawn.

## Open items

These need real input before the site is fully launch-ready:

1. **Client reviews** — `src/content/testimonials.ts` holds structural
   placeholders only. Real quotes must come from
   `/areas/client-testimonials.md`; only verifiable reviews get published. When
   real data goes in, the client-sensitivity rule applies: Josef's Wings, Nana's
   Steakdoner, Mamdouh, Fast & Ferocious and Roll Rice Sushi must never appear
   with testimonial or ongoing-relationship language.
2. **Case study copy** — the four `body` sections per client still need writing.
3. **Photography** — signature portrait shots (oxblood corduroy overshirt,
   top-down angle, selective crimson rim-light).
4. **Contact inbox** — set `VITE_CONTACT_ENDPOINT` or `VITE_CONTACT_EMAIL` in
   the deploy environment (see `.env.example`). Until one of them is set the
   form stays in review-only mode and points at LinkedIn, so no brief is lost.
5. **SEO files** — `npm run seo` regenerates `public/sitemap.xml` and
   `public/robots.txt`. Set `VITE_SITE_URL` first if a custom domain is
   attached. The Open Graph card is committed at `public/og-image.png`; edit
   `scripts/og-image.html` and re-shoot it to change the card.
5. **Result stats** — every `resultStat` is a placeholder. Real figures only.

## Pricing source of truth

One-time tiers are the **$45/hr brand-guide rate card** (the Upwork-facing
repricing), not the live Freelancer.com listing prices — those differ, and
conflating them has caused confusion before. Retainer tiers are capped
monthly-hour packages at the same $45/hr rate. Roll-over is configurable via
`retainer.hoursRollOver`, not hardcoded into the copy.
