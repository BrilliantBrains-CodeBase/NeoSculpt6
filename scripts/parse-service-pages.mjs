#!/usr/bin/env node
// Parses content/service/service-page.md (a PDF-to-markdown export of "Service Page Content — Black Template") into
// src/data/services/parsed.json: one record per service page with every section's copy, word for word, in the doc's
// order. The template's data layer (src/data/services/index.ts) adds images, doctor and links on top.
//
//   node scripts/parse-service-pages.mjs            # writes parsed.json, prints a warning for anything it had to guess
//
// The export is damaged in predictable ways; each is repaired, never reworded:
// - page-break lines ("69", "NeoSculpt6 · Service page content") in the middle of entries;
// - table cells wrapped with <br> (a break after a hyphen is closed up: "non-<br>surgical");
// - cells split at a page column ("|**Eyeb**|**row**<br>OUR PR|OCESS|", "Hair Los|s<br>Men with…");
// - rows continued on the next page ("||planned, from donor…|");
// - labels that fell out of their table ("**H2** Why Choose…", "###### **Sub-line**", a value printed before
//   its "**Buttons**" label, "**H2** … **Intro** …" on one line);
// - a FAQ row broken into a bullet with question and answer run together.
// Two dictionaries from the old-site capture (../scraped/pages/*/data.json) help where the text alone is ambiguous:
// the live page's headings and FAQ questions, which the doc keeps exactly as live.
// Later service docs are clean markdown (content/service/Blepharoplasty-and-Chin-Augmentation.md, listed in
// SUPPLEMENTS): their pages replace the same URL from service-page.md, or add a new page.
// The docs themselves (content/) are never edited.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const DOC = path.resolve(ROOT, '../content/service/service-page.md')
const SCRAPED = path.resolve(ROOT, '../scraped')
const OUT = path.join(ROOT, 'src/data/services/parsed.json')
const PAGES = path.join(ROOT, 'src/data/pages.json')

if (!fs.existsSync(DOC)) {
  console.log(`parse-services: ${DOC} not found, keeping the committed parsed.json`)
  process.exit(0)
}

const warnings = []
const warn = (page, msg) => warnings.push(`${page}: ${msg}`)

// --- text helpers --------------------------------------------------------------------------------------------

// Joins <br>-wrapped lines: a space, or nothing after a hyphen ("non-<br>surgical", "Long-<br>Term").
const unwrap = (s) =>
  s
    .split(/<br>/)
    .map((x) => x.trim())
    .filter(Boolean)
    .reduce((acc, x) => (!acc ? x : /[A-Za-z]-$/.test(acc) ? acc + x : `${acc} ${x}`), '')

const clean = (s) =>
  unwrap(s)
    .replace(/\s*\(live page [^)]*\)/gi, '')
    .replace(/\*\*/g, '')
    .replace(/\\([_*|])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

// A value that ends a sentence; anything else is cut off and continues in the next fragment.
const ends = (s) => /[.!?:;)"”’…]$/.test(s.trim())

const join = (a, b) => (!a ? b : !b ? a : /[A-Za-z]-$/.test(a) ? a + b : `${a} ${b}`)

// Table rows: cells are split on "|" except the " | " that separates buttons or title parts inside a cell.
function cells(line) {
  const inner = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  const out = []
  let cur = ''
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i]
    if (ch === '|' && !(inner[i - 1] === ' ' && inner[i + 1] === ' ')) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out
}

// Known labels (the doc's left-hand column), keyed by their text with spaces and case removed.
const LABELS = [
  'URL (unchanged)', 'Title tag (unchanged)', 'H1 (unchanged)', 'Meta description', 'Robots', 'Note',
  'H1', 'Breadcrumb', 'Intro paragraph', 'Buttons', 'Phone strip',
  'H2', 'Paragraphs', 'Intro line', 'Sub-line', 'Eyebrow', 'Kicker', 'Paragraph', 'Chips', 'Intro', 'Heading', 'Text',
  'Checklist (ticks)', 'Paragraph under checklist',
  'Card: name', 'Card: speciality line', 'Card: qualification chips', 'Card: button', 'Doctor block eyebrow',
  'Doctor block paragraphs', 'Cards', 'Button under accordion', 'Button', 'List heading', 'Links (same speciality)',
  'Contact card',
]
const key = (s) => s.replace(/\*\*/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase()
const LABEL_BY_KEY = new Map(LABELS.map((l) => [key(l), l]))
const labelOf = (s) => LABEL_BY_KEY.get(key(s)) ?? null

// --- old-site dictionaries -----------------------------------------------------------------------------------

const manifest = fs.existsSync(path.join(SCRAPED, 'manifest.json'))
  ? JSON.parse(fs.readFileSync(path.join(SCRAPED, 'manifest.json'), 'utf8'))
  : []
function live(urlPath) {
  const row = manifest.find((r) => new URL(r.url).pathname === urlPath)
  if (!row) return { headings: [], faqs: [], video: null }
  const data = JSON.parse(fs.readFileSync(path.join(SCRAPED, row.data_json), 'utf8'))
  const tidy = (s) => (s ?? '').replace(/\s+/g, ' ').trim()
  return {
    headings: (data.headings ?? []).map((h) => tidy(h.text)),
    faqs: (data.faqs ?? []).map((f) => tidy(f.question)),
    video: row.video_planned || null,
  }
}

// Site routes (pages.json, from generate-pages.mjs), to turn the sidebar's link labels into URLs.
const routes = JSON.parse(fs.readFileSync(PAGES, 'utf8')).filter((r) => r.type !== 'redirect' && r.type !== 'gone')
const norm = (s) => s.toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9&]+/g, ' ').trim()
// The page in the same hub first, then any service page (a doc's list can cross hubs: "Chin Fillers" on a surgery page).
function hrefFor(label, hub) {
  const want = norm(label.replace(/\s+in Bangalore$/i, ''))
  const find = (list) =>
    list.find((r) => norm(r.name) === want) ??
    list.find((r) => norm(r.title).startsWith(want) || norm(r.h1).startsWith(want)) ??
    list.find((r) => norm(r.path.split('/').at(-2).replace(/-in-bangalore$/, '').replace(/-/g, ' ')) === want)
  const services = routes.filter((r) => r.type === 'service')
  return (find(services.filter((r) => r.section === hub)) ?? find(services))?.path ?? null
}

// --- section tokeniser ---------------------------------------------------------------------------------------

// Turns one section's lines into fields (label → value) and numbered rows, repairing the damage listed above.
function parseSection(lines, page, name, dict) {
  const fields = new Map() // label -> string[] (paragraphs)
  const rows = [] // { title, text, raw? }
  const order = []
  let current = null // { kind: 'field', label } | { kind: 'row', row }
  let pendingLabels = [] // labels waiting for a value
  let orphan = null // text that arrived before its label

  const setField = (label, value) => {
    if (!fields.has(label)) {
      fields.set(label, [])
      order.push(label)
    }
    if (value) fields.get(label).push(value)
    current = { kind: 'field', label }
  }
  const appendCurrent = (text, asNewParagraph) => {
    if (!current) return false
    if (current.kind === 'row') {
      current.row.text = join(current.row.text, text)
      return true
    }
    const list = fields.get(current.label)
    if (!list.length || asNewParagraph) list.push(text)
    else list[list.length - 1] = join(list[list.length - 1], text)
    return true
  }
  const PARAGRAPHS = ['Paragraphs', 'Doctor block paragraphs']
  const flushOrphan = () => {
    const isNewParagraph = current?.kind === 'field' && PARAGRAPHS.includes(current.label) && ends(lastValue())
    return appendCurrent(orphan, isNewParagraph)
  }
  const lastValue = () => {
    if (!current) return ''
    if (current.kind === 'row') return current.row.text
    const list = fields.get(current.label)
    return list[list.length - 1] ?? ''
  }

  // Plain text with no label: the value of a waiting label, the end of a cut-off value, or an orphan.
  const takeText = (text) => {
    if (!text) return
    if (/^[a-z]/.test(text) && current && !ends(lastValue())) {
      // The rest of a value cut by a page break, even when a label that fell out sits in between.
      appendCurrent(text)
      return
    }
    if (pendingLabels.length === 1) {
      setField(pendingLabels[0], text)
      pendingLabels = []
    } else if (pendingLabels.length > 1) {
      splitAcross(pendingLabels, text)
      pendingLabels = []
    } else if (current && !ends(lastValue())) appendCurrent(text)
    else if (orphan === null) orphan = text
    else orphan = join(orphan, text)
  }

  // Two labels, one line holding both values ("Why Choose … in Bangalore? Phototherapy for …"): the first value is
  // a live heading where one matches, else the text up to the first sentence end.
  function splitAcross(labels, text) {
    let rest = text
    for (let i = 0; i < labels.length - 1; i++) {
      const known = dict.headings.filter((h) => rest.startsWith(h)).sort((a, b) => b.length - a.length)[0]
      const m = known ? null : rest.match(/^(.+?[?.!])\s+(.*)$/)
      const head = known ?? m?.[1]
      if (!head) {
        warn(page, `${name}: could not split "${rest.slice(0, 60)}…" across ${labels.join(' + ')}`)
        setField(labels[i], rest)
        rest = ''
        continue
      }
      setField(labels[i], head)
      rest = rest.slice(head.length).trim()
      if (!known) warn(page, `${name}: split ${labels[i]} at the first sentence end: "${head}"`)
    }
    setField(labels[labels.length - 1], rest)
  }

  const takeLabel = (label, value) => {
    if (value) {
      if (orphan !== null) {
        // An unclaimed line before a labelled one belongs to the previous value.
        if (!current || !flushOrphan()) warn(page, `${name}: dropped stray text "${orphan.slice(0, 60)}"`)
        orphan = null
      }
      pendingLabels = []
      setField(label, value)
    } else if (orphan !== null) {
      // The value was printed before its label ("Book a Consultation | …" then "**Buttons**").
      setField(label, orphan)
      orphan = null
    } else pendingLabels.push(label)
  }

  for (const raw of lines) {
    let line = raw.replace(/^#{5,6}\s+/, '').trim()
    if (!line) continue

    if (line.startsWith('|')) {
      if (/^\|[\s:|-]+\|?$/.test(line)) continue // separator
      const c = cells(line)
      const first = c[0].trim()
      if (first.startsWith('**#') || (c.every((x) => !x.trim() || /^\*\*/.test(x.trim())) && c.some((x) => x.includes('#')))) {
        // Header row of a numbered table, repeated after a page break; it may carry the end of the previous row's
        // text after its bold header ("|**Card text**<br>therapies are documented …|").
        const carried = clean(c.map((x) => x.replace(/\*\*[^*]*\*\*/g, '')).join('<br>'))
        if (carried && current?.kind === 'row') current.row.text = join(current.row.text, carried)
        else if (carried) warn(page, `${name}: text in a table header: "${carried.slice(0, 60)}"`)
        continue
      }
      const numbered = first.match(/^(\d+)(?:<br>(.+))?$/)
      if (numbered) {
        // Numbered row: number, title, text. The number and title may share a cell ("01<br>Treatment Area"). A title
        // cut at the column edge spills into an extra middle column ("Brow Asses|sment|") or the start of the text
        // ("Hair Los|s<br>Men…"); the spill-over ends the title's first line ("Patte<br>Thinning|rn<br>…").
        const after = numbered[2] ? [numbered[2], ...c.slice(1)] : c.slice(1)
        if (after.length === 1 && after[0].includes('<br>')) {
          // Title and text in one cell (the header merged "Card title<br>Card text"): the title is the live heading
          // the cell starts with, else its first line.
          const all = clean(after[0])
          const known = dict.headings.filter((h) => all.startsWith(h + ' ')).sort((x, y) => y.length - x.length)[0]
          const [t0, ...rest] = after[0].split('<br>')
          after.splice(0, 1, ...(known ? [known, all.slice(known.length).trim()] : [t0, rest.join('<br>')]))
        }
        const titleLines = (after[0] ?? '').split('<br>')
        let text = after.length > 1 ? after[after.length - 1] : ''
        let spill = after.slice(1, -1).join('')
        const cut = after.length === 2 && text.match(/^([a-z][^<]{0,14})<br>/)
        if (cut && /[A-Za-z]$/.test(titleLines[0])) {
          spill = cut[1]
          text = text.slice(cut[0].length)
        }
        titleLines[0] += spill
        const row = { title: clean(titleLines.join('<br>')), text: clean(text) }
        rows.push(row)
        current = { kind: 'row', row }
        pendingLabels = []
        continue
      }
      if (!first || (current?.kind === 'row' && !/^\*\*/.test(first))) {
        // Continuation row: the rest of the previous row or value, split by a page break. In a numbered table its
        // first cell may hold the end of the title ("|me?|management options.|").
        const parts = (first ? c : c.slice(1)).map((x) => x.trim())
        if (current?.kind === 'row') {
          const [t, ...x] = parts.length > 1 ? parts : ['', ...parts]
          current.row.title = join(current.row.title, clean(t))
          current.row.text = join(current.row.text, clean(x.join('')))
          if (current.row.raw) resolveBullet(current.row, page, name, dict)
        } else if (current?.kind === 'field') {
          const text = clean(parts.join(''))
          const label = current.label
          if (label === 'Checklist (ticks)') appendCurrent(text, true)
          else appendCurrent(text, ends(lastValue()) && ['Paragraphs', 'Doctor block paragraphs'].includes(label))
        }
        continue
      }
      // Label row; the label may itself be split ("**Eyeb**|**row**<br>OUR PR|OCESS").
      const joined = c.join('')
      const two = joined.match(/^((?:\*\*[^*]*\*\*)+)<br>((?:\*\*[^*]*\*\*)+)(.*)$/)
      if (two && labelOf(two[1]) && labelOf(two[2])) {
        // Two labels sharing a cell, their values run together: the first is a live heading where one matches,
        // else the first line.
        const [a, b] = [labelOf(two[1]), labelOf(two[2])]
        const lines = two[3].split('<br>')
        const all = clean(two[3])
        const known = dict.headings.filter((h) => all.startsWith(h)).sort((x, y) => y.length - x.length)[0]
        const head = known ?? clean(lines[0])
        if (!known) warn(page, `${name}: split ${a} + ${b} at the first line: "${head}"`)
        takeLabel(a, head)
        takeLabel(b, all.slice(head.length).trim())
        continue
      }
      const m = joined.match(/^((?:\*\*[^*]*\*\*)+)(.*)$/)
      const label = m ? labelOf(m[1]) : null
      if (!label) {
        warn(page, `${name}: unknown table row ${line.slice(0, 80)}`)
        continue
      }
      if (label === 'Doctor block paragraphs') {
        // The doctor block's paragraphs share one cell; the second starts on a new line with "His …" / "Her …".
        const [firstPara, ...more] = m[2].split(/(?<=\.)<br>(?=(?:His|Her|He|She) )/)
        takeLabel(label, clean(firstPara))
        for (const para of more) appendCurrent(clean(para), true)
        continue
      }
      const value = label === 'Checklist (ticks)' ? m[2].trim() : clean(m[2])
      takeLabel(label, value)
      continue
    }

    if (/^\*\*Design:\*\*/.test(line)) {
      // Design note; a label can share its line ("… not in the black template_ **H2** Breast …").
      const rest = line.replace(/^\*\*Design:\*\*/, '')
      const at = rest.search(/\*\*[^*]+\*\*/)
      if (at < 0 || !labelOf(rest.slice(at).match(/\*\*[^*]+\*\*/)[0])) continue
      line = rest.slice(at)
    }
    if (/^\*\*#/.test(line) || /^_·/.test(line)) continue // table header that fell out; design-note continuation
    if (/^\d+ service pages · hub page:/.test(line)) continue // the next speciality's intro line
    if (/^- \*\*/.test(line)) line = line.slice(2) // labels written as a bullet list ("- **H2** Who Can …")
    const loose = line.match(/^(\d{2}) (.+)$/)
    if (loose) {
      // A numbered row that lost its table: "01 Facial Skin & Hair Assessment Clinical review …". The title is the
      // live heading it starts with.
      const known = dict.headings.filter((h) => loose[2].startsWith(h + ' ')).sort((x, y) => y.length - x.length)[0]
      if (known) {
        const row = { title: known, text: clean(loose[2].slice(known.length)) }
        rows.push(row)
        current = { kind: 'row', row }
        continue
      }
      warn(page, `${name}: numbered line without a table: "${line.slice(0, 60)}"`)
    }
    if (/^- \d+\s/.test(line)) {
      // A FAQ row broken into a bullet: number, then question and answer run together.
      const row = { title: '', text: '', raw: line.replace(/^- \d+\s+/, '') }
      rows.push(row)
      current = { kind: 'row', row }
      continue
    }

    const video = line.match(/^Video:\s*(.+)$/)
    if (video) {
      setField('Video', clean(video[1]))
      current = null
      continue
    }

    // Loose line: labels and values in any mix ("**H2** X **Intro** Y", "**Buttons**", plain text).
    const parts = line.split(/(\*\*[^*]+\*\*)/).filter((x) => x.trim())
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i].trim()
      const label = /^\*\*.*\*\*$/.test(p) ? labelOf(p) : null
      if (/^\*\*.*\*\*$/.test(p) && !label) {
        // Bold text that is not a label (a header fragment such as "**Card text**"): ignore.
        if (!/card|text|title|supporting|question|answer|checklist|cost factor|explanation|accordion/i.test(p)) {
          warn(page, `${name}: unknown bold text ${p}`)
        }
        continue
      }
      if (label) {
        const next = parts[i + 1] && !/^\*\*.*\*\*$/.test(parts[i + 1].trim()) ? clean(parts[++i]) : ''
        takeLabel(label, next)
      } else takeText(clean(p))
    }
  }

  if (orphan !== null) {
    const into = current?.kind === 'row' ? 'the last row' : current?.label
    if (current && flushOrphan()) {
      if (!(current.kind === 'field' && PARAGRAPHS.includes(current.label))) warn(page, `${name}: appended trailing text to ${into}: "${orphan.slice(0, 50)}"`)
    } else warn(page, `${name}: dropped stray text "${orphan.slice(0, 60)}"`)
  }
  // A "**Buttons**" label left without a value: its value ran into the end of the previous text ("… irregularity.
  // Book a Body-Contouring Assessment | Get a Personalised Cost Estimate").
  if (pendingLabels.includes('Buttons')) {
    for (const label of [...order].reverse()) {
      const list = fields.get(label)
      const last = list?.[list.length - 1] ?? ''
      const m = last.match(/^(.*[.!?])\s+([^.!?]+ \| [^.!?]+)$/)
      if (m) {
        list[list.length - 1] = m[1]
        setField('Buttons', m[2])
        pendingLabels = pendingLabels.filter((l) => l !== 'Buttons')
        break
      }
    }
  }
  for (const label of pendingLabels) warn(page, `${name}: label ${label} has no value`)
  for (const row of rows) if (row.raw) warn(page, `${name}: could not split FAQ bullet "${row.raw.slice(0, 60)}…"`)

  const one = (label) => (fields.get(label) ?? []).join(' ')
  const many = (label) => fields.get(label) ?? []
  return { one, many, has: (l) => fields.has(l), rows, order }
}

// The bullet holds "<question start> <answer start>"; the continuation row adds the question's end and the answer's
// end. The live FAQ question that ends with that question end tells where the question stops.
function resolveBullet(row, page, name, dict) {
  const tail = row.title
  const q = dict.faqs.find((f) => f.endsWith(tail) && row.raw.startsWith(f.slice(0, f.length - tail.length).trim()))
  if (!q) return
  const head = q.slice(0, q.length - tail.length).trim()
  row.title = q
  row.text = join(clean(row.raw.slice(head.length)), row.text)
  delete row.raw
}

// One-off repairs: a cell split exactly at a word break, which no rule can tell from a mid-word cut.
// [field, value as parsed, value as written in the doc]
const FIXES = {
  '/cosmetic-surgery/scar-revision-surgery-in-bangalore/': [['process.eyebrow', 'OURPROCESS', 'OUR PROCESS']],
}

// Checked by hand and correct as parsed: whole titles in the doc that happen to start a longer live heading, and doc
// FAQ questions that are not on the live page (one differs; Blepharoplasty FAQ 8 is new in the 2026-10 doc).
const CHECKED = new Set([
  'Personalised Treatment Plan',
  'Formulation Review',
  'Can laser treat vaginal dryness in everyone?',
  'Is eye-bag correction the same as lower blepharoplasty?',
])

// --- entries -------------------------------------------------------------------------------------------------

const doc = fs.readFileSync(DOC, 'utf8')
const lines = doc
  .split('\n')
  .filter((l) => !/^\s*\d+\s*$/.test(l) && !/^\s*NeoSculpt6 · Service page content\s*$/.test(l))

// Speciality (## heading) and entry (### heading) boundaries; the preamble's ### blocks are not pages.
const entries = []
let speciality = null
for (let i = 0; i < lines.length; i++) {
  const sp = lines[i].match(/^## \*\*(.+?)\*\*/)
  if (sp && !/how to use|contents/i.test(sp[1])) speciality = sp[1].trim()
  const en = lines[i].match(/^### \*\*(.+?)\*\*/)
  if (en && speciality && !/section map|global blocks|pages in this document/i.test(en[1])) {
    entries.push({ name: en[1].trim(), speciality, start: i })
  }
}
entries.forEach((e, i) => (e.end = i + 1 < entries.length ? entries[i + 1].start : lines.length))

const SECTION = /^##### \*\*((?:\d+[ab]?\.|SEO|Sidebar)[^*]*)\*\*/
const splitList = (s, sep) => s.split(sep).map((x) => x.trim()).filter(Boolean)

const out = []
for (const e of entries) {
  const body = lines.slice(e.start + 1, e.end)
  const sections = []
  for (const l of body) {
    const m = l.match(SECTION)
    if (m) sections.push({ title: m[1].trim(), lines: [] })
    else if (sections.length && !/^## /.test(l)) sections.at(-1).lines.push(l)
  }

  // URL first, so the dictionaries can be loaded.
  const seoSec = sections.find((s) => s.title.startsWith('SEO'))
  const seo0 = parseSection(seoSec?.lines ?? [], e.name, 'SEO', { headings: [], faqs: [] })
  const url = seo0.one('URL (unchanged)').replace(/\s+/g, '')
  const pagePath = url ? new URL(url).pathname : null
  const page = pagePath ?? e.name
  const dict = pagePath ? live(pagePath) : { headings: [], faqs: [], video: null }

  const sec = {}
  const doctorSecs = []
  for (const s of sections) {
    const id = s.title.match(/^(\d+[ab]?)\./)?.[1] ?? (s.title.startsWith('SEO') ? 'seo' : 'sidebar')
    const design = s.lines.find((l) => l.startsWith('**Design:**')) ?? ''
    sec[id] = { ...parseSection(s.lines, page, s.title, dict), design, title: s.title }
    if (id === '7') doctorSecs.push(sec[id])
  }
  out.push(buildRecord({ name: e.name, speciality: e.speciality, source: `content/service/service-page.md:${e.start + 1}`, sec, doctorSecs, seo: seo0, page, pagePath, dict }))
}

// One page's sections (label → value fields and numbered rows, from either reader) → the record parsed.json holds.
function buildRecord({ name, speciality, source, sec, doctorSecs, seo: seo0, page, pagePath, dict }) {
  const empty = { one: () => '', many: () => [], has: () => false, rows: [], points: [], design: '' }
  const need = (id) => sec[id] ?? (warn(page, `missing section ${id}`), empty)
  if (!doctorSecs.length) warn(page, 'missing section 7')

  const s1 = need('1'), s2 = need('2'), s3 = need('3'), s4 = need('4'), s5 = need('5'), s6 = need('6'), s7 = doctorSecs[0] ?? empty
  const s8 = need('8'), s9 = need('9'), s11 = need('11'), s12 = need('12'), s13 = need('13'), side = need('sidebar')

  // Item counts the doc's design notes promise ("7 cards", "8 accordion items").
  const promised = (s, re) => Number(s.design.match(re)?.[1] ?? NaN)
  const checkCount = (s, n, label) => !Number.isNaN(n) && n !== s.rows.length && warn(page, `${label}: ${s.rows.length} rows, design note says ${n}`)
  checkCount(s4, promised(s4, /(\d+) cards/), 'why choose')
  checkCount(s5, promised(s5, /(\d+) accordion items/), 'process')

  const strips = Object.keys(sec)
    .filter((k) => /^10[ab]?$/.test(k))
    .sort()
    .map((k) => ({ heading: sec[k].one('Heading'), text: sec[k].one('Text'), button: /^[-–—]?$/.test(sec[k].one('Button')) ? null : sec[k].one('Button') }))

  const contact = splitList(side.one('Contact card'), ' · ')
  const hub = routes.find((r) => r.path === pagePath)?.section ?? null
  if (!hub) warn(page, 'no route in pages.json')
  const links = splitList(side.one('Links (same speciality)'), ' · ')
    .filter((l) => !/^View all/.test(l))
    .map((label) => ({ label, href: hrefFor(label, hub) }))
  for (const l of links) if (!l.href) warn(page, `sidebar link has no page: "${l.label}"`)
  const record = {
    path: pagePath,
    name,
    speciality,
    source,
    seo: {
      title: seo0.one('Title tag (unchanged)'),
      h1: seo0.one('H1 (unchanged)'),
      description: seo0.one('Meta description'),
      note: seo0.one('Note') || null,
    },
    hero: {
      h1: s1.one('H1'),
      breadcrumb: s1.one('Breadcrumb'),
      intro: s1.one('Intro paragraph'),
      buttons: splitList(s1.one('Buttons'), ' | '),
      phone: s1.one('Phone strip'),
    },
    // `points`: the optional row of small cards under the intro text (a doc's "Extra" design block).
    intro: { h2: s2.one('H2'), paragraphs: s2.many('Paragraphs'), points: s2.points ?? [] },
    consultation: {
      h2: s3.one('H2'),
      introLine: s3.one('Intro line') || null,
      paragraphs: s3.many('Paragraphs'),
      video: s3.one('Video') ? { title: s3.one('Video'), url: dict.video } : null,
      buttons: splitList(s3.one('Buttons'), ' | '),
    },
    whyChoose: { h2: s4.one('H2'), subline: s4.one('Sub-line') || null, cards: s4.rows },
    process: { eyebrow: s5.one('Eyebrow'), h2: s5.one('H2'), steps: s5.rows },
    candidates: {
      h2: s6.one('H2'),
      note: s6.one('Paragraph under checklist'),
      cards: s6.rows,
    },
    // One entry per "7. Your doctor" block, in the doc's order; the eyebrow and H2 are the first block's.
    doctors: {
      eyebrow: s7.one('Eyebrow'),
      h2: s7.one('H2'),
      cards: doctorSecs.map((d) => ({
        name: d.one('Card: name'),
        specialty: d.one('Card: speciality line'),
        chips: splitList(d.one('Card: qualification chips'), ' · '),
        button: d.one('Card: button'),
        blockEyebrow: d.one('Doctor block eyebrow'),
        paragraphs: d.many('Doctor block paragraphs'),
      })),
    },
    technology: { h2: s8.one('H2'), subline: s8.one('Sub-line') || null, cards: s8.rows },
    cost: { h2: s9.one('H2'), intro: s9.one('Intro'), factors: s9.rows, buttons: splitList(s9.one('Buttons'), ' | ') },
    strips,
    reviews: { h2: s11.one('H2') },
    faqs: { eyebrow: s12.one('Eyebrow'), h2: s12.one('H2'), button: s12.one('Button under accordion'), items: s12.rows.map((r) => ({ q: r.title, a: r.text })) },
    closing: {
      kicker: s13.one('Kicker'),
      h2: s13.one('H2'),
      paragraph: s13.one('Paragraph'),
      chips: splitList(s13.one('Chips'), ' · '),
      buttons: splitList(s13.one('Buttons'), ' | '),
    },
    sidebar: {
      heading: side.one('List heading'),
      links,
      hub,
      contactHeading: contact[0] ?? '',
      contactText: contact.slice(1).filter((x) => !x.startsWith('Button:')).join(' · '),
      contactButton: contact.find((x) => x.startsWith('Button:'))?.replace(/^Button:\s*/, '') ?? '',
    },
  }

  // Required copy: an empty string here means the parser lost something.
  const required = {
    'path': record.path, 'hero intro': record.hero.intro, 'hero buttons': record.hero.buttons.length,
    'intro h2': record.intro.h2, 'intro paragraphs': record.intro.paragraphs.length,
    'consultation h2': record.consultation.h2, 'consultation paragraphs': record.consultation.paragraphs.length,
    'why choose h2': record.whyChoose.h2, 'why choose cards': record.whyChoose.cards.length,
    'process h2': record.process.h2, 'process steps': record.process.steps.length,
    'candidates h2': record.candidates.h2, 'candidate cards': record.candidates.cards.length,
    'doctor name': record.doctors.cards.every((d) => d.name), 'doctor paragraphs': record.doctors.cards.every((d) => d.paragraphs.length),
    'technology h2': record.technology.h2, 'technology cards': record.technology.cards.length,
    'cost h2': record.cost.h2, 'cost factors': record.cost.factors.length,
    'faq h2': record.faqs.h2, 'faqs': record.faqs.items.length,
    'closing h2': record.closing.h2, 'closing paragraph': record.closing.paragraph, 'closing buttons': record.closing.buttons.length,
    'sidebar links': record.sidebar.links.length, 'contact text': record.sidebar.contactText,
  }
  for (const [k, v] of Object.entries(required)) if (!v) warn(page, `missing ${k}`)
  for (const s of strips) if (!s.heading || !s.text) warn(page, 'section 10 strip without heading or text')
  if (record.consultation.video && !record.consultation.video.url) warn(page, 'video named but no video URL in the manifest')
  if (record.hero.h1 && record.seo.h1 && record.hero.h1 !== record.seo.h1) warn(page, `hero H1 differs from the SEO H1`)
  // A title that stops mid-word inside a longer live heading was cut at a column edge and not repaired. (Many of the
  // doc's titles are not live headings, and some are whole-word prefixes of other headings; neither is a fault.)
  for (const r of [...record.whyChoose.cards, ...record.process.steps, ...record.candidates.cards, ...record.technology.cards]) {
    const longer = dict.headings.find((h) => h.startsWith(r.title) && /[A-Za-z]/.test(h[r.title.length] ?? ''))
    if (longer && !CHECKED.has(r.title)) warn(page, `title "${r.title}" looks cut (live: "${longer}")`)
  }
  if (dict.faqs.length) for (const f of record.faqs.items) if (!dict.faqs.includes(f.q) && !CHECKED.has(f.q)) warn(page, `FAQ question not live: "${f.q}"`)
  for (const r of [...record.whyChoose.cards, ...record.process.steps, ...record.candidates.cards, ...record.technology.cards, ...record.cost.factors]) {
    if (!r.title || !r.text) warn(page, `row without title or text: "${r.title || r.text}"`)
  }
  for (const [field, from, to] of FIXES[record.path] ?? []) {
    const parts = field.split('.')
    const last = parts.pop()
    const obj = parts.reduce((o, k) => o[k], record)
    if (obj[last] !== from) warn(page, `fix for ${field} no longer applies (value is "${obj[last]}")`)
    else obj[last] = to
  }
  return record
}

// --- clean docs ------------------------------------------------------------------------------------------------

// Later docs in clean markdown: "## **Page**", "### **Section**" (the dot escaped, "1\. Page banner"), two-column
// label tables whose first row is the table header (so its label is not bold) and numbered tables. Escapes ("\|",
// "\+", "\-", "https\://") are undone; " | " inside a value separates buttons, as in service-page.md.
const SUPPLEMENTS = ['Blepharoplasty-and-Chin-Augmentation.md']
const unescapeMd = (s) => s.replace(/\\([\\`*_{}[\]()#+\-.!|:<>])/g, '$1')
const cleanCells = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
    .split(/(?<!\\)\|/)
    .map((c) => unescapeMd(c.replace(/\*\*/g, '')).replace(/\s+/g, ' ').trim())

function readCleanSection(lines) {
  const fields = new Map()
  const rows = []
  const points = []
  let target = rows
  let design = ''
  for (const raw of lines) {
    const line = raw.trim()
    if (line.startsWith('**Design:**')) {
      design += ' ' + line
      // "Design: Extra (current NeoSculpt6 design): bullet cards under the intro text": the next numbered table.
      target = /Design:\*\*\s*Extra/.test(line) ? points : rows
      continue
    }
    if (!line.startsWith('|') || /^\|\s*:?-{2,}/.test(line)) continue
    const c = cleanCells(line)
    if (c[0] === '#') continue
    if (/^\d+$/.test(c[0])) {
      target.push({ title: c[1] ?? '', text: c.slice(2).join(' ') })
      continue
    }
    const label = labelOf(c[0].replace(/\(new\)$/i, '(unchanged)'))
    if (!label) continue
    if (!fields.has(label)) fields.set(label, [])
    fields.get(label).push(c.slice(1).join(' | '))
  }
  return {
    one: (l) => (fields.get(l) ?? []).join(' '),
    many: (l) => fields.get(l) ?? [],
    has: (l) => fields.has(l),
    rows,
    points,
    design,
  }
}

for (const file of SUPPLEMENTS) {
  const docPath = path.resolve(ROOT, '../content/service', file)
  const docLines = fs.readFileSync(docPath, 'utf8').split('\n')
  const starts = docLines.flatMap((l, i) => (/^## \*\*.+\*\*/.test(l) ? [i] : []))
  starts.forEach((start, n) => {
    const name = unescapeMd(docLines[start].match(/^## \*\*(.+?)\*\*/)[1]).trim()
    const body = docLines.slice(start + 1, starts[n + 1] ?? docLines.length)
    const sections = []
    for (const l of body) {
      const m = l.match(/^### \*\*(.+?)\*\*/)
      if (m) sections.push({ title: unescapeMd(m[1]).trim(), lines: [] })
      else if (sections.length) sections.at(-1).lines.push(l)
    }
    const sec = {}
    const doctorSecs = []
    for (const s of sections) {
      const id = s.title.match(/^(\d+[ab]?)\./)?.[1] ?? (s.title.startsWith('SEO') ? 'seo' : 'sidebar')
      sec[id] = { ...readCleanSection(s.lines), title: s.title }
      if (id === '7') doctorSecs.push(sec[id])
    }
    const url = sec.seo?.one('URL (unchanged)') ?? ''
    const pagePath = url ? new URL(url).pathname : null
    const page = pagePath ?? name
    const dict = pagePath ? live(pagePath) : { headings: [], faqs: [], video: null }
    const record = buildRecord({ name, speciality: 'Cosmetic Surgery', source: `content/service/${file}:${start + 1}`, sec, doctorSecs, seo: sec.seo, page, pagePath, dict })
    const at = out.findIndex((r) => r.path === record.path)
    if (at >= 0) out[at] = record
    else out.push(record)
  })
}

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
console.log(`parse-services: ${out.length} pages → ${path.relative(ROOT, OUT)}; ${warnings.length} warnings`)
if (process.argv.includes('--quiet')) process.exit(0)
for (const w of warnings) console.log('  ' + w)
