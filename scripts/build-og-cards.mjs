#!/usr/bin/env node
// Share cards and icons.
//
// 1. One 1200 × 630 share card per page in src/data/pages.json → public/og/cards/<slug>.jpg (og:image, twitter:image).
//    A page with a photo (`og.photo`) gets the photo on the left and the brand panel on the right; a page without one
//    gets the logo mark instead. Cards are cached by their inputs (scripts/.og-cards-cache.json), so a rebuild only
//    redraws the cards whose text or photo changed. Cards no page uses any more are removed.
// 2. The default card (/og/cards/default.jpg) for anything without its own.
// 3. Icons from the logo: favicons (48, 96), apple-touch-icon (180), web-manifest icons (192, 512) and the square
//    logo for schema.org Organization.logo (logo-512.png, the logo on white, as Google shows it).
//
//   node scripts/build-og-cards.mjs          # only what changed
//   node scripts/build-og-cards.mjs --force  # redraw everything

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { OG_SIZE } from '../src/data/site.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const CARDS = path.join(PUBLIC, 'og/cards')
const CACHE_FILE = path.join(import.meta.dirname, '.og-cards-cache.json')
const FONTS = path.join(import.meta.dirname, 'assets/fonts')
const FORCE = process.argv.includes('--force')
const QUIET = process.argv.includes('--quiet')
// Bump when the card design changes, so every card is redrawn.
const TEMPLATE = 'v2'
const PHOTO_W = 560 // the photo column; the brand panel fills the rest

const { width: W, height: H } = OG_SIZE
const C = { bg: '#221a19', panel: '#2a201e', cream: '#faf3ec', text: '#d9c5be', gold: '#e4c98a', rose: '#d98391', line: '#4a3a36' }
// Old placeholder images: a page "with" one of these has no photo of its own.
const NO_PHOTO = new Set(['/og/default.png', '/og/cards/default.jpg'])

const fonts = [
  { name: 'Aboreto', file: 'aboreto-400-normal.woff', weight: 400, style: 'normal' },
  { name: 'Manrope', file: 'manrope-500-normal.woff', weight: 500, style: 'normal' },
  { name: 'Manrope', file: 'manrope-700-normal.woff', weight: 700, style: 'normal' },
  { name: 'Arapey', file: 'arapey-400-italic.woff', weight: 400, style: 'italic' },
].map((f) => ({ ...f, data: fs.readFileSync(path.join(FONTS, f.file)) }))

const sha = (...parts) => crypto.createHash('sha1').update(parts.join('\u0000')).digest('hex').slice(0, 16)
const dataUri = (buf, type) => `data:${type};base64,${buf.toString('base64')}`

// satori element helper
const h = (type, style, ...children) => ({ type, props: { style: { display: 'flex', ...style }, children: children.flat() } })
const img = (src, width, height, style = {}) => ({ type: 'img', props: { src, width, height, style } })

// Logo artwork, prepared once.
const LOGO_STACKED = path.join(PUBLIC, 'images/logo-stacked.webp')
const markBuffer = await sharp(LOGO_STACKED).extract({ left: 191, top: 0, width: 307, height: 350 }).png().toBuffer() // the face mark, above the wordmark
const wordmark = await sharp(path.join(PUBLIC, 'images/logo-horizontal.webp')).png().toBuffer()
const WORDMARK = dataUri(wordmark, 'image/png')
const MARK = dataUri(markBuffer, 'image/png')

// Title size by length, so long treatment names still fit in three lines.
const titleSize = (t) => (t.length <= 16 ? 64 : t.length <= 26 ? 56 : t.length <= 40 ? 48 : 42)

function panel({ eyebrow, title, width }) {
  return h(
    'div',
    { width, height: H, flexShrink: 0, boxSizing: 'border-box', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 60px 52px', backgroundColor: C.bg },
    img(WORDMARK, 300, 55),
    h(
      'div',
      { flexDirection: 'column' },
      eyebrow ? h('div', { fontFamily: 'Manrope', fontWeight: 700, fontSize: 18, letterSpacing: 3, color: C.gold, textTransform: 'uppercase' }, eyebrow) : [],
      h('div', { fontFamily: 'Aboreto', fontSize: titleSize(title), lineHeight: 1.18, color: C.cream, marginTop: 18 }, title),
      h('div', { width: 64, height: 2, backgroundColor: C.gold, marginTop: 30 }),
    ),
    h(
      'div',
      { justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: C.line, paddingTop: 22 },
      h('div', { fontFamily: 'Manrope', fontWeight: 500, fontSize: 22, color: C.text }, 'Whitefield, Bangalore'),
      h('div', { fontFamily: 'Arapey', fontStyle: 'italic', fontSize: 26, color: C.rose }, 'neosculpt6.com'),
    ),
  )
}

function brandCard({ eyebrow, title }) {
  return h(
    'div',
    { width: W, height: H, backgroundColor: C.bg },
    h('div', { width: 440, height: H, flexShrink: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: C.panel }, img(MARK, 263, 300)),
    panel({ eyebrow, title, width: W - 440 }),
  )
}

const svgToPng = async (tree, width) => new Resvg(await satori(tree, { width, height: H, fonts }), { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: false } }).render().asPng()
const jpeg = (img) => img.jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer()

// A photo card: the page photo, cropped to the photo column around its most interesting area, beside the panel.
// The photo is composited by sharp rather than drawn by satori, which is much faster.
async function photoCard({ eyebrow, title, photo }) {
  const left = await sharp(path.join(PUBLIC, photo)).resize(PHOTO_W, H, { fit: 'cover', position: sharp.strategy.attention }).toBuffer()
  const right = await svgToPng(panel({ eyebrow, title, width: W - PHOTO_W }), W - PHOTO_W)
  return jpeg(
    sharp({ create: { width: W, height: H, channels: 3, background: C.bg } }).composite([
      { input: left, left: 0, top: 0 },
      { input: right, left: PHOTO_W, top: 0 },
    ]),
  )
}

const photoHash = (src) => {
  const file = path.join(PUBLIC, src)
  if (!fs.existsSync(file)) throw new Error(`card photo missing: ${src}`)
  return sha(fs.readFileSync(file).toString('base64'))
}

// What each card says. Eyebrow: where the page sits; title: the page's short name.
function cardText(r) {
  const crumb = r.breadcrumbs?.[1]?.name
  switch (r.type) {
    case 'home':
      return { eyebrow: 'Hair · Skin · Body · Surgery', title: 'Doctor-Led Aesthetic Clinic' }
    case 'service':
    case 'technology':
      return { eyebrow: crumb ?? r.category, title: r.name }
    case 'hub':
      return { eyebrow: r.path === '/technology/' ? 'NeoSculpt6' : 'Speciality', title: r.name }
    case 'doctor':
      return { eyebrow: 'Our Doctors', title: r.name }
    case 'about':
      return { eyebrow: 'About NeoSculpt6', title: r.h1 }
    case 'journal':
      return { eyebrow: 'Journal', title: r.h1 }
    case 'article':
      return { eyebrow: 'Journal', title: r.name }
    default:
      return { eyebrow: 'NeoSculpt6', title: r.name }
  }
}

// icons -----------------------------------------------------------------------------------------------------

async function icons() {
  const clear = { r: 0, g: 0, b: 0, alpha: 0 }
  const square = (size, pad) => sharp(markBuffer).resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: clear }).png().toBuffer()
  const onDark = async (size, pad) =>
    sharp({ create: { width: size, height: size, channels: 4, background: C.bg } })
      .composite([{ input: await square(size, pad), gravity: 'center' }])
      .png()
      .toBuffer()
  const out = {
    // Browser tabs and Google's search-result favicon (a multiple of 48 px): the mark on transparent.
    'favicon-48.png': await sharp(await square(48, 2)).extend({ top: 2, bottom: 2, left: 2, right: 2, background: clear }).png().toBuffer(),
    'favicon-96.png': await sharp(await square(96, 4)).extend({ top: 4, bottom: 4, left: 4, right: 4, background: clear }).png().toBuffer(),
    // Home-screen icons: iOS and Android fill transparency, so these sit on the brand background.
    'apple-touch-icon.png': await onDark(180, 22),
    'icon-192.png': await onDark(192, 24),
    'icon-512.png': await onDark(512, 64),
    // schema.org Organization.logo: the full logo as it appears on white (the old site's square logo, og/default.png).
    'logo-512.png': await sharp(path.join(PUBLIC, 'og/default.png')).resize(512, 512).flatten({ background: '#ffffff' }).png().toBuffer(),
  }
  for (const [name, buf] of Object.entries(out)) fs.writeFileSync(path.join(PUBLIC, name), buf)
  return Object.keys(out)
}

// main -------------------------------------------------------------------------------------------------------

const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/pages.json'), 'utf8'))
const cache = FORCE || !fs.existsSync(CACHE_FILE) ? {} : JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
const nextCache = {}
fs.mkdirSync(CARDS, { recursive: true })

const jobs = [{ file: 'default.jpg', eyebrow: 'Whitefield, Bangalore', title: 'Doctor-Led Aesthetic Clinic', photo: null }]
for (const r of pages) {
  if (r.type === 'redirect' || r.type === 'legacy-demo' || !r.og?.image?.startsWith('/og/cards/')) continue
  const file = path.basename(r.og.image)
  const photo = r.og.photo && !NO_PHOTO.has(r.og.photo) ? r.og.photo : null
  jobs.push({ file, ...cardText(r), photo })
}

let drawn = 0
for (const job of jobs) {
  const key = sha(TEMPLATE, job.eyebrow ?? '', job.title, job.photo ?? '', job.photo ? photoHash(job.photo) : '')
  const dest = path.join(CARDS, job.file)
  nextCache[job.file] = key
  if (cache[job.file] === key && fs.existsSync(dest)) continue
  fs.writeFileSync(dest, job.photo ? await photoCard(job) : await jpeg(sharp(await svgToPng(brandCard(job), W))))
  drawn++
}

// Cards no page uses any more.
const keep = new Set(jobs.map((j) => j.file))
const stale = fs.readdirSync(CARDS).filter((f) => f.endsWith('.jpg') && !keep.has(f))
for (const f of stale) fs.unlinkSync(path.join(CARDS, f))

const made = await icons()
fs.writeFileSync(CACHE_FILE, JSON.stringify(nextCache, null, 2) + '\n')

const heavy = jobs.filter((j) => fs.statSync(path.join(CARDS, j.file)).size > 200_000).map((j) => j.file)
if (!QUIET || drawn) console.log(`og cards: ${jobs.length} cards (${drawn} drawn, ${jobs.length - drawn} cached, ${stale.length} stale removed); icons: ${made.join(', ')}`)
if (heavy.length) console.warn(`og cards over 200 KB: ${heavy.join(', ')}`)
