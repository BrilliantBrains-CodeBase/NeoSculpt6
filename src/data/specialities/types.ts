// Shape of a speciality hub page (/hair-transplant-restoration/ and, later, the other five). There is no approved hub
// doc yet: the hub's own copy is a DRAFT for sign-off (each record lists it in `pending`), while the treatment cards
// reuse the child pages' approved wording (services/index.ts) and the technology cards the technology hub's.
// Sections that look like a service page section reuse its type, so the service component renders them unchanged.
// Title tag, meta description, robots, canonical, H1 and breadcrumb are not here: they come from pages.json
// (src/data/hubs.ts).
// Keep this folder to erasable TypeScript only (verify-seo.mjs imports it with Node's type stripping).

import type { Testimonial } from '../home.ts'
import type { NavLink } from '../nav.ts'
import type { Cta, ServiceContent } from '../services/types.ts'
import type { TechnologyBanner, TechnologyHub } from '../technology/types.ts'

/** A treatment card: a child page (or a technology page) with a sentence from its own banner. */
export interface HubTreatment {
  title: string
  text: string
  href: string
}

export interface SpecialityHub {
  /** Canonical path; a `hub` route in pages.json. */
  path: string
  /** Section ids in page order; `npm run verify` checks the built page against it. */
  order: string[]
  hero: TechnologyBanner
  intro: ServiceContent['intro']
  /** Every child page of the speciality, in groups (index.ts checks none is missing). */
  treatments: {
    h2: string
    subline: string
    /** `image` is null where no approved photo suits the group (the photo is then left out). */
    groups: { title: string; text: string; image: TechnologyBanner['image'] | null; items: HubTreatment[] }[]
  }
  /** "Choose your starting point": a concern, a line about it, and the pages to start from (or a button). */
  concerns: { h2: string; subline: string; cards: { title: string; text: string; links: NavLink[]; cta: Cta | null }[] }
  process: ServiceContent['process']
  doctors: ServiceContent['doctors']
  /** The speciality's technology hub cards; empty (section hidden) where the technology doc has none. */
  technology: { h2: string; subline: string; cards: TechnologyHub['cards'] }
  cost: ServiceContent['cost']
  reviews: { h2: string; items: Testimonial[] }
  faqs: ServiceContent['faqs']
  /** FAQPage schema only once the hub's FAQs are approved (they are drafts until then). */
  faqsApproved: boolean
  closing: ServiceContent['closing']
  /** Items that need sign-off before launch; `npm run verify` lists them. */
  pending: string[]
}

/** A hub as its file writes it: treatment groups as paths and technology as page paths; index.ts resolves both. */
export type HubSource = Omit<SpecialityHub, 'treatments' | 'technology'> & {
  treatments: Omit<SpecialityHub['treatments'], 'groups'> & {
    groups: (Omit<SpecialityHub['treatments']['groups'][number], 'items'> & {
      /** Service pages (any speciality: a cross-link is allowed) or technology pages. */
      paths: string[]
    })[]
  }
  technology: Omit<SpecialityHub['technology'], 'cards'> & { paths: string[] }
}
