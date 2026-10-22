// Shape of one service page's content (content/service/service-page.md, one `### **…**` entry each). The copy is parsed
// into parsed.json (scripts/parse-service-pages.mjs) and assembled into these records by services/index.ts, which adds
// images, button actions and the doctor. The template in src/templates/ServiceTemplate.tsx is presentational; every
// word on a service page comes from one of these records.
// Arrays keep the doc's order. Title tag, meta description, robots, canonical and H1 are not here: they come from
// pages.json (scripts/generate-pages.mjs), like every other page.
// Keep this file to erasable TypeScript only (verify-seo.mjs imports the records with Node's type stripping).

import type { Testimonial } from '../home.ts'
import type { NavLink } from '../nav.ts'

/** A button. `book` opens the booking popup; `href` is a page, an on-page anchor ("#cost") or a tel: link. */
export type Cta = { label: string; action: 'book' } | { label: string; href: string }

export interface ServiceImage {
  src: string
  width: number
  height: number
  /** Describes what the photo shows (placeholders included), never the treatment it is meant to stand for. */
  alt: string
}

/** A numbered row from the doc's `|#|title|text|` tables: cards, process steps, candidates, technology, cost. */
export interface NumberedCard {
  title: string
  text: string
}

export interface Faq {
  q: string
  a: string
}

export interface ServiceContent {
  /** Canonical path, the key in services/index.ts; must be a `service` route in pages.json. */
  path: string
  /** Where the copy came from, e.g. "content/service/service-page.md:2983". */
  source: string
  /** 1. Page banner. The H1 is page.h1; the breadcrumb is page.crumbs. */
  hero: { intro: string; ctas: Cta[]; phoneLabel: string; image: ServiceImage }
  /** 2. Introduction. */
  intro: { h2: string; paragraphs: string[] }
  /** 3. Consultation highlight. */
  consultation: {
    h2: string
    introLine: string | null
    paragraphs: string[]
    ctas: Cta[]
    image: ServiceImage
    /** A video the doc names in this section (one page), linked rather than embedded. */
    video: { title: string; url: string } | null
  }
  /** 4. Why choose NeoSculpt6. */
  whyChoose: { h2: string; subline: string | null; cards: NumberedCard[] }
  /** 5. How it works. */
  process: { eyebrow: string; h2: string; steps: NumberedCard[]; image: ServiceImage }
  /** 6. Candidates: one tick item per card (title + supporting line); `note` is the paragraph under the list (two pages
   *  have none). */
  candidates: { h2: string; note: string | null; cards: NumberedCard[]; image: ServiceImage }
  /** 7. Your doctor. `doctor` picks the card (name, profile link, initials) from data/home.ts `doctors.cards`;
   *  `portrait` fills the card's circle (initials while it is null). */
  doctor: {
    doctor: 'Dr Sandeep Mahapatra' | 'Dr Saranya T'
    portrait: ServiceImage | null
    eyebrow: string
    h2: string
    specialty: string
    chips: string[]
    profileLabel: string
    blockEyebrow: string
    paragraphs: string[]
  }
  /** 8. Technology and infrastructure. */
  technology: { h2: string; subline: string | null; cards: NumberedCard[] }
  /** 9. Cost and consultation. `id="cost"` on the page; the hero's cost button points there. */
  cost: { h2: string; intro: string; factors: NumberedCard[]; ctas: Cta[] }
  /** 10. Additional strips (10, or 10a/10b). Empty when the doc has no section 10. */
  strips: { heading: string; text: string; cta: Cta | null }[]
  /** 11. Success stories. Real Google reviews only; pending entries show as pending cards. */
  reviews: { h2: string; items: Testimonial[] }
  /** 12. FAQs. Also the page's FAQPage schema, from the same strings. */
  faqs: { eyebrow: string; h2: string; items: Faq[]; cta: Cta }
  /** 13. Closing call to action. `chips` are short highlight tags (some pages); `image` is null until an approved
   *  photo is supplied. */
  closing: { kicker: string; h2: string; paragraph: string; chips: string[]; ctas: Cta[]; image: ServiceImage | null }
  /** Sidebar "Explore our services". */
  sidebar: { heading: string; links: NavLink[]; viewAll: NavLink; contactHeading: string; contactText: string; cta: Cta }
  /** Page-specific items that need sign-off before launch (prices, figures, notes); `npm run verify` lists them. */
  pending: string[]
}
