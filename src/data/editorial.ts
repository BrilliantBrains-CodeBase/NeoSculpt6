// Journal, blogs and media coverage: one record per item in editorial.json, read by the /journal/ hub, the article
// pages, the home Journal section (section 14), the route generator and `npm run verify`.
// This module is the contract: the types, the validation that runs on load (a malformed record stops `npm run gen`,
// the build and `npm run verify`), the build-date rules for what is public, and the helpers the pages share.
// Adding an article or a media mention is: add a record (and, for an article, its Markdown body and image), run
// `npm run gen`. Keep this file to erasable TypeScript only (Node imports it).
//
// Statuses: draft and review are never shown; scheduled goes live on the first build on or after its date;
// published is live; archived leaves the listings (an article keeps its page, marked archived and noindex).
// Media records link straight to the publication (or to the hosted scan for print), so they have no page of their
// own. Owned records (journal, blog) get /journal/<slug>/.
// Nothing here is invented: titles of media records are the publication's own headlines, dates come from the
// publication, and article copy, authors and review records are filled in only from the signed-off article.

import raw from './editorial.json' with { type: 'json' }
import { SITE_URL } from './site.ts'
import { publishedDoctors } from './doctors.ts'

export const TYPES = ['journal', 'blog', 'media'] as const
export const STATUSES = ['draft', 'review', 'scheduled', 'published', 'archived'] as const
export const COVERAGE_TYPES = [
  'authored-article',
  'expert-commentary',
  'expert-interview',
  'feature',
  'press-coverage',
  'podcast',
  'print',
] as const
export const REVIEW_STATUSES = ['pending', 'approved'] as const
export const LANGUAGES = ['hi', 'kn'] as const

export type EditorialType = (typeof TYPES)[number]
export type EditorialStatus = (typeof STATUSES)[number]
export type CoverageType = (typeof COVERAGE_TYPES)[number]
export type Language = (typeof LANGUAGES)[number]

// Speciality filters and card labels. The six hubs use the homepage's labels; `general` is for items that don't
// belong to one speciality (skin care in general, AI in dermatology), so nothing is forced into a speciality.
export const specialities = {
  hair: { label: 'Hair Restoration', href: '/hair-transplant-restoration/' },
  body: { label: 'Body Contouring', href: '/slimming-body-contouring/' },
  laser: { label: 'Laser & Skin', href: '/laser-skin-aesthetic/' },
  injectables: { label: 'Anti-Ageing & Injectables', href: '/anti-aging-injectables/' },
  surgery: { label: 'Cosmetic Surgery', href: '/cosmetic-surgery/' },
  gynaecology: { label: 'Cosmetic Gynaecology', href: '/cosmetic-gynecology/' },
  general: { label: 'General', href: null },
} as const satisfies Record<string, { label: string; href: string | null }>

export type SpecialityKey = keyof typeof specialities
export const SPECIALITY_KEYS = Object.keys(specialities) as SpecialityKey[]

export const typeLabels: Record<EditorialType, string> = { journal: 'Journal', blog: 'Blog', media: 'Media Coverage' }
// Filter tab labels (the prompt's "Blogs" plural for the tab, "Blog" on a card).
export const typeFilterLabels: Record<EditorialType, string> = { journal: 'Journal', blog: 'Blogs', media: 'Media Coverage' }
export const coverageLabels: Record<CoverageType, string> = {
  'authored-article': 'Authored Article',
  'expert-commentary': 'Expert Commentary',
  'expert-interview': 'Expert Interview',
  feature: 'Feature',
  'press-coverage': 'Press Coverage',
  podcast: 'Podcast',
  print: 'Print',
}
export const languageLabels: Record<Language, string> = { hi: 'In Hindi', kn: 'In Kannada' }

export interface EditorialImage {
  src: string
  width: number
  height: number
  /** Describe what the photo shows; don't repeat the title. */
  alt: string
}

export interface Clipping {
  thumb: string
  thumbWidth: number
  thumbHeight: number
  full: string
  fullWidth: number
  fullHeight: number
  alt: string
}

export interface MediaDetails {
  publication: string
  /** Shown only with permissionConfirmed. No logos are used yet. */
  publicationLogo: string | null
  /** The publication's page. Null for print coverage, which links to the hosted scan instead. */
  sourceUrl: string | null
  coverageType: CoverageType
  language: Language | null
  /** Print only, e.g. "August 2026 issue, page 74". */
  edition?: string
  /** Doctor slug from doctors.json. */
  quotedDoctor: string | null
  /** Other outlets that carried the same story (press releases). */
  syndicated: { name: string; url: string }[]
  /** A scan of print coverage; shown only with permissionConfirmed. */
  clipping: Clipping | null
  /** An approved short summary. When set, the mention could get a summary page; none has one yet. */
  summary: string | null
  sourceVerified: boolean
  permissionConfirmed: boolean
  /** How and when the source was checked (for the editor; not shown). */
  verification: string
}

export interface MedicalReview {
  required: boolean
  status: (typeof REVIEW_STATUSES)[number]
  by: string | null
  date: string | null
}

export interface EditorialRecord {
  id: string
  type: EditorialType
  status: EditorialStatus
  slug: string
  /** /journal/<slug>/ for owned records; null for media. */
  path: string | null
  title: string
  excerpt: string | null
  speciality: SpecialityKey
  /** YYYY-MM-DD. Null only while a draft has no date. */
  date: string | null
  /** "month" when the source gives only a month (print issues); the day is then not shown. */
  datePrecision?: 'day' | 'month'
  updatedDate: string | null
  featuredImage: EditorialImage | null
  /** Doctor slug from doctors.json (owned records). */
  author: string | null
  medicalReview: MedicalReview | null
  content: { bodySource: string; readingTimeMinutes: number | null; tags: string[]; hasMedicalClaims: boolean } | null
  media: MediaDetails | null
  seo: { title: string; description: string; robots: string } | null
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const BANNED = [/\bbest\b/i, /\bno\.? ?1\b/i, /\bguarantee(d|s)?\b/i, /\bpermanent(ly)?\b/i, /\bpainless\b/i, /\bno side effects?\b/i, /\bscarless\b/i]

const isIsoDate = (s: unknown): s is string => typeof s === 'string' && ISO_DATE.test(s) && !Number.isNaN(Date.parse(s))
const nonEmpty = (s: unknown): s is string => typeof s === 'string' && s.trim().length > 0

/** The date the build counts as "today" (YYYY-MM-DD, India time); BUILD_DATE overrides it for tests. */
export function buildDate(): string {
  const env = typeof process !== 'undefined' ? process.env?.BUILD_DATE : undefined
  if (env && ISO_DATE.test(env)) return env
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)
}

/** Shown on the hub, the home section and (owned) as a page: published, or scheduled with its date reached. */
export function isPublic(r: EditorialRecord, today = buildDate()): boolean {
  if (r.status === 'published') return true
  return r.status === 'scheduled' && r.date !== null && r.date <= today
}

/** An owned record that has a page: public, or archived (kept, noindex). */
export const hasPage = (r: EditorialRecord, today = buildDate()) =>
  r.type !== 'media' && r.path !== null && (isPublic(r, today) || (r.status === 'archived' && r.date !== null))

const owned = (r: EditorialRecord) => r.type !== 'media'

// Checks every record's shape, and the full set of rules for anything that can reach a page. Throws with every
// problem listed. Files on disk (bodies, images) are checked by scripts/validate-editorial.mjs.
export function validateEditorial(input: unknown, today = buildDate()): EditorialRecord[] {
  if (!Array.isArray(input)) throw new Error('editorial.json: expected an array of records')
  const records = input as EditorialRecord[]
  const errors: string[] = []
  const doctorSlugs = new Set(publishedDoctors.map((d) => d.slug))
  const seen = { id: new Map<string, string>(), slug: new Map<string, string>(), path: new Map<string, string>(), source: new Map<string, string>(), title: new Map<string, string>() }
  const unique = (kind: keyof typeof seen, value: string | null | undefined, id: string) => {
    if (!value) return
    const key = kind === 'title' || kind === 'source' ? value.trim().toLowerCase() : value
    const other = seen[kind].get(key)
    if (other) errors.push(`${id}: duplicate ${kind} "${value}" (also ${other})`)
    else seen[kind].set(key, id)
  }

  for (const [i, r] of records.entries()) {
    const id = nonEmpty(r?.id) ? r.id : `record ${i}`
    const err = (msg: string) => errors.push(`${id}: ${msg}`)
    if (!nonEmpty(r?.id)) err('missing id')
    if (!TYPES.includes(r.type)) err(`type "${r.type}" is not one of ${TYPES.join(', ')}`)
    if (!STATUSES.includes(r.status)) err(`status "${r.status}" is not one of ${STATUSES.join(', ')}`)
    if (!nonEmpty(r.slug) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.slug)) err(`slug "${r.slug}" must be lowercase words joined by hyphens`)
    if (!nonEmpty(r.title)) err('missing title')
    if (!SPECIALITY_KEYS.includes(r.speciality)) err(`speciality "${r.speciality}" is not one of ${SPECIALITY_KEYS.join(', ')}`)
    if (r.date !== null && !isIsoDate(r.date)) err(`date "${r.date}" is not YYYY-MM-DD`)
    if (r.updatedDate !== null && !isIsoDate(r.updatedDate)) err(`updatedDate "${r.updatedDate}" is not YYYY-MM-DD`)
    if (r.datePrecision !== undefined && !['day', 'month'].includes(r.datePrecision)) err(`datePrecision "${r.datePrecision}" must be day or month`)
    unique('id', r.id, id)
    unique('slug', r.slug, id)
    unique('path', r.path, id)

    if (owned(r)) {
      if (r.path !== `/journal/${r.slug}/`) err(`path must be /journal/${r.slug}/`)
      if (r.media !== null) err('media must be null on a journal or blog record')
      if (!r.content || !nonEmpty(r.content.bodySource)) err('content.bodySource is required')
    } else {
      if (r.path !== null) err('a media record has no page: path must be null')
      if (!r.media) err('media details are required')
      else {
        const m = r.media
        if (!nonEmpty(m.publication)) err('media.publication is required')
        if (!COVERAGE_TYPES.includes(m.coverageType)) err(`media.coverageType "${m.coverageType}" is not one of ${COVERAGE_TYPES.join(', ')}`)
        if (m.language !== null && !LANGUAGES.includes(m.language)) err(`media.language "${m.language}" is not one of ${LANGUAGES.join(', ')}`)
        if (m.sourceUrl !== null && !/^https:\/\//.test(m.sourceUrl)) err('media.sourceUrl must be an https URL')
        if (m.quotedDoctor !== null && !doctorSlugs.has(m.quotedDoctor)) err(`media.quotedDoctor "${m.quotedDoctor}" is not a published doctor`)
        for (const s of m.syndicated ?? []) if (!nonEmpty(s.name) || !/^https:\/\//.test(s.url)) err(`syndicated entry "${s.name}" needs a name and an https URL`)
        unique('source', m.sourceUrl ?? m.clipping?.full, id)
      }
    }

    const live = isPublic(r, today) || r.status === 'archived'
    if (!live) continue
    unique('title', r.title, id)
    if (!isIsoDate(r.date)) err('a public record needs a date')
    if (owned(r)) {
      if (!nonEmpty(r.excerpt)) err('excerpt is required')
      if (!r.featuredImage || !nonEmpty(r.featuredImage.src) || !nonEmpty(r.featuredImage.alt)) err('featuredImage with alt text is required')
      else if (r.featuredImage.alt.trim().toLowerCase() === r.title.trim().toLowerCase()) err('featuredImage.alt must describe the image, not repeat the title')
      if (!r.author || !doctorSlugs.has(r.author)) err(`author "${r.author}" is not a published doctor`)
      if (!r.seo || !nonEmpty(r.seo.title) || !nonEmpty(r.seo.description) || !nonEmpty(r.seo.robots)) err('seo title, description and robots are required')
      const needsReview = r.type === 'journal' || r.content?.hasMedicalClaims
      const review = r.medicalReview
      if (needsReview && !(review?.status === 'approved' && nonEmpty(review.by) && isIsoDate(review.date))) {
        err('needs an approved medical review (medicalReview.status "approved", by, date) before it can be published')
      }
      if (review?.status === 'approved' && !publishedDoctors.some((d) => d.displayName === review.by || d.name === review.by)) {
        err(`medicalReview.by "${review.by}" is not a published doctor's name`)
      }
      for (const [field, text] of [['title', r.title], ['excerpt', r.excerpt], ['seo.title', r.seo?.title], ['seo.description', r.seo?.description]] as const) {
        for (const re of BANNED) if (text && re.test(text)) err(`${field}: banned wording ${re}`)
      }
    } else if (r.media) {
      const m = r.media
      if (!m.sourceVerified) err('media source not verified (media.sourceVerified must be true to publish)')
      if (!m.sourceUrl && !m.clipping) err('a media record needs a sourceUrl or a clipping')
      if (m.clipping && !m.permissionConfirmed) err('a clipping is shown only with media.permissionConfirmed')
      if (m.publicationLogo && !m.permissionConfirmed) err('a publication logo is shown only with media.permissionConfirmed')
      if (m.clipping && !nonEmpty(m.clipping.alt)) err('media.clipping.alt is required')
    }
  }
  if (errors.length) throw new Error(`editorial.json is invalid:\n  ${errors.join('\n  ')}`)
  return records
}

export const editorial: EditorialRecord[] = validateEditorial(raw)

const newestFirst = (a: EditorialRecord, b: EditorialRecord) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title)

/** Everything shown on the hub and the home section, newest first. */
export const publicRecords: EditorialRecord[] = editorial.filter((r) => isPublic(r)).sort(newestFirst)
export const latest = (n: number) => publicRecords.slice(0, n)

/** Owned records with a page of their own (public or archived), by path. */
export const pageRecords = editorial.filter((r) => hasPage(r))
export const recordByPath = new Map(pageRecords.map((r) => [r.path as string, r]))

/** Where a card goes: the article page, the publication, or the hosted scan for print. */
export function cardHref(r: EditorialRecord): string {
  if (r.type !== 'media') return r.path as string
  return r.media?.sourceUrl ?? r.media?.clipping?.full ?? '/journal/'
}
export const isExternal = (r: EditorialRecord) => r.type === 'media'

/** "30 July 2026", or "August 2026" for month-only print dates. */
export function formatDate(iso: string, precision: 'day' | 'month' = 'day'): string {
  const [y, m, d] = iso.split('-').map(Number)
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]
  return precision === 'month' ? `${month} ${y}` : `${d} ${month} ${y}`
}

export const doctorFor = (slug: string | null) => publishedDoctors.find((d) => d.slug === slug) ?? null

/** Public records of the same speciality (then the newest others), for an article's "related" row. */
export function relatedTo(r: EditorialRecord, n = 3): EditorialRecord[] {
  const others = publicRecords.filter((x) => x.id !== r.id)
  return [...others.filter((x) => x.speciality === r.speciality), ...others.filter((x) => x.speciality !== r.speciality)].slice(0, n)
}

export const canonicalFor = (r: EditorialRecord) => (r.path ? SITE_URL + r.path : null)

/** What the editor still has to do: every record that isn't live, with the reason. Printed by gen and verify. */
export function pendingEditorial(today = buildDate()): string[] {
  return editorial
    .filter((r) => !isPublic(r, today) && r.status !== 'archived')
    .map((r) => {
      const why =
        r.status === 'scheduled'
          ? `scheduled for ${r.date}`
          : r.type === 'media'
            ? (r.media?.verification ?? 'in review')
            : `${r.status}: not yet written and medically reviewed`
      return `${typeLabels[r.type]} · ${r.title} (${why})`
    })
}

// Hub copy (content/journal/prompts/journal-blogs-media-coverage-page.md). Change it only from the approved source.
export const journalHub = {
  banner: {
    eyebrow: 'NeoSculpt6 · Whitefield, Bangalore',
    subline: 'Doctor-led education, clinic news and verified media coverage to help you make informed decisions.',
    // The clinic reception photo the Contact banner and service closing bands use (services/index.ts `reception`;
    // copied here so Node scripts don't load the service data). Same TODO as there: confirm or replace the photo.
    image: {
      src: '/images/services/clinic-reception.jpg',
      width: 800,
      height: 750,
      alt: 'The NeoSculpt6 reception: a marble front desk under the NeoSculpt 6 logo, with sofas and plants',
    },
  },
  intro: {
    h2: 'Learn Before You Decide',
    text: 'Explore practical explanations from the NeoSculpt6 team, along with verified coverage of the clinic and its doctors. Educational content supports a consultation; it does not replace an individual medical assessment.',
  },
  empty: 'More approved insights are coming soon. In the meantime, book a consultation or explore our specialities.',
  // Shown above the media items: coverage is reported by the publication, not written or endorsed by NeoSculpt6.
  mediaNote:
    'Media coverage links to the original publication and is shown as published there. It is not a clinical claim, rating or endorsement by NeoSculpt6.',
  pageSize: 9,
  // TODO (copy sign-off): the consultation band's copy is a draft; the prompt gives no wording for it.
  closing: {
    kicker: null as string | null,
    h2: 'Questions About Your Own Case?',
    paragraph: 'Articles and press coverage are general. A consultation looks at your concern, your history and your options.',
    chips: [] as string[],
    ctas: [{ label: 'Book a Consultation', action: 'book' as const }, { label: 'Explore Specialities', href: '/#specialities' }],
    image: null,
  },
}
