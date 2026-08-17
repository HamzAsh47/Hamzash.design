export const contact = {
  eyebrow: 'SYS.09 :: START A PROJECT',
  headline: 'Tell me what you are [building.]',
  lede: 'Four short steps. It takes about a minute, and it gives the discovery call something real to start from.',

  /**
   * `next` is the label the button carries while this step is open. Naming
   * what comes next rather than a flat "Continue" is the form telling the
   * visitor there is a real scoping process ahead — which is the whole point
   * of asking four questions instead of showing one email field.
   */
  steps: [
    { id: 'who', label: 'You', next: 'Next: budget range' },
    { id: 'budget', label: 'Budget', next: 'Next: project scope' },
    { id: 'scope', label: 'Scope', next: 'Next: project details' },
    { id: 'details', label: 'Details', next: '' },
  ],

  fields: {
    name: { label: 'Name', placeholder: 'Your name', required: true },
    company: { label: 'Company', placeholder: 'Company or product name', required: true },
    email: { label: 'Email', placeholder: 'you@company.com', required: true },
    details: {
      label: 'Project details',
      placeholder: 'What are you building, who is it for, and what is the deadline?',
      required: false,
    },
  },

  /**
   * Bands derived from the real rate tiers on this site ($225 entry tier up to
   * $1,575/month retainers) rather than copied from another studio.
   */
  budgetBands: [
    'Under $500',
    '$500 – $1,000',
    '$1,000 – $2,500',
    '$2,500 – $5,000',
    '$5,000+',
    'Retainer — monthly',
    'Not sure yet',
  ],

  scopeOptions: [
    { value: 'brand', label: 'Brand Identity' },
    { value: 'uiux', label: 'UI/UX' },
    { value: 'motion', label: 'Motion Branding' },
    { value: 'full-system', label: 'Full System' },
  ],

  submitLabel: 'Send project brief',

  /**
   * Two success messages, because the two routes end in different places and
   * telling the visitor the wrong one loses the brief.
   *
   * Posted straight through, the brief has arrived and there is nothing left
   * to do. Handed to a mail client, it is sitting in a draft — saying "got it"
   * there would be a lie, and the visitor would close the window on an unsent
   * email. So that copy ends on the instruction, not the reassurance.
   */
  successHeading: 'Brief received',
  successMessage: "Got it — I'll get back to you within 24 hours.",

  mailtoHeading: 'Brief ready to send',
  mailtoMessage:
    'Your email client is opening with the brief filled in and addressed. Hit send and it lands in my inbox — I reply within 24 hours.',

  errorMessage: 'That did not send. Give it another try — or email the brief to',
} as const
