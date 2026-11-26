// /results/ page: copy and the before/after case registry (content/results/prompts/results-page.md).
// Cases live in results.json, one record per case. A case shows on the page only when isPublished() passes: status
// `published`, written consent for the website gallery that has not expired, and medical and image approval.
// scripts/validate-results.mjs (run by `npm run gen`) checks every record and lists hidden cases with the reason.
// Adding a case: a record in results.json plus its images in public/images/results/. For a clinic card with both photos
// side by side, scripts/split_result_cards.py (repo root) writes the before/after pair from the record's `source`.
// Treatment name, doctor, timeline and caption stay null unless approved; the page never guesses them.
// The 16 cases from the 31-10-2026 drop are recorded as consented and approved on the client's confirmation (31 Oct 2026).

import raw from './results.json' with { type: 'json' }
import type { ServiceContent } from './services/types'

export type ResultCategory = 'hair' | 'skin' | 'body' | 'anti-ageing' | 'surgery' | 'gynaecology'
export type ResultStatus = 'draft' | 'review' | 'published' | 'archived'
export type Approval = 'pending' | 'approved' | 'rejected'

export interface ResultImage {
  src: string
  thumbnail: string
  width: number
  height: number
  alt: string
}

export interface ResultCase {
  id: string
  status: ResultStatus
  category: ResultCategory
  speciality: ResultCategory
  treatmentLabel: string
  /** Exactly as approved; null when not approved. */
  treatmentName: string | null
  doctor: string | null
  location: string
  timeline: string | null
  before: ResultImage
  after: ResultImage
  caption: string | null
  consent: {
    written: boolean
    scope: string
    /** ISO date; null when the consent has no end date. */
    expiresAt: string | null
    patientIdentifiable: boolean
    eyesCovered: boolean
  }
  approval: { medical: Approval; image: Approval; published: boolean }
  /** The supplied file the images were made from (drop folder / file name). */
  source?: string
}

export const CONSENT_SCOPE = 'website-results-gallery'

/** Why a case may not be shown, or null when it may. The same rule as scripts/validate-results.mjs. */
export function hiddenReason(c: ResultCase, today = new Date().toISOString().slice(0, 10)): string | null {
  if (c.status !== 'published') return `status is ${c.status}`
  if (!c.consent.written) return 'no written consent'
  if (c.consent.scope !== CONSENT_SCOPE) return `consent scope is ${c.consent.scope}, not ${CONSENT_SCOPE}`
  if (c.consent.expiresAt && c.consent.expiresAt < today) return `consent expired on ${c.consent.expiresAt}`
  if (c.consent.patientIdentifiable) return 'patient is identifiable'
  if (c.approval.medical !== 'approved') return `medical approval is ${c.approval.medical}`
  if (c.approval.image !== 'approved') return `image approval is ${c.approval.image}`
  if (!c.approval.published) return 'not approved for publishing'
  return null
}

export const allResultCases = raw as ResultCase[]
export const resultCases = allResultCases.filter((c) => hiddenReason(c) === null)

// Every category the gallery knows, in filter order, with the speciality page it links to. A filter shows only for a
// category with published cases.
export const resultCategories: Record<ResultCategory, { label: string; href: string }> = {
  hair: { label: 'Hair Restoration', href: '/hair-transplant-restoration/' },
  skin: { label: 'Skin & Face', href: '/laser-skin-aesthetic/' },
  body: { label: 'Body Contouring', href: '/slimming-body-contouring/' },
  'anti-ageing': { label: 'Anti-Ageing', href: '/anti-aging-injectables/' },
  surgery: { label: 'Cosmetic Surgery', href: '/cosmetic-surgery/' },
  gynaecology: { label: 'Cosmetic Gynaecology', href: '/cosmetic-gynecology/' },
}

export const resultsPage = {
  eyebrow: 'Real Results',
  text: "We aim for results that suit your face and body, not a template. Every case is shared for patient education with the patient's written consent.",
  ctas: [
    { label: 'Book a Consultation', action: 'book' },
    { label: 'Find My Treatment', href: '/#find-my-treatment' },
  ] satisfies ServiceContent['closing']['ctas'],
  intro: {
    h2: [{ text: 'Results That ' }, { text: 'Look Like', gold: true }, { text: ' You' }],
    text: 'If you do not need a procedure or need to wait, we will tell you. Your doctor assesses your concern, suitability, alternatives and realistic expectations before a plan is made.',
  },
  galleryTitle: [{ text: 'Before & After ' }, { text: 'Gallery', gold: true }],
  allLabel: 'All Results',
  empty: 'Approved cases will appear here once each patient’s consent and the medical review are complete.',
  privacy: 'Eyes are covered to protect patient privacy.',
  disclaimer:
    'Individual results vary. Before-and-after images are shared for patient education and are not a promise of a specific outcome.',
  // Closing band, drawn by the service pages' ServiceCta.
  closing: {
    kicker: null,
    h2: 'Plan Your Own Result',
    paragraph:
      'Every plan starts with a consultation with the specialist for your concern, who will tell you what is realistic for you.',
    chips: [],
    ctas: [
      { label: 'Book a Consultation', action: 'book' },
      { label: 'Find My Treatment', href: '/#find-my-treatment' },
    ],
    image: null,
  } satisfies ServiceContent['closing'],
}
