// Imports the service-page YouTube videos from the client's video sheet into src/data/services/videos.json.
// Usage: node scripts/import-videos.mjs ["<video csv>"]   (defaults to the sheet at the repo root)
//
// The sheet has one pair of columns per speciality: service name, video link. Each name is matched to a service page
// in parsed.json by its name without " in Bangalore"; ALIASES covers names the sheet words differently. A sheet row
// that matches no page stops the import. Rows with no link are skipped and listed.
//
// Each record (types.ts ServiceVideo) gets:
// - the title from YouTube's oEmbed endpoint, without hashtags and without the word "best" (BANNED_CLAIMS);
//   titles already in videos.json are reused, so a re-run only fetches new videos;
// - a local thumbnail, public/images/videos/<id>.webp (maxresdefault, else hqdefault cropped to 16:9), so the page
//   asks nothing of YouTube until the visitor presses play;
// - approval flags. The client's sheet is their sign-off (October 2026), so a new record is approved, consented and
//   published; a re-run keeps whatever flags a record already has, so a video set to "pending" stays hidden.
// validate-videos.mjs (npm run gen) checks the result; ServiceVideo.tsx renders it in the consultation section.
// Needs cwebp (brew install webp) and macOS sips.

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { BANNED_CLAIMS, watchUrl, youtubeId } from './video-rules.mjs'

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PARSED = path.join(SITE, 'src/data/services/parsed.json')
const OUT = path.join(SITE, 'src/data/services/videos.json')
const THUMBS = path.join(SITE, 'public/images/videos')
const CSV = process.argv[2] ?? path.join(SITE, '..', 'Neo - Pages _ Video _ seo  - video.csv')

// Sheet name → page name (without " in Bangalore"), where the two differ beyond case and punctuation.
const ALIASES = {
  'Neofollicle Transplant Technique / NFT': 'Neo Follicle Hair Transplant',
  'Beard Transplant & Moustache Transplant': 'Beard & Moustache Transplant',
  'Eyebrow Restoration': 'Eyebrow Hair Transplant',
  'Hair Fillers': 'Hair Fillers Treatment',
  'Blepharoplasty': 'Blepharoplasty (Eyelid Surgery)',
  'Abdominoplasty / Tummy Tuck': 'Tummy Tuck Surgery (Abdominoplasty)',
  'Breast Lift': 'Breast Lift Surgery (Mastopexy)',
  'Trauma Reconstruction': 'Advanced Trauma Reconstruction',
  'Obesity Management / Treatment': 'Obesity Treatment',
  'Belly Fat Reduction / Tummy Fat Reduction': 'Belly & Tummy Fat Reduction',
  'Hips Fat Reduction': 'Hip Fat Reduction',
  'Stretch Mark Support': 'Stretch Mark Treatment',
  'CoolSculpting / Cryolipolysis': 'Cryolipolysis Treatment',
  'Scar Revision Laser': 'Laser Scar Revision',
  'Beard Shaping Laser': 'Beard Shaping Laser Hair Removal',
  'CO2 Fractional Laser (Fractional Laser Resurfacing)': 'CO2 Fractional Laser Treatment',
  'Advanced Microneedling': 'Microneedling Treatment',
  'Open Pores Treatment': 'Dermatologist-Led Open Pores Treatment',
  'NCECS / Non-Cultured Epidermal Cell Suspension': 'NCECS Treatment',
  'Phototherapy / Targeted Phototherapy': 'Phototherapy for Vitiligo',
  'Skin Rejuvenation': 'Skin Rejuvenation Treatment',
  'Laser Wart Removal': 'Laser Wart Removal Treatment',
  'Skin Tag Removal': 'Laser Skin Tag Removal',
  'Birthmark Laser Treatment': 'Laser Birthmark Removal Treatment',
  'Botox': 'Botox Treatment',
  'Dermal Fillers': 'Dermal Filler Treatment',
  'Hand Fillers / Hand Rejuvenation Fillers': 'Hand Rejuvenation Fillers',
  'Breast Volume Enhancement with Fillers': 'Breast Volume Enhancement Fillers',
  'Buttock Volume Enhancement with Fillers': 'Buttock Volume Enhancement Fillers',
  'IV Glutathione': 'Glutathione IV Drip Treatment',
  'Double Chin Tightening': 'Non-Surgical Double Chin Tightening Treatment',
  'Hymenoplasty': 'Hymenoplasty Surgery',
  'Perineoplasty': 'Perineoplasty Surgery',
  'Monsplasty': 'Monsplasty (Mons Pubis Reduction)',
  'Urinary Leakage Support': 'Urinary Incontinence Treatment',
}

// Minimal CSV reader: quoted fields may hold commas and doubled quotes.
function readCsv(text) {
  const rows = []
  let row = [], field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field); rows.push(row); row = []; field = ''
    } else field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

const key = (s) => s.toLowerCase().replace(/\s+in bangalore$/, '').replace(/&/g, 'and').replace(/[^a-z0-9]/g, '')
const pages = JSON.parse(fs.readFileSync(PARSED, 'utf8'))
const byKey = new Map(pages.map((p) => [key(p.name), p]))

// A sheet name matches its alias, the whole name, any "/"-separated part, or that plus "Surgery"/"Treatment".
function findPage(name) {
  const tries = [ALIASES[name], name, ...name.split('/')].filter(Boolean).map((t) => key(t))
  for (const k of tries) for (const suffix of ['', 'surgery', 'treatment']) {
    const page = byKey.get(k + suffix)
    if (page) return page
  }
  return null
}

const rows = readCsv(fs.readFileSync(CSV, 'utf8'))
const entries = [] // { name, url, page }
for (const row of rows.slice(1)) {
  for (let i = 0; i + 1 < row.length; i += 2) {
    const name = row[i].trim()
    if (!name || /^\d+\.\s/.test(name)) continue // stray speciality label inside the sheet
    entries.push({ name, url: row[i + 1].trim(), page: findPage(name) })
  }
}

const unmatched = entries.filter((e) => !e.page)
if (unmatched.length) {
  console.error('Sheet rows with no matching service page (add them to ALIASES):')
  for (const e of unmatched) console.error('  ' + e.name)
  process.exit(1)
}
const seen = new Map()
for (const e of entries) {
  if (seen.has(e.page.path)) throw new Error(`"${e.name}" and "${seen.get(e.page.path)}" both match ${e.page.path}`)
  seen.set(e.page.path, e.name)
}

const withLink = entries.filter((e) => e.url)
for (const e of withLink) {
  e.id = youtubeId(e.url)
  if (!e.id) throw new Error(`"${e.name}": not a YouTube video link: ${e.url}`)
}
const ids = [...new Set(withLink.map((e) => e.id))]

// Titles: reuse what videos.json already holds for the same video, fetch the rest once per video.
const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {}
const titles = new Map(Object.values(previous).map((v) => [youtubeId(v.url), v.title]))
for (const id of ids) {
  if (titles.has(id)) continue
  const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl(id))}`)
  if (!res.ok) throw new Error(`oEmbed ${res.status} for ${id} (private or removed video?)`)
  titles.set(id, (await res.json()).title)
}
// Shown as a heading: drop hashtags, the word "best", and the separators they leave dangling.
const changed = []
const clean = (t) => {
  const out = t
    .replace(/#[\p{L}\p{N}_]+/gu, '')
    .replace(/\bbest\s+/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/[\s|.]+$/, '')
    .trim()
  if (/\bbest\s/i.test(t)) changed.push(`${t}\n    → ${out}`)
  return out
}

// Thumbnails: one per video, kept once made.
fs.mkdirSync(THUMBS, { recursive: true })
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'videos-'))
const size = (file) => {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' })
  return { width: Number(/pixelWidth: (\d+)/.exec(out)[1]), height: Number(/pixelHeight: (\d+)/.exec(out)[1]) }
}
const thumbs = new Map()
for (const id of ids) {
  const webp = path.join(THUMBS, `${id}.webp`)
  if (!fs.existsSync(webp)) {
    const jpg = path.join(tmp, `${id}.jpg`)
    let res = await fetch(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)
    let letterboxed = false
    if (!res.ok) {
      res = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`) // 4:3 with black bars top and bottom
      letterboxed = true
    }
    if (!res.ok) throw new Error(`No thumbnail for ${id} (${res.status})`)
    fs.writeFileSync(jpg, Buffer.from(await res.arrayBuffer()))
    if (letterboxed) {
      const { width } = size(jpg)
      execFileSync('sips', ['-c', String(Math.round((width * 9) / 16)), String(width), jpg], { stdio: 'ignore' })
    }
    execFileSync('cwebp', ['-quiet', '-q', '80', jpg, '-o', webp])
  }
  thumbs.set(id, { src: `/images/videos/${id}.webp`, ...size(webp), alt: '' })
}
fs.rmSync(tmp, { recursive: true, force: true })

const out = {}
for (const e of withLink.sort((a, b) => a.page.path.localeCompare(b.page.path))) {
  const before = previous[e.page.path]
  const keep = before && youtubeId(before.url) === e.id
  out[e.page.path] = {
    provider: 'youtube',
    videoId: e.id,
    url: watchUrl(e.id),
    title: clean(titles.get(e.id)),
    thumbnail: thumbs.get(e.id),
    approval: keep && before.approval ? before.approval : 'approved',
    consentConfirmed: keep && typeof before.consentConfirmed === 'boolean' ? before.consentConfirmed : true,
    published: keep && typeof before.published === 'boolean' ? before.published : true,
  }
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')

const blank = entries.filter((e) => !e.url).map((e) => e.page.name)
const missing = pages.filter((p) => !seen.has(p.path)).map((p) => p.name)
const stillBanned = Object.entries(out).filter(([, v]) => BANNED_CLAIMS.test(v.title))
console.log(`${Object.keys(out).length} pages with a video (${ids.length} videos) → ${path.relative(SITE, OUT)}`)
if (changed.length) console.log(`Titles with "best" removed:\n  ${[...new Set(changed)].join('\n  ')}`)
if (stillBanned.length) console.log(`Titles still carrying a banned claim (validate-videos.mjs will fail):\n  ${stillBanned.map(([p, v]) => `${p}: ${v.title}`).join('\n  ')}`)
console.log(`${blank.length} pages with no link in the sheet:\n  ${blank.join('\n  ')}`)
console.log(`${missing.length} pages not in the sheet:\n  ${missing.join('\n  ')}`)
