// Reads a doc section titled "Info: …" into an info block (src/data/blocks.ts), for copy that has no dedicated section
// type: tables, ticked or numbered lists with bold leads, numbered cards, Do / Avoid columns. Shared by
// parse-technology-pages.mjs (ARTAS, Medical Tourism) and parse-service-pages.mjs (a supplement page's `extras`).
//
// Format (clean markdown, like the rest of those docs):
//
//   ### **5\. Info: ARTAS vs FUT vs Manual FUE**
//   **Held:** keep only the countries the clinic confirms        ← optional: not rendered, listed for sign-off
//
//   | Section id | technology-comparison |                         ← required: the section's id on the page
//   | :---- | :---- |
//   | **Place after** | process |                                ← service extras only: the section it follows
//   | **Eyebrow** | … |   | **H2** | … |                          ← "H2" may be "—" for a block with no heading
//   | **Paragraph 1** | … |  | **Paragraph 2** | … |
//   | **List style** | ticks · numbers · bullets |
//   | **List item 1** | **Bold lead.** The rest of the line |
//   | **Do** | One ◆ Two |   | **Avoid** | One ◆ Two |          ← columns (any other "Column: Heading" label too)
//   | **Paragraph after 1** | … |                                 ← under the list / cards / table
//   | **Panel** | yes |                                           ← drawn on the alternate panel
//
//   | Card title | Card text |                                    ← numbered cards
//
//   **Table:**                                                    ← the next table is a data table (first row = head)
//   | | FUT (strip) | Manual FUE | ARTAS robotic FUE |
//   | How grafts are taken | … | … | … |
//
// A table cell with "Label → /path/" parts separated by " · " becomes a run of links (a part without "→" is text).

const unescapeMd = (s) => s.replace(/\\([\\`*_{}[\]()#+\-.!|:<>=&])/g, '$1')
const squash = (s) => unescapeMd(s).replace(/\s+/g, ' ').trim()
const plain = (s) => squash(s.replace(/\*\*/g, ''))

const cellsOf = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
    .split(/(?<!\\)\|/)
    .map((c) => c.trim())

function cellValue(raw) {
  const v = plain(raw)
  if (!v.includes('→')) return v
  return v.split(/\s+·\s+/).map((part) => {
    const m = part.match(/^(.+?)\s+→\s+(\S+)$/)
    return m ? { label: m[1].trim(), href: m[2] } : { label: part.trim(), href: null }
  })
}

function listItem(raw) {
  const v = squash(raw)
  const m = v.match(/^\*\*(.+?)\*\*\s*(.*)$/)
  return m ? { lead: plain(m[1]), text: plain(m[2]) } : { lead: null, text: plain(v) }
}

const KNOWN = /^(Section id|Place after|Eyebrow|H2|Paragraph( \d+)?|List style|List item \d+|Do|Avoid|Column: .+|Paragraph after( \d+)?|Panel)$/

/**
 * @param {string[]} lines the section's lines (after its "### " heading)
 * @param {(msg: string) => void} warn
 * @returns {{ block: object, held: string | null, after: string | null }}
 */
export function readInfoBlock(lines, warn) {
  const fields = []
  const cards = []
  let table = null
  let held = null
  let mode = null // 'fields' | 'cards' | 'table'
  let nextIsTable = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line.startsWith('|')) {
      mode = null
      const heldMatch = line.match(/^\*\*Held:\*\*\s*(.+)$/)
      if (heldMatch) held = plain(heldMatch[1])
      if (/^\*\*Table:\*\*/.test(line)) nextIsTable = true
      continue
    }
    if (/^\|\s*:?-{2,}/.test(line)) continue
    const c = cellsOf(line)
    if (!mode) {
      if (nextIsTable) {
        nextIsTable = false
        mode = 'table'
        table = { head: c.map(plain), rows: [] }
        continue
      }
      if (plain(c[0]) === 'Card title') {
        mode = 'cards'
        continue
      }
      mode = 'fields'
    }
    if (mode === 'table') table.rows.push(c.map(cellValue))
    else if (mode === 'cards') cards.push({ title: plain(c[0]), text: plain(c.slice(1).join(' | ')) })
    else fields.push([plain(c[0]), c.slice(1).join(' | ')])
  }

  for (const [label] of fields) if (!KNOWN.test(label)) warn(`info block: unknown label "${label}"`)
  const one = (label) => {
    const hit = fields.find(([l]) => l === label)
    return hit ? plain(hit[1]) : null
  }
  const numbered = (base) =>
    fields.filter(([l]) => l === base || new RegExp(`^${base} \\d+$`).test(l))

  const id = one('Section id')
  if (!id) warn('info block without a "Section id"')
  const h2 = one('H2')
  const style = one('List style')
  const items = numbered('List item').map(([, v]) => listItem(v))
  if (items.length && !['ticks', 'numbers', 'bullets'].includes(style ?? '')) warn(`info block ${id}: list style "${style}" (ticks, numbers or bullets)`)
  if (table) for (const row of table.rows) if (row.length !== table.head.length) warn(`info block ${id}: a table row has ${row.length} cells, the head ${table.head.length}`)

  const columns = fields
    .filter(([l]) => l === 'Do' || l === 'Avoid' || l.startsWith('Column: '))
    .map(([l, v]) => ({
      heading: l.replace(/^Column:\s*/, ''),
      tone: l === 'Do' ? 'do' : l === 'Avoid' ? 'avoid' : 'plain',
      items: plain(v).split('◆').map((x) => x.trim()).filter(Boolean),
    }))

  const block = {
    id,
    eyebrow: one('Eyebrow'),
    h2: !h2 || h2 === '—' ? null : h2,
    paragraphs: numbered('Paragraph').map(([, v]) => plain(v)),
    cards,
    list: items.length ? { style, items } : null,
    table,
    columns,
    after: numbered('Paragraph after').map(([, v]) => plain(v)),
    panel: /^yes$/i.test(one('Panel') ?? ''),
  }
  const empty = !block.h2 && !block.paragraphs.length && !cards.length && !items.length && !table && !columns.length
  if (empty) warn(`info block ${id}: no content`)
  return { block, held, after: one('Place after') }
}
