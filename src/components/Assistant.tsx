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

const GREETING =
  "Ask me about Hamza's services, pricing, process or past work. I answer from what is on this site — for anything that needs a decision, I will point you to him."

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
          <p className="assistant__msg assistant__msg--bot">{GREETING}</p>

          {turns.map((turn, index) => (
            <p
              key={index}
              className={`assistant__msg assistant__msg--${turn.role === 'user' ? 'user' : 'bot'}`}
            >
              {turn.content}
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
