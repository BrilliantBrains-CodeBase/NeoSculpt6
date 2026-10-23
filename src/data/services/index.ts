// Service pages, keyed by canonical path. The copy is content/service/service-page.md (and later docs that replace or
// add pages, e.g. Blepharoplasty-and-Chin-Augmentation.md), parsed word for word into parsed.json by
// scripts/parse-service-pages.mjs (run by `npm run gen`); this module adds what the docs do not hold: button actions,
// the doctors' names, profile links and portraits, and placeholder photos. ServiceTemplate renders every page here.
// Keep this folder to erasable TypeScript only (verify-seo.mjs imports it with Node's type stripping).
//
// Photos: every service page has its own old-site image (photos.json: what each one shows, and whether it is a
// consultation, procedure or assessment scene). The hero uses the page's own. The consultation, process and candidates
// sections borrow from the same speciality, but only consultation and assessment scenes: another page's procedure
// photo would show a treatment this page is not about (a body-contouring device on an eyelid page). Never a photo the
// page already shows (hero, other sections, the Instagram row). All are placeholders until NeoSculpt6 supplies
// approved photos.

import parsedJson from './parsed.json' with { type: 'json' }
import photosJson from './photos.json' with { type: 'json' }
import { doctors } from '../home.ts'
import { clinic, instagram } from '../site.ts'
import type { NavLink } from '../nav.ts'
import type { Cta, ServiceContent, ServiceDoctor, ServiceImage } from './types.ts'

type Parsed = (typeof parsedJson)[number]
type Photo = { src: string; page: string; kind: 'c' | 'p' | 'a' | 'o' | null; alt: string | null; same: number; unusable?: string }

const photos = photosJson as Photo[]
const hubOf = (path: string) => path.split('/')[1]
const usable = (p: Photo): p is Photo & { alt: string } => !p.unusable && Boolean(p.alt)
const image = (p: Photo & { alt: string }): ServiceImage => ({ src: p.src, width: 1024, height: 1024, alt: p.alt })
const instagramSrcs = new Set(instagram.tiles.map((t) => t.src))

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
// Blepharoplasty and Chin Augmentation doc, with a draft profile page (src/data/hubs.ts) and no portrait yet.
const homeCard = (name: string) => {
  const card = doctors.cards.find((c) => c.name === name)
  if (!card) throw new Error(`no home doctor card for ${name}`)
  return card
}
const DOCTORS = [
  { match: /sandeep/i, ...pick(homeCard('Dr Sandeep Mahapatra')), portrait: sandeepPortrait as ServiceImage | null },
  { match: /saranya/i, ...pick(homeCard('Dr Saranya T')), portrait: null },
  { match: /lavanyaa/i, name: 'Dr Lavanyaa M', href: '/dr-lavanyaa-m/', initials: 'LM', portrait: null },
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
  const own = photos.find((p) => p.src === `/og/${path.replace(/^\/|\/$/g, '').replace(/\//g, '__')}.jpg`)
  const pool = photos.filter((p) => usable(p) && hubOf(p.page) === hubOf(path) && !instagramSrcs.has(p.src))
  const used = new Set<number>()
  const take = (kinds: Photo['kind'][], offset: number) => {
    for (const kind of kinds) {
      const options = pool.filter((p) => p.kind === kind && !used.has(p.same))
      if (options.length) {
        const chosen = options[(seed(path) + offset) % options.length] as Photo & { alt: string }
        used.add(chosen.same)
        return image(chosen)
      }
    }
    throw new Error(`no photo left for ${path}`)
  }
  let hero: ServiceImage
  if (own && usable(own)) {
    used.add(own.same)
    hero = image(own)
  } else hero = take(['c', 'a'], 0)
  return {
    hero,
    consultation: take(['c', 'a'], 1),
    process: take(['c', 'a'], 2),
    candidates: take(['a', 'c'], 3),
  }
}

// Items on this page that need sign-off, beyond what every page shares (reviews, rating, photos, Instagram handle).
function pendingFor(p: Parsed, cards: ServiceDoctor[]): string[] {
  const out: string[] = []
  for (const [i, d] of p.doctors.cards.entries()) {
    const figures = d.chips.filter((c) => /\d/.test(c))
    if (cards[i].name === 'Dr Sandeep Mahapatra' && figures.length) out.push(`doctor figures: ${figures.join(', ')} (homepage.md †)`)
    if (cards[i].name === 'Dr Lavanyaa M') {
      out.push(`new doctor: Dr Lavanyaa M (${d.chips.join(', ')}): credentials, portrait and the draft profile page /dr-lavanyaa-m/`)
    }
  }
  const prices = p.cost.factors.filter((f) => /\bRs\.?|₹/.test(f.text))
  if (prices.length) out.push(`prices shown in the cost section: "${prices[0].text.replace(/^.*?·\s*/, '')}" (and the asterisk's note)`)
  else if (p.cost.factors.some((f) => /\d/.test(f.text))) out.push('figures in the cost section (graft/session ranges)')
  if (p.seo.note) out.push(`SEO note from the doc: ${p.seo.note}`)
  if (p.consultation.video) out.push(`video link: "${p.consultation.video.title}" (${p.consultation.video.url})`)
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
      video: p.consultation.video?.url ? { title: p.consultation.video.title, url: p.consultation.video.url } : null,
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

