#!/usr/bin/env node
// Builds src/data/pages.json (one SEO record per route) from the old-site capture in ../scraped/, plus
// src/data/routes.json (the app's copy), src/data/redirects.json (301s and 410s) and src/data/seo-report.csv.
// sitemap.xml, robots.txt, llms.txt and .htaccess are written into dist/ after the build (scripts/postbuild.mjs);
// the share cards each record points at are drawn by scripts/build-og-cards.mjs.
//
//   node scripts/generate-pages.mjs                 # offline; uses og images already in public/og/
//   node scripts/generate-pages.mjs --download-og   # also fetches missing og images from the live site
//
// Precedence (agreed): title = SEO CSV > live <title>; description = SEO CSV > live text if real > draft.
// Doctor profiles are the exception: their route, title, description, H1, robots and og image all come from the
// doctor's record in src/data/doctors.json (the same record the page renders); an SEO CSV row that disagrees is
// flagged as a todo.
// Robots are index,follow and canonicals are self-referencing; the live site's noindex/YouTube canonicals
// are not carried over. Theme-demo leftovers are not rebuilt: a few with a clear new home get a 301, the rest 410 Gone.

import fs from 'node:fs'
import path from 'node:path'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, ogTypeFor } from '../src/data/site.ts'
import { hubs } from '../src/data/hubs.ts'
import { specialityByPath } from '../src/data/specialities/index.ts'
import { hero as homeHero } from '../src/data/home.ts'
import { publishedDoctors, doctorByPath, portraitFor } from '../src/data/doctors.ts'
import { pageRecords, buildDate } from '../src/data/editorial.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const SCRAPED = path.resolve(ROOT, '../scraped')
const PUBLIC = path.join(ROOT, 'public')
const OG_DIR = path.join(PUBLIC, 'og')
const DATA_DIR = path.join(ROOT, 'src/data')
// NeoSculpt6's own service photos: a page that has one shares its first photo (public/og/new/, made by
// scripts/import-photos.mjs) instead of the old site's og:image.
const SUPPLIED_OG = new Map(
  JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'services/new-photos.json'), 'utf8'))
    .filter((p) => p.n === 1 && p.alt)
    .map((p) => [p.page, p.alt]),
)
// Technology pages the old site gave no og:image share the photo of their treatment's service page.
const TECH_OG_FROM = {
  '/technology/ai-integrated-donor-assessment/': '/hair-transplant-restoration/dhi-hair-transplant-in-bangalore/',
  '/technology/vaser-liposuction-technology/': '/cosmetic-surgery/liposuction-surgery-in-bangalore/',
  '/technology/reaction-viora-rf-tightening/': '/anti-aging-injectables/rf-skin-tightening-treatment-in-bangalore/',
  '/technology/excimer-laser-targeted-phototherapy/': '/cosmetic-surgery/phototherapy-for-vitiligo-in-bangalore/',
  '/technology/body-contouring-cryolipolysis-platforms/': '/slimming-body-contouring/cryolipolysis-treatment-in-bangalore/',
}
const DOWNLOAD = process.argv.includes('--download-og')

const LOGO_URL = 'https://neosculpt6.com/wp-content/uploads/2024/07/cropped-Neo-Sculpt-6_logo_2.png'
const FAVICON_URL = 'https://neosculpt6.com/wp-content/uploads/2024/07/cropped-Neo-Sculpt-6_logo_2-150x150.png'

// Home page SEO is fixed by content/home-page/homepage.md ("Page SEO (unchanged)").
// The † marks a claim awaiting Dr Sandeep's sign-off; it is not part of the meta text.
const HOME = {
  title: 'NeoSculpt6 | Doctor-Led Aesthetic Clinic in Bangalore',
  description:
    'Hair transplant, cosmetic surgery, body contouring, lasers and injectables in Whitefield, Bangalore, led by Dr Sandeep Mahapatra, MD (Gold Medalist).',
  h1: 'Doctor-Led Aesthetic Clinic in Whitefield, Bangalore',
  todo: ['description: "Gold Medalist" claim needs sign-off (homepage.md †)'],
}

// About page SEO is fixed by content/about-us/about-us.md ("Page SEO"). The live page's description is theme-demo
// copy, so the doc's replacement is used. The live page was noindex; the new one is index, follow.
const ABOUT = {
  name: 'About Us',
  title: 'About NeoSculpt6 | Specialist-Led Care in Bangalore',
  description:
    'Hair restoration, skin and laser, anti-ageing, cosmetic surgery, body contouring and intimate care under one doctor-led clinic in Whitefield, Bangalore.',
  h1: 'Care Planned Around You',
  ogImage: '/og/about-dr-sandeep-mahapatra.jpeg',
  ogImageAlt: 'Dr Sandeep Mahapatra, founder of NeoSculpt6, in a clinic consultation room',
}

// Contact page SEO: the fallback title and description in content/contact/prompts/contact-us-page.md ("SEO and
// metadata"), used until the content owner approves final ones. The live page's title was "Contact Us - Neo Sculpt 6".
const CONTACT = {
  name: 'Contact Us',
  title: 'Contact NeoSculpt6 | Doctor-Led Aesthetic Clinic in Whitefield, Bangalore',
  description:
    'Contact NeoSculpt6 in Whitefield, Bangalore to book a doctor-led consultation for hair, skin, laser, anti-ageing, body contouring and cosmetic surgery care.',
  todo: ['title and description: brief fallback, pending content-owner approval (contact-us-page.md)'],
}

// Journal hub SEO is fixed by content/journal/prompts/journal-blogs-media-coverage-page.md ("SEO and schema").
const JOURNAL = {
  path: '/journal/',
  name: 'Journal',
  title: 'Journal, Blogs & Media Coverage | NeoSculpt6',
  description:
    'Doctor-led insights, patient education, clinic blogs and verified media coverage from NeoSculpt6 in Whitefield, Bangalore.',
  h1: 'Insights From NeoSculpt6',
}

// Privacy Policy: a new page (no old-site source, no SEO CSV row). Copy lives in src/data/privacy.ts.
const PRIVACY = {
  path: '/privacy-policy/',
  name: 'Privacy Policy',
  title: 'Privacy Policy | NeoSculpt6',
  description:
    'How NeoSculpt6 in Whitefield, Bangalore collects, uses and protects your personal and medical information, and how to reach our Grievance Officer.',
  h1: 'Privacy Policy',
}

// Thank-you page: where the booking form lands after a request is sent (src/templates/ThankYouTemplate.tsx). Not for
// search: noindex and left out of the sitemap. A fixed URL, so ad and analytics tools can count it as a conversion.
const THANK_YOU = {
  path: '/thank-you/',
  name: 'Thank You',
  title: 'Thank You | NeoSculpt6',
  description: 'Your consultation request has reached NeoSculpt6 in Whitefield, Bangalore. We will call you to confirm your time.',
  h1: 'Thank You',
}

// Free AI Hair Assessment: a new page (src/templates/AssessmentTemplate.tsx), rebuilt from the sister site's
// neofollicletransplant.com/hair-assessment/ (same slug and copy, NeoSculpt6's own form and AI backend). No SEO CSV row,
// so the title and description are drafts. The mobile bar's "AI Analysis" opens it (clinic.aiAnalysisHref).
const HAIR_ASSESSMENT = {
  path: '/hair-assessment/',
  name: 'Hair Assessment',
  title: 'Free AI Hair Assessment | NeoSculpt6',
  description:
    'Answer a few questions and upload photos of your scalp for a free AI hair loss assessment, reviewed by the doctor-led NeoSculpt6 team in Whitefield, Bangalore.',
  h1: 'Free AI Hair Assessment',
}

// Terms of Use: a new page, same pattern. Copy lives in src/data/terms.ts. The slug matches the sister sites; the
// footer's old /terms/ link and the old site's "Terms and Conditions" label redirect to it.
const TERMS = {
  path: '/terms-of-use/',
  name: 'Terms of Use',
  title: 'Terms of Use | NeoSculpt6',
  description:
    'The terms for using the NeoSculpt6 website in Whitefield, Bangalore: medical information, booking requests, results, prices and your rights.',
  h1: 'Terms of Use',
  redirectFrom: ['/terms/', '/terms-and-conditions/'],
}

// Technology pages and the two pages that go with them (/technology/, /international-patients/): SEO fixed by
// content/technology/technology-international-patient.md, read from its parse (scripts/parse-technology-pages.mjs, run
// first by `npm run gen`). The nine technology pages have no SEO CSV rows, so the doc's title tag, description, H1 and
// breadcrumb name replace the live ones; the two hubs copy the same values into src/data/hubs.ts (`source`).
const TECH_JSON = path.join(DATA_DIR, 'technology/parsed.json')
const TECH_SEO = new Map(fs.existsSync(TECH_JSON) ? JSON.parse(fs.readFileSync(TECH_JSON, 'utf8')).map((r) => [r.path, r.seo]) : [])

const REDIRECTS = {
  '/service/': '/slimming-body-contouring/post-pregnancy-belly-correction-in-bangalore/',
  // Theme-demo leftovers with a clear new home. Every other theme-demo URL answers 410 Gone (see redirects.json).
  '/make-appointment/': '/contact-us/',
  '/blog-standard/': '/journal/',
  '/blog-full-width/': '/journal/',
}

// The photo a page's share card shows, for pages the old site gave no og:image. Speciality hubs use their hero photo.
const HOME_PHOTO = { src: homeHero.image, alt: 'A NeoSculpt6 doctor treating a patient in the clinic' }
const LEGACY_DEFAULT = '/og/default.png' // the old square logo: a page "with" it has no photo of its own


// ---------------------------------------------------------------------------------------------------------

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘' }
const decode = (s = '') =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => entities[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim()

const urlPath = (url) => new URL(url).pathname
const fileSlug = (p) => p.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home'
const hubFor = (p) => hubs.find((h) => h.type === 'hub' && p !== h.path && p.startsWith(h.path))

// The live site reuses the phone number, the brand name or the old Medicross demo copy as descriptions.
function isRealDescription(d) {
  if (!d) return false
  if (/^\+?[\d\s]+$/.test(d)) return false
  if (d.toUpperCase() === 'NEOSCULPT6') return false
  if (/Medicenter|Toronto|Medicare|Quisque|Collaboratively|At rerum|Main Hospitals/i.test(d)) return false
  return true
}

// "Lip Fillers in Bangalore - Neo Sculpt 6" -> "Lip Fillers"
function shortName(title) {
  return title
    .replace(/\s*[|\-–]\s*Neo ?Sculpt ?6\s*$/i, '')
    .replace(/,?\s*India$/i, '')
    .replace(/\s+(in )?Bangalore$/i, '')
    .replace(/^(Top|Best|Dermatologist-Led)\s+/i, '')
    .replace(/\s+Clinic$/i, '')
    .trim()
}

// Descriptions for service pages without an SEO sheet row, in the sheet's own pattern; the shorter form keeps long
// treatment names within 160 characters.
const serviceDescription = (name) => {
  const long = `NeoSculpt6 offers ${name} in Bangalore with doctor-led planning. Book a consultation to discuss your plan, cost & recovery.`
  return long.length <= 160 ? long : `NeoSculpt6 offers ${name} in Bangalore. Book a consultation to discuss your plan, cost & recovery.`
}
// Titles for service pages without an SEO sheet row, in the sheet's pattern ("<Treatment> in Bangalore | NeoSculpt6"),
// shortened the way the sheet shortens long names, so they stay within 60 characters.
const serviceTitle = (name) =>
  [`${name} in Bangalore | NeoSculpt6`, `${name} Bangalore | NeoSculpt6`, `${name} | NeoSculpt6`].find((t) => t.length <= 60) ?? `${name} | NeoSculpt6`
const technologyDescription = (name) =>
  `${name} at NeoSculpt6, Whitefield, Bangalore, supporting doctor-led assessment and treatment planning. Book a consultation.`

function pageType(row, p) {
  // The old /about-us/ was a theme-demo page; it is rebuilt from about-us.md.
  if (p === '/about-us/') return 'about'
  if (row.likely_theme_demo) return 'legacy-demo'
  if (p === '/') return 'home'
  if (p === '/contact-us/') return 'contact'
  if (doctorByPath.has(p)) return 'doctor'
  if (p.startsWith('/technology/')) return 'technology'
  return 'service'
}

// og images ------------------------------------------------------------------------------------------------

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

async function localOgImage(p, remote, todo) {
  if (!remote) {
    todo.push('og:image: default (no image on old page)')
    return DEFAULT_OG_IMAGE
  }
  const ext = (path.extname(new URL(remote).pathname) || '.jpg').toLowerCase()
  const file = `${fileSlug(p)}${ext}`
  const dest = path.join(OG_DIR, file)
  if (!fs.existsSync(dest) && DOWNLOAD) {
    try {
      await download(remote, dest)
    } catch (e) {
      console.warn(`  og download failed: ${e.message}`)
    }
  }
  if (fs.existsSync(dest)) return `/og/${file}`
  todo.push(`og:image: default (run gen:og to fetch ${remote})`)
  return DEFAULT_OG_IMAGE
}

// records --------------------------------------------------------------------------------------------------

// Every page shares its own 1200 × 630 card (scripts/build-og-cards.mjs); `ogImage` is the photo the card is drawn
// from (and the page's primary image in schema.org), or a default when the page has no photo.
function record({ p, type, title, description, h1, robots = 'index, follow', ogImage, ogImageAlt, sources, todo, extra = {} }) {
  const card = `/og/cards/${fileSlug(p)}.jpg`
  const photo = ogImage === LEGACY_DEFAULT || ogImage === DEFAULT_OG_IMAGE ? null : ogImage
  const hub = hubFor(p)
  const name = extra.name ?? shortName(title)
  const breadcrumbs = [{ name: 'Home', path: '/' }]
  if (hub) breadcrumbs.push({ name: hub.name, path: hub.path })
  // Doctor profiles: Home › Our Doctors (the home page's doctors section) › doctor.
  if (type === 'doctor') breadcrumbs.push({ name: 'Our Doctors', path: '/#our-doctors' })
  // Journal articles: Home › Journal › article.
  if (type === 'article') breadcrumbs.push({ name: JOURNAL.name, path: JOURNAL.path })
  if (p !== '/') breadcrumbs.push({ name, path: p })
  return {
    path: p,
    type,
    name,
    section: hub?.path ?? null,
    title,
    description,
    h1,
    robots,
    canonical: SITE_URL + p,
    og: {
      type: ogTypeFor(type),
      title,
      description,
      url: SITE_URL + p,
      image: card,
      imageAlt: photo && ogImageAlt ? ogImageAlt : title,
      siteName: SITE_NAME,
      photo,
    },
    twitter: { card: 'summary_large_image', title, description, image: card },
    breadcrumbs,
    sources,
    todo,
    ...extra,
  }
}

function oldSiteOf(row, data) {
  return {
    url: row.url,
    status: row.http_status,
    title: decode(data.meta?.title ?? ''),
    description: decode(data.meta?.description ?? ''),
    dataJson: `scraped/${row.data_json}`,
    contentMd: row.content_md ? `scraped/${row.content_md}` : null,
  }
}

// A doctor profile's record, all from its doctors.json entry. Content still awaiting sign-off is listed as todo.
function doctorRecord(doctor, todo, { lastmod, oldSite }) {
  if (doctor.contentReview.medicalReviewStatus !== 'approved') todo.push('doctor: profile copy awaiting medical review (doctors.json contentReview)')
  if (!portraitFor(doctor)) todo.push('doctor: portrait not approved, initials shown')
  if ([DEFAULT_OG_IMAGE, LEGACY_DEFAULT].includes(doctor.seo.ogImage)) todo.push('og:image: share card has no photo (no approved og image in doctors.json)')
  return record({
    p: doctor.path,
    type: 'doctor',
    title: doctor.seo.title,
    description: doctor.seo.description,
    h1: doctor.seo.h1,
    robots: doctor.seo.robots,
    ogImage: doctor.seo.ogImage,
    ogImageAlt: doctor.seo.ogImage === doctor.hero.portrait.src ? doctor.hero.portrait.alt : undefined,
    sources: { title: 'doctor-json', description: 'doctor-json' },
    todo,
    extra: { name: doctor.displayName, category: 'Doctors', video: null, lastmod, oldSite },
  })
}

async function main() {
  // The scrape lives outside this repo (769 MB), so CI builds (Vercel) don't have it.
  // There, use the committed src/data/*.json and public/ files instead of regenerating.
  if (!fs.existsSync(path.join(SCRAPED, 'manifest.json'))) {
    console.log(`gen: ${SCRAPED} not found, using committed src/data/pages.json and routes.json`)
    return
  }

  fs.mkdirSync(OG_DIR, { recursive: true })
  if (DOWNLOAD) {
    for (const [url, dest] of [[LOGO_URL, path.join(PUBLIC, LEGACY_DEFAULT)], [FAVICON_URL, path.join(PUBLIC, 'favicon.png')]]) {
      if (!fs.existsSync(dest)) await download(url, dest).catch((e) => console.warn(`  ${e.message}`))
    }
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(SCRAPED, 'manifest.json'), 'utf8'))
  const sitemapLastmod = Object.fromEntries(
    JSON.parse(fs.readFileSync(path.join(SCRAPED, 'sitemap_pages.json'), 'utf8')).map((r) => [r.url_path, r.sitemap_lastmod]),
  )

  const pages = []
  const redirects = []

  for (const row of manifest) {
    const p = urlPath(row.url)
    const data = JSON.parse(fs.readFileSync(path.join(SCRAPED, row.data_json), 'utf8'))
    const meta = data.meta ?? {}
    const type = pageType(row, p)
    const live404 = row.http_status === 404
    const todo = []
    const sources = {}
    const techSeo = TECH_SEO.get(p)

    if (type === 'legacy-demo' && !REDIRECTS[p]) {
      pages.push({ path: p, type: 'gone', title: decode(meta.title), status: 410 })
      continue
    }

    if (REDIRECTS[p]) {
      redirects.push({ from: p, to: REDIRECTS[p], status: 301 })
      pages.push({
        path: p,
        type: 'redirect',
        redirectTo: REDIRECTS[p],
        title: decode(meta.title),
        robots: 'noindex, follow',
        canonical: SITE_URL + REDIRECTS[p],
      })
      continue
    }

    // title
    const doctor = type === 'doctor' ? doctorByPath.get(p) : null
    if (doctor) {
      const csvTitle = decode(row.planned_meta_title ?? '')
      const csvDesc = decode(row.planned_meta_description ?? '')
      if (csvTitle && csvTitle !== doctor.seo.title) todo.push(`title: SEO CSV has "${csvTitle}"; doctors.json wins`)
      if (csvDesc && csvDesc !== doctor.seo.description) todo.push(`description: SEO CSV has "${csvDesc}"; doctors.json wins`)
      pages.push(doctorRecord(doctor, todo, { lastmod: (data.meta?.og ?? {})['og:updated_time'] || sitemapLastmod[p] || null, oldSite: oldSiteOf(row, data) }))
      continue
    }

    let title
    if (type === 'home') [title, sources.title] = [HOME.title, 'homepage.md']
    else if (type === 'about') [title, sources.title] = [ABOUT.title, 'about-us.md']
    else if (type === 'contact') [title, sources.title] = [CONTACT.title, 'contact-us-page.md']
    else if (techSeo) [title, sources.title] = [techSeo.title, 'technology-doc']
    else if (row.planned_meta_title) [title, sources.title] = [decode(row.planned_meta_title), 'seo-csv']
    else if (live404) [title, sources.title] = [`${row.service} in Bangalore | NeoSculpt6`, 'draft']
    else if (type === 'service') [title, sources.title] = [serviceTitle(shortName(decode(meta.title))), 'draft']
    else [title, sources.title] = [decode(meta.title), 'live']
    if (sources.title === 'draft')
      todo.push(live404 ? 'title: draft (page is 404 on the old site)' : "title: draft in the SEO sheet's pattern (no sheet row), pending sign-off")

    // description
    const liveDesc = decode(meta.description)
    let description
    if (type === 'home') [description, sources.description] = [HOME.description, 'homepage.md']
    else if (type === 'about') [description, sources.description] = [ABOUT.description, 'about-us.md']
    else if (type === 'contact') [description, sources.description] = [CONTACT.description, 'contact-us-page.md']
    else if (techSeo) [description, sources.description] = [techSeo.description, 'technology-doc']
    else if (row.planned_meta_description) [description, sources.description] = [decode(row.planned_meta_description), 'seo-csv']
    else if (isRealDescription(liveDesc)) [description, sources.description] = [liveDesc, 'live']
    else if (type === 'technology') [description, sources.description] = [technologyDescription(row.service), 'generated']
    else [description, sources.description] = [serviceDescription(shortName(title)), 'generated']
    if (sources.description === 'generated') todo.push('description: generated draft')

    // h1 (rendered now; real content comes later)
    let h1 = type === 'home' ? HOME.h1 : type === 'about' ? ABOUT.h1 : techSeo ? techSeo.h1 : decode(data.h1 || row.h1)
    if (!h1) {
      h1 = type === 'contact' ? 'Contact Us' : live404 ? row.service : shortName(title)
      todo.push('h1: missing on old page, derived')
    }
    if (type === 'home') todo.push(...HOME.todo)
    if (type === 'contact') todo.push(...CONTACT.todo)

    const og = meta.og ?? {}
    const ogFrom = type === 'service' ? p : type === 'technology' ? TECH_OG_FROM[p] : null
    const supplied = ogFrom && SUPPLIED_OG.has(ogFrom) && fs.existsSync(path.join(OG_DIR, 'new', `${fileSlug(ogFrom)}.jpg`)) ? ogFrom : null
    const ogImage =
      type === 'home'
        ? HOME_PHOTO.src
        : type === 'about'
          ? ABOUT.ogImage
          : supplied
            ? `/og/new/${fileSlug(supplied)}.jpg`
            : await localOgImage(p, og['og:image'], todo)

    pages.push(
      record({
        p,
        type,
        title,
        description,
        h1,
        ogImage,
        ogImageAlt:
          type === 'home' ? HOME_PHOTO.alt : type === 'about' ? ABOUT.ogImageAlt : supplied ? SUPPLIED_OG.get(supplied) : decode(og['og:image:alt']),
        sources,
        todo,
        extra: {
          category: row.category,
          ...(type === 'technology' || type === 'service' ? { name: techSeo?.breadcrumb.at(-1) ?? (live404 ? row.service : shortName(title)) } : {}),
          ...(type === 'about' ? { name: ABOUT.name } : {}),
          ...(type === 'contact' ? { name: CONTACT.name } : {}),
          video: row.video_planned || null,
          lastmod: og['og:updated_time'] || sitemapLastmod[p] || null,
          oldSite: oldSiteOf(row, data),
        },
      }),
    )
  }

  for (const hub of hubs) {
    const fromDoc = Boolean(hub.source)
    const heroPhoto = specialityByPath.get(hub.path)?.hero.image
    pages.push(
      record({
        p: hub.path,
        type: hub.type,
        title: hub.title,
        description: hub.description,
        h1: hub.h1,
        robots: hub.robots,
        ogImage: heroPhoto?.src ?? DEFAULT_OG_IMAGE,
        ogImageAlt: heroPhoto?.alt,
        sources: fromDoc ? { title: 'doc', description: 'doc' } : { title: 'draft', description: 'draft' },
        todo: fromDoc
          ? [
              ...(heroPhoto ? [] : ['new page: share card has no photo (no page photo yet)']),
              ...(TECH_SEO.get(hub.path)?.note ? [`title: ${TECH_SEO.get(hub.path).note}`] : []),
            ]
          : [
              'new page: title, description and h1 are drafts (src/data/hubs.ts)',
              ...(hub.robots?.startsWith('noindex') ? ['coming soon: noindex until the page is built'] : []),
            ],
        extra: {
          name: hub.name,
          category: hub.type === 'service' ? (hubFor(hub.path)?.name ?? hub.name) : hub.name,
          video: null,
          lastmod: null,
          oldSite: null,
        },
      }),
    )
  }

  pages.push(
    record({
      p: PRIVACY.path,
      type: 'legal',
      title: PRIVACY.title,
      description: PRIVACY.description,
      h1: PRIVACY.h1,
      ogImage: DEFAULT_OG_IMAGE,
      sources: { title: 'draft', description: 'draft' },
      todo: [
        'new page: draft copy, pending legal review (src/data/privacy.ts)',
        'client to confirm NEOFOLLICLE AND NEOFERTILITY CLINIC LLP runs NeoSculpt6',
        'set the effective date at launch',
      ],
      extra: { name: PRIVACY.name, category: 'Legal', video: null, lastmod: null, oldSite: null },
    }),
  )

  pages.push(
    record({
      p: TERMS.path,
      type: 'legal',
      title: TERMS.title,
      description: TERMS.description,
      h1: TERMS.h1,
      ogImage: DEFAULT_OG_IMAGE,
      sources: { title: 'draft', description: 'draft' },
      todo: [
        'new page: draft copy, pending legal review (src/data/terms.ts)',
        'client to confirm NEOFOLLICLE AND NEOFERTILITY CLINIC LLP runs NeoSculpt6',
        'client to confirm no fees or deposits are taken online',
        'set the effective date at launch',
      ],
      extra: { name: TERMS.name, category: 'Legal', video: null, lastmod: null, oldSite: null },
    }),
  )
  for (const from of TERMS.redirectFrom) redirects.push({ from, to: TERMS.path, status: 301 })

  pages.push(
    record({
      p: THANK_YOU.path,
      type: 'thank-you',
      title: THANK_YOU.title,
      description: THANK_YOU.description,
      h1: THANK_YOU.h1,
      robots: 'noindex, nofollow',
      ogImage: DEFAULT_OG_IMAGE,
      sources: { title: 'draft', description: 'draft' },
      todo: [],
      extra: { name: THANK_YOU.name, category: 'Booking', video: null, lastmod: null, oldSite: null },
    }),
  )

  pages.push(
    record({
      p: HAIR_ASSESSMENT.path,
      type: 'assessment',
      title: HAIR_ASSESSMENT.title,
      description: HAIR_ASSESSMENT.description,
      h1: HAIR_ASSESSMENT.h1,
      ogImage: DEFAULT_OG_IMAGE,
      sources: { title: 'draft', description: 'draft' },
      todo: [
        'new page: title and description are drafts (no SEO CSV row)',
        'questions on hair-loss duration and past treatment are drafts (src/data/assessment.ts)',
        'privacy policy lines for the assessment pending legal review',
      ],
      extra: { name: HAIR_ASSESSMENT.name, category: 'Hair', video: null, lastmod: null, oldSite: null },
    }),
  )

  // Journal hub, and one page per public (or archived) journal or blog article in src/data/editorial.json.
  pages.push(
    record({
      p: JOURNAL.path,
      type: 'journal',
      title: JOURNAL.title,
      description: JOURNAL.description,
      h1: JOURNAL.h1,
      ogImage: DEFAULT_OG_IMAGE,
      sources: { title: 'doc', description: 'doc' },
      todo: ['new page: share card has no photo (no page photo yet)', 'consultation band copy is a draft (editorial.ts journalHub.closing)'],
      extra: { name: JOURNAL.name, category: 'Journal', video: null, lastmod: null, oldSite: null },
    }),
  )
  for (const article of pageRecords) {
    const archived = article.status === 'archived'
    pages.push(
      record({
        p: article.path,
        type: 'article',
        title: article.seo.title,
        description: article.seo.description,
        h1: article.title,
        robots: archived ? 'noindex, follow' : article.seo.robots,
        ogImage: article.featuredImage.src,
        ogImageAlt: article.featuredImage.alt,
        sources: { title: 'editorial-json', description: 'editorial-json' },
        todo: archived ? ['archived article: kept with noindex'] : [],
        extra: { name: article.title, category: 'Journal', video: null, lastmod: article.updatedDate ?? article.date, oldSite: null },
      }),
    )
  }
  console.log(`journal: hub + ${pageRecords.length} article page(s) (build date ${buildDate()})`)

  // Doctor profiles the old site never had (every published record in doctors.json without a captured page).
  const captured = new Set(pages.map((r) => r.path))
  for (const doctor of publishedDoctors) {
    if (!captured.has(doctor.path)) pages.push(doctorRecord(doctor, [], { lastmod: null, oldSite: null }))
  }

  // order: home, hubs, old pages in capture order, then redirects and gone URLs
  const rank = (r) => (r.type === 'home' ? 0 : r.type === 'gone' ? 4 : r.type === 'redirect' ? 3 : r.oldSite === null ? 1 : 2)
  pages.sort((a, b) => rank(a) - rank(b))

  const paths = new Set()
  for (const r of pages) {
    if (paths.has(r.path)) throw new Error(`duplicate path ${r.path}`)
    paths.add(r.path)
  }

  // duplicate title / description flags among indexable pages
  const indexable = pages.filter((r) => r.robots?.startsWith('index'))
  const count = (key) => indexable.reduce((m, r) => m.set(r[key], (m.get(r[key]) ?? 0) + 1), new Map())
  const titleCounts = count('title')
  const descCounts = count('description')
  for (const r of indexable) {
    if (titleCounts.get(r.title) > 1) r.todo.push('title: duplicate')
    if (descCounts.get(r.description) > 1) r.todo.push('description: duplicate')
    // Search results cut titles at about 60 characters and descriptions at about 160.
    if (r.title.length > 60) r.todo.push(`title: ${r.title.length} characters (over 60, may be cut in search results)`)
    if (r.description.length > 160) r.todo.push(`description: ${r.description.length} characters (over 160, may be cut in search results)`)
    if (r.description.length < 70) r.todo.push(`description: ${r.description.length} characters (under 70, thin)`)
  }

  fs.writeFileSync(path.join(DATA_DIR, 'pages.json'), JSON.stringify(pages, null, 2) + '\n')

  // slim runtime copy bundled by the app (see RoutePage in src/data/types.ts). Gone URLs are not built.
  const slim = pages.filter((r) => r.type !== 'gone').map((r) =>
    r.type === 'redirect'
      ? { path: r.path, type: r.type, title: r.title, redirectTo: r.redirectTo }
      : {
          path: r.path,
          type: r.type,
          name: r.name,
          title: r.title,
          description: r.description,
          h1: r.h1,
          robots: r.robots,
          ogImage: r.og.image,
          ...(r.og.imageAlt !== r.title ? { ogImageAlt: r.og.imageAlt } : {}),
          ...(r.og.photo ? { photo: r.og.photo } : {}),
          crumbs: r.breadcrumbs.map((c) => c.path),
          ...(r.lastmod ? { lastmod: r.lastmod } : {}),
        },
  )
  fs.writeFileSync(path.join(DATA_DIR, 'routes.json'), JSON.stringify(slim) + '\n')

  // 301s and 410s, for .htaccess (written by scripts/postbuild.mjs). The meta-refresh pages stay as a fallback.
  const gone = pages.filter((r) => r.type === 'gone').map((r) => r.path)
  fs.writeFileSync(path.join(DATA_DIR, 'redirects.json'), JSON.stringify({ redirects, gone }, null, 2) + '\n')

  // review sheet for SEO sign-off
  const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const header = ['path', 'type', 'robots', 'title', 'title_source', 'title_len', 'description', 'description_source', 'description_len', 'h1', 'old_status', 'todo']
  const rows = pages
    .filter((r) => r.type !== 'redirect' && r.type !== 'gone')
    .map((r) => [r.path, r.type, r.robots, r.title, r.sources.title, r.title.length, r.description, r.sources.description, r.description.length, r.h1, r.oldSite?.status ?? 'new', r.todo.join('; ')])
  fs.writeFileSync(path.join(DATA_DIR, 'seo-report.csv'), [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\n') + '\n')

  // summary
  const by = (f) => pages.reduce((m, r) => ((m[f(r)] = (m[f(r)] ?? 0) + 1), m), {})
  console.log(`pages.json: ${pages.length} records`, by((r) => r.type))
  console.log('title sources', by((r) => r.sources?.title ?? '-'))
  console.log('description sources', by((r) => r.sources?.description ?? '-'))
  console.log(`indexable: ${indexable.length} · redirects: ${redirects.length} · gone (410): ${gone.length} · pages with todo: ${pages.filter((r) => r.todo?.length).length}`)
  const ogMissing = pages.filter((r) => r.todo?.some((t) => t.includes('run gen:og'))).length
  if (ogMissing) console.log(`og:image not downloaded for ${ogMissing} pages: run npm run gen:og`)
}

await main()
