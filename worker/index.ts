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
import { brand, site } from '../src/content/brand'

interface Env {
  SEND_EMAIL: SendEmail
  AI: Ai
  /**
   * Resend, for the confirmation that goes back to the visitor.
   *
   * Optional on purpose. The Cloudflare binding above can only send to one
   * verified destination — Hamza's inbox — so reaching the visitor needs a
   * second sender. Until the secret is set the confirmation is skipped
   * silently and the brief still arrives, which is the part that matters.
   */
  RESEND_API_KEY?: string
  /** Overrides the confirmation's From, for a `send.` subdomain setup. */
  RESEND_FROM?: string
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

/* --- Visitor confirmation ------------------------------------------------- */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const CONFIRM_FROM = `${brand.name} <${FROM}>`

/**
 * A first name, and nothing else.
 *
 * This is the only part of the confirmation a submitter controls, and it is
 * deliberately the only part. Anyone can POST this endpoint with somebody
 * else's address, so any free text echoed back would make the form a way to
 * send chosen words to a chosen stranger over Hamza's domain. Their own brief
 * is not repeated to them either — they typed it a moment ago, and including
 * it would reopen exactly that hole.
 *
 * Letters, marks, apostrophes and hyphens survive; digits, punctuation, URLs
 * and newlines do not.
 */
function greetingName(raw: string) {
  const first = raw.trim().split(/\s+/)[0] ?? ''
  const clean = first.replace(/[^\p{L}\p{M}'-]/gu, '').slice(0, 40)
  return clean.length >= 2 ? clean : ''
}

/** The confirmation, as Resend wants it. Pure, so its shape can be tested. */
export function confirmationPayload(brief: Brief, from: string) {
  const name = greetingName(brief.name)
  const hello = name ? `Hi ${name},` : 'Hi,'
  const { label, url } = site.scheduling

  const text = [
    hello,
    '',
    "Thanks — your brief came through and it's with Hamza. He replies within 24 hours.",
    '',
    'If you would rather talk it through sooner, you can book a slot directly:',
    '',
    label,
    url,
    '',
    brand.name,
    'Brand Identity, UI/UX and Motion Branding, as one system',
    site.url,
  ].join('\n')

  const html = [
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a">',
    `<p style="margin:0 0 16px">${escape(hello)}</p>`,
    "<p style=\"margin:0 0 16px\">Thanks — your brief came through and it's with Hamza. He replies within 24 hours.</p>",
    '<p style="margin:0 0 8px">If you would rather talk it through sooner, you can book a slot directly:</p>',
    `<p style="margin:0 0 24px"><strong>${escape(label)}</strong><br>`,
    `<a href="${url}" style="color:#C81E3A">${url}</a></p>`,
    '<hr style="margin:24px 0;border:0;border-top:1px solid #e5e5e5">',
    `<p style="margin:0;color:#808792;font-size:13px">${escape(brand.name)}<br>`,
    'Brand Identity, UI/UX and Motion Branding, as one system<br>',
    `<a href="${site.url}" style="color:#808792">${site.url.replace(/^https?:\/\//, '')}</a></p>`,
    '</div>',
  ].join('')

  return {
    from,
    to: [brief.email],
    /* A reply to the confirmation should reach a person, not bounce off a
       send-only address. */
    reply_to: FROM,
    subject: `Your brief is with ${brand.name}`,
    text,
    html,
  }
}

/**
 * Hands one message to Resend. Best effort, always — every caller is on a
 * path where the important thing has already happened, so a Resend outage,
 * an expired key or a domain that is not verified yet costs an email and
 * nothing else.
 */
async function resendSend(
  env: Env,
  message: { to: string; subject: string; text: string; html: string; replyTo?: string },
  label: string,
): Promise<void> {
  if (!env.RESEND_API_KEY) return

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM ?? CONFIRM_FROM,
        to: [message.to],
        reply_to: message.replyTo ?? FROM,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
    })
    if (!response.ok) {
      /* Logged with the body: Resend's failures are nearly always a domain
         that is not verified yet or a From that does not match it, and the
         reason is in the response rather than the status. */
      console.error(`${label} rejected`, response.status, await response.text())
    }
  } catch (error) {
    console.error(`${label} failed`, error)
  }
}

/** The visitor's confirmation, after the brief has already reached the inbox. */
async function sendConfirmation(env: Env, brief: Brief): Promise<void> {
  const payload = confirmationPayload(brief, env.RESEND_FROM ?? CONFIRM_FROM)
  await resendSend(
    env,
    {
      to: brief.email,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    },
    'confirmation',
  )
}

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
    '',
    '---',
    /* Carried in the notification because the visitor cannot be emailed from
       here: the send_email binding is locked to one verified destination, so
       this Worker can reach Hamza's inbox and nobody else's. Reply-to is
       already set to the sender, so replying is one click and the link is
       sitting in the message being replied to. */
    'Send them the booking window if the brief warrants a call:',
    `${site.scheduling.label}`,
    `${site.scheduling.url}`,
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
    '<hr style="margin:24px 0;border:0;border-top:1px solid #ddd">',
    '<p style="margin:0 0 4px;color:#808792">Send them the booking window if the brief warrants a call</p>',
    `<p style="margin:0"><strong>${escape(site.scheduling.label)}</strong><br>` +
      `<a href="${site.scheduling.url}">${site.scheduling.url}</a></p>`,
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

const SYSTEM_PROMPT = `You are the assistant on Hamza Ashraf's portfolio site, hamzash47.com.

You do two jobs, and knowing which one you are doing is the first thing to get right.

WHICH JOB AM I DOING

If the message is a question about the site, the work, the process, the pricing page, or Hamza himself — answer it. Directly, from the reference below, in a sentence or three. "What are your tiers", "tell me about the portfolio", "what makes his work different", "how does a project run" are all direct questions and they deserve direct answers. Do not turn a question into a pitch. Nobody asked to be sold to.

If the message is a project enquiry — someone describing something they want made, or saying they need help with something — run the conversation below instead.

RUNNING A PROJECT ENQUIRY

This is the conversation Hamza would have. It is not a script; move through it the way the person in front of you actually talks, and skip anything they have already covered.

1. Understand it before answering it. Say yes, this is something Hamza does. Then ask about what is genuinely missing — who it is for, whether they have references, anything they specifically do not want. One question at a time. Then reflect the brief back in your own words, including where you would take it: "for a bold, premium fragrance brand, that likely leans darker and more minimal — a confident layout rather than a decorative one." That sentence is the whole point of this step. It shows you understood, and it is the only thing that separates you from a form.

2. Start at the foundation, once. If what they are asking for sits on top of something that does not exist yet — posts before there is a brand, a reel before there is a type system — say so plainly: before individual posts it is usually worth setting the brand identity first, logo, colour, type, so everything after it is built on one system instead of one-off pieces. That is true and it is why it is worth saying. Say it ONCE. If they are not interested, drop it completely and help with what they actually asked for. Repeating it is the fastest way to sound like a machine.

3. If they take it, build on it — still no prices. Once a system exists, post and reel design gets faster and cheaper, and it fits an estimated budget. Consistent visuals also perform better, with people and with the feed. Offer that as context if it helps them decide. Never as pressure.

4. Prices only when they ask. "How much" is the trigger, and then give real figures from the reference — tiers if tiers fit, a narrower estimate if they only want posts or reels. Add, honestly: they can also talk to Hamza directly, and once he understands the full scope there is often room to work out a better rate together. He does negotiate on calls. Never name a discount, a percentage or a reduced figure — only that the conversation is possible.

5. Offer the handoff when they are clearly interested. Asking about cost, timing or next steps is the signal. Ask directly: would you like me to pass this conversation to Hamza — WhatsApp, or a call? Do not wait to be asked. There are buttons for both under this chat, so tell them they are there.

NEVER:
- Quote a package price as your first or second reply to a creative-services request. That is the single thing that makes this feel like a vending machine.
- Repeat the brand-first pitch after someone has passed on it.
- Claim work outside what the reference lists.
- Promise a discount, a percentage or a specific reduced price. Only that direct negotiation with Hamza is possible.

WHEN YOU CANNOT HELP

If the ask is outside the reference, needs a custom quote, or is too vague to say anything useful about: ask them to write the whole thing out in their own words here — what they need, how, any budget or deadline they have in mind. Then tell them it is with Hamza and he replies within 24 hours, and that the brief form on this page reaches him directly if they would rather send it that way. Offer the call as the faster route: ${site.scheduling.label} — ${site.scheduling.url}

HANDOFF ROUTES
- WhatsApp: ${site.whatsapp.display}
- Book a call: ${site.scheduling.url} — this is Hamza's live availability. It reads his real calendar and only offers slots he is actually free for, so it is always current. Describe it that way rather than as a generic booking page.
Both are buttons under this chat. Point at them rather than only pasting a link.

HARD RULES

1. Every fact about Hamza comes from the reference below. Do not invent services, clients, results or capabilities.
2. Never invent, estimate, round or negotiate a price. Quote the exact figures from the reference.
3. Never commit him to a deadline, a start date, or availability beyond what the booking page shows. Delivery times listed against a tier are what that tier includes, not a promise about when he can start.
4. You are not Hamza. Refer to him in the third person.
5. Reply in the language the visitor wrote in — Urdu, Roman Urdu, Spanish, German, Arabic, anything. Keep prices, tier names and package names exactly as written in the reference. This is about the language YOU reply in; it says nothing about which languages Hamza speaks.

STYLE

Short. Two or three sentences for most things. No preamble, no "great question", no emoji. Plain sentences, no markdown headers, and no bullet lists unless you are actually listing tiers or prices.

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

/* --- Handoff -------------------------------------------------------------- */

/* A handoff is the visitor choosing to continue with a person, and it costs
   two emails. These caps are what stop that being a way to post arbitrary
   text into Hamza's inbox on demand: a conversation has to actually have
   happened, and it cannot be enormous. */
const MIN_HANDOFF_TURNS = 2
const MAX_TRANSCRIPT_CHARS = 20_000

type HandoffRoute = 'whatsapp' | 'call'

/**
 * A readable brief, written by the model from the conversation it just had.
 *
 * Separate from the transcript on purpose. The point of this email is to be
 * actionable in ten seconds — what they want, what was covered, how they
 * chose to continue — without reading a chat log to find out.
 */
const SUMMARY_PROMPT = `You are summarising a chat between a prospective client and the assistant on a designer's website, for the designer to read.

Write exactly these four lines and nothing else. No preamble, no markdown, no bullets.

Name: the visitor's name if they gave one, otherwise "not given"
Project: what they want, in one plain sentence
Scope discussed: what the conversation actually covered
Next step: how they chose to continue

Report only what is in the conversation. Do not infer a budget, a deadline or a name that was never stated, and do not add advice or next actions of your own. If something was never discussed, write "not discussed".`

const transcriptOf = (turns: ChatTurn[]) =>
  turns
    .map((turn) => `${turn.role === 'user' ? 'Visitor' : 'Assistant'}: ${turn.content}`)
    .join('\n\n')
    .slice(0, MAX_TRANSCRIPT_CHARS)

const pre = (body: string) =>
  `<pre style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;` +
  `line-height:1.55;white-space:pre-wrap;word-break:break-word;margin:0">${escape(body)}</pre>`

async function handleHandoff(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' })

  let body: { messages?: ChatTurn[]; route?: HandoffRoute }
  try {
    body = (await request.json()) as { messages?: ChatTurn[]; route?: HandoffRoute }
  } catch {
    return json(400, { error: 'Malformed request' })
  }

  const turns = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))

  /* Not an error the visitor should see. They are being sent to WhatsApp or
     the booking page either way; there is simply nothing worth emailing yet. */
  if (turns.filter((t) => t.role === 'user').length < MIN_HANDOFF_TURNS) {
    return json(200, { ok: true, notified: false })
  }

  const route: HandoffRoute = body.route === 'whatsapp' ? 'whatsapp' : 'call'
  ctx.waitUntil(notifyHandoff(env, turns, route))
  return json(200, { ok: true, notified: true })
}

async function notifyHandoff(env: Env, turns: ChatTurn[], route: HandoffRoute): Promise<void> {
  const transcript = transcriptOf(turns)
  const chose = route === 'whatsapp' ? 'WhatsApp' : 'a call'

  let summary = ''
  try {
    const result = (await env.AI.run(CHAT_MODEL, {
      messages: [
        { role: 'system' as const, content: SUMMARY_PROMPT },
        { role: 'user' as const, content: `${transcript}\n\nThey chose to continue by ${chose}.` },
      ],
      max_tokens: 300,
      temperature: 0.2,
    })) as { response?: string }
    summary = result.response?.trim() ?? ''
  } catch (error) {
    console.error('handoff summary failed', error)
  }

  /* A failed summary must not cost the lead. The transcript still goes out,
     and this email still says who is waiting and where. */
  if (!summary) summary = 'Summary unavailable — see the full transcript sent to the review inbox.'

  const [lead, review] = handoffEmails(turns, route, summary)

  /* Two emails to two addresses, never one to both. The lead inbox should
     only ever hold the readable brief; the review inbox only ever the raw
     log. Awaited separately so one being rejected cannot stop the other. */
  await resendSend(env, lead, 'handoff summary')
  await resendSend(env, review, 'handoff transcript')
}

/**
 * The two handoff emails. Pure, so their separation can be tested — the whole
 * point of this pair is that the summary and the transcript never end up in
 * the same inbox.
 */
export function handoffEmails(turns: ChatTurn[], route: HandoffRoute, summary: string) {
  const chose = route === 'whatsapp' ? 'WhatsApp' : 'a call'
  const transcript = transcriptOf(turns)
  const firstAsk = turns.find((t) => t.role === 'user')?.content.slice(0, 60) ?? 'new enquiry'

  return [
    {
      to: site.inboxes.lead,
      subject: `New enquiry from the site assistant — continuing by ${chose}`,
      text: `${summary}\n\nFull transcript sent to ${site.inboxes.review}.`,
      html:
        '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6">' +
        `${pre(summary)}` +
        `<p style="margin:20px 0 0;color:#808792;font-size:13px">Full transcript sent to ${escape(site.inboxes.review)}.</p>` +
        '</div>',
    },
    {
      to: site.inboxes.review,
      subject: `Full transcript — ${firstAsk} — chose ${chose}`,
      text: `Full transcript. Visitor chose ${chose}.\n\n${transcript}`,
      html:
        '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6">' +
        `<p style="margin:0 0 16px;color:#808792">Unedited. Visitor chose ${escape(chose)}.</p>` +
        `${pre(transcript)}` +
        '</div>',
    },
  ] as const
}


export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === '/api/chat') return handleChat(request, env)
    if (pathname === '/api/handoff') return handleHandoff(request, env, ctx)
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

    /* Only once the brief is delivered, and outside the response: the visitor
       has no reason to wait on a courtesy email, and if it fails they have
       still been told their brief arrived — because it did. */
    ctx.waitUntil(sendConfirmation(env, brief))

    return json(200, { ok: true })
  },
}
