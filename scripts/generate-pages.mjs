#!/usr/bin/env node
// Builds src/data/pages.json (one SEO record per route) from the old-site capture in ../scraped/,
// plus public/sitemap.xml, public/robots.txt, public/_redirects and src/data/seo-report.csv.
//
//   node scripts/generate-pages.mjs                 # offline; uses og images already in public/og/
//   node scripts/generate-pages.mjs --download-og   # also fetches missing og images from the live site
//
// Precedence (agreed): title = SEO CSV > live <title>; description = SEO CSV > live text if real > draft.
// Robots are index,follow and canonicals are self-referencing; the live site's noindex/YouTube canonicals
// are not carried over. Theme-demo leftovers keep their live title but are noindex and kept out of the sitemap.

import fs from 'node:fs'
import path from 'node:path'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../src/data/site.ts'
import { hubs } from '../src/data/hubs.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const SCRAPED = path.resolve(ROOT, '../scraped')
const PUBLIC = path.join(ROOT, 'public')
const OG_DIR = path.join(PUBLIC, 'og')
const DATA_DIR = path.join(ROOT, 'src/data')
const DOWNLOAD = process.argv.includes('--download-og')

const LOGO_URL = 'https://neosculpt6.com/wp-content/uploads/2024/07/cropped-Neo-Sculpt-6_logo_2.png'
const FAVICON_URL = 'https://neosculpt6.com/wp-content/uploads/2024/07/cropped-Neo-Sculpt-6_logo_2-150x150.png'

// Home page SEO is fixed by content/home-page/homepage.md ("Page SEO (unchanged)").
// The † marks a claim awaiting Dr Sandeep's sign-off; it is not part of the meta text.
const HOME = {
  title: 'NeoSculpt6 | Doctor-Led Aesthetic Clinic in Bangalore',
  description:
    'Hair transplant, cosmetic surgery, body contouring, lasers and injectables in Whitefield, Bangalore, led by Dr Sandeep Mahapatra, MD (Gold Medalist).',
  h1: 'Doctor-Led Aesthetic Care in Whitefield, Bangalore',
  todo: ['description: "Gold Medalist" claim needs sign-off (homepage.md †)'],
}

const CONTACT_DESCRIPTION =
  'Visit NeoSculpt6 on Whitefield Main Road, Bangalore 560066, beside BMW Deutsche Motoren. Open Mon–Sat, 7am–7pm. Call +91 99640 60483 to book.'

const REDIRECTS = { '/service/': '/slimming-body-contouring/post-pregnancy-belly-correction-in-bangalore/' }

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

const serviceDescription = (name) =>
  `NeoSculpt6 offers ${name} in Bangalore with doctor-led planning. Book a consultation to discuss your plan, cost & recovery.`
const technologyDescription = (name) =>
  `${name} at NeoSculpt6, Whitefield, Bangalore, supporting doctor-led assessment and treatment planning. Book a consultation.`

function pageType(row, p) {
  if (row.likely_theme_demo) return 'legacy-demo'
  if (p === '/') return 'home'
  if (p === '/contact-us/') return 'contact'
  if (p === '/about-dr-sandeep-mahapatra/') return 'doctor'
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

function record({ p, type, title, description, h1, robots = 'index, follow', ogImage, ogImageAlt, sources, todo, extra = {} }) {
  const hub = hubFor(p)
  const name = extra.name ?? shortName(title)
  const breadcrumbs = [{ name: 'Home', path: '/' }]
  if (hub) breadcrumbs.push({ name: hub.name, path: hub.path })
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
      type: type === 'home' ? 'website' : 'article',
      title,
      description,
      url: SITE_URL + p,
      image: ogImage,
      imageAlt: ogImageAlt || title,
      siteName: SITE_NAME,
    },
    twitter: { card: 'summary_large_image', title, description, image: ogImage },
    breadcrumbs,
    sources,
    todo,
    ...extra,
  }
}

async function main() {
  fs.mkdirSync(OG_DIR, { recursive: true })
  if (DOWNLOAD) {
    for (const [url, dest] of [[LOGO_URL, path.join(PUBLIC, DEFAULT_OG_IMAGE)], [FAVICON_URL, path.join(PUBLIC, 'favicon.png')]]) {
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
    let title
    if (type === 'home') [title, sources.title] = [HOME.title, 'homepage.md']
    else if (row.planned_meta_title) [title, sources.title] = [decode(row.planned_meta_title), 'seo-csv']
    else if (live404) [title, sources.title] = [`${row.service} in Bangalore | NeoSculpt6`, 'draft']
    else [title, sources.title] = [decode(meta.title), 'live']
    if (sources.title === 'draft') todo.push('title: draft (page is 404 on the old site)')

    // description
    const liveDesc = decode(meta.description)
    let description
    if (type === 'home') [description, sources.description] = [HOME.description, 'homepage.md']
    else if (row.planned_meta_description) [description, sources.description] = [decode(row.planned_meta_description), 'seo-csv']
    else if (type === 'legacy-demo') [description, sources.description] = [liveDesc, 'live']
    else if (isRealDescription(liveDesc)) [description, sources.description] = [liveDesc, 'live']
    else if (type === 'contact') [description, sources.description] = [CONTACT_DESCRIPTION, 'generated']
    else if (type === 'technology') [description, sources.description] = [technologyDescription(row.service), 'generated']
    else [description, sources.description] = [serviceDescription(shortName(title)), 'generated']
    if (sources.description === 'generated') todo.push('description: generated draft')

    // h1 (rendered now; real content comes later)
    let h1 = type === 'home' ? HOME.h1 : decode(data.h1 || row.h1)
    if (!h1) {
      h1 = type === 'contact' ? 'Contact Us' : live404 ? row.service : shortName(title)
      todo.push('h1: missing on old page, derived')
    }
    if (type === 'home') todo.push(...HOME.todo)

    const og = meta.og ?? {}
    const ogImage =
      type === 'legacy-demo' ? DEFAULT_OG_IMAGE : await localOgImage(p, og['og:image'], todo)

    pages.push(
      record({
        p,
        type,
        title,
        description,
        h1,
        robots: type === 'legacy-demo' ? 'noindex, follow' : 'index, follow',
        ogImage,
        ogImageAlt: decode(og['og:image:alt']),
        sources,
        todo,
        extra: {
          category: row.category,
          ...(type === 'technology' || type === 'service' ? { name: live404 ? row.service : shortName(title) } : {}),
          video: row.video_planned || null,
          lastmod: og['og:updated_time'] || sitemapLastmod[p] || null,
          oldSite: {
            url: row.url,
            status: row.http_status,
            title: decode(meta.title),
            description: liveDesc,
            dataJson: `scraped/${row.data_json}`,
            contentMd: row.content_md ? `scraped/${row.content_md}` : null,
          },
          ...(type === 'legacy-demo' ? { legacy: 'theme-demo' } : {}),
        },
      }),
    )
  }

  for (const hub of hubs) {
    pages.push(
      record({
        p: hub.path,
        type: hub.type,
        title: hub.title,
        description: hub.description,
        h1: hub.h1,
        ogImage: DEFAULT_OG_IMAGE,
        sources: { title: 'draft', description: 'draft' },
        todo: ['new page: title, description and h1 are drafts (src/data/hubs.ts)'],
        extra: { name: hub.name, category: hub.name, video: null, lastmod: null, oldSite: null },
      }),
    )
  }

  // order: home, hubs, old pages in capture order, legacy demo last
  const rank = (r) => (r.type === 'home' ? 0 : r.oldSite === null ? 1 : r.type === 'legacy-demo' ? 3 : r.type === 'redirect' ? 4 : 2)
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
  }

  fs.writeFileSync(path.join(DATA_DIR, 'pages.json'), JSON.stringify(pages, null, 2) + '\n')

  // slim runtime copy bundled by the app (see RoutePage in src/data/types.ts)
  const slim = pages.map((r) =>
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
          crumbs: r.breadcrumbs.map((c) => c.path),
          ...(r.lastmod ? { lastmod: r.lastmod } : {}),
        },
  )
  fs.writeFileSync(path.join(DATA_DIR, 'routes.json'), JSON.stringify(slim) + '\n')

  // sitemap / robots / redirects
  const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...indexable.map(
      (r) => `  <url><loc>${xmlEsc(r.canonical)}</loc>${r.lastmod ? `<lastmod>${r.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`,
    ),
    '</urlset>',
    '',
  ].join('\n')
  fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), sitemap)
  fs.writeFileSync(path.join(PUBLIC, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
  fs.writeFileSync(
    path.join(PUBLIC, '_redirects'),
    redirects.flatMap((r) => [`${r.from} ${r.to} ${r.status}`, `${r.from.replace(/\/$/, '')} ${r.to} ${r.status}`]).join('\n') + '\n',
  )

  // review sheet for SEO sign-off
  const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const header = ['path', 'type', 'robots', 'title', 'title_source', 'title_len', 'description', 'description_source', 'description_len', 'h1', 'old_status', 'todo']
  const rows = pages
    .filter((r) => r.type !== 'redirect')
    .map((r) => [r.path, r.type, r.robots, r.title, r.sources.title, r.title.length, r.description, r.sources.description, r.description.length, r.h1, r.oldSite?.status ?? 'new', r.todo.join('; ')])
  fs.writeFileSync(path.join(DATA_DIR, 'seo-report.csv'), [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\n') + '\n')

  // summary
  const by = (f) => pages.reduce((m, r) => ((m[f(r)] = (m[f(r)] ?? 0) + 1), m), {})
  console.log(`pages.json: ${pages.length} records`, by((r) => r.type))
  console.log('title sources', by((r) => r.sources?.title ?? '-'))
  console.log('description sources', by((r) => r.sources?.description ?? '-'))
  console.log(`sitemap: ${indexable.length} URLs · redirects: ${redirects.length} · pages with todo: ${pages.filter((r) => r.todo?.length).length}`)
  const ogMissing = pages.filter((r) => r.todo?.some((t) => t.includes('run gen:og'))).length
  if (ogMissing) console.log(`og:image not downloaded for ${ogMissing} pages: run npm run gen:og`)
}

await main()
