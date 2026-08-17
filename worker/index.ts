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

interface Env {
  SEND_EMAIL: SendEmail
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)
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
