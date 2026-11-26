// Shape of the Technology hub, the nine technology pages and International Patients
// (content/technology/technology-international-patient.md, one "# **Page N — …**" entry each). The copy is parsed into
// parsed.json (scripts/parse-technology-pages.mjs) and assembled into these records by technology/index.ts, which adds
// images, button actions, doctors' portraits and the pending sign-off list. The templates are presentational; every
// word on these pages comes from one of these records.
// Sections that look like a service page section reuse its type, so the service component renders them unchanged
// (src/components/service/*). Title tag, meta description, robots, canonical, H1 and breadcrumb are not here: they
// come from pages.json (scripts/generate-pages.mjs takes them from the same doc).
// Keep this file to erasable TypeScript only (verify-seo.mjs imports the records with Node's type stripping).

import type { Testimonial } from '../home.ts'
import type { NavLink } from '../nav.ts'
import type { Cta, Faq, ServiceContent, ServiceImage } from '../services/types.ts'
import type { HeldBlock, InfoBlock } from '../blocks.ts'

export type TechnologyKind = 'technology-hub' | 'technology-detail' | 'artas-detail' | 'international-patients'

/** 1. Page banner. The H1 is page.h1; the breadcrumb is page.crumbs. */
export interface TechnologyBanner {
  eyebrow: string
  /** A line under the H1 (ARTAS, Medical Tourism); null on the pages whose doc has none. */
  subheading?: string | null
  intro: string
  /** The doc's trust strip under the buttons ("Doctor-led · Image-guided · …"). */
  trust?: string[]
  ctas: Cta[]
  image: ServiceImage
}

/** A card in an icon-card grid. The live benefit cards are titles only (`text: null`); ARTAS's have text. */
export interface TitledCard {
  title: string
  text: string | null
}

/** A cost-factor panel with the doc's paragraphs and no factor list (ServiceCost). */
export type TechnologyCost = Omit<ServiceContent['cost'], 'intro'> & { intro: string[] }

/** Success stories: real Google reviews only; pending entries show as pending cards. */
export interface TechnologyReviews {
  eyebrow: string
  h2: string
  items: Testimonial[]
}

/** A doc note ("Note:" / "Added section:") or an item that needs sign-off before launch. */
export interface TechnologyNote {
  section: string
  kind: 'note' | 'added'
  text: string
}

interface Common {
  /** Canonical path, the key in technology/index.ts. */
  path: string
  /** Where the copy came from, e.g. "content/technology/technology-international-patient.md:172". */
  source: string
  /** Section ids in the doc's order; `npm run verify` checks the page against it. */
  order: string[]
  notes: TechnologyNote[]
  /** Items that need sign-off before launch (photos, reviews, doc notes); `npm run verify` lists them. */
  pending: string[]
}

/** The "Explore" block: the doc's sidebar, drawn as a panel below the closing band. */
export interface TechnologyExplore {
  heading: string
  links: NavLink[]
  /** The doc's "Related treatments" links, under `relatedHeading`. */
  relatedHeading: string
  related: NavLink[]
  /** The contact card: Book An Appointment (popup), Call, WhatsApp. */
  contact: Cta[]
}

/** Technology detail pages (the standard 13 sections plus Explore). */
export interface TechnologyDetail extends Common {
  kind: 'technology-detail'
  hero: TechnologyBanner
  /** 2. Introduction ("What Is …?"). */
  intro: ServiceContent['intro']
  /** 3. How it is different: the image + text band (ServiceConsultation). */
  different: ServiceContent['consultation']
  /** 4. Why a personalised assessment matters: the slim highlight band. */
  assessment: { h2: string; paragraph: string }
  /** 5. Potential benefits: 2 × 2 icon cards. */
  benefits: { h2: string; subline: string | null; cards: TitledCard[]; smallPrint: string | null }
  /** 6. How it works. `id="how-it-works"`, the hero's second button's target. */
  process: ServiceContent['process']
  /** 7. Who may be assessed: ticks (titles only) and the doc's paragraph(s). */
  candidates: Omit<ServiceContent['candidates'], 'cards' | 'note'> & { cards: TitledCard[]; note: string[]; lead?: string | null }
  /** 8. Results, recovery and realistic expectations. */
  expectations: { h2: string; paragraphs: string[] }
  /** 9. Your doctor. */
  doctors: ServiceContent['doctors']
  /** 10. Cost and consultation. No factor list: the doc gives its paragraph(s) only. */
  cost: TechnologyCost
  /** 11. Success stories. */
  reviews: TechnologyReviews
  /** 12. FAQs. Also the page's FAQPage schema, from the same strings. */
  faqs: { eyebrow: string; h2: string; items: Faq[]; cta: Cta | null }
  /** 13. Closing call to action. */
  closing: ServiceContent['closing']
  explore: TechnologyExplore
}

/** ARTAS (client brief 2026-11-25): its own section list. No "How it is different" or assessment band, no reviews
 *  (the brief rules out clinic-wide reviews here); the ARTAS vs FUT vs manual FUE table is an info block. */
export interface ArtasDetail extends Omit<TechnologyDetail, 'kind' | 'different' | 'assessment' | 'reviews'> {
  kind: 'artas-detail'
  /** ARTAS vs FUT vs Manual FUE: a table (InfoSection, id="technology-comparison"), after the benefits. */
  comparison: InfoBlock
  /** The doc's small print above the Explore panel. */
  disclaimer: string
  /** Section ids in page order (`npm run verify`). */
  sectionIds: string[]
}

/** /technology/: banner, nine cards (Hair → Body → Skin), doctors, closing band. */
export interface TechnologyHub extends Common {
  kind: 'technology-hub'
  hero: TechnologyBanner
  cards: { group: string; title: string; label: string; text: string; cta: NavLink; image: ServiceImage }[]
  doctors: ServiceContent['doctors']
  closing: ServiceContent['closing']
}

/** /medical-tourism-in-bangalore/ (was /international-patients/; client brief 2026-11-25): banner, then the doc's
 *  sections in order (`order`: "info:<id>" blocks, doctors, FAQs, closing band, disclaimer). */
export interface InternationalPatients extends Common {
  kind: 'international-patients'
  hero: TechnologyBanner
  blocks: InfoBlock[]
  /** Sections held back until the clinic confirms them (countries, patient videos): not rendered, listed in `pending`. */
  held: HeldBlock[]
  doctors: ServiceContent['doctors']
  faqs: { eyebrow: string; h2: string; items: Faq[]; cta: Cta | null }
  closing: ServiceContent['closing']
  disclaimer: string
  /** Section ids in page order (`npm run verify`). */
  sectionIds: string[]
}

export type TechnologyPage = TechnologyHub | TechnologyDetail | ArtasDetail | InternationalPatients
