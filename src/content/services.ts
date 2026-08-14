export type Service = {
  id: string
  index: string
  title: string
  description: string
  /** Filter value this card links to in the portfolio grid. */
  filter: string
}

export const servicesIntro = {
  eyebrow: 'SYS.02 :: PILLARS',
}

export const services: Service[] = [
  {
    id: 'brand',
    index: '01',
    title: 'Brand Identity & Visual Systems',
    description:
      'Naming, logo systems, colour and type architecture — built as rules your team can apply, not a folder of one-off files.',
    filter: 'brand',
  },
  {
    id: 'uiux',
    index: '02',
    title: 'UI/UX & Product Design',
    description:
      'Product interfaces and design systems in Figma, extending the brand into something people actually use.',
    filter: 'uiux',
  },
  {
    id: 'motion',
    index: '03',
    title: 'Motion Branding',
    description:
      'Animated identity, product films and campaign assets that move the way the brand is meant to move.',
    filter: 'motion',
  },
]
