export type FaqItem = {
  question: string
  answer: string
}

export const faqIntro = {
  eyebrow: 'SYS.08 :: FAQ',
  headline: 'The questions that come before the [call.]',
}

/** Working draft written from the locked positioning — safe to ship as-is. */
export const faq: FaqItem[] = [
  {
    question: "What's included in a typical project?",
    answer:
      'A connected system, not a single asset. Depending on scope that can mean brand identity, product UI/UX, and motion, all built to work together and stay consistent as your product grows — rather than hiring separate specialists for each piece.',
  },
  {
    question: 'How long does a project take?',
    answer:
      'Depends on the tier and scope. Motion pieces run 3–10 days depending on package (see pricing above); full brand or UI/UX systems typically run longer and get a specific timeline after the discovery call, once the real scope is clear.',
  },
  {
    question: 'Do you work with early-stage/pre-seed startups, or only funded ones?',
    answer:
      'The sweet spot is funded and early-growth teams who treat design as infrastructure rather than a one-off cost — that’s where the system approach pays off most. Earlier-stage or smaller projects are considered case by case.',
  },
  {
    question: 'Do you offer ongoing/retainer work after the initial system is built?',
    answer:
      'Yes. Most engagements don’t end at launch — new features need UI, campaigns need motion, brands need periodic refreshes. The retainer tiers above are built for exactly that.',
  },
  {
    question: 'What tools/software do you deliver in?',
    answer:
      'Figma for UI/UX and design systems, After Effects for motion, plus standard brand-guideline and asset-handoff formats. Final files are always delivered in editable, production-ready form.',
  },
  {
    question: 'How do revisions work?',
    answer:
      'Revision counts scale with the package tier (see the rate card for exact numbers per tier). Feedback is applied throughout the process rather than saved up and dumped at the end.',
  },
  {
    question: 'What if I only need one pillar — just motion, or just UI/UX?',
    answer:
      'That’s fine — each pillar is available on its own. The system approach is where the most value shows up, but single-pillar engagements are a normal starting point for a lot of clients.',
  },
]
