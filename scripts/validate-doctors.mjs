#!/usr/bin/env node
// Checks src/data/doctors.json beyond its shape (the shape, enums, unique slug/path, SEO fields and wording rules are
// checked when src/data/doctors.ts loads, so a malformed record fails here too). Exits 1 on any failure.
//
//   - every image (portrait, og image, logos, expertise images) exists in public/ at the width × height the record says
//   - every internal link is a route in src/data/routes.json
//   - an expertise item links only to a page that already shows this doctor on its doctor card (the approved
//     doctor-to-pathway assignment), so a profile never links a doctor to a treatment someone else provides
//   - the doctor names and profile links elsewhere in the site (menu, home cards, About schema, service cards) all
//     point at a published record
//
// It also lists what each doctor's profile is still waiting on (pending items are hidden from the page).
// Run by `npm run gen` (before the route generator) and on its own with `npm run validate:doctors`.

import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from './image-size.mjs'
import { doctors, publishedDoctors, pendingItems } from '../src/data/doctors.ts'
import { primaryNav } from '../src/data/nav.ts'
import { doctors as homeDoctors } from '../src/data/home.ts'
import { physicians } from '../src/data/about.ts'
import { servicesByPath } from '../src/data/services/index.ts'
import { specialityByPath } from '../src/data/specialities/index.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const quiet = process.argv.includes('--quiet')

const failures = []
const fail = (where, msg) => failures.push(`${where}: ${msg}`)


function checkImage(where, img) {
  const file = path.join(PUBLIC, img.src)
  if (!fs.existsSync(file)) return fail(where, `image file missing: public${img.src}`)
  if (img.width === undefined) return
  const size = imageSize(file)
  if (!size) return fail(where, `can't read the size of ${img.src}`)
  if (size.width !== img.width || size.height !== img.height) {
    fail(where, `${img.src} is ${size.width}×${size.height}, the record says ${img.width}×${img.height}`)
  }
}

// Routes the site builds. routes.json is regenerated after this check, so doctor routes come from the records
// themselves and the rest from the committed routes.json.
const routes = new Set([
  ...JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/routes.json'), 'utf8'))
    .filter((r) => r.type !== 'redirect' && r.type !== 'gone' && r.type !== 'doctor')
    .map((r) => r.path),
  ...publishedDoctors.map((d) => d.path),
])
const routeOf = (href) => href.split('#')[0] || '/'

// Pages that show a doctor on their doctor card, by doctor name.
const shownOn = new Map()
for (const [p, page] of [...servicesByPath, ...specialityByPath]) {
  for (const card of page.doctors?.cards ?? []) shownOn.set(card.name, [...(shownOn.get(card.name) ?? []), p])
}

for (const d of doctors) {
  const where = d.slug
  // An unapproved portrait is not shown (initials instead), so its file may not be in place yet.
  if (d.hero.portrait.approval === 'approved' || fs.existsSync(path.join(PUBLIC, d.hero.portrait.src))) checkImage(`${where} portrait`, d.hero.portrait)
  if (d.cardPortrait) checkImage(`${where} card portrait`, d.cardPortrait)
  checkImage(`${where} og image`, { src: d.seo.ogImage })
  for (const r of d.recognition) if (r.logo) checkImage(`${where} logo`, r.logo)
  for (const x of d.expertise) if (x.image) checkImage(`${where} expertise image`, x.image)

  const internal = [d.ctas.contactHref, ...d.expertise.map((x) => x.href)].filter((h) => h?.startsWith('/'))
  for (const href of internal) if (!routes.has(routeOf(href))) fail(where, `links to ${href}, which is not a route`)

  const allowed = new Set(shownOn.get(d.displayName) ?? [])
  for (const x of d.expertise) {
    if (x.href && !allowed.has(x.href)) fail(where, `expertise "${x.title}" links to ${x.href}, which does not show ${d.displayName} on its doctor card`)
  }
}

// The rest of the site's doctor links must resolve to a published record (no links to removed or draft profiles).
const published = new Map(publishedDoctors.map((d) => [d.path, d]))
const elsewhere = [
  ...primaryNav.flatMap((i) => i.children ?? []).filter((c) => published.has(c.href) || /\/dr-|doctor/.test(c.href)).map((c) => ['menu', c.label, c.href]),
  ...homeDoctors.cards.map((c) => ['home doctor card', c.name, c.href]),
  ...physicians.map((c) => ['About schema', c.name, c.href]),
  ...[...servicesByPath.values(), ...specialityByPath.values()].flatMap((pg) => (pg.doctors?.cards ?? []).filter((c) => c.href).map((c) => [`${pg.path} doctor card`, c.name, c.href])),
]
const seen = new Set()
for (const [where, name, href] of elsewhere) {
  const key = `${where}|${href}`
  if (seen.has(key)) continue
  seen.add(key)
  const d = published.get(href)
  if (!d) fail(where, `${name} links to ${href}, which has no published doctor record`)
  else if (d.displayName !== name) fail(where, `names the ${href} doctor "${name}", the record's displayName is "${d.displayName}"`)
}

if (!quiet) {
  console.log(`doctors.json: ${doctors.length} records, ${publishedDoctors.length} published`)
  for (const d of doctors) {
    const pending = pendingItems(d)
    console.log(`  ${d.displayName} (${d.path}, ${d.status}): ${pending.length ? `${pending.length} item(s) pending sign-off, hidden from the page` : 'nothing pending'}`)
    for (const item of pending) console.log(`    - ${item}`)
    if (!fs.existsSync(path.join(PUBLIC, d.hero.portrait.src))) console.log(`    - portrait file not in public/ yet: ${d.hero.portrait.src}`)
  }
}

if (failures.length) {
  console.error(`\ndoctors.json: ${failures.length} FAILURE(S):`)
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
console.log('doctors.json: OK')
