// Imports the NeoSculpt6 photo drop (Zoho WorkDrive export) into public/ as WebP, and lists the service photos in
// src/data/services/new-photos.json. Usage: node scripts/import-photos.mjs "<folder>"
//
// The folder is either a whole drop (layout below; hero, about and pillars are optional) or a Services folder on its own
// (<Hub>/<Service name>/*.png). Folder layout:
//   hero image/*.png                    → public/images/home/hero-supplied.webp (not shown: the home hero is the
//                                         theme image, by the client's choice) + hero-square.webp
//   about/1.png, about/2.png            → public/images/home/about.webp, about-inset.webp
//   Treatment Pillars/<Tab label>.png   → public/images/pillars/<hub>.webp
//   Services/<Hub>/<Service name>/*.png → public/images/services/<hub>/<page-slug>-<n>.webp
//                                         + public/og/new/<hub>__<page-slug>.jpg (photo 1, for og:image)
//
// Each photo's `hash` is its source file's fingerprint. Re-running keeps the alt text and scene kind already written into
// new-photos.json for a photo whose source is unchanged (same src and hash), and clears them for a replaced one, so the
// photo is described again. Identical files are found by hash: `same` points at the first copy on another page, and a
// second copy on the same page is marked `unusable`. Scene kinds as in photos.json: c consultation, a assessment,
// p procedure, o other (page-specific, never borrowed). A photo dropped loose in a hub folder counts as a folder named
// after the file.
// Needs cwebp (brew install webp) and macOS sips.

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(SITE, 'public')
const MANIFEST = path.join(SITE, 'src/data/services/new-photos.json')
const SRC = process.argv[2]
if (!SRC || !fs.existsSync(SRC)) throw new Error('usage: node scripts/import-photos.mjs "<Zoho WorkDrive folder>"')

const HUBS = {
  'Anti aging and injections': 'anti-aging-injectables',
  'Cosmetic Surgery': 'cosmetic-surgery',
  'Hair Transplant & Restoration': 'hair-transplant-restoration',
  'Slimming & Body Contouring': 'slimming-body-contouring',
  'Laser and Skin Aesthetic Care': 'laser-skin-aesthetic',
  'Cosmetic Gynecology': 'cosmetic-gynecology',
}
const PILLARS = {
  'Hair Restoration': 'hair-transplant-restoration',
  'Body Contouring': 'slimming-body-contouring',
  'Anti-Ageing': 'anti-aging-injectables',
  'Laser & Skin': 'laser-skin-aesthetic',
  'Cosmetic Surgery': 'cosmetic-surgery',
  'Intimate Wellness': 'cosmetic-gynecology',
}
// Folders whose name does not match their page's name.
const FOLDER_PAGE = {
  'Burn Scar Body Hair Transplant': '/hair-transplant-restoration/burn-scar-hair-transplant-in-bangalore/',
  Cryolipolysis: '/slimming-body-contouring/cryolipolysis-treatment-in-bangalore/',
}

const ls = (dir) => fs.readdirSync(dir).filter((f) => !f.startsWith('.'))
const pngs = (dir) =>
  ls(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    // 1.png, 2.png … first, then any other names alphabetically.
    .sort((a, b) => {
      const na = /^\d+\./.test(a) ? parseInt(a) : Infinity
      const nb = /^\d+\./.test(b) ? parseInt(b) : Infinity
      return na - nb || a.localeCompare(b)
    })

function size(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' })
  return { width: +out.match(/pixelWidth: (\d+)/)[1], height: +out.match(/pixelHeight: (\d+)/)[1] }
}

// WebP, long edge at most `max` (never upscaled). Returns the output size.
function webp(input, output, max) {
  fs.mkdirSync(path.dirname(output), { recursive: true })
  const { width, height } = size(input)
  const resize = Math.max(width, height) > max ? (width >= height ? ['-resize', max, 0] : ['-resize', 0, max]) : []
  execFileSync('cwebp', ['-quiet', '-q', '80', '-metadata', 'none', ...resize.map(String), input, '-o', output])
  return size(output)
}

function jpeg(input, output, max) {
  fs.mkdirSync(path.dirname(output), { recursive: true })
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '70', '-Z', String(max), input, '--out', output], { stdio: 'ignore' })
}

// Home page and pillars, when the drop has them.
const HAS_HOME = fs.existsSync(path.join(SRC, 'hero image'))
if (HAS_HOME) {
  const heroFile = pngs(path.join(SRC, 'hero image'))[0]
  webp(path.join(SRC, 'hero image', heroFile), path.join(PUBLIC, 'images/home/hero-supplied.webp'), 2000)
  console.log('hero (supplied)', size(path.join(PUBLIC, 'images/home/hero-supplied.webp')))
  // Square crop around the face (right of centre) for the Instagram row (src/data/site.ts).
  {
    const input = path.join(SRC, 'hero image', heroFile)
    const { width, height } = size(input)
    const side = Math.min(width, height)
    const tmp = path.join(fs.mkdtempSync(path.join(SITE, '.cache-')), 'hero-square.png')
    const left = Math.min(width - side, Math.round(width * 0.42))
    execFileSync('sips', ['-c', String(side), String(side), '--cropOffset', '0', String(left), input, '--out', tmp], { stdio: 'ignore' })
    console.log('hero square', webp(tmp, path.join(PUBLIC, 'images/home/hero-square.webp'), 1024))
    fs.rmSync(path.dirname(tmp), { recursive: true })
  }
  console.log('about', webp(path.join(SRC, 'about/1.png'), path.join(PUBLIC, 'images/home/about.webp'), 1100))
  console.log('about inset', webp(path.join(SRC, 'about/2.png'), path.join(PUBLIC, 'images/home/about-inset.webp'), 640))
  for (const f of pngs(path.join(SRC, 'Treatment Pillars'))) {
    const hub = PILLARS[path.parse(f).name]
    if (!hub) throw new Error(`unknown pillar photo: ${f}`)
    console.log('pillar', hub, webp(path.join(SRC, 'Treatment Pillars', f), path.join(PUBLIC, `images/pillars/${hub}.webp`), 1200))
  }
}

// Service pages.
const parsed = JSON.parse(fs.readFileSync(path.join(SITE, 'src/data/services/parsed.json'), 'utf8'))
const norm = (s) =>
  s.toLowerCase().replace(/\s+in bangalore$/, '').replace(/&/g, 'and').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, ' ').trim()
const byName = new Map(parsed.map((p) => [`${p.path.split('/')[1]}|${norm(p.name)}`, p.path]))

const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : []
const keep = new Map(previous.map((p) => [p.src, p]))
const out = []
const count = new Map()
const firstByHash = new Map()
const SERVICES = fs.existsSync(path.join(SRC, 'Services')) ? path.join(SRC, 'Services') : SRC
for (const hubDir of ls(SERVICES)) {
  const hub = HUBS[hubDir]
  if (!hub) throw new Error(`unknown hub folder: ${hubDir}`)
  // Sorted so that "Cryolipolysis" (4 photos) comes before "Cryolipolysis Treatment" (1).
  for (const entry of ls(path.join(SERVICES, hubDir)).sort()) {
    const loose = fs.statSync(path.join(SERVICES, hubDir, entry)).isFile()
    if (loose && !/\.(png|jpe?g|webp)$/i.test(entry)) continue
    const folder = loose ? path.parse(entry).name : entry
    const dir = loose ? path.join(SERVICES, hubDir) : path.join(SERVICES, hubDir, folder)
    const files = loose ? [entry] : pngs(dir)
    if (!files.length) continue
    const page = FOLDER_PAGE[folder] ?? byName.get(`${hub}|${norm(folder)}`)
    if (!page) throw new Error(`no service page for ${hubDir}/${folder}`)
    const slug = page.split('/')[2]
    for (const f of files) {
      const n = (count.get(page) ?? 0) + 1
      count.set(page, n)
      const src = `/images/services/${hub}/${slug}-${n}.webp`
      const dims = webp(path.join(dir, f), path.join(PUBLIC, src), 1200)
      if (n === 1) jpeg(path.join(dir, f), path.join(PUBLIC, `og/new/${hub}__${slug}.jpg`), 1000)
      const hash = createHash('md5').update(fs.readFileSync(path.join(dir, f))).digest('hex')
      const old = keep.get(src)?.hash === hash ? keep.get(src) : {}
      const first = firstByHash.get(hash)
      if (!first) firstByHash.set(hash, { src, page })
      const twin = first ? (first.page === page ? { unusable: `duplicate of ${path.basename(first.src)}` } : { same: first.src }) : {}
      const from = loose ? `${hubDir}/${f}` : `${hubDir}/${folder}/${f}`
      out.push({ page, src, ...dims, n, from, hash, kind: old.kind ?? null, alt: old.alt ?? null, ...twin })
    }
  }
}
fs.writeFileSync(MANIFEST, JSON.stringify(out, null, 1) + '\n')
console.log(`${out.length} service photos for ${count.size} pages → ${path.relative(SITE, MANIFEST)}`)
const toDescribe = out.filter((p) => !p.alt && !p.unusable)
if (toDescribe.length) console.log(`${toDescribe.length} new or replaced photos need alt text and a scene kind:\n${toDescribe.map((p) => `  ${p.src}`).join('\n')}`)
