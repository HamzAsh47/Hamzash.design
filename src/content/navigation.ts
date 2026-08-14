export type NavLink = {
  id: string
  label: string
}

/** Section ids double as scroll anchors, so order matters. */
export const navLinks: NavLink[] = [
  { id: 'system', label: 'The System' },
  { id: 'portfolio', label: 'Work' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'process', label: 'Process' },
  { id: 'faq', label: 'FAQ' },
]

export const navCta = { id: 'contact', label: 'Start a project' }
