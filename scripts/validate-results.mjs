#!/usr/bin/env node
// Checks src/data/results.json, the /results/ before/after cases (content/results/prompts/results-page.md). Exits 1 on
// any failure:
//   - unique, lower-case id; known status, category and speciality
//   - each image (before, after and their thumbnails) is a WebP in public/images/results/ named after the case,
//     at the width × height the record says, with no EXIF or XMP metadata
//   - before and after: same size, same shape, different files; thumbnails the same shape as the full images
//   - alt text: says before / after, at least 20 characters, not the same for both
//   - no personal details (phone number, email, age, record number, title + name) and no banned claim, graft or
//     session count in the alt text, caption, treatment name or timeline
//   - a doctor, when set, is a doctor in doctors.json
// A case that may not be shown (src/data/results.ts hiddenReason(): status, consent, expiry, approvals) is listed with
// its reason; the page leaves it out. Run by `npm run gen`.

import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { imageSize } from './image-size.mjs'
import { BANNED_CLAIMS } from './video-rules.mjs'
import { allResultCases, hiddenReason, resultCategories } from '../src/data/results.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const DIR = '/images/results/'
const doctors = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/doctors.json'), 'utf8')).map((d) => d.name))
const quiet = process.argv.includes('--quiet')

const STATUSES = ['draft', 'review', 'published', 'archived']
const PERSONAL = [
  [/\+?\d[\d\s-]{7,}\d/, 'a phone-like number'],
  [/[\w.+-]+@[\w-]+\.\w/, 'an email address'],
  [/\b(aged?\s*\d+|\d+\s*(years?|yrs?)\s*old)\b/i, 'an age'],
  [/\b(MRN|UHID|record\s*(no|number)|patient\s*(id|no))\b/i, 'a record number'],
  [/\b(Mr|Mrs|Ms|Miss)\.?\s+[A-Z]/, 'a name'],
]
const COUNT = /\b\d[\d,]*\+?\s*(grafts?|sessions?|units?|ml)\b/i

const failures = []
const hidden = []
const ids = new Set()
const today = new Date().toISOString().slice(0, 10)

// WebP chunk names after the RIFF header, to spot embedded metadata.
function webpChunks(buf) {
  const out = []
  for (let i = 12; i + 8 <= buf.length; ) {
    out.push(buf.toString('ascii', i, i + 4))
    const size = buf.readUInt32LE(i + 4)
    i += 8 + size + (size % 2)
  }
  return out
}

for (const c of allResultCases) {
  const fail = (msg) => failures.push(`${c.id ?? '(no id)'}: ${msg}`)
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id ?? '')) fail('id must be lower-case words and digits joined by hyphens')
  if (ids.has(c.id)) fail('duplicate id')
  ids.add(c.id)
  if (!STATUSES.includes(c.status)) fail(`status "${c.status}" is not one of ${STATUSES.join(', ')}`)
  if (!(c.category in resultCategories)) fail(`unknown category "${c.category}"`)
  if (!(c.speciality in resultCategories)) fail(`unknown speciality "${c.speciality}"`)
  if (!c.treatmentLabel?.trim()) fail('empty treatmentLabel')
  if (c.doctor !== null && !doctors.has(c.doctor)) fail(`doctor "${c.doctor}" is not in doctors.json`)

  const hashes = {}
  const sizes = {}
  for (const side of ['before', 'after']) {
    const img = c[side]
    if (!img) {
      fail(`no ${side} image`)
      continue
    }
    for (const [key, suffix] of [['src', ''], ['thumbnail', '-thumb']]) {
      const expected = `${DIR}${c.id}-${side}${suffix}.webp`
      if (img[key] !== expected) fail(`${side}.${key} is ${img[key]}, expected ${expected}`)
      const file = path.join(PUBLIC, img[key] ?? '')
      if (!img[key]?.startsWith(DIR) || !fs.existsSync(file)) {
        fail(`${side}.${key} ${img[key]} is not a file in public${DIR}`)
        continue
      }
      const buf = fs.readFileSync(file)
      const chunks = webpChunks(buf)
      if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') fail(`${img[key]} is not a WebP`)
      else if (chunks.includes('EXIF') || chunks.includes('XMP ')) fail(`${img[key]} carries EXIF/XMP metadata`)
      sizes[`${side}.${key}`] = imageSize(file)
      if (key === 'src') hashes[side] = createHash('sha256').update(buf).digest('hex')
    }
    const full = sizes[`${side}.src`]
    if (full && (full.width !== img.width || full.height !== img.height))
      fail(`${img.src} is ${full.width}×${full.height}, the record says ${img.width}×${img.height}`)
    const thumb = sizes[`${side}.thumbnail`]
    if (full && thumb && Math.abs(thumb.width / thumb.height - full.width / full.height) > 0.01)
      fail(`${img.thumbnail} is not the same shape as ${img.src}`)

    const alt = img.alt?.trim() ?? ''
    if (alt.length < 20) fail(`${side} alt text is missing or too short`)
    else if (!new RegExp(`\\b${side}\\b`, 'i').test(alt)) fail(`${side} alt text does not say "${side}"`)
  }
  if (c.before && c.after) {
    if (c.before.width !== c.after.width || c.before.height !== c.after.height)
      fail(`before is ${c.before.width}×${c.before.height}, after is ${c.after.width}×${c.after.height}: they must match`)
    if (hashes.before && hashes.before === hashes.after) fail('before and after are the same image')
    if (c.before.alt?.trim() === c.after.alt?.trim()) fail('before and after have the same alt text')
  }

  const texts = { 'before alt': c.before?.alt, 'after alt': c.after?.alt, caption: c.caption, treatmentName: c.treatmentName, timeline: c.timeline }
  for (const [field, text] of Object.entries(texts)) {
    if (!text) continue
    for (const [re, what] of PERSONAL) if (re.test(text)) fail(`${field} contains ${what}: ${text}`)
    if (BANNED_CLAIMS.test(text)) fail(`${field} carries a banned claim ("${BANNED_CLAIMS.exec(text)[0]}"): ${text}`)
    if (COUNT.test(text)) fail(`${field} states a count that needs sign-off ("${COUNT.exec(text)[0]}"): ${text}`)
  }

  const reason = hiddenReason(c, today)
  if (reason) hidden.push(`${c.id}: ${reason}`)
}

const shown = allResultCases.length - hidden.length
if (!quiet || hidden.length || failures.length) {
  console.log(`results.json: ${allResultCases.length} cases, ${shown} shown`)
  if (hidden.length) console.log(`  not shown:\n    ${hidden.join('\n    ')}`)
}
if (failures.length) {
  console.error(`\n${failures.length} FAILURE(S) in src/data/results.json:\n  ${failures.join('\n  ')}`)
  process.exit(1)
}
