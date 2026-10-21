#!/usr/bin/env node
// Post-build check: every prerendered page carries exactly the SEO in pages.json, and no old URL is lost.
// Run after `npm run build`. Exits 1 on any failure.
import fs from 'node:fs'
import path from 'node:path'
import { primaryNav, findMyTreatment } from '../src/data/nav.ts'
import { footerNav, legalNav } from '../src/data/site.ts'
import { pillars, results, signature, doctors, testimonials, technology, journal } from '../src/data/home.ts'
import { posts, postHref, specialities } from '../src/data/posts.ts'

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
console.log(`menu links: ${navLinks.length} checked${pendingLegal.length ? `; legal pages not built yet: ${pendingLegal.join(', ')}` : ''}`)
console.log(`duplicate titles: ${dups('title').length}, duplicate descriptions: ${dups('description').length}`)
console.log(`pages with todo items: ${pages.filter((p) => p.todo?.length).length} (see src/data/seo-report.csv)`)

if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S):`)
  for (const f of failures.slice(0, 50)) console.error('  ' + f)
  process.exit(1)
}
console.log('\nOK: all SEO checks passed')
