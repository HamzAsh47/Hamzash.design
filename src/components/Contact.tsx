import { memo, useState } from 'react'
import { contact, site } from '../content'
import contactPortrait from '../assets/images/contact-portrait.webp'
import { Eyebrow } from './Eyebrow'
import { Icon } from './Icon'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

type FormState = {
  name: string
  company: string
  email: string
  budget: string
  scope: string[]
  details: string
  /** Honeypot — hidden from people, so anything in it came from a bot. */
  website: string
}

const EMPTY: FormState = {
  name: '',
  company: '',
  email: '',
  budget: '',
  scope: [],
  details: '',
  website: '',
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

/* One brief, one shape. Both routes are built from this, so a field can never
   be carried by the mailto body and quietly dropped from the POST — which is
   exactly the kind of divergence that loses the Details answer, the only part
   of the brief written in the visitor's own words. */
function buildBrief(form: FormState) {
  return {
    subject: `Project brief — ${form.company || form.name}`,
    name: form.name,
    company: form.company || '—',
    email: form.email,
    budget: form.budget || '—',
    scope: form.scope.length ? form.scope.join(', ') : '—',
    details: form.details.trim() || '—',
    website: form.website,
  }
}

function buildMailto(form: FormState) {
  const brief = buildBrief(form)
  const body = [
    `Name: ${brief.name}`,
    `Company: ${brief.company}`,
    `Email: ${brief.email}`,
    `Budget: ${brief.budget}`,
    `Scope: ${brief.scope}`,
    '',
    'Details:',
    brief.details,
  ].join('\n')

  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(brief.subject)}&body=${encodeURIComponent(body)}`
}

/**
 * The heading, lede and step rail, split out and memoised.
 *
 * None of it depends on a single character the visitor types, but it used to
 * re-render on every keystroke along with the rest of the form — heading
 * re-tokenised, step rail rebuilt, the whole subtree diffed. Keyed on `step`
 * alone, a keystroke now stops at the field it belongs to.
 */
const ContactIntro = memo(function ContactIntro({ step }: { step: number }) {
  return (
    <Reveal className="contact__intro">
      <Eyebrow>{contact.eyebrow}</Eyebrow>
      <Heading text={contact.headline} className="headline--lg" />
      <p className="section__lede">{contact.lede}</p>

      <ol className="contact__steps" aria-hidden="true">
        {contact.steps.map((item, index) => (
          <li
            key={item.id}
            className={`contact__step${index === step ? ' is-active' : ''}${
              index < step ? ' is-done' : ''
            }`}
          >
            {/* The glyph alone. The number beside it was saying the same
                thing twice — the panel opposite already reads
                "STEP 1 OF 4 — YOU", and the list is in order. */}
            <span className="contact__step-mark">
              {index < step ? <Icon name="check" size={14} /> : <Icon name={item.icon} size={14} />}
            </span>
            <span className="contact__step-label">{item.label}</span>
          </li>
        ))}
      </ol>

      {/* Whose inbox this actually lands in. The differentiator on this site
          is that one person does all of it, and the form is the moment that
          claim is worth showing rather than only stating. */}
      <figure className="contact__who">
        <img
          src={contactPortrait}
          alt="Hamza Ashraf"
          width={900}
          height={1200}
          loading="lazy"
        />
        <figcaption className="contact__who-copy">
          <span className="contact__who-name">Hamza Ashraf</span>
          <span className="contact__who-role">
            Reads and answers this himself, usually within a day.
          </span>
        </figcaption>
      </figure>
    </Reveal>
  )
})

export function Contact() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const isConnected = Boolean(site.formEndpoint || site.contactEmail)
  const lastStep = contact.steps.length - 1

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const toggleScope = (value: string) =>
    update(
      'scope',
      form.scope.includes(value) ? form.scope.filter((item) => item !== value) : [...form.scope, value],
    )

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) return 'Add your name so I know who I am replying to.'
      if (!form.company.trim()) return 'Add the company or product this is for.'
      if (!isEmail(form.email)) return 'That email address does not look right.'
    }
    if (step === 1 && !form.budget) return 'Pick a budget range — an estimate is fine.'
    if (step === 2 && form.scope.length === 0) return 'Select at least one area of scope.'
    return ''
  }

  const next = () => {
    const message = validateStep()
    if (message) {
      setError(message)
      return
    }
    setStep((current) => Math.min(current + 1, lastStep))
  }

  const back = () => {
    setError('')
    setStep((current) => Math.max(current - 1, 0))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const message = validateStep()
    if (message) {
      setError(message)
      return
    }

    if (site.formEndpoint) {
      setStatus('submitting')
      try {
        /* Flat scalars, not the raw form state: `scope` is an array, and the
           hosted form backends each flatten arrays differently — one of them
           silently keeps only the last checkbox. Joining it here means the
           brief reads the same whichever backend is behind the endpoint. */
        const response = await fetch(site.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(buildBrief(form)),
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        setStatus('success')
      } catch {
        setStatus('error')
      }
      return
    }

    if (site.contactEmail) {
      window.location.href = buildMailto(form)
      setStatus('success')
    }
  }

  return (
    <section className="section section--hairline section--tint section--mark-frame contact" id="contact">
      <div className="container contact__inner">
        <ContactIntro step={step} />

        <Reveal className="contact__panel" delayMs={100}>
          {status === 'success' ? (
            <div className="contact__done" role="status">
              <Eyebrow>SYS :: RECEIVED</Eyebrow>
              <p className="contact__done-heading">
                {site.formEndpoint ? contact.successHeading : contact.mailtoHeading}
              </p>
              <p className="lede">
                {site.formEndpoint ? contact.successMessage : contact.mailtoMessage}
              </p>

              {/* The booking window, offered here rather than emailed. The
                  Worker's send_email binding is locked to one verified
                  destination — it can reach Hamza's inbox and nobody else's —
                  so a visitor-facing confirmation email would need a whole
                  new provider. This reaches them faster anyway: it is on
                  screen the moment they submit, with nothing to open. */}
              <div className="contact__book">
                <p className="contact__book-label">{contact.schedulingLead}</p>
                <a
                  className="btn btn--ghost contact__book-link"
                  href={site.scheduling.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {site.scheduling.label}
                  <span className="btn__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={submit} noValidate>
              <p className="form__progress">
                Step {step + 1} of {contact.steps.length} — {contact.steps[step].label}
              </p>

              {step === 0 && (
                <div className="form__fields">
                  <label className="field">
                    <span className="field__label">{contact.fields.name.label} *</span>
                    <input
                      className="field__input"
                      value={form.name}
                      placeholder={contact.fields.name.placeholder}
                      onChange={(event) => update('name', event.target.value)}
                      autoComplete="name"
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">{contact.fields.company.label} *</span>
                    <input
                      className="field__input"
                      value={form.company}
                      placeholder={contact.fields.company.placeholder}
                      onChange={(event) => update('company', event.target.value)}
                      autoComplete="organization"
                    />
                  </label>

                  <label className="field">
                    <span className="field__label">{contact.fields.email.label} *</span>
                    <input
                      className="field__input"
                      type="email"
                      value={form.email}
                      placeholder={contact.fields.email.placeholder}
                      onChange={(event) => update('email', event.target.value)}
                      autoComplete="email"
                    />
                  </label>
                </div>
              )}

              {step === 1 && (
                <fieldset className="form__fields">
                  <legend className="field__label">Project budget range</legend>
                  <div className="options">
                    {contact.budgetBands.map((band) => (
                      <label className="option" key={band}>
                        <input
                          type="radio"
                          name="budget"
                          value={band}
                          checked={form.budget === band}
                          onChange={() => update('budget', band)}
                        />
                        <span>{band}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset className="form__fields">
                  <legend className="field__label">Project scope</legend>
                  <div className="options options--wide">
                    {contact.scopeOptions.map((option) => (
                      <label className="option" key={option.value}>
                        <input
                          type="checkbox"
                          checked={form.scope.includes(option.label)}
                          onChange={() => toggleScope(option.label)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <div className="form__fields">
                  <label className="field">
                    <span className="field__label">{contact.fields.details.label}</span>
                    <textarea
                      className="field__input field__input--area"
                      rows={6}
                      value={form.details}
                      placeholder={contact.fields.details.placeholder}
                      onChange={(event) => update('details', event.target.value)}
                    />
                  </label>

                  {/* Off-screen rather than display:none — a bot reading the
                      DOM fills it, a screen reader is told to skip it, and a
                      browser autofilling "website" cannot reach a field it
                      never renders in the tab order. */}
                  <div className="form__trap" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(event) => update('website', event.target.value)}
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="form__error" role="alert">
                  {error}
                </p>
              )}

              {status === 'error' && (
                <p className="form__error" role="alert">
                  {contact.errorMessage}{' '}
                  <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
                </p>
              )}

              <div className="form__actions">
                {step > 0 && (
                  <button type="button" className="btn btn--ghost" onClick={back}>
                    Back
                  </button>
                )}

                {/* The keys matter. Both branches render a <button> in the
                    same slot, so without them React reconciles one into the
                    other and only patches the attributes — the advance button
                    on the last-but-one step became type="submit" between
                    mousedown and mouseup, and the browser submitted the form
                    on the click that was meant to open the Details step. Every
                    brief arrived a step early with details empty. Distinct
                    keys force an unmount, so the node that receives the click
                    is the node that was clicked. */}
                {step < lastStep ? (
                  <button key="advance" type="button" className="btn btn--primary" onClick={next}>
                    {contact.steps[step].next}
                    <span className="btn__arrow" aria-hidden="true">
                      <Icon name="arrow-right" size={14} />
                    </span>
                  </button>
                ) : (
                  <button
                    key="submit"
                    type="submit"
                    className="btn btn--primary"
                    disabled={!isConnected || status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending…' : contact.submitLabel}
                  </button>
                )}
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
