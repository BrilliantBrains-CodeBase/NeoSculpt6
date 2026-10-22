#!/usr/bin/env node
// Post-build check: every prerendered page carries exactly the SEO in pages.json, and no old URL is lost.
// Run after `npm run build`. Exits 1 on any failure.
import fs from 'node:fs'
import path from 'node:path'
import { primaryNav, findMyTreatment } from '../src/data/nav.ts'
import { footerNav, legalNav } from '../src/data/site.ts'
import { pillars, results, signature, doctors, testimonials, technology, journal } from '../src/data/home.ts'
import { posts, postHref, specialities } from '../src/data/posts.ts'
import * as about from '../src/data/about.ts'
import { services } from '../src/data/services/index.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')
const SITE_URL = 'https://neosculpt6.com'

const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/pages.json'), 'utf8'))
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, '../scraped/manifest.json'), 'utf8'))
const redirectsFile = fs.readFileSync(path.join(DIST, '_redirects'), 'utf8')

const failures = []
const fail = (p, msg) => failures.push(`${p}: ${msg}`)

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k.toLowerCase(), decode(v)]))

function parseHead(html) {
  const titles = [...html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]))
  const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => attrs(m[0]))
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0]))
  const ld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1])
  const metaBy = (k, v) => metas.filter((m) => m[k] === v).map((m) => m.content)
  return {
    titles,
    description: metaBy('name', 'description'),
    robots: metaBy('name', 'robots'),
    ogUrl: metaBy('property', 'og:url'),
    ogTitle: metaBy('property', 'og:title'),
    ogImage: metaBy('property', 'og:image'),
    refresh: metaBy('http-equiv', 'refresh'),
    canonical: links.filter((l) => l.rel === 'canonical').map((l) => l.href),
    h1: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, ''))),
    ld,
  }
}

const one = (p, label, list, expected) => {
  if (list.length !== 1) fail(p, `${label}: expected 1 tag, found ${list.length}`)
  else if (expected !== undefined && list[0] !== expected) fail(p, `${label}: "${list[0]}" ≠ "${expected}"`)
}

const fileFor = (p) => path.join(DIST, p, 'index.html')

for (const page of pages) {
  const file = fileFor(page.path)
  if (!fs.existsSync(file)) {
    fail(page.path, `missing ${path.relative(ROOT, file)}`)
    continue
  }
  const head = parseHead(fs.readFileSync(file, 'utf8'))

  if (page.type === 'redirect') {
    if (!redirectsFile.includes(`${page.path} ${page.redirectTo} 301`)) fail(page.path, 'not in _redirects')
    one(page.path, 'meta refresh', head.refresh, `0; url=${page.redirectTo}`)
    one(page.path, 'canonical', head.canonical, page.canonical)
    continue
  }

  one(page.path, 'title', head.titles, page.title)
  one(page.path, 'description', head.description, page.description)
  one(page.path, 'robots', head.robots, page.robots)
  one(page.path, 'canonical', head.canonical, page.canonical)
  one(page.path, 'og:url', head.ogUrl, page.og.url)
  one(page.path, 'og:title', head.ogTitle, page.title)
  one(page.path, 'og:image', head.ogImage)
  one(page.path, 'h1', head.h1, page.h1)

  if (!page.canonical.startsWith(SITE_URL + '/')) fail(page.path, `off-site canonical ${page.canonical}`)
  if (page.type !== 'legacy-demo' && /noindex/i.test(head.robots[0] ?? '')) fail(page.path, 'indexable page is noindex')
  const img = head.ogImage[0]
  if (img?.startsWith(SITE_URL) && !fs.existsSync(path.join(DIST, img.slice(SITE_URL.length)))) fail(page.path, `og:image file missing: ${img}`)

  if (page.type !== 'legacy-demo') {
    if (head.ld.length !== 1) fail(page.path, `JSON-LD: expected 1 block, found ${head.ld.length}`)
    else
      try {
        JSON.parse(head.ld[0])
      } catch (e) {
        fail(page.path, `JSON-LD does not parse: ${e.message}`)
      }
  }
}

// Every URL captured from the old site must still resolve: as a page or as a redirect.
const known = new Set(pages.map((p) => p.path))
for (const row of manifest) {
  const p = new URL(row.url).pathname
  if (!known.has(p)) fail(p, 'old URL has no route')
}

// sitemap: indexable pages only, each one built
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const indexable = pages.filter((p) => p.type !== 'redirect' && p.robots.startsWith('index'))
if (locs.length !== indexable.length) fail('sitemap.xml', `${locs.length} URLs, expected ${indexable.length}`)
for (const loc of locs) if (!fs.existsSync(fileFor(new URL(loc).pathname))) fail('sitemap.xml', `no file for ${loc}`)
// Header and footer menus: every internal link is a built page, and every menu image exists.
// Home anchors (/#…) are skipped; /privacy-policy/ and /terms/ are known gaps until those pages exist.
const navLinks = [
  ...primaryNav.flatMap((i) => [i, ...(i.children ?? []), ...(i.mega ?? []).flatMap((c) => [c, ...c.items])]),
  findMyTreatment,
  ...footerNav,
]
for (const { href } of navLinks) {
  if (href.startsWith('/') && !href.includes('#') && !fs.existsSync(fileFor(href))) fail('nav', `no page for ${href}`)
}
for (const col of primaryNav.flatMap((i) => i.mega ?? [])) {
  if (!fs.existsSync(path.join(DIST, col.image))) fail('nav', `mega-menu image missing: ${col.image}`)
}
// Home section 4 (Core Treatment Pillars): every checklist link and button is a built page, and every image exists.
const pillarLinks = pillars.tabs.flatMap((t) => [...t.items, t.cta])
for (const { href } of pillarLinks) {
  if (!fs.existsSync(fileFor(href))) fail('home pillars', `no page for ${href}`)
}
for (const { image } of pillars.tabs) {
  if (!fs.existsSync(path.join(DIST, image))) fail('home pillars', `image missing: ${image}`)
}
// Home section 6 (Philosophy / results slider): the gallery button is a built page, and both slider images exist.
if (!fs.existsSync(fileFor(results.cta.href))) fail('home results', `no page for ${results.cta.href}`)
for (const { src } of [results.slider.before, results.slider.after]) {
  if (!fs.existsSync(path.join(DIST, src))) fail('home results', `image missing: ${src}`)
}
// Home section 8 (Signature hair expertise): the assessment button is a built page, and the hotspot image exists.
if (!fs.existsSync(fileFor(signature.cta.href))) fail('home signature', `no page for ${signature.cta.href}`)
if (!fs.existsSync(path.join(DIST, signature.image.src))) fail('home signature', `image missing: ${signature.image.src}`)
// Home section 9 (Meet your doctors): every profile link is a built page, every portrait that is set exists, and
// every social link that is set is an https URL.
for (const card of doctors.cards) {
  if (!fs.existsSync(fileFor(card.href))) fail('home doctors', `no page for ${card.href}`)
  if (card.portrait && !fs.existsSync(path.join(DIST, card.portrait.src))) fail('home doctors', `portrait missing: ${card.portrait.src}`)
  for (const s of card.social) {
    if (s.href && !s.href.startsWith('https://')) fail('home doctors', `${card.name} ${s.network} link is not https: ${s.href}`)
  }
}
// Home section 10 (Testimonials): the five treatment labels from homepage.md, a quote only with consent, no ages,
// no AggregateRating until the rating is signed off. Anything still pending is listed as a warning, not a failure.
const testimonialLabels = ['Hair Transplant', 'Body Contouring', 'Acne Scar Laser', 'Botox & Fillers', 'Cosmetic Surgery']
const testimonialsPending = []
const homeHtml = fs.existsSync(fileFor('/')) ? decode(fs.readFileSync(fileFor('/'), 'utf8')) : ''
if (!homeHtml.includes('id="testimonials"')) fail('home testimonials', 'section not on the built home page')
for (const label of testimonialLabels) {
  if (!testimonials.reviews.some((r) => r.treatment === label)) fail('home testimonials', `no card for ${label}`)
  if (!homeHtml.includes(label)) fail('home testimonials', `${label} missing from the built home page`)
}
for (const r of testimonials.reviews) {
  if ((r.quote || r.author) && !r.consent) fail('home testimonials', `${r.treatment}: review text set without consent`)
  if (r.author && /\d/.test(r.author)) fail('home testimonials', `${r.treatment}: author "${r.author}" looks like it has an age`)
  if (!(r.quote && r.author && r.consent)) testimonialsPending.push(`${r.treatment} review (quote, name, consent)`)
  else if (!r.source) testimonialsPending.push(`${r.treatment} review: Google link for the record`)
}
if (!testimonials.rating.value) testimonialsPending.push('Google rating [x.x]')
if (!testimonials.rating.count) testimonialsPending.push('Google review count [nn]')
testimonialsPending.push('Practo: 2,054 recommendations for Dr Sandeep (†)')
if (/AggregateRating/.test(homeHtml) && !testimonials.rating.value) {
  fail('home testimonials', 'AggregateRating schema on the home page before the rating is signed off')
}
// Home section 13 (Our Technology): every card link and the button are built pages, and every card image exists.
const technologyLinks = [...technology.cards, technology.cta]
for (const { href } of technologyLinks) {
  if (!fs.existsSync(fileFor(href))) fail('home technology', `no page for ${href}`)
}
for (const { image } of technology.cards) {
  if (!fs.existsSync(path.join(DIST, image))) fail('home technology', `image missing: ${image}`)
}
// Home section 14 (Journal): every published post has a built page, a review record and an image with real alt
// text; the home page shows at most 3 cards; planned topics are reported as editorial dependencies.
const publishedPosts = posts.filter((p) => p.status === 'published')
for (const post of publishedPosts) {
  const href = postHref(post.slug)
  if (!fs.existsSync(fileFor(href))) fail('home journal', `published post has no page: ${href}`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)) fail('home journal', `${href}: date must be YYYY-MM-DD`)
  if (!post.medicalReview?.by || !post.medicalReview?.date) fail('home journal', `${href}: no medical review record`)
  if (!fs.existsSync(path.join(DIST, post.image.src))) fail('home journal', `${href}: image missing: ${post.image.src}`)
  const alt = post.image.alt.trim()
  if (!alt || alt.toLowerCase() === post.title.trim().toLowerCase()) fail('home journal', `${href}: alt text must describe the image`)
}
for (const post of posts) {
  if (!specialities[post.speciality]) fail('home journal', `unknown speciality "${post.speciality}" on "${post.title}"`)
  if (post.status !== 'published' && post.image && !fs.existsSync(path.join(DIST, post.image.src))) {
    fail('home journal', `image missing: ${post.image.src}`)
  }
}
for (const { href } of Object.values(specialities)) {
  if (!fs.existsSync(fileFor(href))) fail('home journal', `no page for speciality ${href}`)
}
if (journal.cta && !fs.existsSync(fileFor(journal.cta.href))) fail('home journal', `no page for ${journal.cta.href}`)
const journalHtml = homeHtml.match(/<section[^>]*id="journal"[\s\S]*?<\/section>/)?.[0] ?? ''
if (!journalHtml) fail('home journal', 'section id="journal" missing from the home page')
const journalCardCount = (journalHtml.match(/<article\b/g) ?? []).length
if (journalCardCount > 3) fail('home journal', `${journalCardCount} cards, expected at most 3`)
const plannedTopics = posts.filter((p) => p.status === 'planned').map((p) => `${specialities[p.speciality]?.label}: ${p.title}`)
// About page (/about-us/, content/about-us/about-us.md): sections in the doc's order, every link a built page, every
// image present with alt text, no theme stock photo, schema that matches the visible FAQ, and no rating markup. Items
// still waiting for Dr Sandeep's sign-off (marked † in the doc) are listed as warnings, not failures.
const aboutHtml = fs.existsSync(fileFor('/about-us/')) ? decode(fs.readFileSync(fileFor('/about-us/'), 'utf8')) : ''
const aboutOrder = [
  'about-banner',
  'our-story',
  'clinic-in-numbers',
  'mission',
  'founder',
  'our-team',
  'inside-neosculpt6',
  'our-services',
  'patient-reviews',
  'memberships',
  'clinic-faqs',
  'book-consultation',
  'instagram',
]
const aboutPositions = aboutOrder.map((id) => aboutHtml.indexOf(`id="${id}"`))
aboutOrder.forEach((id, i) => aboutPositions[i] < 0 && fail('about', `section id="${id}" missing`))
if (aboutPositions.every((p) => p >= 0) && aboutPositions.some((p, i) => i > 0 && p < aboutPositions[i - 1])) {
  fail('about', 'sections are not in the about-us.md order')
}
if (aboutHtml.indexOf('id="instagram"') > aboutHtml.indexOf('<footer')) fail('about', 'Instagram row is not above the footer')
const aboutCount = (re) => (aboutHtml.match(re) ?? []).length
if (about.numbers.items.length !== 8) fail('about', `${about.numbers.items.length} counters, expected 8`)
for (const { label } of about.numbers.items) if (!aboutHtml.includes(label)) fail('about', `counter "${label}" missing`)
if (about.services.cards.length !== 6) fail('about', `${about.services.cards.length} service cards, expected 6`)
if (about.faqs.items.length !== 6) fail('about', `${about.faqs.items.length} FAQs, expected 6`)
for (const { q, a } of about.faqs.items) {
  if (!aboutHtml.includes(q) || !aboutHtml.includes(a)) fail('about', `FAQ "${q}" not fully in the HTML`)
}
if (aboutCount(/aria-controls="[^"]*-track"/g) < 2) fail('about', 'carousel controls missing')
const aboutLinks = [
  ...about.numbers.items.filter((i) => i.href).map((i) => i.href),
  about.founder.cta.href,
  about.saranya.cta.href,
  ...about.team.cards.map((c) => c.href),
  about.clinicTech.cta.href,
  ...about.services.cards.map((c) => c.href),
]
for (const href of ['/about-dr-sandeep-mahapatra/', '/dr-saranya-t/', '/technology/', '/international-patients/']) {
  if (!aboutLinks.includes(href)) fail('about', `no link to ${href}`)
}
for (const href of aboutLinks) {
  if (!fs.existsSync(fileFor(href))) fail('about', `no page for ${href}`)
  if (!aboutHtml.includes(`href="${href}"`)) fail('about', `link to ${href} missing from the built page`)
}
const aboutImages = [
  about.banner.image,
  ...Object.values(about.story.images),
  about.founder.portrait,
  about.founder.inset,
  about.clinicTech.image,
  ...about.services.cards.map((c) => ({ src: c.image, alt: c.alt })),
  ...about.instagram.tiles,
]
for (const { src, alt } of aboutImages) {
  if (!fs.existsSync(path.join(DIST, src))) fail('about', `image missing: ${src}`)
  if (!alt?.trim()) fail('about', `no alt text: ${src}`)
}
const aboutImgTags = [...aboutHtml.matchAll(/<img\b[^>]*>/g)].map((m) => attrs(m[0]))
for (const img of aboutImgTags) {
  if (!img.width || !img.height) fail('about', `<img> without width/height: ${img.src}`)
  if (/\/images\/home\/(about|hero)/.test(img.src)) fail('about', `theme stock photo used: ${img.src}`)
}
const aboutLd = parseHead(fs.existsSync(fileFor('/about-us/')) ? fs.readFileSync(fileFor('/about-us/'), 'utf8') : '').ld[0] ?? '{}'
const aboutGraph = JSON.parse(aboutLd)['@graph'] ?? []
const ldTypes = aboutGraph.flatMap((n) => [n['@type']].flat())
for (const t of ['AboutPage', 'MedicalClinic', 'FAQPage']) if (!ldTypes.includes(t)) fail('about', `JSON-LD has no ${t}`)
if (ldTypes.filter((t) => t === 'Physician').length !== 2) fail('about', 'JSON-LD: expected 2 Physician nodes')
const faqLd = aboutGraph.find((n) => n['@type'] === 'FAQPage')?.mainEntity ?? []
if (JSON.stringify(faqLd.map((e) => [e.name, e.acceptedAnswer.text])) !== JSON.stringify(about.faqs.items.map((f) => [f.q, f.a]))) {
  fail('about', 'FAQPage schema does not match the visible FAQ')
}
if (/AggregateRating|"Review"/.test(aboutLd)) fail('about', 'rating or review schema before the rating is signed off')
for (const r of about.reviews.items) if ((r.quote || r.author) && !r.consent) fail('about', 'review text set without consent')
if (!about.founder.quote.signedOff && aboutHtml.includes(about.founder.quote.text)) fail('about', 'founder quote shown before sign-off')
for (const name of about.memberships.pending) if (aboutHtml.includes(`alt="${name}"`)) fail('about', `unconfirmed membership logo shown: ${name}`)
const aboutPending = [
  'Founding story wording (and opening year, if shown)',
  'Years in practice: 20+ (site) vs 18 (Practo) vs 19 (Apollo 24/7)',
  '10,000+ transplants and 6M+ follicles: own cases or Neo Follicle total?',
  '100,000+ PRP, 50,000+ laser, 40,000+ peels, 3,000+ vitiligo, 500+ international patients',
  '18+ surgeons trained and 55+ specialists formed',
  'MBBS honours, MD Gold Medal, DHI Global and Allergan certifications; 7 published papers',
  '"The doctor reviews your recovery" holds for every speciality (FAQ 3)',
  ...(about.founder.quote.signedOff ? [] : ["Founder quote in Dr Sandeep's words (hidden until approved)"]),
  ...about.memberships.pending.map((n) => `Membership: ${n} (logo hidden on About until confirmed)`),
  ...about.memberships.group.filter((g) => g.claim && !g.claim.signedOff).map((g) => `${g.name}: "${g.claim.text}" (hidden)`),
  ...(about.instagram.handle ? [] : ['NeoSculpt6 Instagram handle and profile URL']),
  ...about.reviews.items.filter((r) => !(r.quote && r.author && r.consent)).map((r) => `About review about ${r.lookFor} (quote, name, treatment, consent)`),
  'Placeholder photos (old-site images): banner, story ×3, founder portrait + inset, clinic image, Instagram ×6; Dr Saranya portrait',
]

// Service pages built from content/service/service-page.md (src/data/services/, parsed.json): sections in the
// doc's order (section 10 only where the doc has it), every string from the data visible on the page, every link a
// built page, every image present with alt text and a size, and schema that matches what the page shows. It loops
// over every page that has content.
const bodyText = (html) =>
  decode(html.slice(Math.max(0, html.indexOf('<body'))).replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')
const ctaHrefs = (ctas) => [...new Set(ctas.filter((c) => c.href).map((c) => c.href))]
const servicePending = []
for (const s of services) {
  const p = s.path
  const record = pages.find((r) => r.path === p)
  if (record?.type !== 'service') {
    fail(p, 'service content for a route that is not a service page')
    continue
  }
  const raw = fs.existsSync(fileFor(p)) ? fs.readFileSync(fileFor(p), 'utf8') : ''
  const html = decode(raw)
  const text = bodyText(raw)

  const order = [
    'service-hero',
    'service-intro',
    'service-consultation',
    'service-why-choose',
    'service-process',
    'service-candidates',
    'service-doctor',
    'service-technology',
    'cost',
    ...s.strips.map((_, i) => `service-strip-${i + 1}`),
    'success-stories',
    'service-faqs',
    'service-explore',
    'service-cta',
    'instagram',
  ]
  const positions = order.map((id) => html.indexOf(`id="${id}"`))
  order.forEach((id, i) => positions[i] < 0 && fail(p, `section id="${id}" missing`))
  if (positions.every((x) => x >= 0) && positions.some((x, i) => i > 0 && x < positions[i - 1])) {
    fail(p, 'sections are not in the service-page.md order')
  }
  if (html.includes(`id="service-strip-${s.strips.length + 1}"`)) fail(p, 'more section 10 strips than the doc has')
  if (html.indexOf('id="instagram"') > html.indexOf('<footer')) fail(p, 'Instagram row is not above the footer')

  const ctas = [...s.hero.ctas, ...s.consultation.ctas, ...s.cost.ctas, ...s.strips.flatMap((x) => (x.cta ? [x.cta] : [])), s.faqs.cta, ...s.closing.ctas, s.sidebar.cta]
  const strings = [
    s.hero.intro,
    s.hero.phoneLabel,
    s.intro.h2,
    ...s.intro.paragraphs,
    s.consultation.h2,
    s.consultation.introLine ?? '',
    ...s.consultation.paragraphs,
    s.whyChoose.h2,
    ...(s.whyChoose.subline ? [s.whyChoose.subline] : []),
    ...s.whyChoose.cards.flatMap((c) => [c.title, c.text]),
    s.process.eyebrow,
    s.process.h2,
    ...s.process.steps.flatMap((c) => [c.title, c.text]),
    s.candidates.h2,
    s.candidates.note ?? '',
    s.consultation.video?.title ?? '',
    ...s.closing.chips,
    ...s.candidates.cards.flatMap((c) => [c.title, c.text]),
    s.doctor.doctor,
    s.doctor.eyebrow,
    s.doctor.h2,
    s.doctor.specialty,
    s.doctor.profileLabel,
    s.doctor.blockEyebrow,
    ...s.doctor.chips,
    ...s.doctor.paragraphs,
    s.technology.h2,
    ...(s.technology.subline ? [s.technology.subline] : []),
    ...s.technology.cards.flatMap((c) => [c.title, c.text]),
    s.cost.h2,
    s.cost.intro,
    ...s.cost.factors.flatMap((c) => [c.title, c.text]),
    ...s.strips.flatMap((x) => [x.heading, x.text]),
    s.reviews.h2,
    s.faqs.eyebrow,
    s.faqs.h2,
    ...s.faqs.items.flatMap((f) => [f.q, f.a]),
    s.closing.kicker,
    s.closing.h2,
    s.closing.paragraph,
    s.sidebar.heading,
    ...s.sidebar.links.map((l) => l.label),
    s.sidebar.viewAll.label,
    s.sidebar.contactHeading,
    s.sidebar.contactText,
    ...ctas.map((c) => c.label),
  ]
  for (const str of strings.filter(Boolean)) if (!text.includes(str)) fail(p, `not on the page: "${str.length > 60 ? str.slice(0, 60) + '…' : str}"`)
  // Each FAQ question shows once in the FAQ list (another section may use the same words, e.g. an intro H2 "What Is …?").
  const faqText = bodyText(raw.match(/<section[^>]*id="service-faqs"[\s\S]*?<\/section>/)?.[0] ?? '')
  for (const { q } of s.faqs.items) {
    const n = faqText.split(q).length - 1
    if (n !== 1) fail(p, `FAQ question shown ${n} times in the FAQ list: "${q}"`)
  }

  const doctorCard = doctors.cards.find((c) => c.name === s.doctor.doctor)
  if (!doctorCard) fail(p, `no doctor card for ${s.doctor.doctor}`)
  const links = [
    ...record.breadcrumbs.slice(0, -1).map((c) => c.path),
    ...s.sidebar.links.map((l) => l.href),
    s.sidebar.viewAll.href,
    ...(doctorCard ? [doctorCard.href] : []),
    ...ctaHrefs(ctas).filter((h) => h.startsWith('/')),
  ]
  for (const href of links) {
    if (!fs.existsSync(fileFor(href))) fail(p, `no page for ${href}`)
    if (!html.includes(`href="${href}"`)) fail(p, `link to ${href} missing from the built page`)
  }
  for (const href of ctaHrefs(ctas).filter((h) => h.startsWith('#'))) {
    if (!html.includes(`id="${href.slice(1)}"`)) fail(p, `${href} has no target on the page`)
    if (!html.includes(`href="${href}"`)) fail(p, `link to ${href} missing`)
  }
  for (const href of ctaHrefs(ctas).filter((h) => h.startsWith('tel:'))) if (!html.includes(`href="${href}"`)) fail(p, `${href} missing`)
  if (s.sidebar.links.some((l) => !l.href.startsWith(record.section ?? '-'))) fail(p, 'sidebar links outside the page’s speciality')

  const images = [s.hero.image, s.consultation.image, s.process.image, s.candidates.image, s.doctor.portrait, s.closing.image].filter(Boolean)
  for (const { src, alt } of images) {
    if (!fs.existsSync(path.join(DIST, src))) fail(p, `image missing: ${src}`)
    if (!alt?.trim()) fail(p, `no alt text: ${src}`)
    if (!html.includes(`src="${src}"`)) fail(p, `image not on the page: ${src}`)
  }
  for (const img of [...raw.matchAll(/<img\b[^>]*>/g)].map((m) => attrs(m[0]))) {
    if (!img.width || !img.height) fail(p, `<img> without width/height: ${img.src}`)
    if (/\/images\/home\/(about|hero)/.test(img.src)) fail(p, `theme stock photo used: ${img.src}`)
  }

  const accordions = (raw.match(/<button[^>]*aria-expanded="(true|false)"[^>]*aria-controls="[^"]+"/g) ?? []).length
  if (accordions < s.process.steps.length + s.faqs.items.length) fail(p, `${accordions} accordion buttons with aria-controls`)
  for (const track of ['service-technology-track', 'success-stories-track']) {
    if (!raw.includes(`aria-controls="${track}"`)) fail(p, `carousel controls missing for ${track}`)
  }
  for (const r of s.reviews.items) if ((r.quote || r.author) && !r.consent) fail(p, 'review text set without consent')

  const ld = parseHead(raw).ld[0] ?? '{}'
  const graph = JSON.parse(ld)['@graph'] ?? []
  const types = graph.flatMap((n) => [n['@type']].flat())
  for (const t of ['MedicalWebPage', 'MedicalClinic', 'FAQPage', 'Physician']) if (!types.includes(t)) fail(p, `JSON-LD has no ${t}`)
  const faq = graph.find((n) => n['@type'] === 'FAQPage')?.mainEntity ?? []
  if (JSON.stringify(faq.map((e) => [e.name, e.acceptedAnswer.text])) !== JSON.stringify(s.faqs.items.map((f) => [f.q, f.a]))) {
    fail(p, 'FAQPage schema does not match the visible FAQ')
  }
  const physician = graph.find((n) => n['@type'] === 'Physician')
  if (physician && physician.name !== s.doctor.doctor) fail(p, `Physician schema names ${physician.name}, the page shows ${s.doctor.doctor}`)
  if (physician?.hasCredential || physician?.memberOf) fail(p, 'Physician schema lists credentials the page does not show as verified')
  if (/AggregateRating|"Review"/.test(ld)) fail(p, 'rating or review schema before the reviews are verified')

  for (const item of s.pending) servicePending.push([item.replace(/:.*$/, ''), `${p.split('/').at(-2)}: ${item.replace(/^[^:]*:\s*/, '')}`])
}
const serviceRoutes = pages.filter((r) => r.type === 'service').length
const serviceImages = new Set(services.flatMap((s) => [s.hero.image, s.consultation.image, s.process.image, s.candidates.image].map((i) => i.src)))

const pendingLegal =legalNav.filter(({ href }) => !fs.existsSync(fileFor(href))).map(({ href }) => href)

if (!fs.existsSync(path.join(DIST, 'robots.txt'))) fail('robots.txt', 'missing')
if (!fs.existsSync(path.join(DIST, '404.html'))) fail('404.html', 'missing')

// report
const dups = (key) => {
  const m = new Map()
  for (const p of indexable) m.set(p[key], [...(m.get(p[key]) ?? []), p.path])
  return [...m].filter(([, v]) => v.length > 1)
}
const byType = pages.reduce((m, p) => ((m[p.type] = (m[p.type] ?? 0) + 1), m), {})
console.log(`checked ${pages.length} routes`, byType)
console.log(`old URLs: ${manifest.length}, all routed: ${!failures.some((f) => f.endsWith('old URL has no route'))}`)
console.log(`sitemap: ${locs.length} URLs`)
console.log(`home pillar links: ${pillarLinks.length} checked`)
console.log(`home doctor profiles: ${doctors.cards.length} checked`)
console.log(`home technology links: ${technologyLinks.length} checked`)
console.log(`home testimonials: ${testimonials.reviews.length} cards checked; pending sign-off:`)
for (const item of testimonialsPending) console.log(`  - ${item}`)
console.log(`home journal: ${journalCardCount} cards (${publishedPosts.length} published); not yet written or medically reviewed:`)
for (const item of plannedTopics) console.log(`  - ${item}`)
console.log(`about: ${aboutOrder.length} sections in order, ${aboutLinks.length} links and ${aboutImages.length} images checked; pending sign-off:`)
for (const item of aboutPending) console.log(`  - ${item}`)
console.log(`services: ${services.length} of ${serviceRoutes} service pages built from service-page.md; pending sign-off:`)
console.log(`  - every service page: 3 Google reviews each (quote, name, consent), the Google rating and count, and the`)
console.log(`    "Board-Certified Team" heading; ${serviceImages.size} old-site placeholder photos, the reception image and Dr Sandeep's portrait`)
const byKind = Map.groupBy(servicePending, ([kind]) => kind)
for (const [kind, items] of byKind) {
  console.log(`  - ${kind} (${items.length} page${items.length === 1 ? '' : 's'}):`)
  for (const [, item] of items.slice(0, 6)) console.log(`      ${item.length > 150 ? item.slice(0, 150) + '…' : item}`)
  if (items.length > 6) console.log(`      … and ${items.length - 6} more`)
}
console.log(`menu links: ${navLinks.length} checked${pendingLegal.length ? `; legal pages not built yet: ${pendingLegal.join(', ')}` : ''}`)
console.log(`duplicate titles: ${dups('title').length}, duplicate descriptions: ${dups('description').length}`)
console.log(`pages with todo items: ${pages.filter((p) => p.todo?.length).length} (see src/data/seo-report.csv)`)

if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S):`)
  for (const f of failures.slice(0, 50)) console.error('  ' + f)
  process.exit(1)
}
console.log('\nOK: all SEO checks passed')
