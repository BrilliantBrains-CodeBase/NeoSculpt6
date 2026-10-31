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
  /** CSS object-position for a crop that would otherwise cut the subject (wide banners from portrait photos). */
  position?: string
}

/** A doctor on a service page: who they are (services/index.ts `DOCTORS`) and the page's own copy about them. */
export interface ServiceDoctor {
  name: string
  /** Profile page, or null for a doctor without one (Dr Lavanyaa M): the card then has no profile link. */
  href: string | null
  initials: string
  /** Fills the card's circle; initials show while it is null. */
  portrait: ServiceImage | null
  specialty: string
  chips: string[]
  profileLabel: string
  /** The current-site doctor block's eyebrow; null where the page has no doctor block (technology pages). */
  blockEyebrow: string | null
  paragraphs: string[]
  /** A button beside the profile link (speciality hubs: "Book a Consultation"); service pages have none. */
  cta?: Cta
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
  /** 2. Introduction. `points`: an optional row of small cards under the text (a doc's "Extra" block). */
  intro: { h2: string; paragraphs: string[]; points: NumberedCard[] }
  /** 3. Consultation highlight. */
  consultation: {
    h2: string
    introLine: string | null
    paragraphs: string[]
    ctas: Cta[]
    image: ServiceImage
    /** The page's YouTube video (videos.json), shown under the text; null when it has none approved. */
    video: ServiceVideo | null
  }
  /** 4. Why choose NeoSculpt6. */
  whyChoose: { h2: string; subline: string | null; cards: NumberedCard[] }
  /** 5. How it works. */
  process: { eyebrow: string; h2: string; steps: NumberedCard[]; image: ServiceImage }
  /** 6. Candidates: one tick item per card (title + supporting line); `note` is the paragraph under the list (two pages
   *  have none). */
  candidates: { h2: string; note: string | null; cards: NumberedCard[]; image: ServiceImage }
  /** 7. Your doctor: one card per doctor the doc names for this page, in its order (most pages have one). */
  doctors: {
    eyebrow: string
    h2: string
    cards: ServiceDoctor[]
    /** A paragraph block under the heading (International Patients); service pages have none. */
    intro?: string[]
    /** Two cards side by side on desktop (technology pages); service pages stack them. */
    columns?: boolean
  }
  /** 8. Technology and infrastructure. */
  technology: { h2: string; subline: string | null; cards: NumberedCard[] }
  /** 9. Cost and consultation. `id="cost"` on the page; the hero's cost button points there. */
  cost: { h2: string; intro: string; factors: NumberedCard[]; ctas: Cta[] }
  /** 10. Additional strips (10, or 10a/10b). Empty when the doc has no section 10. */
  strips: { heading: string; text: string; cta: Cta | null }[]
  /** 11. Success stories. Real Google reviews only; pending entries show as pending cards. */
  reviews: { h2: string; items: Testimonial[] }
  /** 12. FAQs. Also the page's FAQPage schema, from the same strings. `cta` is null where the doc gives no button. */
  faqs: { eyebrow: string; h2: string; items: Faq[]; cta: Cta | null }
  /** 13. Closing call to action. `kicker` is null where the doc has none (technology pages); `chips` are short
   *  highlight tags (some pages); `image` is null until an approved photo is supplied. */
  closing: { kicker: string | null; h2: string; paragraph: string; chips: string[]; ctas: Cta[]; image: ServiceImage | null }
  /** Sidebar "Explore our services". */
  sidebar: { heading: string; links: NavLink[]; viewAll: NavLink; contactHeading: string; contactText: string; cta: Cta }
  /** Page-specific items that need sign-off before launch (prices, figures, notes); `npm run verify` lists them. */
  pending: string[]
}

/** A service page's YouTube video: a record in videos.json (scripts/import-videos.mjs, checked by
 *  scripts/validate-videos.mjs). A page shows it only when it is approved, consent-confirmed and published. */
export interface ServiceVideo {
  provider: 'youtube'
  videoId: string
  /** https://www.youtube.com/watch?v=<videoId> */
  url: string
  title: string
  description?: string
  /** Local copy of the YouTube thumbnail, so nothing loads from YouTube before the visitor presses play. */
  thumbnail?: { src: string; width: number; height: number; alt: string }
  transcriptUrl?: string
  attribution?: string
  /** From YouTube (scripts/fetch-video-meta.mjs): needed for the schema.org VideoObject. ISO 8601. */
  uploadDate?: string
  /** ISO 8601 duration, e.g. PT3M34S. */
  duration?: string
  approval: 'approved' | 'pending' | 'rejected'
  consentConfirmed: boolean
  published: boolean
}
