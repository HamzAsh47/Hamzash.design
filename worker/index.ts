/**
 * The brief form's inbox.
 *
 * Cloudflare Email Routing only *receives* — it forwards mail addressed to
 * contact@hamzash47.com on to the real mailbox. Nothing in it sends, and a
 * static page cannot send either, so the form used to hand the finished brief
 * to the visitor's mail client and hope they pressed send. On a machine with
 * no mail client configured that is a dead end: the visitor sees a
 * confirmation and no email is ever written.
 *
 * This closes that gap. The `send_email` binding lets a Worker send to an
 * address already verified on the account, which is the same mailbox the
 * routing rules point at — so the brief arrives without a third-party form
 * service, an API key, or anything for the visitor to do after clicking send.
 */

import { botKnowledge } from '../src/content/botContext'

interface Env {
  SEND_EMAIL: SendEmail
  AI: Ai
}

/** Mirrors buildBrief() on the client. Everything here reaches the inbox. */
interface Brief {
  subject: string
  name: string
  company: string
  email: string
  budget: string
  scope: string
  details: string
  /** Honeypot. Never shown to a human, so anything in it came from a bot. */
  website?: string
}

const FROM = 'contact@hamzash47.com'
const TO = 'hamzash4798@gmail.com'

/* A brief is a few short answers and a paragraph. Anything past this is not a
   project enquiry, and the cap keeps a scripted POST from turning the inbox
   into somebody else's mail relay. */
const MAX_BYTES = 16 * 1024

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })

function asText(brief: Brief) {
  return [
    `Name:    ${brief.name}`,
    `Company: ${brief.company}`,
    `Email:   ${brief.email}`,
    `Budget:  ${brief.budget}`,
    `Scope:   ${brief.scope}`,
    '',
    'Details:',
    brief.details,
  ].join('\n')
}

const escape = (value: string) =>
  value.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

function asHtml(brief: Brief) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#808792;white-space:nowrap">${label}</td>` +
    `<td style="padding:4px 0"><strong>${escape(value)}</strong></td></tr>`

  return [
    '<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5">',
    '<table style="border-collapse:collapse">',
    row('Name', brief.name),
    row('Company', brief.company),
    row('Email', brief.email),
    row('Budget', brief.budget),
    row('Scope', brief.scope),
    '</table>',
    '<p style="margin:20px 0 4px;color:#808792">Details</p>',
    `<p style="margin:0;white-space:pre-wrap">${escape(brief.details)}</p>`,
    '</div>',
  ].join('')
}


/* --- Assistant ------------------------------------------------------------ */

/* Llama 3.3 70B on Workers AI. Picked over the 8B models because the job is
   reading a rate card and reasoning about which tier fits a described project,
   which the small models get wrong often enough to matter when the wrong
   answer is a price. Still inside the free daily allocation at this site's
   traffic. */
const CHAT_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'

/* A brief is a paragraph; a question is a sentence. Anything past these is not
   a visitor asking about design work, and both caps protect a shared free
   allocation from a single scripted caller. */
const MAX_CHARS = 900
const MAX_TURNS = 12

const SYSTEM_PROMPT = `You are the assistant on Hamza Ashraf's portfolio site, hamzash47.com. You answer questions from prospective clients about his work, his services, his pricing, and how to start a project.

RULES, IN ORDER OF IMPORTANCE:

1. Answer ONLY from the reference below. It is the complete and current source of truth about Hamza.
2. NEVER invent, estimate, round, discount or negotiate a price. Quote the exact figures from the reference. If someone asks for a price that is not in it, or asks for a custom quote or a discount, say that needs Hamza directly and point them to the brief form or WhatsApp.
3. NEVER commit Hamza to a deadline, a start date, or availability. Delivery times listed against a tier are what that tier includes, not a promise about when he can start.
4. If the reference does not answer something, say so plainly and point them to Hamza. Do not guess, and do not fill the gap with what is generally true of designers.
5. You are not Hamza. Refer to him in the third person.
6. Reply in the language the visitor wrote in. If they write Urdu, Roman Urdu, Spanish, German, Arabic or anything else, answer in that same language and keep the prices, tier names and package names exactly as written in the reference. This is about the language YOU reply in — it says nothing about which languages Hamza speaks. If asked what languages HE works in, answer only from the reference and do not infer it from a phone number or anything else.

STYLE:
- Short. Two or three sentences for most questions. No preamble, no "great question".
- Plain sentences, no markdown headers, no bullet lists unless you are listing tiers or prices.
- Concrete. If a tier answers the question, name it and its price.
- When someone describes their project and asks what it would cost, match it to the closest package and tier, give that figure, and say the brief form is how it gets scoped properly.
- Never use emoji.

REFERENCE:
${botKnowledge}`

type ChatTurn = { role: 'user' | 'assistant'; content: string }

async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' })

  let body: { messages?: ChatTurn[] }
  try {
    body = (await request.json()) as { messages?: ChatTurn[] }
  } catch {
    return json(400, { error: 'Malformed request' })
  }

  const history = Array.isArray(body.messages) ? body.messages.slice(-MAX_TURNS) : []
  if (history.length === 0) return json(400, { error: 'No message' })

  /* Trust nothing about the shape that arrived: a caller can send any roles it
     likes, and an injected "system" turn would sit above the rules above. */
  const messages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...history
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) })),
  ]

  try {
    const result = (await env.AI.run(CHAT_MODEL, {
      messages,
      max_tokens: 400,
      temperature: 0.3,
    })) as { response?: string }

    const reply = result.response?.trim()
    if (!reply) throw new Error('Empty completion')
    return json(200, { reply })
  } catch (error) {
    console.error('chat failed', error)
    /* Out of free allocation, model cold, anything else: the visitor still
       needs a route to a human, so failure names one instead of apologising. */
    return json(503, {
      error:
        'The assistant is unavailable right now. WhatsApp +92 318 3749996 reaches Hamza directly, or use the brief form on this page.',
    })
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === '/api/chat') return handleChat(request, env)
    if (pathname !== '/api/brief') return new Response('Not found', { status: 404 })
    if (request.method !== 'POST') {
      return json(405, { error: 'Method not allowed' })
    }

    const length = Number(request.headers.get('content-length') ?? 0)
    if (length > MAX_BYTES) return json(413, { error: 'Brief too large' })

    let brief: Brief
    try {
      brief = (await request.json()) as Brief
    } catch {
      return json(400, { error: 'Malformed brief' })
    }

    /* Silent 200. Telling a bot which check it failed is free tuning advice,
       and a real visitor can never reach this branch. */
    if (brief.website) return json(200, { ok: true })

    if (!brief.name?.trim() || !brief.email?.trim() || !isEmail(brief.email)) {
      return json(400, { error: 'Name and a valid email are required' })
    }

    try {
      await env.SEND_EMAIL.send({
        from: { name: 'hamzash47.com', email: FROM },
        to: TO,
        /* The visitor's own address, so replying from the inbox goes straight
           back to them rather than to the site's own routing rule. */
        replyTo: { name: brief.name, email: brief.email },
        subject: brief.subject || `Project brief — ${brief.company || brief.name}`,
        text: asText(brief),
        html: asHtml(brief),
      })
    } catch (error) {
      console.error('brief send failed', error)
      return json(502, { error: 'Could not send the brief' })
    }

    return json(200, { ok: true })
  },
}
