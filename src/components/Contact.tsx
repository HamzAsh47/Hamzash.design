import { useState } from 'react'
import { brand, contact, site } from '../content'
import { Eyebrow } from './Eyebrow'
import { Heading } from './Heading'
import { Reveal } from './Reveal'

type FormState = {
  name: string
  company: string
  email: string
  budget: string
  scope: string[]
  details: string
}

const EMPTY: FormState = { name: '', company: '', email: '', budget: '', scope: [], details: '' }

type Status = 'idle' | 'submitting' | 'success' | 'error'

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

function buildMailto(form: FormState) {
  const lines = [
    `Name: ${form.name}`,
    `Company: ${form.company || '—'}`,
    `Email: ${form.email}`,
    `Budget: ${form.budget || '—'}`,
    `Scope: ${form.scope.length ? form.scope.join(', ') : '—'}`,
    '',
    'Details:',
    form.details || '—',
  ]
  const subject = `Project brief — ${form.company || form.name}`
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
}

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
        const response = await fetch(site.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
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
    <section className="section section--hairline contact" id="contact">
      <div className="container contact__inner">
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
                <span className="contact__step-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="contact__step-label">{item.label}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="contact__panel" delayMs={100}>
          {status === 'success' ? (
            <div className="contact__done" role="status">
              <Eyebrow>SYS :: RECEIVED</Eyebrow>
              <p className="lede">
                {site.formEndpoint ? contact.successMessage : contact.mailtoMessage}
              </p>
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
                    <span className="field__label">{contact.fields.company.label}</span>
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

                  {!isConnected && (
                    <p className="form__notice">
                      {contact.unconfiguredMessage}{' '}
                      <a href={brand.handles.linkedin.href} target="_blank" rel="noreferrer">
                        {brand.handles.linkedin.label}
                      </a>
                    </p>
                  )}
                </div>
              )}

              {error && (
                <p className="form__error" role="alert">
                  {error}
                </p>
              )}

              {status === 'error' && (
                <p className="form__error" role="alert">
                  That did not send. Try again, or reach out on LinkedIn.
                </p>
              )}

              <div className="form__actions">
                {step > 0 && (
                  <button type="button" className="btn btn--ghost" onClick={back}>
                    Back
                  </button>
                )}

                {step < lastStep ? (
                  <button type="button" className="btn btn--primary" onClick={next}>
                    Continue
                    <span className="btn__arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                ) : (
                  <button
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
