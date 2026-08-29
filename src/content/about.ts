import centricsource from '../assets/logos/centricsource.jpeg'
import ezSportsApparel from '../assets/logos/ez-sports-apparel.png'
import muhammadLabs from '../assets/logos/muhammad-labs.jpeg'
import raahTv from '../assets/logos/raah-tv.jpeg'
import santamaria from '../assets/logos/santamaria.jpeg'
import theVisualist from '../assets/logos/the-visualist.jpeg'
import upliftK12 from '../assets/logos/uplift-k12.jpeg'
import upwork from '../assets/logos/upwork.jpeg'

export type TimelineEntry = {
  range: string
  title: string
  org: string
  location: string
  copy: string
  /** Optional. Entries without one show their number on the rail instead. */
  logo?: string
  /** Where the client sat, for the map. Omitted where there is no one place. */
  place?: { label: string; lat: number; lon: number }
}

export const aboutIntro = {
  eyebrow: 'PROFILE :: ABOUT',
  headline: 'One person, not an [agency] roster.',
  lede:
    'Every project on this site was built by the same one person, start to finish — no account manager, no hand-off between specialists. Here is the full record of how that came to be.',
}

export const aboutBio = {
  paragraphs: [
    "Over 10+ years, I've directed brand identity systems, UI/UX and product design, and motion branding for clients spanning sports apparel, legal services, education technology, hospitality, and IT consulting, across three continents. I've managed $90K+ in project revenue and now run The Visualist, an independent creative practice built on a foundation of agency leadership and team management.",
    "My focus today is funded and early-growth tech and edtech startups that need brand, product, and motion treated as infrastructure, not a one-off request — the same \"one system\" approach that shaped my work on Uplift K12's educational game platform and GoTeach.ai's teacher tools.",
  ],
  personalLine:
    'My take, after a decade of watching brand, product, and motion get handled as three separate hires: they were never meant to be.',
}

export const aboutStats = [
  { value: '10+', label: 'Years' },
  { value: '$90K+', label: 'Managed' },
  { value: 'Top 2%', label: 'Preferred Freelancer' },
  { value: '3', label: 'Continents' },
]

/** Chronological, oldest first — the "old-school craft to the AI-driven future" arc, not a resume dump. */
export const aboutTimeline: TimelineEntry[] = [
  {
    range: 'Oct 2015 — Jan 2019',
    title: 'Graphic Designer',
    org: 'Freelance / Contract — Print & Production',
    place: { label: 'Karachi, Pakistan', lat: 24.86, lon: 67.01 },
    location: 'Karachi, Pakistan',
    copy: 'Early-career roles across Karachi\u2019s print production industry before transitioning to digital and brand systems.',
  },
  {
    range: 'Apr 2019 — Nov 2019',
    title: 'Broadcast Motion Designer & Video Editor',
    org: 'Raah TV',
    place: { label: 'Karachi, Pakistan', lat: 24.86, lon: 67.01 },
    logo: raahTv,
    location: 'Karachi, Pakistan',
    copy: 'Broadcast-quality motion graphics and video for a 24-hour news network under daily deadline pressure — editing, graphic design, and content packaging across news, cultural coverage, and community programming.',
  },
  {
    range: 'Aug 2019 — Apr 2020',
    title: 'Design Team Lead',
    org: 'CentricSource',
    place: { label: 'Karachi, Pakistan', lat: 24.86, lon: 67.01 },
    logo: centricsource,
    location: 'Karachi, Pakistan',
    copy: 'Joined building production design for a virtual garment-fitting system, then promoted to lead the design team — owning the design-to-development handoff and leading the team through a fully remote transition during COVID-19.',
  },
  {
    range: 'Jan 2020 — Aug 2020',
    title: 'Co-Founder',
    org: 'Design Dot',
    place: { label: 'Karachi, Pakistan', lat: 24.86, lon: 67.01 },
    location: 'Karachi, Pakistan',
    copy: 'Co-founded a creative venture with Rohan Shahid, sourcing and delivering freelance design and video projects for international clients — first-hand lessons in business operations and client acquisition.',
  },
  {
    range: 'Jan 2021 — May 2022',
    title: 'Freelance Motion Graphic Designer & Animator',
    org: 'Upwork (Self-employed)',
    place: { label: 'Karachi, Pakistan', lat: 24.86, lon: 67.01 },
    logo: upwork,
    location: 'Karachi, Pakistan',
    copy: 'Built an independent motion design practice — custom animation, character animation, and story-driven explainers for international clients across music, tech, and education.',
  },
  {
    range: 'Jan 2021 — Jun 2022',
    title: 'YouTube Content Strategist & Producer',
    org: 'Santamaria Law Firm, P.C.',
    place: { label: 'San Francisco, USA', lat: 37.77, lon: -122.42 },
    logo: santamaria,
    location: 'San Francisco, CA · Remote',
    copy: '10+ videos monthly, turning raw green-screen footage into polished 4K motion graphics on immigration law. Grew into content for the firm\u2019s university partnerships and a rebrand of their presentation assets.',
  },
  {
    range: 'Jul 2022 — Sep 2022',
    title: 'Professional Development',
    org: 'Career Break',
    place: { label: 'Karachi, Pakistan', lat: 24.86, lon: 67.01 },
    location: 'Karachi, Pakistan',
    copy: 'An intentional pause to invest in new skills and lay the groundwork for the next chapter.',
  },
  {
    range: 'Sep 2022 — Present',
    title: 'Founder & Sole Operator',
    org: 'The Visualist',
    place: { label: 'Karachi, Pakistan', lat: 24.86, lon: 67.01 },
    logo: theVisualist,
    location: 'Karachi, Pakistan · Hybrid',
    copy: 'Founded a multidisciplinary creative studio directing brand, UI/UX, and motion for international clients — hiring and leading a team before transitioning, two and a half years in, to running it solo.',
  },
  {
    range: 'Sep 2023 — Mar 2026',
    title: 'Art Director — Brand Development',
    org: "JOSEF'S Buffalo Wings",
    place: { label: 'Hamburg, Germany', lat: 53.55, lon: 9.99 },
    location: 'Hamburg an der Elbe, Germany · Remote',
    copy: 'Built the full brand identity from the ground up for Hamburg\u2019s pioneering buffalo wings concept — the complete visual system across digital, marketing, and print.',
  },
  {
    range: 'Oct 2023 — Oct 2025',
    title: 'Freelance Creative Director — Multimedia & Curriculum Design',
    org: 'Uplift K12',
    place: { label: 'Houston, USA', lat: 29.76, lon: -95.37 },
    logo: upliftK12,
    location: 'Houston, TX · Remote',
    copy: 'Started designing K-4 math game assets, then grew into an ongoing creative partnership leading multimedia content across the platform\u2019s educational products as its design needs scaled.',
  },
  {
    range: 'Apr 2024 — Present',
    title: 'Senior Apparel Branding & Visualization Designer',
    org: 'EZ Sports Apparel',
    logo: ezSportsApparel,
    location: 'Remote',
    copy: 'Own the full pre-production visual pipeline for client-facing apparel presentations — logo application, pattern graphics, color matching, and layout that turns raw requirements into production-ready mockups.',
  },
  {
    range: 'Jun 2025 — Dec 2025',
    title: 'Freelance Creative Art Director',
    org: 'Muhammad Labs LTD',
    place: { label: 'London, United Kingdom', lat: 51.51, lon: -0.13 },
    logo: muhammadLabs,
    location: 'United Kingdom · Remote',
    copy: 'Creative Director for a UK IT consultancy — scalable creative systems for their client portfolio, UI/UX for onboarding dashboards and mobile apps, and repeatable workflows the team operated under.',
  },
]

export const aboutEducation: TimelineEntry[] = [
  {
    range: 'Aug 2021 — Oct 2024',
    title: 'Bachelor of Science, Media Science',
    org: 'Benazir Bhutto Shaheed University',
    location: '',
    copy: 'Advanced Mass Media Architectures, Visual Communication Analysis, Narrative Design Strategies — formal media theory alongside hands-on practice.',
  },
  {
    range: 'Apr 2014 — Feb 2016',
    title: 'HSC, Engineering',
    org: 'Bufferzone Degree College',
    location: '',
    copy: 'Pre-Engineering studies — Automotive Systems Analysis, Mechanical Drafting, Structural Engineering Applications.',
  },
  {
    range: 'Mar 2012 — Apr 2014',
    title: 'SSC, Computer Science',
    org: 'Pious Secondary',
    location: '',
    copy: 'Foundational Computing, Digital Logic Algorithms, Early Tech Initiatives.',
  },
]
