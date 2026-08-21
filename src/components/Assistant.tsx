import { useEffect, useRef, useState } from 'react'
import { site } from '../content'

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

  // Follow the conversation down as it grows.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, busy])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const send = async (text: string) => {
    const message = text.trim()
    if (!message || busy) return

    const next: Turn[] = [...turns, { role: 'user', content: message }]
    setTurns(next)
    setDraft('')
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
        className={`assistant-launch${open ? ' is-open' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        aria-label={open ? 'Close the assistant' : 'Ask about pricing, services or process'}
      >
        <span className="assistant-launch__glyph" aria-hidden="true">
          {open ? '×' : 'AI'}
        </span>
        <span className="assistant-launch__label">Ask</span>
      </button>

      <div
        id="assistant-panel"
        className={`assistant${open ? ' is-open' : ''}`}
        hidden={!open}
        role="dialog"
        aria-label="Site assistant"
      >
        <header className="assistant__head">
          <p className="assistant__title">
            Ask about the work
            {/* The one sanctioned cyan on the page is AI context, and this is
                literally that. */}
            <span className="assistant__badge">AI</span>
          </p>
          <button className="assistant__close" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
        </header>

        <div className="assistant__log" ref={logRef}>
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
            <p className="assistant__msg assistant__msg--bot assistant__msg--thinking" aria-live="polite">
              Thinking…
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
            onChange={(event) => setDraft(event.target.value)}
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
