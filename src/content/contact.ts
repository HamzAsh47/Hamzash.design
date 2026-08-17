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
  successMessage:
    'Brief received. You will get a reply within two business days with next steps for the discovery call.',
  mailtoMessage:
    'Your email client will open with the brief filled in — send it and it lands directly in my inbox.',
  /** Shown when neither a form endpoint nor a contact email is configured. */
  unconfiguredMessage:
    'The brief form is not connected to an inbox yet. In the meantime, the fastest route is a direct message on LinkedIn.',
  /** Secondary route, offered under a working form rather than instead of it. */
  altRoutePrompt: 'Prefer LinkedIn?',
  altRouteLink: 'Message me directly.',
} as const
