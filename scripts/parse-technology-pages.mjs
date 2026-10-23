#!/usr/bin/env node
// Parses content/technology/technology-international-patient.md (the Technology hub, nine technology pages and
// International Patients) into src/data/technology/parsed.json: one record per page with its SEO table and every
// section's copy, word for word, in the doc's order. The data layer (src/data/technology/index.ts) adds images,
// button actions and doctor portraits on top; scripts/generate-pages.mjs takes each page's title tag, meta
// description, H1 and breadcrumb name from here (these pages have no SEO CSV rows).
//
//   node scripts/parse-technology-pages.mjs           # writes parsed.json, prints a warning for anything unexpected
//
// The doc is clean markdown: "# **Page N — Name**", "### **N\. Section**" (or "### **—. Sidebar …**"), two-column
// label tables whose first row is the table header (so its label is not bold), and row tables headed "#",
// "Question", "Card title" or "Group". Escapes ("\|", "\+", "\-", "\#") are undone. Doc-only asides in a value
// ("(scrolls to section 6)", "(live text says "DHT", see note)", "(live page is noindex …)") are dropped; the doc's
// "Note:" and "Added section:" lines are kept with the page for the sign-off list. Step numbers are not stored: the
// templates number steps by position, so the live "0101" / "0202" duplicates (Excimer, Body Contouring) cannot recur.
// The doc itself is never edited.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DOC_REL = 'content/technology/technology-international-patient.md'
const DOC = path.resolve(ROOT, '..', DOC_REL)
const OUT = path.join(ROOT, 'src/data/technology/parsed.json')

if (!fs.existsSync(DOC)) {
  console.log(`parse-technology: ${DOC} not found, keeping the committed parsed.json`)
  process.exit(0)
}

const warnings = []
const warn = (page, msg) => warnings.push(`${page}: ${msg}`)

// --- text helpers --------------------------------------------------------------------------------------------

const unescapeMd = (s) => s.replace(/\\([\\`*_{}[\]()#+\-.!|:<>=&])/g, '$1')
const ASIDE = /\s*\((?:live page|live text|scrolls to|none on the live)[^)]*\)/gi
const tidy = (s) => unescapeMd(s).replace(ASIDE, '').replace(/\s+/g, ' ').trim()
const clean = (s) => tidy(s.replace(/\*\*/g, ''))

// Cells split on unescaped pipes; values keep their ** until clean() (the hub card cell needs them).
const cellsOf = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
    .split(/(?<!\\)\|/)
    .map((c) => c.trim())

// "Label → /path/ Label → #id" runs (links, buttons, chips). An empty cell, or the doc's "—" (with or without a
// reason, e.g. Excimer's "— (no matching service page link confirmed; leave out)"), is no links.
function links(value) {
  const v = clean(value)
  if (!v || v.startsWith('—')) return []
  const out = [...v.matchAll(/(.+?)\s+→\s+(\S+)\s*/g)].map((m) => ({ label: m[1].trim(), href: m[2] }))
  if (!out.length) return [{ label: v, href: null }]
  return out
}
const button = (value) => links(value)[0] ?? null
// "◆  One ◆  Two" / "✓  One ✓  Two"
const marks = (value) => clean(value).split(/[◆✓]/).map((x) => x.trim()).filter(Boolean)
// "MBBS · MD Dermatology"; the contact card's "A → /x/ · Call … · WhatsApp"
const dots = (value) => clean(value).split(/\s+·\s+/).map((x) => x.trim()).filter(Boolean)

// --- section reader ----------------------------------------------------------------------------------------

const ROW_HEADERS = new Set(['#', 'Question', 'Card title', 'Card title (H3)', 'Group'])

// One section: its tables (in order), each either label fields or rows, plus its Note / Added section lines.
function readSection(lines) {
  const tables = []
  const notes = []
  let current = null
  for (const raw of lines) {
    const line = raw.trim()
    if (!line.startsWith('|')) {
      current = null
      const note = line.match(/^\*\*(Note|Added section):\*\*\s*(.+)$/)
      if (note) notes.push({ kind: note[1] === 'Note' ? 'note' : 'added', text: clean(note[2]) })
      continue
    }
    if (/^\|\s*:?-{2,}/.test(line)) continue
    const c = cellsOf(line)
    if (!current) {
      const head = clean(c[0])
      current = ROW_HEADERS.has(head) ? { kind: 'rows', header: c.map(clean), rows: [] } : { kind: 'fields', fields: [] }
      tables.push(current)
      if (current.kind === 'rows') continue
    }
    if (current.kind === 'rows') current.rows.push(c)
    else current.fields.push([clean(c[0]), c.slice(1).join(' | ')])
  }

  const fieldTables = tables.filter((t) => t.kind === 'fields')
  const all = fieldTables.flatMap((t) => t.fields)
  const used = new Set()
  const get = (label, from = all) => {
    const hit = from.find(([l]) => l === label)
    if (hit) used.add(hit)
    return hit ? hit[1] : null
  }
  return {
    tables,
    notes,
    /** Raw value of a label (first match), or null. */
    raw: (label, from) => get(label, from),
    /** Cleaned text of a label, or null. */
    one: (label, from) => {
      const v = get(label, from)
      return v === null ? null : clean(v)
    },
    /** "Paragraph" or "Paragraph 1", "Paragraph 2", … in order. */
    paragraphs: (base = 'Paragraph', from = all) => {
      const hits = from.filter(([l]) => l === base || new RegExp(`^${base} \\d+$`).test(l))
      hits.forEach((h) => used.add(h))
      return hits.map(([, v]) => clean(v))
    },
    fieldTables,
    rows: () => tables.filter((t) => t.kind === 'rows'),
    unused: () => all.filter((f) => !used.has(f)).map(([l]) => l),
  }
}

// Step / card / FAQ rows: the last two cells are title and text ("#" tables have the number first).
const rowsOf = (table) => table.rows.map((c) => ({ title: clean(c.at(-2)), text: clean(c.at(-1)) }))

// --- page builders -------------------------------------------------------------------------------------------

const KINDS = {
  '/technology/': 'technology-hub',
  '/technology/artas-robotic-hair-transplant/': 'artas-detail',
  '/international-patients/': 'international-patients',
}
const kindOf = (p) => KINDS[p] ?? 'technology-detail'

// Section keys by title, so a page's own layout (ARTAS, International Patients) is read in its own order.
const SECTION_KEYS = [
  [/^Page banner/i, 'hero'],
  [/^Introduction/i, 'intro'],
  [/^Technology cards/i, 'cards'],
  [/^How it is different/i, 'different'],
  [/^ARTAS vs/i, 'comparison'],
  [/personalised assessment/i, 'assessment'],
  [/benefits/i, 'benefits'],
  [/^How it works/i, 'process'],
  [/candidates|^Who may be assessed/i, 'candidates'],
  [/^Results/i, 'expectations'],
  [/^Your doctor|^Clinical advice/i, 'doctors'],
  [/^Cost and consultation/i, 'cost'],
  [/^Estimates/i, 'estimates'],
  [/^Success stories/i, 'reviews'],
  [/^FAQs/i, 'faqs'],
  [/^Closing/i, 'closing'],
  [/^Sidebar/i, 'explore'],
  [/^Three steps/i, 'steps'],
  [/^Six clinical pathways/i, 'pathways'],
  [/^Patient journey/i, 'journey'],
  [/^Before you travel/i, 'travel'],
]

function doctorCards(s, page) {
  return s.fieldTables
    .filter((t) => t.fields.some(([l]) => l === 'Card: name (H3)'))
    .map((t) => {
      const chips = s.raw('Card: qualification chips', t.fields)
      const qualifications = s.one('Card: qualifications', t.fields)
      if (!chips && !qualifications) warn(page, 'doctor card without qualifications')
      return {
        name: s.one('Card: name (H3)', t.fields),
        chips: chips ? dots(chips) : null,
        qualifications,
        specialty: s.one('Card: speciality line', t.fields),
        text: s.one('Card: text', t.fields),
        button: button(s.raw('Card: button', t.fields) ?? ''),
      }
    })
}

const BUILD = {
  hero: (s) => ({
    eyebrow: s.one('Eyebrow'),
    h1: s.one('H1'),
    intro: s.one('Intro text'),
    buttons: [s.raw('Button'), s.raw('Button 1'), s.raw('Button 2')].filter(Boolean).map(button),
  }),
  intro: (s) => ({ h2: s.one('H2'), paragraphs: s.paragraphs() }),
  different: (s) => ({ h2: s.one('H2'), paragraphs: s.paragraphs() }),
  assessment: (s) => ({ h2: s.one('H2'), paragraph: s.one('Paragraph') }),
  benefits: (s) => {
    const titles = s.raw('Card titles')
    const table = s.rows()[0]
    return {
      h2: s.one('H2'),
      subline: s.one('Sub-line'),
      cards: titles ? marks(titles).map((title) => ({ title, text: null })) : table ? rowsOf(table) : [],
      smallPrint: s.one('Small print under cards'),
    }
  },
  comparison: (s) => ({ h2: s.one('H2'), introLine: s.one('Intro line'), cards: rowsOf(s.rows()[0] ?? { rows: [] }) }),
  process: (s) => ({ eyebrow: s.one('Eyebrow'), h2: s.one('H2'), steps: rowsOf(s.rows()[0] ?? { rows: [] }) }),
  candidates: (s) => ({
    h2: s.one('H2'),
    items: marks(s.raw('Checklist (ticks)') ?? ''),
    paragraphs: [s.one('Paragraph under checklist'), ...s.paragraphs()].filter(Boolean),
  }),
  expectations: (s) => ({ h2: s.one('H2'), paragraphs: s.paragraphs() }),
  doctors: (s, page) => ({
    eyebrow: s.one('Eyebrow'),
    h2: s.one('H2'),
    paragraphs: s.paragraphs('Paragraph', s.fieldTables[0]?.fields ?? []),
    cards: doctorCards(s, page),
  }),
  cost: (s) => ({ h2: s.one('H2'), paragraphs: s.paragraphs(), buttons: [s.raw('Button')].filter(Boolean).map(button) }),
  estimates: (s) => ({ h2: s.one('H2'), paragraphs: s.paragraphs() }),
  reviews: (s) => ({ eyebrow: s.one('Eyebrow'), h2: s.one('H2'), note: s.one('Slides') }),
  faqs: (s) => ({
    eyebrow: s.one('Eyebrow'),
    h2: s.one('H2'),
    items: (s.rows()[0]?.rows ?? []).map((c) => ({ q: clean(c[0]), a: clean(c[1]) })),
    button: s.raw('Button') ? button(s.raw('Button')) : null,
  }),
  closing: (s) => ({ h2: s.one('H2'), paragraph: s.one('Paragraph'), buttons: [s.raw('Button')].filter(Boolean).map(button) }),
  explore: (s) => ({
    heading: s.one('List heading'),
    links: links(s.raw('Links') ?? ''),
    related: links(s.raw('Related treatments') ?? ''),
    contact: dots(s.raw('Contact card') ?? '').map((part) => button(part)),
  }),
  // Hub: "**Title** Label: small label" | card text | "Read More → /path/"
  cards: (s, page) =>
    (s.rows()[0]?.rows ?? []).map((c) => {
      const m = tidy(c[1]).match(/^\*\*(.+?)\*\*\s*Label:\s*(.+)$/)
      if (!m) warn(page, `hub card title cell not understood: "${c[1]}"`)
      return { group: clean(c[0]), title: m ? m[1].trim() : clean(c[1]), label: m ? m[2].trim() : null, text: clean(c[2]), button: button(c[3]) }
    }),
  steps: (s) => ({ h2: s.one('H2'), cards: rowsOf(s.rows()[0] ?? { rows: [] }) }),
  pathways: (s) => ({
    h2: s.one('H2'),
    tabs: s.fieldTables
      .filter((t) => t.fields.some(([l]) => l === 'Tab'))
      .map((t) => ({
        tab: s.one('Tab', t.fields),
        h3: s.one('H3', t.fields),
        paragraph: s.one('Paragraph', t.fields),
        chips: links(s.raw('Treatment chips', t.fields) ?? '').filter((l) => l.href),
        button: button(s.raw('Button', t.fields) ?? ''),
      })),
  }),
  journey: (s) => ({ eyebrow: s.one('Eyebrow'), h2: s.one('H2'), steps: rowsOf(s.rows()[0] ?? { rows: [] }) }),
  travel: (s) => ({ h2: s.one('H2'), paragraphs: s.paragraphs() }),
}

// The sections each page type must have, in the doc's order.
const EXPECTED = {
  'technology-hub': ['hero', 'cards', 'doctors', 'closing'],
  'technology-detail': ['hero', 'intro', 'different', 'assessment', 'benefits', 'process', 'candidates', 'expectations', 'doctors', 'cost', 'reviews', 'faqs', 'closing', 'explore'],
  'artas-detail': ['hero', 'intro', 'comparison', 'process', 'benefits', 'candidates', 'expectations', 'doctors', 'cost', 'reviews', 'faqs', 'closing', 'explore'],
  'international-patients': ['hero', 'intro', 'steps', 'pathways', 'journey', 'travel', 'doctors', 'estimates', 'reviews', 'faqs', 'closing'],
}

// --- main ------------------------------------------------------------------------------------------------------

const docLines = fs.readFileSync(DOC, 'utf8').split('\n')
const starts = docLines.flatMap((l, i) => (/^# \*\*Page \d+/.test(l) ? [i] : []))
const out = []

for (const [n, start] of starts.entries()) {
  const name = clean(docLines[start].match(/^# \*\*Page \d+\s+—\s+(.+?)\*\*/)?.[1] ?? '')
  const body = docLines.slice(start + 1, starts[n + 1] ?? docLines.length)
  const pageNotes = body.filter((l) => /^\*[^*].*\*$/.test(l.trim())).map((l) => clean(l.trim().slice(1, -1)))
  const sections = []
  for (const [i, l] of body.entries()) {
    const m = l.match(/^### \*\*(.+?)\*\*/)
    if (m) sections.push({ title: tidy(m[1]).replace(/^(\d+|—)\.\s*/, ''), line: start + i + 2, lines: [] })
    else if (sections.length) sections.at(-1).lines.push(l)
  }

  const seoSec = sections.find((s) => s.title === 'SEO settings')
  const seo = readSection(seoSec?.lines ?? [])
  const pagePath = seo.one('URL (keep)')
  const page = pagePath ?? name
  if (!pagePath) {
    warn(name, 'no URL in the SEO table')
    continue
  }
  const kind = kindOf(pagePath)
  const record = {
    path: pagePath,
    name,
    kind,
    source: `${DOC_REL}:${start + 1}`,
    seo: {
      title: seo.one('Title tag'),
      description: seo.one('Meta description'),
      h1: seo.one('H1'),
      robots: seo.one('Robots'),
      breadcrumb: (seo.one('Breadcrumb') ?? '').split(/\s*›\s*/).filter(Boolean),
      note: seo.notes.map((x) => x.text).join(' ') || null,
    },
    order: [],
    notes: pageNotes.map((text) => ({ section: 'page', kind: 'note', text })),
  }

  for (const s of sections) {
    if (s === seoSec) continue
    const key = SECTION_KEYS.find(([re]) => re.test(s.title))?.[1]
    if (!key) {
      warn(page, `unknown section "${s.title}" (line ${s.line})`)
      continue
    }
    if (record[key]) warn(page, `section "${key}" appears twice`)
    const sec = readSection(s.lines)
    record[key] = BUILD[key](sec, page)
    record.order.push(key)
    for (const note of sec.notes) record.notes.push({ section: key, ...note })
    const unused = sec.unused()
    if (unused.length) warn(page, `${key}: labels not read: ${unused.join(', ')}`)
  }

  // Checks: the expected sections in order, the hero H1 against the SEO H1, empty values.
  const expected = EXPECTED[kind]
  if (record.order.join() !== expected.join()) warn(page, `sections ${record.order.join(', ')}; expected ${expected.join(', ')}`)
  if (record.hero?.h1 && record.hero.h1 !== record.seo.h1) warn(page, `hero H1 "${record.hero.h1}" differs from the SEO H1 "${record.seo.h1}"`)
  for (const [k, v] of Object.entries(record.seo)) if (v === null || v === '' || (Array.isArray(v) && !v.length)) if (k !== 'note') warn(page, `SEO ${k} missing`)
  const walk = (v, at) => {
    if (v === '' || (Array.isArray(v) && !v.length && !/chips|related|links|paragraphs/.test(at))) warn(page, `empty value at ${at}`)
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${at}[${i}]`))
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${at}.${k}`)
  }
  for (const key of record.order) walk(record[key], key)
  out.push(record)
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
console.log(`parse-technology: ${out.length} pages → ${path.relative(ROOT, OUT)}; ${warnings.length} warnings`)
if (process.argv.includes('--quiet')) process.exit(0)
for (const w of warnings) console.log('  ' + w)
