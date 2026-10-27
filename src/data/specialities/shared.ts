// What every speciality hub file shares: the buttons, photo lookup, doctor cards, pending reviews and section order.
// Keep this folder to erasable TypeScript only (verify-seo.mjs imports it with Node's type stripping).

import newPhotosJson from '../services/new-photos.json' with { type: 'json' }
import { clinic, instagram } from '../site.ts'
import { physicians, saranya } from '../about.ts'
import { doctorFor } from '../services/index.ts'
import type { Cta, ServiceDoctor, ServiceImage } from '../services/types.ts'
import { pillars, type Testimonial } from '../home.ts'

export const book: Cta = { label: 'Book a Consultation', action: 'book' }
export const call: Cta = { label: 'Call the Clinic', href: clinic.phoneHref }
export const whatsapp: Cta = { label: 'WhatsApp', href: clinic.whatsappHref }

/** Section ids in page order; a hub without technology cards leaves out `hub-technology`. */
export function hubOrder({ technology = true } = {}) {
  return [
    'technology-banner',
    'service-intro',
    'hub-treatments',
    'hub-concerns',
    'service-process',
    'service-doctor',
    ...(technology ? ['hub-technology'] : []),
    'cost',
    'success-stories',
    'service-faqs',
    'service-cta',
    'instagram',
  ]
}

type NewPhoto = { src: string; alt: string | null; width: number; height: number; unusable?: string }
const photos = new Map((newPhotosJson as NewPhoto[]).map((p) => [p.src, p]))
const instagramSrcs = new Set(instagram.tiles.map((t) => t.src))

/** A NeoSculpt6 photo (public/images/services/<hub>/<file>.webp): size and alt from new-photos.json, which
 *  describes the scene only. Stops the build for an unknown, unusable or Instagram photo. */
export function photo(hub: string, file: string): ServiceImage {
  const src = `/images/services/${hub}/${file}.webp`
  const p = photos.get(src)
  if (!p || p.unusable || !p.alt) throw new Error(`speciality hub photo not usable: ${src}`)
  if (instagramSrcs.has(src)) throw new Error(`speciality hub photo is an Instagram tile: ${src}`)
  return { src, width: p.width, height: p.height, alt: p.alt }
}

/** The speciality's Treatment Pillars photo (home.ts `pillars`, the same file and alt), for the banner. All six are
 *  900 × 1200 portraits; the banner crops them wide, a little above centre. */
export function pillarPhoto(hubPath: string): ServiceImage {
  const tab = pillars.tabs.find((t) => t.cta.href === hubPath)
  if (!tab) throw new Error(`no pillar photo for ${hubPath}`)
  return { src: tab.image, width: 900, height: 1200, alt: tab.imageAlt, position: '50% 30%' }
}

const sandeep = doctorFor('Dr Sandeep Mahapatra')
const sandeepRecord = physicians.find((d) => d.name === sandeep.name)
if (!sandeepRecord) throw new Error('no physician record for Dr Sandeep Mahapatra')
const saranyaDoc = doctorFor('Dr Saranya T')

/** Dr Sandeep's card with signed-off facts only: his job title, and chips that carry no † claim (years, case counts
 *  and degrees are † in about.ts). `paragraphs` are a child page's own words about his approach. */
export function sandeepCard(paragraphs: string[], chips: string[] = [], blockEyebrow = 'Meet Dr Sandeep'): ServiceDoctor {
  return {
    name: sandeep.name,
    href: sandeep.href,
    initials: sandeep.initials,
    portrait: sandeep.portrait,
    specialty: sandeepRecord!.jobTitle,
    chips,
    profileLabel: 'Know More',
    blockEyebrow,
    paragraphs,
    cta: book,
  }
}

/** Dr Saranya T's card: her title and qualifications as the About page shows them (not † in about.ts). */
export function saranyaCard(paragraphs: string[], blockEyebrow = 'Meet Dr Saranya'): ServiceDoctor {
  return {
    name: saranya.name,
    href: saranyaDoc.href,
    initials: saranya.initials,
    portrait: saranya.portrait,
    specialty: saranya.title,
    chips: saranya.qualifications,
    profileLabel: 'Know More',
    blockEyebrow,
    paragraphs,
    cta: book,
  }
}

/** 3–6 real Google reviews per hub, word for word with consent; none collected yet, so these show as pending. */
export function pendingReviews(treatment: string, lookFor: string[]): Testimonial[] {
  return lookFor.map((l) => ({ treatment, lookFor: l, quote: null, author: null, consent: false, source: null }))
}

/** Sign-off items every hub shares. */
export const sharedPending = [
  'hub copy: every heading, intro, group line, concern card, process step, cost line and the closing band are drafts (no hub doc)',
  'FAQs: the drafted questions are shown; FAQPage schema stays off until they are approved (faqsApproved)',
  'photos: banner, group and process photos need approval for this page',
  'reviews: 3 real Google reviews (quote, first name + initial, consent)',
  'SEO: title, description and H1 are drafts (src/data/hubs.ts)',
]
