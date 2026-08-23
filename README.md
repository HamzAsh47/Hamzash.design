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

The brief posts to `/api/brief`, which sends it on with Cloudflare's
`send_email` binding — no third-party form service and no API key.

Two constraints come with that binding, and both are already satisfied:

- **From** must be on a domain with Email Routing enabled on the account —
  `contact@hamzash47.com`.
- **To** must be an address already *verified* on the account. The binding is
  pinned to that one address in `wrangler.jsonc`, so a bug here cannot turn the
  endpoint into a relay aimed somewhere else.

The visitor's own address goes in `Reply-To`, so replying from the inbox
reaches them rather than the site's own routing rule.

A honeypot field named `website` sits off-screen in the form. It is invisible
to people and to screen readers, so anything that arrives with it filled came
from a bot; the Worker answers those with a plain `200` rather than explaining
which check they failed.

### The visitor's confirmation email (Resend)

The Cloudflare binding above can only reach that one verified address, so it
cannot send anything to the person who filled the form. Resend does that half:
a short confirmation with the discovery-call booking link.

It is **optional**. With no `RESEND_API_KEY` set, the confirmation is skipped
and the brief still arrives — which is why the site worked before the key
existed and keeps working if the key is ever revoked. The send happens in
`ctx.waitUntil` *after* the brief is delivered, so a Resend outage, an expired
key or an unverified domain costs a courtesy email and nothing else. The
visitor still sees the booking link on the confirmation screen either way.

To switch it on:

1. Create a Resend account (free tier: 3,000 emails/month, 100/day) and add
   the domain `hamzash47.com` under **Domains**.
2. Resend gives a DKIM `TXT` record and an SPF `TXT` record. Add the DKIM one
   to Cloudflare DNS as-is.
3. **Merge the SPF record — do not add a second one.** Email Routing already
   publishes `v=spf1 include:_spf.mx.cloudflare.net ~all` on the root domain,
   and two SPF records on one name is a misconfiguration that makes both
   unreliable. Edit the existing record to:

   ```
   v=spf1 include:_spf.mx.cloudflare.net include:amazonses.com ~all
   ```

4. Once Resend shows the domain as Verified:

   ```
   npx wrangler secret put RESEND_API_KEY
   ```

   Then redeploy. Nothing else changes — `RESEND_FROM` is available if the
   domain is ever verified on a `send.` subdomain instead, but the default
   `Hamza Ashraf <contact@hamzash47.com>` is correct for the setup above.

For local runs, put the key in `.dev.vars` (gitignored) rather than
`wrangler.jsonc`.

**What the confirmation contains, and why so little.** Anyone can POST
`/api/brief` with somebody else's address, so any free text echoed back would
turn the form into a way to send chosen words to a chosen stranger over this
domain. The confirmation is therefore fixed copy plus the booking link, and
the only variable in it is a first name — stripped to letters, marks,
apostrophes and hyphens, capped at 40 characters, and dropped entirely if
what is left is shorter than two. The submitted brief is never repeated back;
they typed it a moment ago, and including it would reopen exactly that hole.

## Deploying

Hosted on **Cloudflare Workers** (not Pages) and served at
**https://hamzash47.com**. `main` is the only branch that deploys; there is no
GitHub Actions workflow, because two deploy paths pointing at the same
repository is the fastest way to lose track of what is actually live.

`wrangler.jsonc` is what makes the deploy work — Workers Builds has no
convention for "where is the build output", so without it a connected Worker
has nothing to publish.

One route runs code: `/api/brief`, in `worker/index.ts`, which emails the
contact form's brief. Everything else is the static build, served from `dist`.

Workers Builds settings, in the dashboard:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Production branch | `main` |

The Vite `base` is `'./'` and case studies use a hash router (`#/case/<slug>`),
so the same build works from the apex domain, a `*.workers.dev` preview, or a
local `dist` preview — with no rewrite rules and no base-path reconfiguration.

`not_found_handling` is set to `404-page` rather than `single-page-application`
on purpose: a fragment never reaches the server, so `/` is the only real path
here. SPA handling would answer every unknown path with the homepage and a
200, which a crawler indexes as duplicate content.

Validate a config change without deploying:

```sh
npm run build && npx wrangler deploy --dry-run
```

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
