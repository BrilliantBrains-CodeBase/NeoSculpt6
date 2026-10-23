// Technology hub, technology pages and International Patients, keyed by canonical path. The copy is
// content/technology/technology-international-patient.md, parsed word for word into parsed.json by
// scripts/parse-technology-pages.mjs (run by `npm run gen`); this module adds what the doc does not hold: button
// actions, doctors' portraits, placeholder photos and the sign-off list. TechnologyTemplate and HubTemplate render
// the pages listed in LIVE; the others keep the placeholder until their template is checked.
// Keep this folder to erasable TypeScript only (verify-seo.mjs imports it with Node's type stripping).
//
// Buttons: the doc sends every booking button to /contact-us/; they open the booking popup instead, as on the service
// pages (the Contact page is not built yet). "#…" stays an on-page anchor, "Call …" rings the clinic, "WhatsApp"
// opens the chat, and every other destination is a link.
//
// Photos (all placeholders until NeoSculpt6 supplies approved ones): each technology page's hero is its card photo
// on the home page (data/home.ts `technology`, the same file, size and alt). The image bands are old-site consultation
// and assessment scenes chosen per page in PHOTOS (picked by hand: an automatic pick put a chest-hair exam on the ARTAS
// page and a torso model on Excimer), never one the page already shows nor an Instagram tile. Their alt text is
// photos.json's, which describes the scene only. The closing band uses the clinic reception, as on the service pages.

import parsedJson from './parsed.json' with { type: 'json' }
import { technology as homeTechnology } from '../home.ts'
import { clinic } from '../site.ts'
import photosJson from '../services/photos.json' with { type: 'json' }
import { doctorFor, reception } from '../services/index.ts'
import type { NavLink } from '../nav.ts'
import type { Cta, ServiceDoctor, ServiceImage } from '../services/types.ts'
import type {
  ArtasDetail,
  InternationalPatients,
  TechnologyBanner,
  TechnologyDetail,
  TechnologyHub,
  TechnologyNote,
  TechnologyPage,
  TechnologyReviews,
} from './types.ts'

// parsed.json, as scripts/parse-technology-pages.mjs writes it (one shape per page kind; checked there).
type DocLink = { label: string; href: string | null }
type DocRow = { title: string; text: string }
type DocText = { h2: string; paragraphs: string[] }
type DocFaqs = { eyebrow: string; h2: string; items: { q: string; a: string }[]; button: DocLink | null }
interface DocDoctor {
  name: string
  chips: string[] | null
  qualifications: string | null
  specialty: string
  text: string
  button: DocLink | null
}
interface DocBase {
  path: string
  name: string
  source: string
  seo: { title: string; description: string; h1: string; robots: string; breadcrumb: string[]; note: string | null }
  order: string[]
  notes: TechnologyNote[]
  hero: { eyebrow: string; h1: string; intro: string; buttons: DocLink[] }
  doctors: { eyebrow: string | null; h2: string; paragraphs: string[]; cards: DocDoctor[] }
  closing: { h2: string; paragraph: string; buttons: DocLink[] }
}
interface DocDetail extends DocBase {
  kind: 'technology-detail' | 'artas-detail'
  intro: DocText
  /** Standard pages only. */
  different?: DocText
  assessment?: { h2: string; paragraph: string }
  /** ARTAS only. */
  comparison?: { h2: string; introLine: string; cards: DocRow[] }
  benefits: { h2: string; subline: string | null; cards: { title: string; text: string | null }[]; smallPrint: string | null }
  process: { eyebrow: string; h2: string; steps: DocRow[] }
  candidates: { h2: string; items: string[]; paragraphs: string[] }
  expectations: DocText
  cost: { h2: string; paragraphs: string[]; buttons: DocLink[] }
  reviews: { eyebrow: string; h2: string }
  faqs: DocFaqs
  explore: { heading: string; links: DocLink[]; related: DocLink[]; contact: DocLink[] }
}
interface DocHub extends DocBase {
  kind: 'technology-hub'
  cards: { group: string; title: string; label: string; text: string; button: { label: string; href: string } }[]
}
interface DocInternational extends DocBase {
  kind: 'international-patients'
  intro: DocText
  steps: { h2: string; cards: DocRow[] }
  pathways: { h2: string; tabs: { tab: string; h3: string; paragraph: string; chips: DocLink[]; button: DocLink }[] }
  journey: { eyebrow: string; h2: string; steps: DocRow[] }
  travel: DocText
  estimates: DocText
  reviews: { eyebrow: string; h2: string }
  faqs: DocFaqs
}
type Parsed = DocDetail | DocHub | DocInternational

const need = <T,>(value: T | undefined, what: string): T => {
  if (value === undefined) throw new Error(`technology doc: missing ${what}`)
  return value
}

/** Pages whose template has been checked against the doc (all 11). A page left out renders the placeholder. */
export const LIVE = new Set((parsedJson as { path: string }[]).map((p) => p.path))

function cta({ label, href }: DocLink): Cta {
  if (/^call\b/i.test(label)) return { label, href: clinic.phoneHref }
  if (/^whatsapp$/i.test(label)) return { label, href: clinic.whatsappHref }
  if (href === '/contact-us/') return { label, action: 'book' }
  if (!href) throw new Error(`a technology doc button has no destination: ${label}`)
  return { label, href }
}

const navLinks = (links: DocLink[]): NavLink[] => links.filter((l): l is NavLink => Boolean(l.href))

// The home page's card for a technology page: its photo is the page's own (or the closest old-site one).
function cardImage(path: string): ServiceImage {
  const card = homeTechnology.cards.find((c) => c.href === path)
  if (!card) throw new Error(`no home technology card for ${path}`)
  return { src: card.image, width: card.width, height: card.height, alt: card.alt }
}

// An abstract clinic texture (the home stats band), for the two pages that are not about one device.
const texture: ServiceImage = {
  src: '/images/home/stats-bg.webp',
  width: 1920,
  height: 1290,
  alt: 'Soft, out-of-focus clinic interior in warm, dim light',
}

// The image bands' photos, by page: [how it is different (or travel), how it works (or journey), candidates]. Each is
// an old-site photo file name under /og/ (photos.json), a consultation or assessment scene that fits the band.
const PHOTOS: Record<string, [string | null, string, string | null]> = {
  '/technology/ai-integrated-hair-analysis/': [
    'hair-transplant-restoration__dhi-hair-transplant-in-bangalore', // reviewing scalp images on a monitor
    'hair-transplant-restoration__burn-scar-hair-transplant-in-bangalore', // hairline diagrams at the desk
    'hair-transplant-restoration__neo-follicle-hair-transplant-in-bangalore', // digital scope, images on a tablet
  ],
  '/technology/ai-integrated-donor-assessment/': [
    'hair-transplant-restoration__neo-follicle-stem-cell-therapy-in-bangalore', // scope, magnified scalp on a screen
    'hair-transplant-restoration__unshaven-hair-transplant-in-bangalore', // hairline under a dermatoscope
    'hair-transplant-restoration__nri-hair-transplant-consultation-in-bangalore', // thinning hairline, magnifier
  ],
  '/technology/artas-robotic-hair-transplant/': [
    null,
    'hair-transplant-restoration__burn-scar-hair-transplant-in-bangalore', // hairline diagrams (planning)
    'hair-transplant-restoration__female-hair-transplant-in-bangalore', // a woman's scalp under a magnifier
  ],
  '/technology/vaser-liposuction-technology/': [
    'slimming-body-contouring__obesity-treatment-in-bangalore', // consultation, body chart on the wall
    'slimming-body-contouring__belly-tummy-fat-reduction-in-bangalore', // body-contouring image on a monitor
    'slimming-body-contouring__post-weight-loss-body-planning-in-bangalore', // talking beside a mirror
  ],
  '/technology/reaction-viora-rf-tightening/': [
    'anti-aging-injectables__skin-vive-in-bangalore', // a facial image on a tablet
    'anti-aging-injectables__skin-boosters-treatment-in-bangalore', // pointing to the jaw, tablet in hand
    'anti-aging-injectables__non-surgical-double-chin-tightening-treatment-in-bangalore', // examining the neck
  ],
  '/technology/co2-fractional-laser/': [
    'laser-skin-aesthetic__laser-skin-resurfacing-in-bangalore', // tablet, laser equipment behind
    'laser-skin-aesthetic__acne-scar-laser-treatment-in-bangalore', // consultation about acne marks
    'laser-skin-aesthetic__dark-circle-treatment-in-bangalore', // examining the skin under the eye
  ],
  '/technology/q-switch-laser/': [
    'laser-skin-aesthetic__melasma-treatment-in-bangalore', // consultation with a tablet
    'laser-skin-aesthetic__laser-hair-reduction-in-bangalore', // skin images on a tablet
    'laser-skin-aesthetic__pigmentation-treatment-in-bangalore', // pigmentation under a dermatoscope
  ],
  '/technology/excimer-laser-targeted-phototherapy/': [
    'cosmetic-surgery__melanocyte-transfer-surgery-in-bangalore', // magnified skin images on a monitor
    'cosmetic-surgery__scar-revision-surgery-in-bangalore', // examining a patch of skin on the forearm
    'cosmetic-surgery__vitiligo-treatment-in-bangalore', // skin on the hand under a dermatoscope
  ],
  '/technology/body-contouring-cryolipolysis-platforms/': [
    'slimming-body-contouring__arm-fat-reduction-in-bangalore', // body images on a tablet
    'slimming-body-contouring__love-handle-reduction-in-bangalore', // body image on the monitor
    'slimming-body-contouring__hip-fat-reduction-in-bangalore', // back images on a monitor
  ],
  '/international-patients/': [
    'cosmetic-surgery__breast-augmentation-surgery-in-bangalore', // talking across a consultation table (travel)
    'slimming-body-contouring__mounjaro-weight-loss-consultation-in-bangalore', // notes across the desk (journey)
    null,
  ],
}
const photoBySrc = new Map((photosJson as { src: string; alt: string | null; unusable?: string }[]).map((p) => [p.src, p]))
function photo(name: string): ServiceImage {
  const p = photoBySrc.get(`/og/${name}.jpg`)
  if (!p?.alt || p.unusable) throw new Error(`technology photo not usable: ${name}`)
  return { src: p.src, width: 1024, height: 1024, alt: p.alt }
}
function bands(path: string) {
  const picks = PHOTOS[path]
  if (!picks) throw new Error(`no technology photos chosen for ${path}`)
  const [first, second, third] = picks.map((n) => (n ? photo(n) : null))
  return { first, second: second as ServiceImage, third }
}

function doctors(p: DocBase['doctors']) {
  const cards: ServiceDoctor[] = p.cards.map((d) => {
    const who = doctorFor(d.name)
    if (d.button && d.button.href !== who.href) throw new Error(`${d.name}: doc profile link ${d.button.href} is not ${who.href}`)
    return {
      // The doc's own spelling ("Dr. Sandeep Mahapatra"); profile and portrait from the shared doctor list.
      name: d.name,
      href: who.href,
      initials: who.initials,
      portrait: who.portrait,
      specialty: d.specialty,
      chips: d.chips ?? [],
      profileLabel: d.button?.label ?? 'Know More',
      blockEyebrow: null,
      // International Patients' cards give the qualifications as a line ("MBBS, MD Dermatology."), not chips.
      paragraphs: d.chips ? [d.text] : [d.qualifications, d.text].filter((x): x is string => Boolean(x)),
    }
  })
  return {
    eyebrow: p.eyebrow ?? '',
    h2: p.h2,
    cards,
    ...(p.paragraphs.length ? { intro: p.paragraphs } : {}),
    // The doc sets two cards side by side (hub, Body Contouring, International Patients).
    ...(cards.length > 1 ? { columns: true } : {}),
  }
}

// 3–6 real Google reviews that mention the technology or the doctor, word for word with consent. None collected yet.
// `topic` is what the review should mention, where that is not the page's own name.
function reviews(r: { eyebrow: string; h2: string }, treatment: string, doctor: string | undefined, topic = treatment): TechnologyReviews {
  return {
    eyebrow: r.eyebrow,
    h2: r.h2,
    items: [topic, topic, doctor ?? topic].map((lookFor) => ({
      treatment,
      lookFor: lookFor === doctor ? `${doctor} by name` : lookFor,
      quote: null,
      author: null,
      consent: false,
      source: null,
    })),
  }
}

const banner = (h: DocBase['hero'], image: ServiceImage): TechnologyBanner => ({
  eyebrow: h.eyebrow,
  intro: h.intro,
  ctas: h.buttons.map(cta),
  image,
})

const closing = (c: DocBase['closing'], image: ServiceImage | null) => ({
  kicker: null,
  h2: c.h2,
  paragraph: c.paragraph,
  chips: [],
  ctas: c.buttons.map(cta),
  image,
})

// Everything on the page that needs sign-off: the doc's notes and approvals, and what every page still lacks.
function pendingFor(p: Parsed, extra: string[]): string[] {
  const out: string[] = []
  if (p.seo.note) out.push(`SEO note from the doc: ${p.seo.note}`)
  for (const n of p.notes) {
    if (n.kind === 'note') out.push(`doc note (${n.section}): ${n.text}`)
    else if (/approve/i.test(n.text)) out.push(`added section to approve (${n.section}): ${n.text}`)
  }
  if ('reviews' in p) out.push('reviews: 3 real Google reviews (quote, first name + initial, consent)')
  return [...out, ...extra]
}

// Source copy that uses a word the content rules keep out ("best", "permanent", …). It is shown word for word, as the
// doc gives it, and listed for sign-off; `npm run verify` allows exactly these phrases and no others.
export const SOURCE_EXCEPTIONS: Record<string, string[]> = {
  '/technology/artas-robotic-hair-transplant/': ['FUT leaves a permanent linear scar'],
  '/international-patients/': ['International care works best when'],
}
const sourceWords = (p: Parsed) =>
  (SOURCE_EXCEPTIONS[p.path] ?? []).map((phrase) => `content rules: source copy "${phrase}" uses a word the rules keep out`)

function common(p: Parsed) {
  return { path: p.path, source: p.source, order: p.order, notes: p.notes }
}

function buildDetail(p: DocDetail): TechnologyDetail | ArtasDetail {
  const hero = cardImage(p.path)
  const related = p.explore.related
  const pics = bands(p.path)
  const docs = doctors(p.doctors)
  const shared = {
    ...common(p),
    hero: banner(p.hero, hero),
    intro: { h2: p.intro.h2, paragraphs: p.intro.paragraphs, points: [] },
    benefits: {
      h2: p.benefits.h2,
      subline: p.benefits.subline,
      cards: p.benefits.cards.map((c) => ({ title: c.title, text: c.text })),
      smallPrint: p.benefits.smallPrint,
    },
    process: { eyebrow: p.process.eyebrow, h2: p.process.h2, steps: p.process.steps, image: pics.second },
    candidates: {
      h2: p.candidates.h2,
      note: p.candidates.paragraphs,
      cards: p.candidates.items.map((title) => ({ title, text: null })),
      image: need(pics.third ?? undefined, `${p.path} candidates photo`),
    },
    expectations: { h2: p.expectations.h2, paragraphs: p.expectations.paragraphs },
    doctors: docs,
    cost: { h2: p.cost.h2, intro: p.cost.paragraphs, factors: [], ctas: p.cost.buttons.map(cta) },
    reviews: reviews(p.reviews, p.name, docs.cards[0]?.name),
    faqs: { eyebrow: p.faqs.eyebrow, h2: p.faqs.h2, items: p.faqs.items, cta: p.faqs.button ? cta(p.faqs.button) : null },
    closing: closing(p.closing, reception),
    explore: {
      heading: p.explore.heading,
      links: navLinks(p.explore.links),
      // The doc's own label for the list (a table label, not page copy): needs sign-off as a visible heading.
      relatedHeading: related.length ? 'Related Treatments' : '',
      related: navLinks(related),
      contact: p.explore.contact.map(cta),
    },
    pending: pendingFor(p, [
      `photos: hero (${hero.src}) and the image bands are placeholders; doctor portraits and the reception photo too`,
      related.length
        ? 'explore: "Related Treatments" (the doc\'s table label) shown as the heading of the related-treatment links'
        : 'explore: no related treatments (the doc leaves them out: no matching service page confirmed)',
      ...sourceWords(p),
    ]),
  }
  if (p.kind === 'artas-detail') {
    const comparison = need(p.comparison, `${p.path} comparison`)
    return {
      ...shared,
      kind: 'artas-detail',
      comparison: { ...comparison, highlight: comparison.cards.findIndex((c) => /^ARTAS/.test(c.title)) },
    }
  }
  return {
    ...shared,
    kind: 'technology-detail',
    different: { ...need(p.different, `${p.path} different`), introLine: null, ctas: [], image: need(pics.first ?? undefined, `${p.path} different photo`), video: null },
    assessment: need(p.assessment, `${p.path} assessment`),
  }
}

const GROUPS = ['Hair', 'Body', 'Skin']

function buildHub(p: DocHub): TechnologyHub {
  for (const c of p.cards) if (!GROUPS.includes(c.group)) throw new Error(`technology hub card in an unknown group: ${c.group}`)
  return {
    ...common(p),
    kind: 'technology-hub',
    hero: banner(p.hero, texture),
    // Grouped Hair → Body → Skin (the header menu's groups), keeping the doc's order inside each group.
    cards: [...p.cards].sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group)).map((c) => ({
      group: c.group,
      title: c.title,
      label: c.label,
      text: c.text,
      cta: { label: c.button.label, href: c.button.href },
      image: cardImage(c.button.href),
    })),
    doctors: doctors(p.doctors),
    closing: closing(p.closing, reception),
    pending: pendingFor(p, [
      'photos: the nine card photos are the home page placeholders (six borrow a treatment page photo); the banner is a texture',
      'cards: shown Hair → Body → Skin (the doc lists Reaction Viora RF, a Skin card, before Body Contouring, a Body card)',
      'doctors: Dr Saranya T has no portrait yet (initials)',
    ]),
  }
}

function buildInternational(p: DocInternational): InternationalPatients {
  const pics = bands(p.path)
  return {
    ...common(p),
    kind: 'international-patients',
    hero: banner(p.hero, texture),
    intro: { h2: p.intro.h2, paragraphs: p.intro.paragraphs, points: [] },
    steps: { h2: p.steps.h2, cards: p.steps.cards },
    pathways: {
      h2: p.pathways.h2,
      tabs: p.pathways.tabs.map((t) => ({ tab: t.tab, h3: t.h3, paragraph: t.paragraph, chips: navLinks(t.chips), cta: cta(t.button) })),
    },
    journey: { eyebrow: p.journey.eyebrow, h2: p.journey.h2, steps: p.journey.steps, image: pics.second },
    travel: { h2: p.travel.h2, introLine: null, paragraphs: p.travel.paragraphs, ctas: [], image: need(pics.first ?? undefined, `${p.path} travel photo`), video: null },
    doctors: doctors(p.doctors),
    estimates: { h2: p.estimates.h2, intro: p.estimates.paragraphs, factors: [], ctas: [] },
    reviews: reviews(p.reviews, 'International Patients', undefined, 'an international patient’s planning or visit'),
    faqs: { eyebrow: p.faqs.eyebrow, h2: p.faqs.h2, items: p.faqs.items, cta: p.faqs.button ? cta(p.faqs.button) : null },
    // The reception would repeat the clinic photo; the band is plain until an approved photo is supplied.
    closing: closing(p.closing, null),
    pending: pendingFor(p, [
      'photos: the banner texture and the journey and travel photos are placeholders; Dr Saranya T has no portrait yet',
      'pathways: Fertility Care shows no treatment links until the Neo Fertility link is confirmed (or the tab removed)',
      ...sourceWords(p),
    ]),
  }
}

function build(p: Parsed): TechnologyPage {
  if (p.kind === 'technology-hub') return buildHub(p)
  if (p.kind === 'international-patients') return buildInternational(p)
  return buildDetail(p)
}

export const technologyPages: TechnologyPage[] = (parsedJson as unknown as Parsed[]).map(build)

export const technologyByPath = new Map(technologyPages.map((t) => [t.path, t]))
