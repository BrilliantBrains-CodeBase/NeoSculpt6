#!/usr/bin/env node
// Checks src/data/editorial.json beyond its shape (the shape, enums, unique id/slug/path/source, required fields,
// review approval, banned wording and media verification are checked when src/data/editorial.ts loads, so a malformed
// record fails here too). Exits 1 on any failure.
//
//   - every article that has a page has a non-empty Markdown body that the converter accepts, and every internal link
//     in it is a route (src/data/routes.json) or the hub
//   - every featured image and print scan exists in public/ at the size the record says
//   - no two public records point at the same external article (also across syndicated copies)
//
// It also lists what is still pending (drafts, items in review, unverified sources). Run by `npm run gen` (before the
// route generator) and on its own with `npm run validate:editorial`.

import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from './image-size.mjs'
import { markdownToBlocks, bodyPath } from './build-editorial.mjs'
import { editorial, pageRecords, publicRecords, pendingEditorial, buildDate } from '../src/data/editorial.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const quiet = process.argv.includes('--quiet')

const failures = []
const fail = (where, msg) => failures.push(`${where}: ${msg}`)

const routes = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/routes.json'), 'utf8')).map((r) => r.path))
const known = (href) => routes.has(href.split('#')[0] || '/') || href.startsWith('/#') || href === '/journal/' || pageRecords.some((r) => r.path === href)

function checkImage(where, src, width, height) {
  const file = path.join(PUBLIC, src)
  if (!fs.existsSync(file)) return fail(where, `image missing: public${src}`)
  const size = imageSize(file)
  if (!size) return fail(where, `can't read the size of ${src}`)
  if (size.width !== width || size.height !== height) fail(where, `${src} is ${size.width}×${size.height}, record says ${width}×${height}`)
}

for (const r of pageRecords) {
  const file = bodyPath(r)
  if (!fs.existsSync(file)) {
    fail(r.id, `body file missing: ${r.content.bodySource}`)
    continue
  }
  const md = fs.readFileSync(file, 'utf8')
  if (!md.trim()) {
    fail(r.id, `body file is empty: ${r.content.bodySource}`)
    continue
  }
  try {
    const blocks = markdownToBlocks(md, r.content.bodySource)
    const links = blocks.flatMap((b) => ('items' in b ? b.items.flat() : b.text)).filter((p) => p.href).map((p) => p.href)
    for (const href of links) {
      if (href.startsWith('/') && !known(href)) fail(r.id, `body links to ${href}, which is not a page`)
      if (/^http:\/\//.test(href)) fail(r.id, `body link ${href} must be https`)
    }
  } catch (e) {
    fail(r.id, e.message)
  }
  const img = r.featuredImage
  checkImage(r.id, img.src, img.width, img.height)
}

const sources = new Map()
for (const r of publicRecords) {
  const m = r.media
  if (!m) continue
  if (m.clipping && m.permissionConfirmed) {
    checkImage(r.id, m.clipping.thumb, m.clipping.thumbWidth, m.clipping.thumbHeight)
    checkImage(r.id, m.clipping.full, m.clipping.fullWidth, m.clipping.fullHeight)
  }
  for (const url of [m.sourceUrl, ...m.syndicated.map((s) => s.url)].filter(Boolean)) {
    const key = url.replace(/\/$/, '').toLowerCase()
    if (sources.has(key)) fail(r.id, `same source as ${sources.get(key)}: ${url}`)
    else sources.set(key, r.id)
  }
}

const pending = pendingEditorial()
if (!quiet || failures.length) {
  console.log(
    `editorial.json: ${editorial.length} records · ${publicRecords.length} public · ${pageRecords.length} article page(s) · build date ${buildDate()}`,
  )
  if (pending.length) {
    console.log(`not public yet (${pending.length}):`)
    for (const p of pending) console.log(`  - ${p}`)
  }
}
if (failures.length) {
  console.error(`\neditorial: ${failures.length} FAILURE(S):`)
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
if (quiet) console.log(`editorial.json: OK (${publicRecords.length} public, ${pending.length} pending)`)
