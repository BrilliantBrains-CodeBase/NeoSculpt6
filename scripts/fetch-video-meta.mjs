#!/usr/bin/env node
// Adds each service video's YouTube upload date and length to src/data/services/videos.json (`uploadDate`, ISO 8601
// date-time; `duration`, ISO 8601 duration). Seo.tsx marks a page's video up as a schema.org VideoObject only once
// it has an upload date, which Google requires. Records that already have both are skipped, so a re-run only fetches
// new videos. Run by hand after scripts/import-videos.mjs (it needs the network; the build does not).
//
//   node scripts/fetch-video-meta.mjs

import fs from 'node:fs'
import path from 'node:path'

const FILE = path.resolve(import.meta.dirname, '../src/data/services/videos.json')
const videos = JSON.parse(fs.readFileSync(FILE, 'utf8'))

const isoDuration = (s) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${sec || (!h && !m) ? `${sec}S` : ''}`
}

const byId = new Map()
for (const v of Object.values(videos)) if (v && !(v.uploadDate && v.duration)) byId.set(v.videoId, null)

let failed = 0
for (const id of byId.keys()) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en' } })
    const html = await res.text()
    const uploadDate = html.match(/itemprop="uploadDate" content="([^"]+)"/)?.[1] ?? html.match(/"uploadDate":"([^"]+)"/)?.[1]
    const seconds = html.match(/"videoDetails":\{[^}]*?"lengthSeconds":"(\d+)"/)?.[1]
    if (!uploadDate) throw new Error('no upload date on the watch page')
    byId.set(id, { uploadDate, ...(seconds ? { duration: isoDuration(Number(seconds)) } : {}) })
  } catch (e) {
    failed++
    console.warn(`  ${id}: ${e.message}`)
  }
}

let updated = 0
for (const v of Object.values(videos)) {
  const meta = v && byId.get(v.videoId)
  if (!meta) continue
  Object.assign(v, meta)
  updated++
}
fs.writeFileSync(FILE, JSON.stringify(videos, null, 2) + '\n')
console.log(`video meta: ${byId.size} videos fetched, ${updated} records updated, ${failed} failed`)
