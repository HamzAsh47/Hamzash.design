export type ProcessStep = {
  number: string
  title: string
  description: string
}

export const processIntro = {
  eyebrow: 'SYS.07 :: PROCESS',
  headline: 'How the work actually [runs.]',
  lede: 'Four steps, in this order. Numbering is not decoration here — each step depends on the one before it.',
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery call',
    description:
      'Understand the product, the audience and what is actually broken — before anything gets designed.',
  },
  {
    number: '02',
    title: 'System proposal',
    description:
      'A written plan for how brand, UI/UX and motion connect for this specific case, with scope and timeline attached.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Iterative delivery with regular check-ins. Feedback is applied as we go, not collected and dumped at the end.',
  },
  {
    number: '04',
    title: 'Handoff & ongoing support',
    description:
      'Editable, production-ready files plus the guidelines your team needs — and a retainer if the work keeps going.',
  },
]
