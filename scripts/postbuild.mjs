#!/usr/bin/env node
// After `vite-react-ssg build`, writes the site's root files into dist/ from the pages actually built:
//
//   404.html        copy of dist/404/index.html (the server's error page for 404 and 410)
//   sitemap.xml     every indexable page, with its photo (image sitemap) and a real last-modified date
//   robots.txt      allow all crawlers; points at the sitemap and llms.txt
//   llms.txt        plain-text guide to the clinic and its pages for AI assistants (llmstxt.org)
//   llms-full.txt   the same, with each treatment's visible intro and FAQs
//   .htaccess       Hostinger (Apache/LiteSpeed): HTTPS + one host, 301s, 410 Gone, error pages, caching, headers
//
// Last-modified dates come from src/data/lastmod.json, a ledger of each page's content hash (its <main> text, title and
// description, so a CSS or script change does not count) and the date it last changed. Commit the ledger with the
// site, so dates only move when a page's content does.
//
// Everything here is built from strings the site already shows (pages.json, site.ts, the page data files): no new
// claims, and nothing pending sign-off.

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { SITE_URL, SITE_NAME, clinic, local, sameAs } from '../src/data/site.ts'
import { services } from '../src/data/services/index.ts'
import { LIVE as TECH_LIVE, technologyByPath } from '../src/data/technology/index.ts'
import { specialityHubs } from '../src/data/specialities/index.ts'
import { publishedDoctors } from '../src/data/doctors.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const DIST = path.join(ROOT, 'dist')
const DATA = path.join(ROOT, 'src/data')
const LEDGER = path.join(DATA, 'lastmod.json')
const today = new Date().toISOString().slice(0, 10)

const pages = JSON.parse(fs.readFileSync(path.join(DATA, 'pages.json'), 'utf8'))
const { redirects, gone } = JSON.parse(fs.readFileSync(path.join(DATA, 'redirects.json'), 'utf8'))
const fileFor = (p) => path.join(DIST, p, 'index.html')
const abs = (p) => (p.startsWith('http') ? p : SITE_URL + p)
const write = (name, text) => fs.writeFileSync(path.join(DIST, name), text)

// 404 --------------------------------------------------------------------------------------------------------
const notFound = path.join(DIST, '404/index.html')
if (fs.existsSync(notFound)) fs.copyFileSync(notFound, path.join(DIST, '404.html'))
else console.warn('postbuild: dist/404/index.html not found')

// Indexable pages: built, index robots, not a redirect or a gone URL.
const indexable = pages.filter((r) => r.type !== 'redirect' && r.type !== 'gone' && r.robots.startsWith('index') && fs.existsSync(fileFor(r.path)))
const missing = pages.filter((r) => r.type !== 'redirect' && r.type !== 'gone' && r.robots.startsWith('index') && !fs.existsSync(fileFor(r.path)))
if (missing.length) console.warn(`postbuild: ${missing.length} indexable page(s) not built: ${missing.map((r) => r.path).join(', ')}`)

// lastmod ledger ---------------------------------------------------------------------------------------------
const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : {}
const contentHash = (r) => {
  const html = fs.readFileSync(fileFor(r.path), 'utf8')
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? html
  const text = main
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return crypto.createHash('sha1').update([r.title, r.description, text].join('\u0000')).digest('hex').slice(0, 16)
}
const nextLedger = {}
let changed = 0
for (const r of indexable) {
  const hash = contentHash(r)
  const prev = ledger[r.path]
  if (prev?.hash === hash) nextLedger[r.path] = prev
  else {
    nextLedger[r.path] = { hash, date: today }
    changed++
  }
}
fs.writeFileSync(LEDGER, JSON.stringify(nextLedger, null, 2) + '\n')

// sitemap.xml ------------------------------------------------------------------------------------------------
const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
write(
  'sitemap.xml',
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...indexable.map((r) => {
      const image = r.og.photo ? `<image:image><image:loc>${xml(abs(r.og.photo))}</image:loc></image:image>` : ''
      return `  <url><loc>${xml(r.canonical)}</loc><lastmod>${nextLedger[r.path].date}</lastmod>${image}</url>`
    }),
    '</urlset>',
    '',
  ].join('\n'),
)

// robots.txt -------------------------------------------------------------------------------------------------
// Every crawler, AI crawlers included, may read the whole site. The thank-you page is not disallowed: its noindex
// meta tag only works if crawlers can fetch it.
write(
  'robots.txt',
  [
    `# ${SITE_NAME} · ${SITE_URL}/`,
    `# A plain-text guide to the clinic and its pages for AI assistants: ${SITE_URL}/llms.txt`,
    '',
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n'),
)

// llms.txt and llms-full.txt ---------------------------------------------------------------------------------
const indexed = new Map(indexable.map((r) => [r.path, r]))
const servicesByPath = new Map(services.map((s) => [s.path, s]))
const techFor = (p) => (TECH_LIVE.has(p) ? technologyByPath.get(p) : null)
const link = (r, text = r.name) => `[${text}](${r.canonical})`
// A treatment's one-line summary: the first sentence of the intro its page shows, else the meta description.
const firstSentence = (text) => text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text
const summary = (r) => {
  const intro = servicesByPath.get(r.path)?.hero.intro ?? techFor(r.path)?.hero?.intro
  return intro ? firstSentence(intro) : r.description
}
const line = (r, text) => `- ${link(r, text)}: ${summary(r)}`
const { address } = clinic
const postal = `${address.streetAddress}, ${address.addressLocality}, ${address.addressRegion} ${address.postalCode}, India`

const intro = [
  `# ${SITE_NAME}`,
  '',
  `> ${SITE_NAME} is a doctor-led aesthetic clinic in Whitefield, Bangalore, India, part of Neo Group and led by Dr Sandeep Mahapatra. It offers hair transplant and restoration, cosmetic surgery, slimming and body contouring, laser and skin aesthetics, anti-ageing and injectables, and cosmetic gynaecology. Every treatment starts with a consultation with a doctor.`,
  '',
  'Medical information on this site is for patient education and does not replace an in-person consultation. Suitability, cost and recovery are confirmed by a doctor after assessment.',
  '',
  '## Clinic',
  '',
  `- Address: ${postal}`,
  `- Landmark: ${address.landmark}`,
  `- Hours: ${clinic.hours.label}`,
  `- Phone: ${clinic.phone}`,
  `- WhatsApp: ${clinic.whatsappHref}`,
  `- Email: ${clinic.email}`,
  `- Book a consultation: ${SITE_URL}/contact-us/`,
  `- Directions: ${clinic.mapsHref}`,
  `- ${clinic.nearbyAreas}`,
  ...(local.google.reviewUrl ? [`- Google reviews: ${local.google.reviewUrl}`] : []),
  ...(sameAs.length ? [`- Profiles: ${sameAs.join(', ')}`] : []),
  '',
  '## Doctors',
  '',
  ...publishedDoctors.filter((d) => indexed.has(d.path)).map((d) => `- ${link(indexed.get(d.path), d.displayName)}: ${d.role}`),
  '',
]

const sections = []
for (const hub of specialityHubs) {
  const hubPage = indexed.get(hub.path)
  if (!hubPage) continue
  const children = indexable.filter((r) => r.type === 'service' && r.section === hub.path)
  sections.push({ title: hubPage.name, hub: hubPage, children })
}
const techHub = indexed.get('/technology/')
const techPages = indexable.filter((r) => r.type === 'technology')
const otherPaths = ['/about-us/', '/international-patients/', '/journal/', '/contact-us/']
const policies = indexable.filter((r) => r.type === 'legal')

const listing = [
  ...sections.flatMap(({ title, hub, children }) => [`## ${title}`, '', line(hub, `${title} overview`), ...children.map((r) => line(r)), '']),
  ...(techHub ? ['## Technology', '', line(techHub, 'Technology overview'), ...techPages.map((r) => line(r)), ''] : []),
  '## About the clinic',
  '',
  ...otherPaths.filter((p) => indexed.has(p)).map((p) => line(indexed.get(p))),
  '',
  '## Optional',
  '',
  ...policies.map((r) => line(r)),
  '',
]
write('llms.txt', [...intro, ...listing].join('\n'))

// Full version: each treatment's visible intro and FAQs, in page order.
const qa = (items) => items.flatMap(({ q, a }) => [`Q: ${q}`, `A: ${a}`, ''])
const full = [...intro]
for (const { title, hub, children } of sections) {
  full.push(`## ${title}`, '', `${link(hub, `${title} overview`)}`, '', specialityHubs.find((h) => h.path === hub.path).hero.intro, '')
  for (const r of children) {
    const s = servicesByPath.get(r.path)
    full.push(`### ${r.name}`, '', `URL: ${r.canonical}`, '', s ? s.hero.intro : r.description, '')
    if (s?.faqs?.items?.length) full.push(...qa(s.faqs.items))
  }
}
if (techHub) {
  full.push('## Technology', '', link(techHub, 'Technology overview'), '')
  for (const r of techPages) {
    const t = techFor(r.path)
    full.push(`### ${r.name}`, '', `URL: ${r.canonical}`, '', t?.hero?.intro ?? r.description, '')
    if (t && 'faqs' in t && t.faqs?.items?.length) full.push(...qa(t.faqs.items))
  }
}
full.push('## About the clinic', '', ...otherPaths.filter((p) => indexed.has(p)).map((p) => line(indexed.get(p))), '', '## Optional', '', ...policies.map((r) => line(r)), '')
write('llms-full.txt', full.join('\n'))

// .htaccess (Hostinger) --------------------------------------------------------------------------------------
const esc = (p) => p.replace(/^\/|\/$/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const livePaths = pages.filter((r) => r.type !== 'gone').map((r) => r.path)
// A gone URL's top folder is answered 410 as a whole when no live page or redirect sits under it, so stray old URLs in
// the same theme-demo folder are caught too; other gone URLs are matched exactly.
const goneFolders = [...new Set(gone.map((p) => p.split('/')[1]).filter((seg) => gone.some((p) => p.startsWith(`/${seg}/`) && p !== `/${seg}/`)))].filter(
  (seg) => !livePaths.some((p) => p.startsWith(`/${seg}/`)),
)
const goneExact = gone.filter((p) => !goneFolders.includes(p.split('/')[1]))
// Old WordPress paths: nothing on the new site lives there.
const wordpress = ['wp-admin', 'wp-includes', 'wp-content', 'wp-json', 'feed', 'comments', 'author', 'tag']
for (const seg of [...goneFolders, ...wordpress]) if (livePaths.some((p) => p.startsWith(`/${seg}/`))) throw new Error(`410 folder /${seg}/ has a live page`)

const htaccess = `# Generated by scripts/postbuild.mjs on each build. Do not edit on the server: change the script instead.
# Hostinger shared hosting (Apache / LiteSpeed).

Options -Indexes -MultiViews
DirectoryIndex index.html
AddDefaultCharset utf-8
ErrorDocument 404 /404.html
ErrorDocument 410 /404.html

<IfModule mod_mime.c>
  AddType application/manifest+json .webmanifest
  AddType text/plain .txt
  AddCharset utf-8 .html .txt .xml .webmanifest .json
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On

  # One address for every page (canonical host ${SITE_URL}): "www." goes straight to it, in one hop, then
  # anything else still on plain HTTP moves to HTTPS.
  RewriteCond %{HTTP_HOST} ^www\\.neosculpt6\\.com$ [NC]
  RewriteRule ^ ${SITE_URL}%{REQUEST_URI} [R=301,L,NE]
  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L,NE]

  # /foo/index.html → /foo/
  RewriteCond %{THE_REQUEST} \\s/+(.*/)?index\\.html[\\s?] [NC]
  RewriteRule ^(.*/)?index\\.html$ /$1 [R=301,L]

  # Old URLs that moved (301).
${redirects.map((r) => `  RewriteRule ^${esc(r.from)}/?$ ${r.to} [R=301,L]`).join('\n')}

  # Old sitemaps (the WordPress site's Rank Math files) → the new sitemap.
  RewriteRule ^(sitemap_index|[a-z0-9_-]+-sitemap[0-9]*)\\.xml$ /sitemap.xml [R=301,L]

  # Old theme-demo and WordPress URLs that have no new page: 410 Gone, so search engines drop them.
  RewriteRule ^(${goneFolders.map(esc).join('|')})(/.*)?$ - [G,L]
${goneExact.map((p) => `  RewriteRule ^${esc(p)}/?$ - [G,L]`).join('\n')}
  RewriteRule ^(${wordpress.join('|')})(/.*)?$ - [G,L]
  RewriteRule ^(xmlrpc|wp-login|wp-cron)\\.php$ - [G,L]

  # Folder URLs end in a slash (/foo → /foo/), matching the canonical URLs.
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^(.*[^/])$ /$1/ [R=301,L]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"

  # Pages: always revalidate, so a new build shows at once.
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  # Scripts and styles carry a content hash in their file name (/assets/): cache for a year.
  <FilesMatch "\\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  # Images and fonts keep their names between builds: cache for 30 days.
  <FilesMatch "\\.(webp|jpe?g|png|gif|svg|ico|woff2?)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
  <FilesMatch "\\.(xml|txt|webmanifest)$">
    Header set Cache-Control "public, max-age=3600"
  </FilesMatch>
  # The llms files are for AI assistants, not search results.
  <FilesMatch "^llms(-full)?\\.txt$">
    Header set X-Robots-Tag "noindex"
  </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/xml application/javascript application/json application/manifest+json image/svg+xml
</IfModule>
`
write('.htaccess', htaccess)

// The booking form's landing page: also noindex by header (the page carries the meta tag too).
const thankYou = path.join(DIST, 'thank-you')
if (fs.existsSync(thankYou))
  fs.writeFileSync(path.join(thankYou, '.htaccess'), '<IfModule mod_headers.c>\n  Header set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n')

console.log(
  `postbuild: 404.html, sitemap.xml (${indexable.length} URLs, ${changed} with a new lastmod), robots.txt, llms.txt, llms-full.txt, .htaccess (${redirects.length} redirects, ${goneFolders.length} gone folders + ${goneExact.length} gone URLs)`,
)
