import { useEffect, useRef, useState } from 'react'
import { site } from '../content'
import { Icon } from './Icon'

type Turn = { role: 'user' | 'assistant'; content: string }

/* Openers, so the first screen is not an empty box asking the visitor to
   invent a question. These are the three things people actually arrive
   wanting to know. */
const STARTERS = [
  'What makes you different from hiring an agency?',
  'Which package fits a startup rebrand?',
  'How does a project actually run?',
]

/**
 * Turns bare URLs in a reply into links.
 *
 * The assistant is told to offer the booking window as a full URL on its own,
 * and a model writes exactly that — a URL, as text. Rendered into a plain
 * `<p>` it stays text, so the one message whose whole purpose is to get
 * somebody onto a call ended in a link they would have to select and copy.
 *
 * Deliberately not markdown parsing or `dangerouslySetInnerHTML`: this is
 * model output, and the only thing in it that needs to be interactive is an
 * http(s) URL. Everything else stays inert text, which is the right default
 * for a string this component did not write.
 */
const URL_PATTERN = /(https?:\/\/[^\s<>"')\]]+)/g

function withLinks(text: string) {
  /* Split on a capturing group, so the URLs come back in the array between
     the text around them. Tested with `startsWith` rather than the regex,
     because a /g regex carries lastIndex between calls and `test` would then
     skip every other match. */
  return text.split(URL_PATTERN).map((part, index) =>
    part.startsWith('http://') || part.startsWith('https://') ? (
      <a key={index} href={part} target="_blank" rel="noreferrer noopener">
        {part}
      </a>
    ) : (
      part
    ),
  )
}

const GREETING =
  "Ask me about Hamza's services, pricing, process or past work. I answer from what is on this site — for anything that needs a decision, I will point you to him."

/* Shown before the visitor has typed anything, because that is the only point
   at which telling them is worth anything. Handing this conversation on is
   the whole purpose of the two buttons below it, so it is stated plainly and
   up front rather than buried in a footnote nobody reads. */
const DISCLOSURE =
  'This conversation is recorded and shared with Hamza Ashraf so he can follow up personally.'

/* A handoff emails Hamza a summary and the transcript, so it should only fire
   on a conversation that has actually happened. Matches the Worker's own
   floor — it enforces this again server-side, since a client check protects
   nothing on its own. */
const MIN_HANDOFF_TURNS = 2

export function Assistant() {
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const launchRef = useRef<HTMLButtonElement>(null)

  // Follow the conversation down as it grows.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, busy])

  /* Guards the effect below against its own first run. Without it, mounting
     counted as "closed" and the launcher grabbed focus on page load — every
     visitor arrived with a focused floating button lit in its focus colour,
     and a keyboard user started the page inside a widget they never opened. */
  const wasOpen = useRef(false)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      wasOpen.current = true
      return
    }
    /* Closing must hand focus back to the control that opened it, or a keyboard
       user is dropped at the top of the document with no idea where they were.
       Only on a real close, though — never on mount. */
    if (wasOpen.current) {
      launchRef.current?.focus()
      wasOpen.current = false
    }
  }, [open])

  /* On a phone the panel is a sheet covering most of the screen. Letting the
     page scroll underneath it means a swipe aimed at the conversation moves the
     site instead, which is the classic broken-modal feeling. */
  useEffect(() => {
    if (!open) return
    const sheet = window.matchMedia('(max-width: 620px)').matches
    if (!sheet) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  /* The on-screen keyboard shrinks the visual viewport without changing the
     layout viewport, so a bottom-anchored sheet ends up underneath it. Track
     the difference and lift the sheet by exactly that much. */
  useEffect(() => {
    const vv = window.visualViewport
    if (!open || !vv) return
    const sync = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      panelRef.current?.style.setProperty('--keyboard-inset', `${inset}px`)
    }
    sync()
    vv.addEventListener('resize', sync)
    vv.addEventListener('scroll', sync)
    return () => {
      vv.removeEventListener('resize', sync)
      vv.removeEventListener('scroll', sync)
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* Grow with the message rather than making the visitor scroll a one-line
     box to re-read what they typed. Capped in CSS. */
  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  /* Hands the conversation to a person, and tells Hamza it happened.
     The email is deliberately not awaited before opening the destination: the
     visitor asked to talk to somebody, and making them watch a spinner while
     two emails go out is the wrong order. `keepalive` is what lets the
     request survive the tab losing focus to WhatsApp. */
  const handoff = (route: 'whatsapp' | 'call') => {
    const target =
      route === 'whatsapp'
        ? `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.prefill)}`
        : site.scheduling.url

    if (turns.filter((turn) => turn.role === 'user').length >= MIN_HANDOFF_TURNS) {
      void fetch('/api/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: turns, route }),
        keepalive: true,
      }).catch(() => {
        /* Silent. The visitor is on their way to Hamza either way, and an
           error toast about an email they never asked for helps nobody. */
      })
    }

    window.open(target, '_blank', 'noopener,noreferrer')
  }

  const send = async (text: string) => {
    const message = text.trim()
    if (!message || busy) return

    const next: Turn[] = [...turns, { role: 'user', content: message }]
    setTurns(next)
    setDraft('')
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
    setError('')
    setBusy(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = (await response.json()) as { reply?: string; error?: string }
      if (!response.ok || !data.reply) throw new Error(data.error ?? 'No reply')
      setTurns([...next, { role: 'assistant', content: data.reply }])
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        ref={launchRef}
        className={`assistant-launch${open ? ' is-open' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        aria-label={open ? 'Close the assistant' : 'Ask about pricing, services or process'}
      >
        <span className="assistant-launch__glyph" aria-hidden="true">
          {open ? '×' : <Icon name="assistant" />}
        </span>
      </button>

      <div
        ref={panelRef}
        id="assistant-panel"
        className={`assistant${open ? ' is-open' : ''}`}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site assistant"
      >
        <header className="assistant__head">
          <p className="assistant__title">
            {/* Cyan is reserved for AI and system context, and this is exactly
                that — so the glyph carries it, here and on the launcher. */}
            <span className="assistant__title-glyph" aria-hidden="true">
              <Icon name="assistant" />
            </span>
            Ask about the work
          </p>
          <button className="assistant__close" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
        </header>

        <div className="assistant__log" ref={logRef} role="log" aria-live="polite" aria-atomic="false">
          <p className="assistant__notice">{DISCLOSURE}</p>
          <p className="assistant__msg assistant__msg--bot">{GREETING}</p>

          {turns.map((turn, index) => (
            <p
              key={index}
              className={`assistant__msg assistant__msg--${turn.role === 'user' ? 'user' : 'bot'}`}
            >
              {turn.role === 'assistant' ? withLinks(turn.content) : turn.content}
            </p>
          ))}

          {busy && (
            <p className="assistant__msg assistant__msg--bot assistant__msg--thinking">
              <span className="assistant__dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="visually-hidden">Thinking</span>
            </p>
          )}

          {error && (
            <p className="assistant__error" role="alert">
              {error}
            </p>
          )}

          {turns.length === 0 && !busy && (
            <div className="assistant__starters">
              {STARTERS.map((starter) => (
                <button key={starter} className="assistant__starter" onClick={() => send(starter)}>
                  {starter}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          className="assistant__form"
          onSubmit={(event) => {
            event.preventDefault()
            send(draft)
          }}
        >
          <textarea
            ref={inputRef}
            className="assistant__input"
            value={draft}
            rows={1}
            maxLength={900}
            placeholder="Ask a question…"
            onChange={(event) => {
              setDraft(event.target.value)
              autoGrow(event.target)
            }}
            /* Enter sends, Shift+Enter breaks the line — the convention every
               chat input already trains people to expect. */
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                send(draft)
              }
            }}
          />
          <button className="assistant__send" type="submit" disabled={busy || !draft.trim()}>
            Send
          </button>
        </form>

        {/* Appear once there is a conversation worth handing over, which is
            also the point at which the assistant is told to offer this. Real
            buttons rather than links the model has to remember to produce:
            the route out of a chat should not depend on what a model wrote. */}
        {turns.filter((turn) => turn.role === 'user').length >= MIN_HANDOFF_TURNS && (
          <div className="assistant__handoff">
            <p className="assistant__handoff-label">Talk to Hamza directly</p>
            <div className="assistant__handoff-actions">
              <button className="assistant__handoff-btn" onClick={() => handoff('whatsapp')}>
                <Icon name="whatsapp" />
                WhatsApp
              </button>
              <button className="assistant__handoff-btn" onClick={() => handoff('call')}>
                <Icon name="calendar" />
                Book a call
              </button>
            </div>
          </div>
        )}

        <p className="assistant__foot">
          Answers come from this site. For a quote or a start date,{' '}
          <a href={`https://wa.me/${site.whatsapp.number}`} target="_blank" rel="noreferrer">
            message Hamza
          </a>
          .
        </p>
      </div>
    </>
  )
}
