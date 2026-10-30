// Doctor profiles: one record per doctor in doctors.json, one renderer (src/components/doctor/DoctorProfilePage.tsx).
// This module is the contract: the types, the validation that runs on load (a malformed record stops `npm run gen`,
// the build and `npm run verify`), the route lookup, and the public view of a record (only approved items).
// generate-pages.mjs reads `publishedDoctors` to build each doctor's route and SEO, so adding a doctor is: add a
// record, add its approved images, run `npm run gen`. Keep this file to erasable TypeScript only (Node imports it).

import raw from './doctors.json' with { type: 'json' }
import { SITE_URL } from './site.ts'

export const STATUSES = ['published', 'draft'] as const
export const APPROVALS = ['approved', 'pending'] as const
export const QUALIFICATION_TYPES = ['education', 'certification', 'training'] as const
export const SOCIAL_NETWORKS = ['instagram', 'facebook', 'youtube', 'linkedin'] as const
export const SCHEMA_SPECIALTIES = ['Dermatology', 'PlasticSurgery', 'Gynecologic', 'Obstetric'] as const

export type Status = (typeof STATUSES)[number]
export type Approval = (typeof APPROVALS)[number]
export type QualificationType = (typeof QUALIFICATION_TYPES)[number]
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number]
export type SchemaSpecialty = (typeof SCHEMA_SPECIALTIES)[number]

export interface DoctorImage {
  src: string
  width: number
  height: number
  alt: string
}

export interface Doctor {
  slug: string
  path: string
  status: Status
  /** Full name as written in SEO copy ("Dr. Sandeep Mahapatra"). */
  name: string
  /** Name used in breadcrumbs, headings and the booking form ("Dr Sandeep Mahapatra"). */
  displayName: string
  initials: string
  role: string
  shortRole: string
  /** schema.org MedicalSpecialty for the Physician node. */
  schemaSpecialty: SchemaSpecialty
  seo: { title: string; description: string; h1: string; canonical: string; robots: string; ogImage: string }
  hero: { eyebrow: string; intro: string; portrait: DoctorImage & { approval: Approval } }
  /** Square crop for the round doctor cards (home, About, menus); null uses the hero portrait. Shown only once the
   *  hero portrait is approved. */
  cardPortrait: DoctorImage | null
  /** null when there is no approved philosophy copy; the section is then left out. */
  philosophy: { eyebrow: string; heading: string; paragraphs: string[] } | null
  /** An item links only where the target page already shows this doctor (checked by validate-doctors.mjs). */
  expertise: { title: string; description: string | null; href: string | null; image: DoctorImage | null }[]
  qualifications: { title: string; institution: string | null; type: QualificationType; approval: Approval }[]
  recognition: { title: string; organisation: string; logo: DoctorImage | null; approval: Approval }[]
  metrics: { value: string; label: string; approval: Approval }[]
  process: { eyebrow: string | null; heading: string; intro: string | null; steps: { title: string; description: string }[] }
  quote: { text: string | null; approval: Approval }
  socialLinks: { network: SocialNetwork; href: string | null; approval: Approval }[]
  ctas: { profileLabel: string; contactLabel: string; contactHref: string; bookingEyebrow: string; bookingHeading: string }
  contentReview: { medicalReviewStatus: Approval; lastReviewed: string | null; reviewedBy: string | null }
}

// Validation ---------------------------------------------------------------------------------------------------------

type Check = (v: unknown, at: string, errors: string[]) => void

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const str: Check = (v, at, e) => {
  if (typeof v !== 'string' || !v.trim()) e.push(`${at}: expected a non-empty string`)
}
const oneOf =
  (values: readonly string[]): Check =>
  (v, at, e) => {
    if (typeof v !== 'string' || !values.includes(v)) e.push(`${at}: expected one of ${values.join(' | ')}, got ${JSON.stringify(v)}`)
  }
const posInt: Check = (v, at, e) => {
  if (!Number.isInteger(v) || (v as number) <= 0) e.push(`${at}: expected a positive integer, got ${JSON.stringify(v)}`)
}
const nullable =
  (check: Check): Check =>
  (v, at, e) => {
    if (v !== null) check(v, at, e)
  }
const list =
  (check: Check): Check =>
  (v, at, e) => {
    if (!Array.isArray(v)) e.push(`${at}: expected an array`)
    else v.forEach((item, i) => check(item, `${at}[${i}]`, e))
  }
const nonEmptyList =
  (check: Check): Check =>
  (v, at, e) => {
    if (Array.isArray(v) && v.length === 0) e.push(`${at}: expected at least one item`)
    list(check)(v, at, e)
  }
// Every record has exactly these keys: optional content is null or [], never a missing key.
const shape =
  (fields: Record<string, Check>): Check =>
  (v, at, e) => {
    if (!isObject(v)) return void e.push(`${at}: expected an object`)
    for (const k of Object.keys(fields)) {
      if (!(k in v)) e.push(`${at}.${k}: missing`)
      else fields[k](v[k], `${at}.${k}`, e)
    }
    for (const k of Object.keys(v)) if (!(k in fields)) e.push(`${at}.${k}: unexpected field`)
  }

const image = shape({ src: str, width: posInt, height: posInt, alt: str })
const doctorShape = shape({
  slug: str,
  path: str,
  status: oneOf(STATUSES),
  name: str,
  displayName: str,
  initials: str,
  role: str,
  shortRole: str,
  schemaSpecialty: oneOf(SCHEMA_SPECIALTIES),
  seo: shape({ title: str, description: str, h1: str, canonical: str, robots: str, ogImage: str }),
  hero: shape({
    eyebrow: str,
    intro: str,
    portrait: shape({ src: str, width: posInt, height: posInt, alt: str, approval: oneOf(APPROVALS) }),
  }),
  cardPortrait: nullable(image),
  philosophy: nullable(shape({ eyebrow: str, heading: str, paragraphs: nonEmptyList(str) })),
  expertise: list(shape({ title: str, description: nullable(str), href: nullable(str), image: nullable(image) })),
  qualifications: list(shape({ title: str, institution: nullable(str), type: oneOf(QUALIFICATION_TYPES), approval: oneOf(APPROVALS) })),
  recognition: list(shape({ title: str, organisation: str, logo: nullable(image), approval: oneOf(APPROVALS) })),
  metrics: list(shape({ value: str, label: str, approval: oneOf(APPROVALS) })),
  process: shape({
    eyebrow: nullable(str),
    heading: str,
    intro: nullable(str),
    steps: nonEmptyList(shape({ title: str, description: str })),
  }),
  quote: shape({ text: nullable(str), approval: oneOf(APPROVALS) }),
  socialLinks: list(shape({ network: oneOf(SOCIAL_NETWORKS), href: nullable(str), approval: oneOf(APPROVALS) })),
  ctas: shape({ profileLabel: str, contactLabel: str, contactHref: str, bookingEyebrow: str, bookingHeading: str }),
  contentReview: shape({ medicalReviewStatus: oneOf(APPROVALS), lastReviewed: nullable(str), reviewedBy: nullable(str) }),
})

// Words the brief keeps out of patient-facing copy, and leftovers from the old theme demo.
const BANNED = [/\bbest\b/i, /\bno\.? ?1\b/i, /\bguarantee(d|s)?\b/i, /\bpermanent(ly)?\b/i, /\bpainless\b/i, /\bno side effects?\b/i, /\bscarless\b/i]
const DEMO = [/portland/i, /medicross/i, /\+1 800/, /lorem ipsum/i]

const strings = (v: unknown, at: string): [string, string][] =>
  typeof v === 'string'
    ? [[at, v]]
    : Array.isArray(v)
      ? v.flatMap((x, i) => strings(x, `${at}[${i}]`))
      : isObject(v)
        ? Object.entries(v).flatMap(([k, x]) => strings(x, `${at}.${k}`))
        : []

const internalHref = (href: string) => /^\/([a-z0-9-]+\/)*(#[a-z0-9-]+)?$/.test(href)
const hrefOk = (href: string) => internalHref(href) || href.startsWith('https://')

export function validateDoctors(input: unknown): Doctor[] {
  const errors: string[] = []
  if (!Array.isArray(input) || input.length === 0) throw new Error('doctors.json: expected a non-empty array of doctor records')
  input.forEach((rec, i) => doctorShape(rec, `doctors[${i}]${isObject(rec) && typeof rec.slug === 'string' ? ` (${rec.slug})` : ''}`, errors))
  if (errors.length) throw new Error(`doctors.json is malformed:\n  ${errors.join('\n  ')}`)

  const records = input as Doctor[]
  const seen = { slug: new Set<string>(), path: new Set<string>() }
  for (const d of records) {
    const at = d.slug
    for (const key of ['slug', 'path'] as const) {
      if (seen[key].has(d[key])) errors.push(`${at}: duplicate ${key} ${d[key]}`)
      seen[key].add(d[key])
    }
    if (!/^[a-z0-9-]+$/.test(d.slug)) errors.push(`${at}.slug: lowercase letters, digits and hyphens only`)
    if (!/^\/[a-z0-9-]+\/$/.test(d.path)) errors.push(`${at}.path: must look like /some-path/`)
    if (d.seo.canonical !== SITE_URL + d.path) errors.push(`${at}.seo.canonical: must be ${SITE_URL + d.path}`)
    if (!/^(no)?index, (no)?follow$/.test(d.seo.robots)) errors.push(`${at}.seo.robots: expected e.g. "index, follow"`)
    for (const [field, src] of [['seo.ogImage', d.seo.ogImage], ['hero.portrait.src', d.hero.portrait.src]] as const)
      if (!src.startsWith('/')) errors.push(`${at}.${field}: must be a site path starting with /`)
    const hrefs: [string, string | null][] = [
      ['ctas.contactHref', d.ctas.contactHref],
      ...d.expertise.map((x, i): [string, string | null] => [`expertise[${i}].href`, x.href]),
      ...d.socialLinks.map((x, i): [string, string | null] => [`socialLinks[${i}].href`, x.href]),
    ]
    for (const [field, href] of hrefs) if (href !== null && !hrefOk(href)) errors.push(`${at}.${field}: not a site path or https URL: ${href}`)
    d.socialLinks.forEach((s, i) => {
      if (s.href && !s.href.startsWith('https://')) errors.push(`${at}.socialLinks[${i}].href: social links must be https URLs`)
      if (s.approval === 'approved' && !s.href) errors.push(`${at}.socialLinks[${i}]: approved but has no href`)
    })
    if (d.quote.approval === 'approved' && !d.quote.text) errors.push(`${at}.quote: approved but has no text`)
    if (d.quote.approval === 'approved' && !d.philosophy) errors.push(`${at}.quote: approved, but the quote shows in the philosophy section, which is null`)
    for (const [field, text] of strings(d, at)) {
      for (const re of BANNED) if (re.test(text)) errors.push(`${field}: banned wording ${re} in "${text}"`)
      for (const re of DEMO) if (re.test(text)) errors.push(`${field}: theme-demo leftover ${re} in "${text}"`)
    }
  }
  if (errors.length) throw new Error(`doctors.json is invalid:\n  ${errors.join('\n  ')}`)
  return records
}

export const doctors: Doctor[] = validateDoctors(raw)
export const publishedDoctors = doctors.filter((d) => d.status === 'published')
export const doctorByPath = new Map(publishedDoctors.map((d) => [d.path, d]))

// Public view: what a page, its schema and its checks may show. Pending items never leave this module unfiltered. --

export const approved = <T extends { approval: Approval }>(items: T[]): T[] => items.filter((x) => x.approval === 'approved')

export function portraitFor(d: Doctor): DoctorImage | null {
  const { approval, ...portrait } = d.hero.portrait
  return approval === 'approved' ? portrait : null
}

/** The round card's photo: the square crop if there is one, else the hero portrait; null until approved. */
export const cardPortraitFor = (d: Doctor): DoctorImage | null => (portraitFor(d) ? (d.cardPortrait ?? portraitFor(d)) : null)

/** Approved degrees, joined for the hero ("MBBS · MD Dermatology"). */
export const credentialLine = (d: Doctor) =>
  approved(d.qualifications)
    .filter((q) => q.type === 'education')
    .map((q) => q.title)
    .join(' · ')

export const publicQuote = (d: Doctor) => (d.quote.approval === 'approved' && d.quote.text ? d.quote.text : null)

export const publicSocialLinks = (d: Doctor) =>
  approved(d.socialLinks).filter((s): s is typeof s & { href: string } => s.href !== null)

/**
 * The page's sections in their fixed order, minus any whose approved content is empty. The renderer and
 * verify-seo.mjs both use this list, so the order is defined once.
 */
export const DOCTOR_SECTIONS = [
  'doctor-hero',
  'doctor-philosophy',
  'doctor-expertise',
  'doctor-credentials',
  'doctor-metrics',
  'doctor-process',
  'doctor-booking',
  'instagram',
] as const
export type DoctorSectionId = (typeof DOCTOR_SECTIONS)[number]

export function doctorSections(d: Doctor): DoctorSectionId[] {
  const shown: Record<DoctorSectionId, boolean> = {
    'doctor-hero': true,
    'doctor-philosophy': d.philosophy !== null,
    'doctor-expertise': d.expertise.length > 0,
    'doctor-credentials': approved(d.qualifications).length + approved(d.recognition).length > 0,
    'doctor-metrics': approved(d.metrics).length > 0,
    'doctor-process': true,
    'doctor-booking': true,
    instagram: true,
  }
  return DOCTOR_SECTIONS.filter((id) => shown[id])
}

/** Everything still waiting for sign-off, for the validation report. */
export function pendingItems(d: Doctor): string[] {
  const out: string[] = []
  if (d.hero.portrait.approval !== 'approved') out.push(`portrait (showing initials): ${d.hero.portrait.src}`)
  for (const q of d.qualifications) if (q.approval !== 'approved') out.push(`qualification: ${q.title}${q.institution ? ` (${q.institution})` : ''}`)
  for (const r of d.recognition) if (r.approval !== 'approved') out.push(`recognition: ${r.title}, ${r.organisation}`)
  for (const m of d.metrics) if (m.approval !== 'approved') out.push(`metric: ${m.value} ${m.label}`)
  if (d.quote.text && d.quote.approval !== 'approved') out.push(`quote: "${d.quote.text}"`)
  for (const s of d.socialLinks) if (s.approval !== 'approved' || !s.href) out.push(`social: ${s.network}${s.href ? '' : ' (no URL yet)'}`)
  if (d.contentReview.medicalReviewStatus !== 'approved') out.push('medical review of the profile copy')
  return out
}
