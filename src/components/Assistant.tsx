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

/**
 * The marker the assistant ends a handoff offer with. Stripped before the
 * message is shown; what it does is make the WhatsApp and call buttons appear
 * attached to that turn, so the offer and the way to take it are the same
 * moment rather than a sentence pointing at a footer.
 */
const HANDOFF_MARKER = '[[handoff]]'

/**
 * Last line of defence against the assistant writing out contact details.
 *
 * The prompt tells it not to, and a model does it anyway sometimes. A raw
 * phone number and a calendar URL pasted above two buttons that do the same
 * thing reads as amateurish, so the known ones are removed at render rather
 * than trusted not to appear. Only these three exact things — nothing else is
 * touched, because guessing at a model's sentence is worse than the problem.
 */
const CONTACT_NOISE: [RegExp, string][] = [
  [/https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/\S+/gi, 'WhatsApp'],
  [/https?:\/\/calendar\.app\.google\/\S+/gi, 'the booking page'],
  [/\+?92[\s-]?318[\s-]?\d{3}[\s-]?\d{4}/g, 'WhatsApp'],
]

/* Substituted rather than deleted. Cutting a URL out leaves "message him on
   or book at, or call." — technically clean and unreadable. Swapping in the
   words the link stood for keeps the sentence a sentence, which matters
   because this fires exactly when the model has already gone off-script. */
function scrubContacts(text: string) {
  let out = text
  for (const [pattern, replacement] of CONTACT_NOISE) out = out.replace(pattern, replacement)
  return out
    .replace(/\(\s*\)|\[\s*\]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim()
}

/**
 * Speech-to-text, where the browser has it.
 *
 * The Web Speech API, deliberately, over a transcription service: it costs
 * nothing per use, adds no dependency and no key, and the audio never leaves
 * the visitor's machine as a file we then have to be responsible for. The
 * trade-off is coverage — Chrome, Edge and Safari have it, Firefox does not —
 * so the button is only rendered where the API exists rather than sitting
 * there dead. Anyone without it types, which is what they were doing anyway.
 */
/**
 * What the visitor is about to speak.
 *
 * Speech recognition takes exactly one language per session — there is no
 * auto-detect in the API — so mixed speech has to be told what it is rather
 * than worked out. These four cover who actually talks to this site.
 *
 * `en-IN` is the Hinglish entry, and it is the right engine for it: it is
 * trained on Indian and Pakistani English, tolerates Hindi and Urdu words
 * dropped mid-sentence, and transcribes to Latin script — so what lands in
 * the box is the Roman Urdu / Hinglish the person actually said. The two
 * native-script options are there for anyone speaking mostly Hindi or Urdu,
 * and they transcribe into Devanagari and Urdu script respectively, which the
 * assistant reads and answers in the same language.
 */
const VOICE_LANGUAGES = [
  { code: 'en-US', label: 'EN' },
  { code: 'en-IN', label: 'Hinglish' },
  { code: 'hi-IN', label: 'हिंदी' },
  { code: 'ur-PK', label: 'اردو' },
] as const

const VOICE_PREF_KEY = 'ha-voice-lang'

/** Remembered per visitor. Storage throws in some private modes. */
function storedVoiceLanguage() {
  try {
    const saved = localStorage.getItem(VOICE_PREF_KEY)
    if (saved && VOICE_LANGUAGES.some((entry) => entry.code === saved)) return saved
  } catch {
    /* No storage, no preference. The default is still correct. */
  }
  return VOICE_LANGUAGES[0].code as string
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

const SpeechRecognitionCtor: (new () => SpeechRecognitionLike) | undefined =
  typeof window === 'undefined'
    ? undefined
    : ((window as unknown as Record<string, unknown>).SpeechRecognition as
        | (new () => SpeechRecognitionLike)
        | undefined) ??
      ((window as unknown as Record<string, unknown>).webkitSpeechRecognition as
        | (new () => SpeechRecognitionLike)
        | undefined)

/** Pulls a usable reply-to address out of whatever the visitor typed. */
const EMAIL_IN_TEXT = /[^\s@<>()[\]",;]+@[^\s@<>()[\]",;]+\.[a-z]{2,}/i

/**
 * The two ways out of the chat.
 *
 * One component, rendered either attached to the message that offered the
 * handoff or as a standing pair under the composer — never both at once. The
 * assistant is told never to write a number or a link, so this is the only
 * place either one exists in the interface.
 */
function HandoffActions({
  onPick,
  inline = false,
}: {
  onPick: (route: 'whatsapp' | 'call') => void
  inline?: boolean
}) {
  return (
    <div className={`assistant__handoff${inline ? ' assistant__handoff--inline' : ''}`}>
      {!inline && <p className="assistant__handoff-label">Talk to Hamza directly</p>}
      <div className="assistant__handoff-actions">
        <button className="assistant__handoff-btn" onClick={() => onPick('whatsapp')}>
          <Icon name="whatsapp" />
          WhatsApp
        </button>
        <button className="assistant__handoff-btn" onClick={() => onPick('call')}>
          <Icon name="calendar" />
          Book a call
        </button>
      </div>
    </div>
  )
}

export function Assistant() {
  const [open, setOpen] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  /* Set when the visitor has actually been handed over, so the buttons stop
     re-sending Hamza the same conversation every time one is pressed. */
  const [handedOff, setHandedOff] = useState<'whatsapp' | 'call' | null>(null)
  /* Non-null while the email gate is open, holding the route it will resume. */
  const [pendingRoute, setPendingRoute] = useState<'whatsapp' | 'call' | null>(null)
  const [emailDraft, setEmailDraft] = useState('')
  const [listening, setListening] = useState(false)
  const [voiceLanguage, setVoiceLanguage] = useState(storedVoiceLanguage)

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

  /* Dictation drops into the same box the visitor types in, rather than
     sending straight off. What comes back from speech recognition is often
     nearly right and needs one word fixed, and sending it unseen would make
     the visitor argue with a transcript instead of with the assistant. */
  const recognition = useRef<SpeechRecognitionLike | null>(null)

  const toggleVoice = () => {
    if (listening) {
      recognition.current?.stop()
      return
    }
    if (!SpeechRecognitionCtor) return

    const engine = new SpeechRecognitionCtor()
    engine.lang = voiceLanguage
    engine.interimResults = false
    engine.continuous = false
    engine.onresult = (event) => {
      const said = Array.from({ length: event.results.length }, (_, i) => event.results[i][0].transcript)
        .join(' ')
        .trim()
      if (!said) return
      setDraft((current) => (current ? `${current} ${said}` : said))
      requestAnimationFrame(() => {
        if (inputRef.current) {
          autoGrow(inputRef.current)
          inputRef.current.focus()
        }
      })
    }
    engine.onerror = () => setListening(false)
    engine.onend = () => setListening(false)
    recognition.current = engine
    setListening(true)
    engine.start()
  }

  /* Grow with the message rather than making the visitor scroll a one-line
     box to re-read what they typed. Capped in CSS. */
  const autoGrow = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  /* Whatever address the visitor already gave in conversation. The assistant
     is told to ask for one before offering the handoff, so most of the time
     it is here and the gate below never appears. */
  const emailInChat =
    turns
      .filter((turn) => turn.role === 'user')
      .map((turn) => turn.content.match(EMAIL_IN_TEXT)?.[0])
      .filter(Boolean)
      .pop() ?? ''

  /* Hands the conversation to a person, and tells Hamza it happened.
     Not awaited before opening the destination: they asked to talk to
     somebody, and making them watch a spinner while two emails go out is the
     wrong order. `keepalive` is what lets the request survive the tab losing
     focus to WhatsApp. */
  const forward = (route: 'whatsapp' | 'call', email: string) => {
    const target =
      route === 'whatsapp'
        ? `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(site.whatsapp.prefill)}`
        : site.scheduling.url

    if (turns.filter((turn) => turn.role === 'user').length >= MIN_HANDOFF_TURNS) {
      void fetch('/api/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: turns, route, email }),
        keepalive: true,
      }).catch(() => {
        /* Silent. They are on their way to Hamza either way, and an error
           about an email they never asked for helps nobody. */
      })
    }

    setHandedOff(route)
    setPendingRoute(null)
    window.open(target, '_blank', 'noopener,noreferrer')
  }

  /* An address is required, because a handoff with no reply-to is a lead
     Hamza cannot answer. If the conversation already contains one, this is
     invisible; if not, one field appears rather than the whole thing being
     refused. */
  const handoff = (route: 'whatsapp' | 'call') => {
    if (emailInChat) return forward(route, emailInChat)
    setPendingRoute(route)
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
      setHandedOff(null)
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

          {turns.map((turn, index) => {
            if (turn.role === 'user') {
              return (
                <p key={index} className="assistant__msg assistant__msg--user">
                  {turn.content}
                </p>
              )
            }

            const offersHandoff = turn.content.includes(HANDOFF_MARKER)
            const body = scrubContacts(turn.content.split(HANDOFF_MARKER).join(''))
            /* Only on the newest message. An offer three turns back is
               history, and leaving its buttons live means several sets of the
               same two controls stacked down the log. */
            const isLast = index === turns.length - 1

            return (
              <div key={index} className="assistant__turn">
                <p className="assistant__msg assistant__msg--bot">{withLinks(body)}</p>
                {offersHandoff && isLast && !handedOff && (
                  <HandoffActions onPick={handoff} inline />
                )}
              </div>
            )
          })}

          {/* The gate. One field, at the moment it is actually needed. */}
          {pendingRoute && (
            <form
              className="assistant__gate"
              onSubmit={(event) => {
                event.preventDefault()
                const value = emailDraft.trim()
                if (!EMAIL_IN_TEXT.test(value)) return
                forward(pendingRoute, value)
              }}
            >
              <label className="assistant__gate-label" htmlFor="assistant-email">
                What is the best email for Hamza to reply to?
              </label>
              <div className="assistant__gate-row">
                <input
                  id="assistant-email"
                  className="assistant__gate-input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={emailDraft}
                  onChange={(event) => setEmailDraft(event.target.value)}
                  autoFocus
                />
                <button
                  className="assistant__send"
                  type="submit"
                  disabled={!EMAIL_IN_TEXT.test(emailDraft.trim())}
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {handedOff && (
            <p className="assistant__msg assistant__msg--bot">
              Sent to Hamza — he will follow up shortly. If this was useful, tell him so when
              you speak.
            </p>
          )}

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
          {/* Only where the browser actually has speech recognition. A dead
              microphone is worse than no microphone. */}
          {SpeechRecognitionCtor && (
            <select
              className="assistant__voice-lang"
              value={voiceLanguage}
              aria-label="Language you will speak in"
              onChange={(event) => {
                setVoiceLanguage(event.target.value)
                try {
                  localStorage.setItem(VOICE_PREF_KEY, event.target.value)
                } catch {
                  /* Fine. It just will not be remembered next visit. */
                }
              }}
            >
              {VOICE_LANGUAGES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.label}
                </option>
              ))}
            </select>
          )}

          {SpeechRecognitionCtor && (
            <button
              type="button"
              className={`assistant__mic${listening ? ' is-live' : ''}`}
              onClick={toggleVoice}
              aria-pressed={listening}
              aria-label={listening ? 'Stop dictating' : 'Dictate a message'}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <rect x="7.4" y="2.6" width="5.2" height="9.4" rx="2.6" />
                <path d="M4.6 9.4a5.4 5.4 0 0 0 10.8 0M10 14.8v2.6" />
              </svg>
            </button>
          )}

          <button className="assistant__send" type="submit" disabled={busy || !draft.trim()}>
            Send
          </button>
        </form>

        {listening && (
          <p className="assistant__listening" role="status">
            Listening — speak, then press the microphone again.
          </p>
        )}

        {/* The standing pair, under the composer. Real buttons rather than
            links the model has to remember to write: the route out of a chat
            should not depend on what a model produced that turn. Hidden while
            an inline set is showing, so only one pair is ever on screen. */}
        {turns.filter((turn) => turn.role === 'user').length >= MIN_HANDOFF_TURNS &&
          !pendingRoute &&
          !turns.at(-1)?.content.includes(HANDOFF_MARKER) && (
            <HandoffActions onPick={handoff} />
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
