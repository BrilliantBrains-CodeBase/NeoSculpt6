#!/usr/bin/env node
// Post-build check: every prerendered page carries exactly the SEO in pages.json, and no old URL is lost.
// Run after `npm run build`. Exits 1 on any failure.
import fs from 'node:fs'
import path from 'node:path'
import { primaryNav, findMyTreatment } from '../src/data/nav.ts'
import { footerNav, legalNav, instagram } from '../src/data/site.ts'
// The Instagram strip has a site-wide switch (instagram.enabled); while it is off, no section list expects it.
const withInstagram = (ids) => (instagram.enabled ? ids : ids.filter((id) => id !== 'instagram'))
import { pillars, results, signature, doctors, doctorSpotlight, testimonials, technology, journal } from '../src/data/home.ts'
import { hubs } from '../src/data/hubs.ts'
import { editorial, publicRecords, pageRecords, latest, pendingEditorial, isPublic, cardHref } from '../src/data/editorial.ts'
import * as about from '../src/data/about.ts'
import * as contact from '../src/data/contact.ts'
import { services } from '../src/data/services/index.ts'
import { LIVE as TECH_LIVE, SOURCE_EXCEPTIONS, technologyPages } from '../src/data/technology/index.ts'
import { specialityHubs } from '../src/data/specialities/index.ts'
import { REVIEWS as REVIEW_POOL, topicsForPath } from '../src/data/reviews.ts'
import {
  DOCTOR_SECTIONS,
  approved,
  credentialLine,
  doctorByPath,
  doctorSections,
  pendingItems,
  portraitFor,
  publicQuote,
  publicSocialLinks,
  publishedDoctors,
} from '../src/data/doctors.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
// New pages held out of search on purpose (a `robots` noindex in src/data/hubs.ts, e.g. a coming-soon page).
const noindexOnPurpose = new Set(hubs.filter((h) => h.robots?.startsWith('noindex')).map((h) => h.path))
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
  // The thank-you page (booking form's landing page) is noindex by design.
  if (page.type !== 'legacy-demo' && page.type !== 'thank-you' && !noindexOnPurpose.has(page.path) && /noindex/i.test(head.robots[0] ?? ''))
    fail(page.path, 'indexable page is noindex')
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
// Home anchors (/#…) are skipped.
const navLinks = [
  ...primaryNav.flatMap((i) => [i, ...(i.children ?? []), ...(i.mega ?? []).flatMap((c) => [c, ...c.items])]),
  findMyTreatment,
  ...footerNav,
  ...legalNav,
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
// Home section 10 (Testimonials): the five treatment labels (homepage.md's, adapted to the reviews the client chose;
// see src/data/home.ts), a quote only with consent, no ages, the borrowed Google rating named on the page, and no
// AggregateRating schema. Anything still pending is listed as a warning, not a failure.
const testimonialLabels = ['Hair Transplant', 'Laser Hair Reduction', 'Acne & Scar Treatment', 'Botox & Fillers', 'CO2 Laser']
const testimonialsPending = []
const homeHtml = fs.existsSync(fileFor('/')) ? decode(fs.readFileSync(fileFor('/'), 'utf8')) : ''
if (!homeHtml.includes('id="testimonials"')) fail('home testimonials', 'section not on the built home page')
// Home extra A (Dr Sandeep spotlight): on the page, directly before the popular carousel, with the team section
// (id="our-doctors") still further down; the experience line only once approved. Its portrait and profile link are
// About's `founder`, checked with the About images and links.
const spotlightAt = homeHtml.indexOf(`id="${doctorSpotlight.id}"`)
if (spotlightAt < 0) fail('home spotlight', `section id="${doctorSpotlight.id}" missing from the home page`)
else if (!(spotlightAt < homeHtml.indexOf('id="popular-heading"'))) fail('home spotlight', 'not placed before Our Popular Treatments')
if (!homeHtml.includes('id="our-doctors"')) fail('home doctors', 'section id="our-doctors" missing from the home page')
if (!doctorSpotlight.experience.approved && homeHtml.includes(doctorSpotlight.experience.text)) fail('home spotlight', 'experience line shown before approval')
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
// React's prerender puts <!-- --> between adjacent text pieces.
if (testimonials.rating.value && testimonials.rating.source && !homeHtml.replace(/<!-- -->/g, '').includes(`reviews of ${testimonials.rating.source}`)) {
  fail('home testimonials', `the Google rating line does not name its listing (${testimonials.rating.source})`)
}
if (/AggregateRating/.test(homeHtml)) {
  fail('home testimonials', 'AggregateRating schema on the home page: the rating shown is another listing\'s')
}

// Review pool (src/data/reviews.json), used by every testimonials section: unique ids, no ages, each review keeps to
// the content rules as posted (a review that breaks one is left out, never edited), and no built page still shows a
// pending placeholder card. Coverage: how many pages get a review about their own treatment.
const POOL_RULES = /\b(best|No\. ?1|guaranteed|permanent|painless|no side effects|scarless|no downtime|zero downtime|frozen|effortless|guarantee[sd]?)\b|₹|\bRs\.? ?\d|\bINR\b|\d[\d,]*\+? ?grafts\b/i
const poolIds = new Set()
for (const r of REVIEW_POOL) {
  if (poolIds.has(r.id)) fail('reviews.json', `duplicate id ${r.id}`)
  poolIds.add(r.id)
  if (!r.quote?.trim()) fail('reviews.json', `${r.id}: empty quote`)
  if (/\d/.test(r.author)) fail('reviews.json', `${r.id}: author "${r.author}" has a digit`)
  const hit = r.quote.match(POOL_RULES)
  if (hit) fail('reviews.json', `${r.id}: "${hit[0]}" breaks the content rules`)
}
const reviewPages = { matched: 0, general: [] }
for (const file of fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('index.html'))) {
  const html = fs.readFileSync(path.join(DIST, file), 'utf8')
  const pagePath = '/' + path.dirname(file).replace(/^\.$/, '').split(path.sep).filter(Boolean).join('/') + (path.dirname(file) === '.' ? '' : '/')
  if (!/id="(success-stories|patient-reviews|testimonials)"/.test(html)) continue
  if (html.includes('Review pending sign-off')) fail(pagePath, 'testimonials still show a pending placeholder card')
  if (pagePath === '/' || pagePath === '/about-us/') continue
  const topics = topicsForPath(pagePath)
  if (REVIEW_POOL.some((r) => r.topics.some((t) => topics.includes(t)))) reviewPages.matched++
  else reviewPages.general.push(pagePath)
}
// Home technology banner (section 13's replacement): both crops exist and are on the page, with size and alt; its
// words are live text under the H2; it sits directly above Real Results. Every card link (the technology pages use
// the cards) is a built page, and every card image exists.
const techBanner = technology.banner
for (const img of [techBanner.image, techBanner.mobileImage]) {
  if (!fs.existsSync(path.join(DIST, img.src))) fail('home technology', `banner image missing: ${img.src}`)
  if (!homeHtml.includes(img.src)) fail('home technology', `banner image not on the home page: ${img.src}`)
}
if (!techBanner.alt.trim()) fail('home technology', 'banner has no alt text')
for (const str of [...techBanner.h2.flat().map((p) => p.text), techBanner.text]) {
  if (!homeHtml.includes(str)) fail('home technology', `banner text not on the home page: "${str}"`)
}
if (!homeHtml.includes('id="technology-heading"')) fail('home technology', 'section heading id="technology-heading" missing')
const bannerAt = homeHtml.indexOf('id="technology-banner"')
// Only Real Results' own <section> tag (it opens just before its id) may sit between the two.
if (bannerAt < 0 || bannerAt > homeHtml.indexOf('id="results"') || homeHtml.slice(bannerAt, homeHtml.indexOf('id="results"')).split('<section').length !== 2) {
  fail('home technology', 'banner is not directly above Real Results')
}
const technologyLinks = technology.cards
for (const { href } of technologyLinks) {
  if (!fs.existsSync(fileFor(href))) fail('home technology', `no page for ${href}`)
}
for (const { image } of technology.cards) {
  if (!fs.existsSync(path.join(DIST, image))) fail('home technology', `image missing: ${image}`)
}
// Journal (home section 14 and /journal/): one registry (src/data/editorial.json) drives the hub, the article pages
// and the home row. The hub is built with one H1 and CollectionPage schema; every article page is built with one H1
// and Article schema (and no other page has Article); the home row shows the newest 3 public items; nothing that is
// not public appears in any built page; every media card opens in a new tab with noopener.
const H1S = (html) => [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, '')).trim())
const journalHub = pages.find((p) => p.path === '/journal/')
const hubHtml = fs.existsSync(fileFor('/journal/')) ? decode(fs.readFileSync(fileFor('/journal/'), 'utf8')) : ''
if (!journalHub || !hubHtml) fail('/journal/', 'hub page missing')
else {
  const h1s = H1S(hubHtml)
  if (h1s.length !== 1 || h1s[0].toLowerCase() !== journalHub.h1.toLowerCase()) fail('/journal/', `expected one H1 "${journalHub.h1}", found ${JSON.stringify(h1s)}`)
  if (!/"CollectionPage"/.test(hubHtml)) fail('/journal/', 'no CollectionPage schema')
  for (const r of publicRecords) if (!hubHtml.includes(r.title)) fail('/journal/', `public item missing from the hub HTML: ${r.title}`)
}
for (const r of pageRecords) {
  const file = fileFor(r.path)
  if (!fs.existsSync(file)) {
    fail(r.path, 'article page not built')
    continue
  }
  const html = decode(fs.readFileSync(file, 'utf8'))
  const h1s = H1S(html)
  if (h1s.length !== 1 || h1s[0] !== r.title) fail(r.path, `expected one H1 "${r.title}", found ${JSON.stringify(h1s)}`)
  if (r.status !== 'archived' && !/"@type":"Article"/.test(html)) fail(r.path, 'no Article schema')
}
const articlePaths = new Set(pageRecords.map((r) => r.path))
const journalHtml = homeHtml.match(/<section[^>]*id="journal"[\s\S]*?<\/section>/)?.[0] ?? ''
if (publicRecords.length && !journalHtml) fail('home journal', 'section id="journal" missing from the home page')
const journalCardCount = (journalHtml.match(/<article\b/g) ?? []).length
const expectedHome = latest(3)
if (journalCardCount !== expectedHome.length) fail('home journal', `${journalCardCount} cards, expected ${expectedHome.length}`)
for (const r of expectedHome) if (!journalHtml.includes(r.title)) fail('home journal', `missing the latest item: ${r.title}`)
if (journal.cta && !fs.existsSync(fileFor(journal.cta.href))) fail('home journal', `no page for ${journal.cta.href}`)
const hidden = editorial.filter((r) => !isPublic(r) && r.status !== 'archived').map((r) => r.title)
const mediaHrefs = publicRecords.filter((r) => r.type === 'media').map(cardHref)
for (const p of pages.filter((x) => x.type !== 'redirect')) {
  const file = fileFor(p.path)
  if (!fs.existsSync(file)) continue
  const html = decode(fs.readFileSync(file, 'utf8'))
  for (const t of hidden) if (html.includes(t)) fail(p.path, `unpublished journal item appears in the page: ${t}`)
  if (/"@type":"Article"/.test(html) && !articlePaths.has(p.path)) fail(p.path, 'Article schema on a page that is not a journal article')
  for (const href of mediaHrefs) {
    for (const m of html.matchAll(/<a\b[^>]*>/g)) {
      const a = attrs(m[0])
      if (a.href !== href) continue
      if (a.target !== '_blank' || !/\bnoopener\b/.test(a.rel ?? '')) fail(p.path, `media link must open in a new tab with rel=noopener: ${href}`)
    }
  }
}
for (const r of publicRecords) {
  const clip = r.media?.clipping
  if (clip && r.media.permissionConfirmed) {
    for (const src of [clip.thumb, clip.full]) if (!fs.existsSync(path.join(DIST, src))) fail('journal', `clipping missing: ${src}`)
  }
}
const editorialPending = pendingEditorial()
// About page (/about-us/, content/about-us/about-us.md): sections in the doc's order, every link a built page, every
// image present with alt text, schema that matches the visible FAQ, and no rating markup. Items
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
  ...(instagram.enabled ? ['instagram'] : []),
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
  ...(instagram.enabled ? about.instagram.tiles : []),
]
for (const { src, alt } of aboutImages) {
  if (!fs.existsSync(path.join(DIST, src))) fail('about', `image missing: ${src}`)
  if (!alt?.trim()) fail('about', `no alt text: ${src}`)
}
const aboutImgTags = [...aboutHtml.matchAll(/<img\b[^>]*>/g)].map((m) => attrs(m[0]))
for (const img of aboutImgTags) {
  if (!img.width || !img.height) fail('about', `<img> without width/height: ${img.src}`)
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

// Contact page (/contact-us/, content/contact/prompts/contact-us-page.md, trimmed to banner / form / map at the user's
// request): sections in order, one H1 that matches the data, the banner photo present with alt text and a size, the
// contact links, a lazy keyless map embed, ContactPage + MedicalClinic schema without rating markup, and no theme demo
// contact details.
const contactFile = fileFor('/contact-us/')
const contactRaw = fs.existsSync(contactFile) ? fs.readFileSync(contactFile, 'utf8') : ''
const contactHtml = decode(contactRaw)
const contactOrder = withInstagram(['contact-banner', 'book-consultation', 'visit-us', 'instagram'])
const contactPositions = contactOrder.map((id) => contactHtml.indexOf(`id="${id}"`))
contactOrder.forEach((id, i) => contactPositions[i] < 0 && fail('contact', `section id="${id}" missing`))
if (contactPositions.every((p) => p >= 0) && contactPositions.some((p, i) => i > 0 && p < contactPositions[i - 1])) {
  fail('contact', 'sections are not in order (banner, form, map, Instagram)')
}
if (contactHtml.indexOf('id="instagram"') > contactHtml.indexOf('<footer')) fail('contact', 'Instagram row is not above the footer')
if (contact.banner.h1.map((p) => p.text).join('') !== pages.find((p) => p.path === '/contact-us/')?.h1) {
  fail('contact', 'banner H1 parts do not match the H1 in pages.json')
}
if (pages.find((p) => p.path === '/contact-us/')?.name !== 'Contact Us') fail('contact', 'breadcrumb name is not "Contact Us"')
const { image: contactImage } = contact.banner
if (!fs.existsSync(path.join(DIST, contactImage.src))) fail('contact', `image missing: ${contactImage.src}`)
if (!contactImage.alt?.trim()) fail('contact', `no alt text: ${contactImage.src}`)
for (const img of [...contactHtml.matchAll(/<img\b[^>]*>/g)].map((m) => attrs(m[0]))) {
  if (!img.width || !img.height) fail('contact', `<img> without width/height: ${img.src}`)
}
for (const href of ['href="#book-consultation"', 'href="tel:', 'href="https://wa.me/', 'href="https://www.google.com/maps/', 'href="mailto:']) {
  if (!contactHtml.includes(href)) fail('contact', `no ${href}…" link`)
}
const contactIframes = [...contactRaw.matchAll(/<iframe\b[^>]*>/g)].map((m) => attrs(m[0]))
if (contactIframes.length !== 1) fail('contact', `${contactIframes.length} map iframes, expected 1`)
for (const f of contactIframes) {
  if (!f.title?.trim()) fail('contact', 'map iframe has no title')
  if (f.loading !== 'lazy') fail('contact', 'map iframe is not lazy-loaded')
  if (/[?&]key=/.test(f.src ?? '')) fail('contact', 'API key in the map embed URL')
}
if (/portland|800[- ]123|@gmail|@example|rejuvita/i.test(contactHtml.slice(contactHtml.indexOf('<body')))) {
  fail('contact', 'theme demo contact details or names on the page')
}
const contactLd = parseHead(contactRaw).ld[0] ?? '{}'
const contactTypes = (JSON.parse(contactLd)['@graph'] ?? []).flatMap((n) => [n['@type']].flat())
for (const t of ['ContactPage', 'MedicalClinic']) if (!contactTypes.includes(t)) fail('contact', `JSON-LD has no ${t}`)
if (/AggregateRating|"Review"/.test(contactLd)) fail('contact', 'rating or review schema')
const contactPending = [
  'Final title and meta description (brief fallback in use)',
  'Google Business Profile URL / place ID and its own map embed (the map and Get Directions use an address search)',
  ...(about.instagram.handle ? [] : ['NeoSculpt6 Instagram handle and profile URL; Facebook and YouTube URLs']),
  'Banner photo: confirm the old-site reception image is the real NeoSculpt6 reception',
  'Privacy policy page and approved legal copy (the privacy note links to none)',
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
    ...(instagram.enabled ? ['instagram'] : []),
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
    s.doctors.eyebrow,
    s.doctors.h2,
    ...s.doctors.cards.flatMap((d) => [d.name, d.specialty, d.profileLabel, d.blockEyebrow, ...d.chips, ...d.paragraphs]),
    ...s.intro.points.flatMap((c) => [c.title, c.text]),
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

  const links = [
    ...record.breadcrumbs.slice(0, -1).map((c) => c.path),
    ...s.sidebar.links.map((l) => l.href),
    s.sidebar.viewAll.href,
    ...s.doctors.cards.flatMap((d) => (d.href ? [d.href] : [])),
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
  // The doc's own list decides which pages it names (some cross hubs: fillers on a surgery page); each must be a service.
  for (const l of s.sidebar.links) if (pages.find((r) => r.path === l.href)?.type !== 'service') fail(p, `sidebar link is not a service page: ${l.href}`)

  const images = [s.hero.image, s.consultation.image, s.process.image, s.candidates.image, ...s.doctors.cards.map((d) => d.portrait), s.closing.image].filter(Boolean)
  for (const { src, alt } of images) {
    if (!fs.existsSync(path.join(DIST, src))) fail(p, `image missing: ${src}`)
    if (!alt?.trim()) fail(p, `no alt text: ${src}`)
    if (!html.includes(`src="${src}"`)) fail(p, `image not on the page: ${src}`)
  }
  for (const img of [...raw.matchAll(/<img\b[^>]*>/g)].map((m) => attrs(m[0]))) {
    if (!img.width || !img.height) fail(p, `<img> without width/height: ${img.src}`)
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
  const physicians = graph.filter((n) => n['@type'] === 'Physician')
  const shown = s.doctors.cards.map((d) => d.name)
  if (JSON.stringify(physicians.map((n) => n.name)) !== JSON.stringify(shown)) {
    fail(p, `Physician schema names ${physicians.map((n) => n.name).join(', ')}, the page shows ${shown.join(', ')}`)
  }
  if (physicians.some((n) => n.hasCredential || n.memberOf)) fail(p, 'Physician schema lists credentials the page does not show as verified')
  if (/AggregateRating|"Review"/.test(ld)) fail(p, 'rating or review schema before the reviews are verified')

  for (const item of s.pending) servicePending.push([item.replace(/:.*$/, ''), `${p.split('/').at(-2)}: ${item.replace(/^[^:]*:\s*/, '')}`])
}
const serviceRoutes = pages.filter((r) => r.type === 'service').length
const serviceImages = new Set(services.flatMap((s) => [s.hero.image, s.consultation.image, s.process.image, s.candidates.image].map((i) => i.src)))

// Technology hub, technology pages and International Patients (content/technology/technology-international-patient.md,
// src/data/technology/). For all 11: pages.json carries the doc's title tag, description, H1, robots and breadcrumb
// (the head check above then holds the built page to it). For each page in LIVE, as for the service pages: sections
// in the doc's order, every string visible, links and images, FAQ schema equal to the visible FAQ, and none of the
// words the content rules keep out. Doc notes and missing items are listed for sign-off.
const techJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/technology/parsed.json'), 'utf8'))
const BANNED = /\b(best|No\. ?1|guaranteed|permanent|painless|no side effects|scarless|Portland|Medicross|gmail)\b/i
const techPending = []
for (const doc of techJson) {
  const p = doc.path
  const record = pages.find((r) => r.path === p)
  if (!record) {
    fail(p, 'technology doc page has no route')
    continue
  }
  for (const key of ['title', 'description', 'h1', 'robots']) {
    if (record[key] !== doc.seo[key]) fail(p, `${key} "${record[key]}" ≠ doc "${doc.seo[key]}"`)
  }
  const crumbs = record.breadcrumbs.map((c) => c.name)
  if (crumbs.join(' › ') !== doc.seo.breadcrumb.join(' › ')) fail(p, `breadcrumb "${crumbs.join(' › ')}" ≠ doc "${doc.seo.breadcrumb.join(' › ')}"`)
}
// Section ids per page kind, in the doc's order (TechnologyTemplate, HubTemplate).
const TECH_ORDER = {
  'technology-detail': ['technology-banner', 'service-intro', 'service-consultation', 'technology-assessment', 'technology-benefits', 'how-it-works', 'service-candidates', 'technology-expectations', 'service-doctor', 'cost', 'success-stories', 'service-faqs', 'service-cta', 'technology-explore', 'instagram'],
  'artas-detail': ['technology-banner', 'service-intro', 'technology-comparison', 'how-it-works', 'technology-benefits', 'service-candidates', 'technology-expectations', 'service-doctor', 'cost', 'success-stories', 'service-faqs', 'service-cta', 'technology-explore', 'instagram'],
  'technology-hub': ['technology-banner', 'technology-cards', 'service-doctor', 'service-cta', 'instagram'],
  'international-patients': ['technology-banner', 'service-intro', 'service-why-choose', 'technology-pathways', 'patient-journey', 'service-consultation', 'service-doctor', 'cost', 'success-stories', 'service-faqs', 'service-cta', 'instagram'],
}
// Every visible string in a record: all text values except what is not shown (paths, ids, image data, notes,
// pending items, review placeholders).
const HIDDEN_KEYS = new Set(['path', 'source', 'order', 'notes', 'pending', 'kind', 'image', 'portrait', 'href', 'action', 'initials', 'reviews', 'highlight', 'columns'])
const visibleStrings = (v, out = []) => {
  if (typeof v === 'string') out.push(v)
  else if (Array.isArray(v)) v.forEach((x) => visibleStrings(x, out))
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (!HIDDEN_KEYS.has(k)) visibleStrings(x, out)
  return out
}
const collect = (v, test, out = []) => {
  if (Array.isArray(v)) v.forEach((x) => collect(x, test, out))
  else if (v && typeof v === 'object') {
    if (test(v)) out.push(v)
    for (const x of Object.values(v)) collect(x, test, out)
  }
  return out
}
for (const t of technologyPages) {
  const p = t.path
  if (!TECH_LIVE.has(p)) {
    techPending.push(`${p}: template not switched on yet (${t.kind})`)
    continue
  }
  const record = pages.find((r) => r.path === p)
  const raw = fs.existsSync(fileFor(p)) ? fs.readFileSync(fileFor(p), 'utf8') : ''
  const html = decode(raw)
  const text = bodyText(raw)

  const order = withInstagram(TECH_ORDER[t.kind])
  const positions = order.map((id) => html.indexOf(`id="${id}"`))
  order.forEach((id, i) => positions[i] < 0 && fail(p, `section id="${id}" missing`))
  if (positions.every((x) => x >= 0) && positions.some((x, i) => i > 0 && x < positions[i - 1])) fail(p, 'sections are not in the doc order')
  if (html.indexOf('id="instagram"') > html.indexOf('<footer')) fail(p, 'Instagram row is not above the footer')
  if ((raw.match(/<h1[\s>]/g) ?? []).length !== 1) fail(p, 'expected exactly one <h1>')

  for (const str of visibleStrings(t).filter(Boolean)) if (!text.includes(str)) fail(p, `not on the page: "${str.length > 60 ? str.slice(0, 60) + '…' : str}"`)
  // Steps numbered once ("01. Title", never "0101").
  for (const list of [t.process?.steps, t.journey?.steps].filter(Boolean)) {
    list.forEach((s, i) => {
      if (!text.includes(`${String(i + 1).padStart(2, '0')}. ${s.title}`)) fail(p, `step "${s.title}" is not numbered once`)
    })
  }
  // Content rules, allowing only the source phrases listed for sign-off (SOURCE_EXCEPTIONS).
  let main = bodyText(raw.slice(0, raw.indexOf('<footer')))
  for (const phrase of SOURCE_EXCEPTIONS[p] ?? []) {
    if (!main.includes(phrase)) fail(p, `listed source exception not on the page: "${phrase}"`)
    main = main.split(phrase).join(' ')
  }
  const banned = main.match(BANNED)
  if (banned) fail(p, `"${banned[0]}" on the page (content rules)`)

  const ctas = collect(t, (o) => typeof o.label === 'string' && ('href' in o || 'action' in o))
  const hrefs = [...new Set([...record.breadcrumbs.slice(0, -1).map((c) => c.path), ...t.doctors.cards.flatMap((d) => (d.href ? [d.href] : [])), ...ctas.filter((c) => c.href).map((c) => c.href)])]
  for (const href of hrefs.filter((h) => h.startsWith('/'))) {
    if (!fs.existsSync(fileFor(href))) fail(p, `no page for ${href}`)
    if (!html.includes(`href="${href}"`)) fail(p, `link to ${href} missing from the built page`)
  }
  for (const href of hrefs.filter((h) => h.startsWith('#'))) {
    if (!html.includes(`id="${href.slice(1)}"`)) fail(p, `${href} has no target on the page`)
    if (!html.includes(`href="${href}"`)) fail(p, `link to ${href} missing`)
  }
  for (const href of hrefs.filter((h) => /^(tel:|https?:)/.test(h))) if (!html.includes(`href="${href}"`)) fail(p, `${href} missing`)
  const books = ctas.filter((c) => c.action === 'book').length
  if (books && !/<button[^>]*type="button"/.test(raw)) fail(p, 'booking buttons missing')

  const images = collect(t, (o) => typeof o.src === 'string' && typeof o.alt === 'string')
  if (new Set(images.map((i) => i.src)).size !== images.length) fail(p, 'the same photo is used twice on the page')
  for (const { src, alt } of images) {
    if (!fs.existsSync(path.join(DIST, src))) fail(p, `image missing: ${src}`)
    if (!alt?.trim()) fail(p, `no alt text: ${src}`)
    if (!html.includes(`src="${src}"`)) fail(p, `image not on the page: ${src}`)
  }
  for (const img of [...raw.matchAll(/<img\b[^>]*>/g)].map((m) => attrs(m[0]))) {
    if (!img.width || !img.height) fail(p, `<img> without width/height: ${img.src}`)
  }

  const steps = (t.process?.steps.length ?? 0) + (t.journey?.steps.length ?? 0) + (t.faqs?.items.length ?? 0)
  const accordions = (raw.match(/<button[^>]*aria-expanded="(true|false)"[^>]*aria-controls="[^"]+"/g) ?? []).length
  if (accordions < steps) fail(p, `${accordions} accordion buttons with aria-controls, expected ${steps}`)
  if (t.reviews) {
    if (!raw.includes('aria-controls="success-stories-track"')) fail(p, 'carousel controls missing for success-stories-track')
    for (const r of t.reviews.items) if ((r.quote || r.author) && !r.consent) fail(p, 'review text set without consent')
  }
  if (t.pathways) {
    const tabs = raw.match(/role="tab"/g)?.length ?? 0
    const panels = raw.match(/role="tabpanel"/g)?.length ?? 0
    const selected = raw.match(/role="tab"[^>]*aria-selected="true"|aria-selected="true"[^>]*role="tab"/g)?.length ?? 0
    if (tabs !== t.pathways.tabs.length || panels !== tabs) fail(p, `${tabs} tabs and ${panels} panels, expected ${t.pathways.tabs.length}`)
    if (selected !== 1) fail(p, `${selected} selected tabs`)
    if ((raw.match(/role="tabpanel"[^>]*hidden=""/g)?.length ?? 0) !== tabs - 1) fail(p, 'exactly one tab panel should be shown')
  }

  const ld = parseHead(raw).ld[0] ?? '{}'
  const graph = JSON.parse(ld)['@graph'] ?? []
  const types = graph.flatMap((n) => [n['@type']].flat())
  const wantTypes = ['MedicalClinic', 'Physician', ...(t.faqs ? ['FAQPage'] : []), ...(/detail$/.test(t.kind) ? ['MedicalWebPage'] : [])]
  for (const type of wantTypes) if (!types.includes(type)) fail(p, `JSON-LD has no ${type}`)
  if (!t.faqs && types.includes('FAQPage')) fail(p, 'FAQPage schema on a page without FAQs')
  if (t.faqs) {
    const faq = graph.find((n) => n['@type'] === 'FAQPage')?.mainEntity ?? []
    const faqText = bodyText(raw.match(/<section[^>]*id="service-faqs"[\s\S]*?<\/section>/)?.[0] ?? '')
    if (JSON.stringify(faq.map((e) => [e.name, e.acceptedAnswer.text])) !== JSON.stringify(t.faqs.items.map((f) => [f.q, f.a]))) {
      fail(p, 'FAQPage schema does not match the FAQ data')
    }
    for (const e of faq) if (!faqText.includes(e.name) || !faqText.includes(e.acceptedAnswer.text)) fail(p, `FAQPage entry not visible in the FAQ list: "${e.name}"`)
  }
  const physiciansLd = graph.filter((n) => n['@type'] === 'Physician')
  if (JSON.stringify(physiciansLd.map((n) => n.url)) !== JSON.stringify(t.doctors.cards.map((d) => SITE_URL + d.href))) fail(p, 'Physician schema does not match the doctor cards')
  if (physiciansLd.some((n) => n.hasCredential || n.memberOf)) fail(p, 'Physician schema lists credentials the page does not show as verified')
  if (/AggregateRating|"Review"/.test(ld)) fail(p, 'rating or review schema before the reviews are verified')

  for (const item of t.pending) techPending.push(`${p}: ${item}`)
}

// Speciality hubs (src/data/specialities/; brief: content/service/prompts/speciality-<hub>.md). No hub doc exists yet,
// so the hub's own copy is a draft listed for sign-off. Checked: sections in hub.order, one H1, every string visible,
// every service page under the hub linked (and every other link a built page), photos, accordions, and the content
// rules (no banned words, prices or graft counts). Schema: CollectionPage listing the treatment cards, the clinic, the
// doctor without credentials, FAQPage only once the FAQs are approved, and no rating or review markup.
const PRICE = /₹|\bRs\.? ?\d|\bINR\b|\d[\d,]*\+? ?grafts\b|\+1[ -]\d/i
// The hub briefs' own exclusions, on top of BANNED.
const HUB_BANNED = /\b(no downtime|zero downtime|frozen|effortless|guarantee[sd]?)\b/i
const hubPending = []
for (const h of specialityHubs) {
  const p = h.path
  const record = pages.find((r) => r.path === p)
  if (!record || record.type !== 'hub') {
    fail(p, 'speciality hub has no hub route')
    continue
  }
  const raw = fs.existsSync(fileFor(p)) ? fs.readFileSync(fileFor(p), 'utf8') : ''
  const html = decode(raw)
  const text = bodyText(raw)
  if (raw.includes('data-template="hub"')) fail(p, 'still renders the placeholder')

  const positions = h.order.map((id) => html.indexOf(`id="${id}"`))
  h.order.forEach((id, i) => positions[i] < 0 && fail(p, `section id="${id}" missing`))
  if (positions.every((x) => x >= 0) && positions.some((x, i) => i > 0 && x < positions[i - 1])) fail(p, 'sections are not in hub.order')
  if (html.indexOf('id="instagram"') > html.indexOf('<footer')) fail(p, 'Instagram row is not above the footer')
  if ((raw.match(/<h1[\s>]/g) ?? []).length !== 1) fail(p, 'expected exactly one <h1>')

  // A hub without technology cards hides that section (its heading included).
  const shown = h.technology.cards.length ? h : { ...h, technology: undefined }
  for (const str of visibleStrings(shown).filter(Boolean)) if (!text.includes(str)) fail(p, `not on the page: "${str.length > 60 ? str.slice(0, 60) + '…' : str}"`)
  h.process.steps.forEach((s, i) => {
    if (!text.includes(`${String(i + 1).padStart(2, '0')}. ${s.title}`)) fail(p, `step "${s.title}" is not numbered once`)
  })
  // Content rules. The treatment cards quote each child page's approved banner words; a ruled word there is listed for
  // sign-off rather than failed (as SOURCE_EXCEPTIONS on the technology pages), everything else must pass.
  let main = bodyText(raw.slice(0, raw.indexOf('<footer')))
  for (const item of h.treatments.groups.flatMap((g) => g.items)) {
    const hit = item.text.match(BANNED) ?? item.text.match(HUB_BANNED)
    if (hit) hubPending.push(`${p}: content rules: source copy on the "${item.title}" card uses "${hit[0]}"`)
    main = main.split(item.text).join(' ')
  }
  const banned = main.match(BANNED) ?? main.match(HUB_BANNED) ?? main.match(PRICE)
  if (banned) fail(p, `"${banned[0]}" on the page (content rules)`)

  const children = services.map((s) => s.path).filter((x) => x.startsWith(p))
  for (const child of children) if (!html.includes(`href="${child}"`)) fail(p, `child page not linked: ${child}`)
  const ctas = collect(h, (o) => typeof o.label === 'string' && ('href' in o || 'action' in o))
  const hrefs = [
    ...new Set([
      ...record.breadcrumbs.slice(0, -1).map((c) => c.path),
      ...h.doctors.cards.flatMap((d) => (d.href ? [d.href] : [])),
      ...h.treatments.groups.flatMap((g) => g.items.map((i) => i.href)),
      ...ctas.filter((c) => c.href).map((c) => c.href),
    ]),
  ]
  for (const href of hrefs.filter((x) => x.startsWith('/'))) {
    if (!fs.existsSync(fileFor(href))) fail(p, `no page for ${href}`)
    if (!html.includes(`href="${href}"`)) fail(p, `link to ${href} missing from the built page`)
  }
  for (const href of hrefs.filter((x) => /^(tel:|https?:)/.test(x))) if (!html.includes(`href="${href}"`)) fail(p, `${href} missing`)
  if (ctas.some((c) => c.action === 'book') && !/<button[^>]*type="button"/.test(raw)) fail(p, 'booking buttons missing')

  const images = collect(h, (o) => typeof o.src === 'string' && typeof o.alt === 'string')
  if (new Set(images.map((i) => i.src)).size !== images.length) fail(p, 'the same photo is used twice on the page')
  for (const { src, alt } of images) {
    if (!fs.existsSync(path.join(DIST, src))) fail(p, `image missing: ${src}`)
    if (!alt?.trim()) fail(p, `no alt text: ${src}`)
    if (!html.includes(`src="${src}"`)) fail(p, `image not on the page: ${src}`)
  }
  for (const img of [...raw.matchAll(/<img\b[^>]*>/g)].map((m) => attrs(m[0]))) {
    if (!img.width || !img.height) fail(p, `<img> without width/height: ${img.src}`)
  }
  const accordions = (raw.match(/<button[^>]*aria-expanded="(true|false)"[^>]*aria-controls="[^"]+"/g) ?? []).length
  if (accordions < h.process.steps.length + h.faqs.items.length) fail(p, `${accordions} accordion buttons with aria-controls`)
  if (!raw.includes('aria-controls="success-stories-track"')) fail(p, 'carousel controls missing for success-stories-track')
  for (const r of h.reviews.items) if ((r.quote || r.author) && !r.consent) fail(p, 'review text set without consent')

  const ld = parseHead(raw).ld[0] ?? '{}'
  const graph = JSON.parse(ld)['@graph'] ?? []
  const types = graph.flatMap((n) => [n['@type']].flat())
  for (const type of ['CollectionPage', 'BreadcrumbList', 'MedicalClinic', ...(h.doctors.cards.length ? ['Physician'] : [])]) {
    if (!types.includes(type)) fail(p, `JSON-LD has no ${type}`)
  }
  const list = graph.find((n) => n['@type'] === 'CollectionPage')?.mainEntity?.itemListElement ?? []
  const cardUrls = h.treatments.groups.flatMap((g) => g.items.map((i) => SITE_URL + i.href))
  if (JSON.stringify(list.map((e) => e.url)) !== JSON.stringify(cardUrls)) fail(p, 'ItemList schema does not match the treatment cards')
  if (h.faqsApproved !== types.includes('FAQPage')) fail(p, h.faqsApproved ? 'JSON-LD has no FAQPage' : 'FAQPage schema before the FAQs are approved')
  const physiciansLd = graph.filter((n) => n['@type'] === 'Physician')
  if (physiciansLd.some((n) => n.hasCredential || n.memberOf)) fail(p, 'Physician schema lists credentials the page does not show as verified')
  if (/AggregateRating|"Review"/.test(ld)) fail(p, 'rating or review schema before the reviews are verified')

  const linked = children.filter((c) => html.includes(`href="${c}"`)).length
  const crossLinks = h.treatments.groups.flatMap((g) => g.items).filter((i) => !i.href.startsWith(p)).length
  hubPending.push(`${p}: ${linked} of ${children.length} child pages linked${crossLinks ? ` (+ ${crossLinks} cross-links)` : ''}`)
  for (const item of h.pending) hubPending.push(`${p}: ${item}`)
}

// A character the prerender split mid-way (U+FFFD in the HTML).
for (const r of pages.filter((x) => x.type !== 'redirect')) {
  if (fs.existsSync(fileFor(r.path)) && fs.readFileSync(fileFor(r.path), 'utf8').includes('�')) fail(r.path, 'broken character (U+FFFD) in the built HTML')
}

const pendingLegal =legalNav.filter(({ href }) => !fs.existsSync(fileFor(href))).map(({ href }) => href)

// Doctor profiles (src/data/doctors.json → DoctorProfilePage): the route and SEO are the record's; the sections are in
// the shared order, left out only when they have no approved content; every approved string is on the page and no
// pending one is; the schema is ProfilePage + Physician + MedicalClinic with exactly the approved credentials and
// memberships, and no rating, review or statistics markup. Every doctor route has a published record.
const doctorPending = []
for (const r of pages.filter((x) => x.type === 'doctor')) if (!doctorByPath.has(r.path)) fail(r.path, 'doctor route without a published doctors.json record')
for (const d of publishedDoctors) {
  const p = d.path
  const record = pages.find((r) => r.path === p)
  if (record?.type !== 'doctor') {
    fail(p, 'published doctor without a doctor route (run npm run gen)')
    continue
  }
  for (const [key, value] of [['title', d.seo.title], ['description', d.seo.description], ['h1', d.seo.h1], ['robots', d.seo.robots], ['name', d.displayName]]) {
    if (record[key] !== value) fail(p, `pages.json ${key} "${record[key]}" is not the doctors.json record's "${value}"`)
  }
  if (record.og.image !== d.seo.ogImage) fail(p, `og image ${record.og.image} is not the record's ${d.seo.ogImage}`)
  if (JSON.stringify(record.breadcrumbs.map((c) => c.path)) !== JSON.stringify(['/', '/#our-doctors', p])) fail(p, 'breadcrumb is not Home › Our Doctors › doctor')

  const raw = fs.existsSync(fileFor(p)) ? fs.readFileSync(fileFor(p), 'utf8') : ''
  const html = decode(raw)
  const mainRaw = raw.slice(Math.max(0, raw.indexOf('<main')), raw.indexOf('<footer') > 0 ? raw.indexOf('<footer') : undefined)
  const main = bodyText(mainRaw)

  // Section order: the shared order, minus the sections with nothing approved to show.
  const expected = doctorSections(d)
  const at = expected.map((id) => raw.indexOf(`id="${id}"`))
  expected.forEach((id, i) => at[i] < 0 && fail(p, `section id="${id}" missing`))
  if (at.some((x, i) => i > 0 && x < at[i - 1])) fail(p, `sections out of order: expected ${expected.join(' → ')}`)
  for (const id of DOCTOR_SECTIONS.filter((x) => !expected.includes(x))) if (raw.includes(`id="${id}"`)) fail(p, `section id="${id}" shown with nothing approved in it`)
  for (const id of expected.filter((x) => x !== 'instagram')) if (!raw.includes(`aria-labelledby="${id}-heading"`)) fail(p, `section ${id} has no aria-labelledby heading`)

  // Approved content is visible.
  const shown = [
    d.displayName,
    d.hero.eyebrow,
    d.role,
    d.hero.intro,
    credentialLine(d),
    ...(d.philosophy ? [d.philosophy.eyebrow, d.philosophy.heading, ...d.philosophy.paragraphs] : []),
    ...d.expertise.flatMap((x) => [x.title, x.description]),
    ...approved(d.qualifications).flatMap((q) => [q.title, q.institution]),
    ...approved(d.recognition).flatMap((r) => [r.title, r.organisation]),
    ...approved(d.metrics).map((m) => m.label),
    d.process.eyebrow,
    d.process.heading,
    d.process.intro,
    ...d.process.steps.flatMap((x) => [x.title, x.description]),
    publicQuote(d),
    d.ctas.profileLabel,
    d.ctas.contactLabel,
    d.ctas.bookingEyebrow,
    d.ctas.bookingHeading,
  ].filter(Boolean)
  for (const str of shown) if (!main.includes(str)) fail(p, `not on the page: "${str.length > 60 ? str.slice(0, 60) + '…' : str}"`)

  // Pending content is not.
  const hidden = [
    ...d.qualifications.filter((q) => q.approval !== 'approved').flatMap((q) => [q.title, q.institution]),
    ...d.recognition.filter((r) => r.approval !== 'approved').map((r) => r.organisation),
    ...d.metrics.filter((m) => m.approval !== 'approved').map((m) => m.label),
    d.quote.approval !== 'approved' ? d.quote.text : null,
  ].filter(Boolean)
  for (const str of hidden) if (main.includes(str)) fail(p, `pending item on the page: "${str}"`)
  const banned = main.match(BANNED)
  if (banned) fail(p, `"${banned[0]}" on the page (content rules)`)
  if (/\+1 800|lorem ipsum/i.test(main)) fail(p, 'theme-demo contact details or filler text on the page')

  // Links: breadcrumb, expertise, contact, booking hand-offs.
  const links = ['/', '/#our-doctors', d.ctas.contactHref, ...d.expertise.flatMap((x) => (x.href ? [x.href] : []))]
  for (const href of links) {
    if (!html.includes(`href="${href}"`)) fail(p, `link to ${href} missing from the built page`)
    if (href.startsWith('/') && !href.includes('#') && !fs.existsSync(fileFor(href))) fail(p, `no page for ${href}`)
  }
  for (const href of ['tel:+919964060483', 'https://wa.me/919187401600']) if (!html.includes(`href="${href}"`)) fail(p, `${href} missing`)
  if (!raw.includes('Request My Consultation')) fail(p, 'booking form missing')

  // Images: the approved portrait (or the initials), and width/height/alt on every image in the content.
  const portrait = portraitFor(d)
  if (portrait && !html.includes(`src="${portrait.src}"`)) fail(p, `portrait not on the page: ${portrait.src}`)
  if (portrait && !fs.existsSync(path.join(DIST, portrait.src))) fail(p, `portrait file missing: ${portrait.src}`)
  if (!portrait && d.hero.portrait.src && html.includes(`src="${d.hero.portrait.src}"`)) fail(p, 'unapproved portrait on the page')
  for (const img of [...mainRaw.matchAll(/<img\b[^>]*>/g)].map((m) => attrs(m[0]))) {
    if (!img.width || !img.height) fail(p, `<img> without width/height: ${img.src}`)
    if (img.alt === undefined) fail(p, `<img> without alt: ${img.src}`)
  }

  // Schema from the same record.
  const ld = parseHead(raw).ld[0] ?? '{}'
  const graph = JSON.parse(ld)['@graph'] ?? []
  const types = graph.flatMap((n) => [n['@type']].flat())
  for (const t of ['ProfilePage', 'Physician', 'MedicalClinic', 'BreadcrumbList']) if (!types.includes(t)) fail(p, `JSON-LD has no ${t}`)
  const physician = graph.find((n) => n['@type'] === 'Physician')
  if (physician) {
    if (physician.name !== d.displayName) fail(p, `Physician name "${physician.name}" ≠ "${d.displayName}"`)
    if (physician.jobTitle !== d.role) fail(p, 'Physician jobTitle is not the visible role')
    const creds = (physician.hasCredential ?? []).map((c) => c.name)
    if (JSON.stringify(creds) !== JSON.stringify(approved(d.qualifications).map((q) => q.title))) fail(p, `Physician credentials ${creds.join(', ')} are not the approved list`)
    const orgs = (physician.memberOf ?? []).map((o) => o.name)
    if (JSON.stringify(orgs) !== JSON.stringify(approved(d.recognition).map((r) => r.organisation))) fail(p, `Physician memberOf ${orgs.join(', ')} is not the approved list`)
    const sameAs = physician.sameAs ?? []
    if (JSON.stringify(sameAs) !== JSON.stringify(publicSocialLinks(d).map((x) => x.href))) fail(p, 'Physician sameAs is not the approved social links')
    if (Boolean(physician.image) !== Boolean(portrait)) fail(p, 'Physician image does not match the approved portrait')
  }
  const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList')?.itemListElement?.map((i) => i.name) ?? []
  if (JSON.stringify(crumbs) !== JSON.stringify(['Home', 'Our Doctors', d.displayName])) fail(p, `BreadcrumbList is ${crumbs.join(' › ')}`)
  if (/AggregateRating|"Review"|"InteractionCounter"/.test(ld)) fail(p, 'rating, review or statistics schema on a doctor profile')

  for (const item of pendingItems(d)) doctorPending.push(`${p}: ${item}`)
}

// While the Instagram switch is off, no built page may show the strip.
if (!instagram.enabled) {
  for (const { path: p } of pages) {
    const f = fileFor(p)
    if (fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('id="instagram"')) fail(p, 'Instagram strip shown while instagram.enabled is false')
  }
}

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
console.log('home doctor spotlight: pending sign-off:')
for (const item of [...doctorSpotlight.pending, ...(doctorSpotlight.experience.approved ? [] : [`Experience line "${doctorSpotlight.experience.text}" (hidden)`])]) console.log(`  - ${item}`)
console.log(`home technology links: ${technologyLinks.length} checked`)
console.log(`reviews: ${REVIEW_POOL.length} in the pool; ${reviewPages.matched} pages show a review about their own treatment, ${reviewPages.general.length} show general reviews only`)
console.log(`home testimonials: ${testimonials.reviews.length} cards checked; pending sign-off:`)
for (const item of testimonialsPending) console.log(`  - ${item}`)
console.log(`journal: ${publicRecords.length} public items, ${pageRecords.length} article page(s), home row ${journalCardCount} cards; not public yet:`)
for (const item of editorialPending) console.log(`  - ${item}`)
console.log(`about: ${aboutOrder.length} sections in order, ${aboutLinks.length} links and ${aboutImages.length} images checked; pending sign-off:`)
for (const item of aboutPending) console.log(`  - ${item}`)
console.log(`contact: ${contactOrder.length} sections in order, map embed and contact links checked; pending sign-off:`)
for (const item of contactPending) console.log(`  - ${item}`)
console.log(`services: ${services.length} of ${serviceRoutes} service pages built from service-page.md; pending sign-off:`)
console.log(`  - every service page: the`)
console.log(`    "Board-Certified Team" heading; ${serviceImages.size} old-site placeholder photos, the reception image and Dr Sandeep's portrait`)
const byKind = Map.groupBy(servicePending, ([kind]) => kind)
for (const [kind, items] of byKind) {
  console.log(`  - ${kind} (${items.length} page${items.length === 1 ? '' : 's'}):`)
  for (const [, item] of items.slice(0, 6)) console.log(`      ${item.length > 150 ? item.slice(0, 150) + '…' : item}`)
  if (items.length > 6) console.log(`      … and ${items.length - 6} more`)
}
console.log(`technology: ${[...TECH_LIVE].length} of ${technologyPages.length} pages built from technology-international-patient.md; SEO checked for all; pending sign-off:`)
for (const item of techPending) console.log(`  - ${item.length > 200 ? item.slice(0, 200) + '…' : item}`)
console.log(`speciality hubs: ${specialityHubs.length} built; pending sign-off:`)
for (const item of hubPending) console.log(`  - ${item}`)
console.log(`doctor profiles: ${publishedDoctors.length} built from doctors.json; pending sign-off (hidden until approved):`)
for (const item of doctorPending) console.log(`  - ${item.length > 200 ? item.slice(0, 200) + '…' : item}`)
console.log(`menu links: ${navLinks.length} checked${pendingLegal.length ? `; legal pages not built yet: ${pendingLegal.join(', ')}` : ''}`)
console.log(`duplicate titles: ${dups('title').length}, duplicate descriptions: ${dups('description').length}`)
console.log(`pages with todo items: ${pages.filter((p) => p.todo?.length).length} (see src/data/seo-report.csv)`)

if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S):`)
  for (const f of failures.slice(0, 50)) console.error('  ' + f)
  process.exit(1)
}
console.log('\nOK: all SEO checks passed')
