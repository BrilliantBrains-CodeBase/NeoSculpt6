#!/usr/bin/env node
// Checks src/data/services/videos.json, the YouTube video each service page may show in its consultation section
// (written by import-videos.mjs). Exits 1 on any failure:
//   - the key is a service route in pages.json
//   - provider is youtube, the video ID is 11 characters, the URL is https://www.youtube.com/watch?v=<that ID>
//   - the title is not empty and carries none of the banned outcome claims ("best", "guaranteed", …)
//   - the approval flags have the right type and value set
//   - the thumbnail exists in public/ as a WebP at the width × height the record says, with alt text set (may be
//     empty: the heading above the player names the video)
// A record that is not approved, consent-confirmed and published is listed, with the reason, and not shown
// (services/index.ts applies the same rule). Run by `npm run gen`.

import fs from 'node:fs'
import path from 'node:path'
import { BANNED_CLAIMS, VIDEO_ID, watchUrl } from './video-rules.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const videos = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/services/videos.json'), 'utf8'))
const servicePaths = new Set(
  JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/pages.json'), 'utf8'))
    .filter((p) => p.type === 'service')
    .map((p) => p.path),
)
const quiet = process.argv.includes('--quiet')

const failures = []
const hidden = []

// WebP size from the file header (lossy VP8, lossless VP8L or extended VP8X).
function webpSize(file) {
  const b = fs.readFileSync(file)
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') return null
  const chunk = b.toString('ascii', 12, 16)
  if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff }
  if (chunk === 'VP8L') {
    const bits = b.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  if (chunk === 'VP8X') return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 }
  return null
}

for (const [where, v] of Object.entries(videos)) {
  const fail = (msg) => failures.push(`${where}: ${msg}`)
  if (!servicePaths.has(where)) fail('not a service route in pages.json')
  if (v === null) continue // explicitly no video
  if (v.provider !== 'youtube') fail(`provider is "${v.provider}", expected "youtube"`)
  if (!VIDEO_ID.test(v.videoId ?? '')) fail(`video ID "${v.videoId}" is not an 11-character YouTube ID`)
  else if (v.url !== watchUrl(v.videoId)) fail(`url ${v.url} does not match video ID ${v.videoId}`)
  if (!v.title?.trim()) fail('empty title')
  else if (BANNED_CLAIMS.test(v.title)) fail(`title carries a banned claim ("${BANNED_CLAIMS.exec(v.title)[0]}"): ${v.title}`)
  if (!['approved', 'pending', 'rejected'].includes(v.approval)) fail(`approval "${v.approval}" is not approved/pending/rejected`)
  if (typeof v.consentConfirmed !== 'boolean') fail('consentConfirmed must be true or false')
  if (typeof v.published !== 'boolean') fail('published must be true or false')

  const t = v.thumbnail
  if (t) {
    const file = path.join(PUBLIC, t.src ?? '')
    if (!t.src?.endsWith('.webp') || !fs.existsSync(file)) fail(`thumbnail ${t.src} is not a WebP in public/`)
    else {
      const size = webpSize(file)
      if (!size || size.width !== t.width || size.height !== t.height)
        fail(`thumbnail ${t.src} is ${size ? `${size.width}×${size.height}` : 'unreadable'}, the record says ${t.width}×${t.height}`)
    }
    if (typeof t.alt !== 'string') fail('thumbnail alt must be a string (empty when the heading names the video)')
  }

  const reasons = [
    v.approval !== 'approved' && `approval is "${v.approval}"`,
    v.consentConfirmed !== true && 'consent not confirmed',
    v.published !== true && 'not published',
  ].filter(Boolean)
  if (reasons.length) hidden.push(`${where}: ${reasons.join(', ')}`)
}

const shown = Object.values(videos).filter(Boolean).length - hidden.length
if (!quiet || hidden.length) {
  console.log(`videos.json: ${Object.keys(videos).length} records, ${shown} shown`)
  if (hidden.length) console.log(`  not shown:\n    ${hidden.join('\n    ')}`)
}
if (failures.length) {
  console.error(`\nvideos.json: ${failures.length} FAILURE(S):`)
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
console.log('videos.json: OK')
