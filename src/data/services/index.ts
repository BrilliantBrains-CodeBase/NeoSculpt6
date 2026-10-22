// Service pages, keyed by canonical path. The copy is content/service/service-page.md, parsed word for word into
// parsed.json by scripts/parse-service-pages.mjs (run by `npm run gen`); this module adds what the doc does not hold:
// button actions, the doctor's card, and placeholder photos. ServiceTemplate renders every page listed here.
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
import type { Cta, ServiceContent, ServiceImage } from './types.ts'

type Parsed = (typeof parsedJson)[number]
type Photo = { src: string; page: string; kind: 'c' | 'p' | 'a' | 'o' | null; alt: string | null; same: number; unusable?: string }

const photos = photosJson as Photo[]
const hubOf = (path: string) => path.split('/')[1]
const usable = (p: Photo): p is Photo & { alt: string } => !p.unusable && Boolean(p.alt)
const image = (p: Photo & { alt: string }): ServiceImage => ({ src: p.src, width: 1024, height: 1024, alt: p.alt })
const instagramSrcs = new Set(instagram.tiles.map((t) => t.src))

// The NeoSculpt6 reception (old-site rendering with the logo), for every closing band.
// TODO: confirm it shows the real reception, or replace it with a photo of it.
const reception: ServiceImage = {
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

// "Dr Sandeep Mahapatra", "Dr. Sandeep" and "Dr. Saranya" in the doc → the doctor cards in data/home.ts.
function doctorName(name: string): ServiceContent['doctor']['doctor'] {
  if (/saranya/i.test(name)) return 'Dr Saranya T'
  if (/sandeep/i.test(name)) return 'Dr Sandeep Mahapatra'
  throw new Error(`service-page.md names an unknown doctor: ${name}`)
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
function pendingFor(p: Parsed, doctor: ServiceContent['doctor']['doctor']): string[] {
  const out: string[] = []
  const figures = p.doctor.chips.filter((c) => /\d/.test(c))
  if (doctor === 'Dr Sandeep Mahapatra' && figures.length) out.push(`doctor figures: ${figures.join(', ')} (homepage.md †)`)
  const prices = p.cost.factors.filter((f) => /\bRs\.?|₹/.test(f.text))
  if (prices.length) out.push(`prices shown in the cost section: "${prices[0].text.replace(/^.*?·\s*/, '')}" (and the asterisk's note)`)
  else if (p.cost.factors.some((f) => /\d/.test(f.text))) out.push('figures in the cost section (graft/session ranges)')
  if (p.seo.note) out.push(`SEO note from the doc: ${p.seo.note}`)
  if (p.consultation.video) out.push(`video link: "${p.consultation.video.title}" (${p.consultation.video.url})`)
  return out
}

function build(p: Parsed): ServiceContent {
  const pics = pickPhotos(p.path)
  const doctor = doctorName(p.doctor.name)
  const heroCtas = p.hero.buttons.map(cta)
  const primary = heroCtas.find((c) => 'action' in c) ?? { label: 'Book a Consultation', action: 'book' as const }
  const treatment = p.name.replace(/\s+in Bangalore$/i, '')
  return {
    path: p.path,
    source: p.source,
    hero: { intro: p.hero.intro, ctas: heroCtas, phoneLabel: p.hero.phone.split(' · ')[0], image: pics.hero },
    intro: p.intro,
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
    doctor: {
      doctor,
      portrait: doctor === 'Dr Sandeep Mahapatra' ? sandeepPortrait : null,
      eyebrow: p.doctor.eyebrow,
      h2: p.doctor.h2,
      specialty: p.doctor.specialty,
      chips: p.doctor.chips,
      profileLabel: p.doctor.button.split('→')[0].trim() || 'Know More',
      blockEyebrow: p.doctor.blockEyebrow,
      paragraphs: p.doctor.paragraphs,
    },
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
      links: p.sidebar.links.filter((l): l is { label: string; href: string } => Boolean(l.href)),
      viewAll: { label: 'View all', href: p.sidebar.hub ?? '/' },
      contactHeading: p.sidebar.contactHeading,
      contactText: p.sidebar.contactText,
      cta: cta(p.sidebar.contactButton || 'Book a Consultation'),
    },
    pending: pendingFor(p, doctor),
  }
}

export const services: ServiceContent[] = parsedJson.map(build)

export const servicesByPath = new Map(services.map((s) => [s.path, s]))

// Every doctor named on a service page has a card (name, profile link).
for (const s of services) if (!doctors.cards.some((c) => c.name === s.doctor.doctor)) throw new Error(`no card for ${s.doctor.doctor}`)
