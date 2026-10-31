// Service pages, keyed by canonical path. The copy is content/service/service-page.md (and later docs that replace or
// add pages, e.g. Blepharoplasty-and-Chin-Augmentation.md), parsed word for word into parsed.json by
// scripts/parse-service-pages.mjs (run by `npm run gen`); this module adds what the docs do not hold: button actions,
// the doctors' names, profile links and portraits, and the photos. ServiceTemplate renders every page here.
// Keep this folder to erasable TypeScript only (verify-seo.mjs imports it with Node's type stripping).
//
// Photos: NeoSculpt6 supplied its own photos for 152 pages (new-photos.json, imported by scripts/import-photos.mjs;
// only Chin Augmentation has none yet). Every page also has its old-site image
// (photos.json). Both list what each photo shows and whether it is a consultation, procedure, assessment or other
// (page-specific) scene. The hero is the page's first supplied photo, else its old-site one. The page's other supplied
// photos fill the consultation, process and candidates sections, each taking the scene that suits it best. Sections
// still empty borrow from the same speciality, supplied photos first, but only consultation and assessment scenes:
// another page's procedure photo would show a treatment this page is not about (a body-contouring device on an eyelid
// page). Never a photo the page already shows (hero, other sections, the Instagram row).

import parsedJson from './parsed.json' with { type: 'json' }
import photosJson from './photos.json' with { type: 'json' }
import newPhotosJson from './new-photos.json' with { type: 'json' }
import videosJson from './videos.json' with { type: 'json' }
import { doctors } from '../home.ts'
import { clinic, instagram } from '../site.ts'
import type { NavLink } from '../nav.ts'
import type { Cta, ServiceContent, ServiceDoctor, ServiceImage, ServiceVideo } from './types.ts'

type Parsed = (typeof parsedJson)[number]
// The client's video sheet (scripts/import-videos.mjs); a page shows its video only once it is approved,
// consent-confirmed and published (the rule scripts/validate-videos.mjs reports on).
const videos = videosJson as Record<string, ServiceVideo | null>
const shownVideo = (path: string): ServiceVideo | null => {
  const v = videos[path]
  return v && v.approval === 'approved' && v.consentConfirmed && v.published ? v : null
}
type Kind = 'c' | 'p' | 'a' | 'o' | null
type OldPhoto = { src: string; page: string; kind: Kind; alt: string | null; same: number; unusable?: string }
type NewPhoto = { src: string; page: string; kind: Kind; alt: string | null; width: number; height: number; n: number; same?: string; unusable?: string }
// One list for both: `same` groups identical photos, `supplied` marks NeoSculpt6's own.
type Photo = { src: string; page: string; kind: Kind; alt: string; width: number; height: number; same: string; supplied: boolean }

const instagramSrcs = new Set(instagram.tiles.map((t) => t.src))
const hubOf = (path: string) => path.split('/')[1]
const supplied: Photo[] = (newPhotosJson as NewPhoto[])
  .filter((p): p is NewPhoto & { alt: string } => !p.unusable && Boolean(p.alt))
  .sort((a, b) => a.n - b.n)
  .map((p) => ({ src: p.src, page: p.page, kind: p.kind, alt: p.alt, width: p.width, height: p.height, same: p.same ?? p.src, supplied: true }))
const oldSite: Photo[] = (photosJson as OldPhoto[])
  .filter((p): p is OldPhoto & { alt: string } => !p.unusable && Boolean(p.alt))
  .map((p) => ({ src: p.src, page: p.page, kind: p.kind, alt: p.alt, width: 1024, height: 1024, same: `old-${p.same}`, supplied: false }))
const image = (p: Photo): ServiceImage => ({ src: p.src, width: p.width, height: p.height, alt: p.alt })

// The NeoSculpt6 reception (old-site rendering with the logo), for every closing band.
// TODO: confirm it shows the real reception, or replace it with a photo of it.
export const reception: ServiceImage = {
  src: '/images/services/clinic-reception.jpg',
  width: 800,
  height: 750,
  alt: 'The NeoSculpt6 reception: a marble front desk under the NeoSculpt 6 logo, with sofas and plants',
}

// TODO: placeholder (old-site photo, as on the About page); replace with the approved portrait.
const sandeepPortrait: ServiceImage = {
  src: '/og/about-dr-sandeep-mahapatra.jpeg',
  width: 1122,
  height: 1402,
  alt: 'Dr Sandeep Mahapatra in a white coat, standing in a clinic room',
}

// The doc's buttons are labels only. "Call …" rings the clinic, a cost or estimate button goes to the page's cost
// section, and every other one (book, assess, ask) opens the booking popup.
function cta(label: string): Cta {
  if (/^call\b/i.test(label)) return { label, href: clinic.phoneHref }
  if (/estimate|price|cost/i.test(label)) return { label, href: '#cost' }
  return { label, action: 'book' }
}

// The doctors the docs name ("Dr Sandeep Mahapatra" / "Dr. Sandeep", "Dr. Saranya", "Dr. Lavanyaa M"): name, profile
// and portrait. Dr Sandeep and Dr Saranya are the home page's doctor cards; Dr Lavanyaa M is new in the 2026-10
// Blepharoplasty and Chin Augmentation doc, with no profile page (removed until her profile is signed off) and no
// portrait yet, so her card has no profile link.
const homeCard = (name: string) => {
  const card = doctors.cards.find((c) => c.name === name)
  if (!card) throw new Error(`no home doctor card for ${name}`)
  return card
}
const DOCTORS = [
  { match: /sandeep/i, ...pick(homeCard('Dr Sandeep Mahapatra')), portrait: sandeepPortrait as ServiceImage | null },
  { match: /saranya/i, ...pick(homeCard('Dr Saranya T')), portrait: null },
  { match: /lavanyaa/i, name: 'Dr Lavanyaa M', href: null as string | null, initials: 'LM', portrait: null },
]
function pick({ name, href, initials }: { name: string; href: string; initials: string }) {
  return { name, href, initials }
}
export function doctorFor(docName: string) {
  const d = DOCTORS.find((x) => x.match.test(docName))
  if (!d) throw new Error(`a service doc names an unknown doctor: ${docName}`)
  return d
}

// Links a later doc asks for on a page it does not otherwise change. Blepharoplasty-and-Chin-Augmentation.md: list
// Chin Augmentation on the Chin Fillers page as the surgical alternative.
const EXTRA_LINKS: Record<string, NavLink[]> = {
  '/anti-aging-injectables/chin-fillers-in-bangalore/': [
    { label: 'Chin Augmentation Surgery in Bangalore', href: '/cosmetic-surgery/chin-augmentation-surgery-in-bangalore/' },
  ],
}

// A stable small number per page, so photo picks vary between pages but never between builds.
const seed = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

function pickPhotos(path: string) {
  const pool = [...supplied, ...oldSite].filter((p) => hubOf(p.page) === hubOf(path) && !instagramSrcs.has(p.src))
  // The Instagram row under every page already shows these.
  const used = new Set<string>(supplied.filter((p) => instagramSrcs.has(p.src)).map((p) => p.same))
  const use = (p: Photo) => {
    used.add(p.same)
    return image(p)
  }
  // Borrowed from another page of the speciality: supplied photos first, then old-site ones.
  const borrow = (kinds: Kind[], offset: number) => {
    for (const isSupplied of [true, false]) {
      for (const kind of kinds) {
        const options = pool.filter((p) => p.supplied === isSupplied && p.kind === kind && !used.has(p.same))
        if (options.length) return use(options[(seed(path) + offset) % options.length])
      }
    }
    throw new Error(`no photo left for ${path}`)
  }

  const ownSupplied = supplied.filter((p) => p.page === path && !used.has(p.same))
  const ownOld = oldSite.find((p) => p.src === `/og/${path.replace(/^\/|\/$/g, '').replace(/\//g, '__')}.jpg`)
  const heroPhoto = ownSupplied[0] ?? ownOld
  const hero = heroPhoto ? use(heroPhoto) : borrow(['c', 'a'], 0)

  // The page's own extra photos, each section taking the scene that suits it best.
  const extras = ownSupplied.slice(1).filter((p) => !used.has(p.same))
  const own = (prefer: Kind[]) => {
    for (const kind of prefer) {
      const p = extras.find((x) => x.kind === kind && !used.has(x.same))
      if (p) return use(p)
    }
    return null
  }
  const consultation = own(['c', 'a', 'o', 'p']) ?? borrow(['c', 'a'], 1)
  const process = own(['p', 'o', 'c', 'a']) ?? borrow(['c', 'a'], 2)
  const candidates = own(['a', 'c', 'o', 'p']) ?? borrow(['a', 'c'], 3)
  return { hero, consultation, process, candidates }
}

// Items on this page that need sign-off, beyond what every page shares (reviews, rating, photos, Instagram handle).
function pendingFor(p: Parsed, cards: ServiceDoctor[]): string[] {
  const out: string[] = []
  for (const [i, d] of p.doctors.cards.entries()) {
    const figures = d.chips.filter((c) => /\d/.test(c))
    if (cards[i].name === 'Dr Sandeep Mahapatra' && figures.length) out.push(`doctor figures: ${figures.join(', ')} (homepage.md †)`)
    if (cards[i].name === 'Dr Lavanyaa M') {
      out.push(`new doctor: Dr Lavanyaa M (${d.chips.join(', ')}): credentials, portrait and a profile page (none yet, so no profile link)`)
    }
  }
  const prices = p.cost.factors.filter((f) => /\bRs\.?|₹/.test(f.text))
  if (prices.length) out.push(`prices shown in the cost section: "${prices[0].text.replace(/^.*?·\s*/, '')}" (and the asterisk's note)`)
  else if (p.cost.factors.some((f) => /\d/.test(f.text))) out.push('figures in the cost section (graft/session ranges)')
  if (p.seo.note) out.push(`SEO note from the doc: ${p.seo.note}`)
  return out
}

function build(p: Parsed): ServiceContent {
  const pics = pickPhotos(p.path)
  const doctorCards: ServiceDoctor[] = p.doctors.cards.map((d) => {
    const who = doctorFor(d.name)
    return {
      name: who.name,
      href: who.href,
      initials: who.initials,
      portrait: who.portrait,
      specialty: d.specialty,
      chips: d.chips,
      profileLabel: d.button.split('→')[0].trim() || 'Know More',
      blockEyebrow: d.blockEyebrow,
      paragraphs: d.paragraphs,
    }
  })
  const doctor = doctorCards[0].name
  const heroCtas = p.hero.buttons.map(cta)
  const primary = heroCtas.find((c) => 'action' in c) ?? { label: 'Book a Consultation', action: 'book' as const }
  const treatment = p.name.replace(/\s+in Bangalore$/i, '')
  return {
    path: p.path,
    source: p.source,
    hero: { intro: p.hero.intro, ctas: heroCtas, phoneLabel: p.hero.phone.split(' · ')[0], image: pics.hero },
    intro: { h2: p.intro.h2, paragraphs: p.intro.paragraphs, points: p.intro.points },
    consultation: {
      h2: p.consultation.h2,
      introLine: p.consultation.introLine,
      paragraphs: p.consultation.paragraphs,
      ctas: p.consultation.buttons.map(cta),
      image: pics.consultation,
      video: shownVideo(p.path),
    },
    whyChoose: p.whyChoose,
    process: { ...p.process, image: pics.process },
    candidates: { h2: p.candidates.h2, note: p.candidates.note || null, cards: p.candidates.cards, image: pics.candidates },
    doctors: { eyebrow: p.doctors.eyebrow, h2: p.doctors.h2, cards: doctorCards },
    technology: p.technology,
    cost: { h2: p.cost.h2, intro: p.cost.intro, factors: p.cost.factors, ctas: p.cost.buttons.map(cta) },
    // A strip without its own button in the doc offers the page's primary action.
    strips: p.strips.map((s) => ({ heading: s.heading, text: s.text, cta: s.button ? cta(s.button) : primary })),
    // 3–6 real Google reviews that mention the treatment or the doctor, word for word with consent. None collected yet.
    reviews: {
      h2: p.reviews.h2,
      items: [treatment, treatment, doctor].map((lookFor) => ({
        treatment,
        lookFor: lookFor === doctor ? `${doctor} by name` : lookFor,
        quote: null,
        author: null,
        consent: false,
        source: null,
      })),
    },
    faqs: { eyebrow: p.faqs.eyebrow, h2: p.faqs.h2, items: p.faqs.items, cta: cta(p.faqs.button) },
    closing: { kicker: p.closing.kicker, h2: p.closing.h2, paragraph: p.closing.paragraph, chips: p.closing.chips, ctas: p.closing.buttons.map(cta), image: reception },
    sidebar: {
      heading: p.sidebar.heading,
      links: [...p.sidebar.links.filter((l): l is { label: string; href: string } => Boolean(l.href)), ...(EXTRA_LINKS[p.path] ?? [])],
      viewAll: { label: 'View all', href: p.sidebar.hub ?? '/' },
      contactHeading: p.sidebar.contactHeading,
      contactText: p.sidebar.contactText,
      cta: cta(p.sidebar.contactButton || 'Book a Consultation'),
    },
    pending: pendingFor(p, doctorCards),
  }
}

export const services: ServiceContent[] = parsedJson.map(build)

export const servicesByPath = new Map(services.map((s) => [s.path, s]))

