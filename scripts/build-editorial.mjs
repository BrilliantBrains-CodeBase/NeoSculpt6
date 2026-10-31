#!/usr/bin/env node
// Turns the Markdown body of every journal and blog article that has a page (public or archived, per
// src/data/editorial.ts) into src/data/editorial-bodies.json, which the article template renders. Drafts and records in
// review never reach the bundle. Run by `npm run gen` (after validate-editorial.mjs).
//
// Supported Markdown, on purpose a small subset so no parser dependency is needed: "## " and "### " headings,
// paragraphs, "- " / "* " and "1. " lists, [links](/path/ or https://…), **bold** and *italic*. A "# " heading is
// rejected (the page's only H1 is the record's title), as is anything else this converter would silently drop
// (images, tables, HTML, block quotes, code).

import fs from 'node:fs'
import path from 'node:path'
import { pageRecords } from '../src/data/editorial.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const REPO = path.resolve(ROOT, '..')
const OUT = path.join(ROOT, 'src/data/editorial-bodies.json')

// **bold**, *italic*, [text](href); nested emphasis inside a link is allowed.
export function inlines(text) {
  const parts = []
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let last = 0
  let m
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index) })
    if (m[1] !== undefined) parts.push(...inlines(m[1]).map((p) => ({ ...p, href: m[2] })))
    else if (m[3] !== undefined) parts.push({ text: m[3], bold: true })
    else parts.push({ text: m[4], italic: true })
    last = re.lastIndex
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts
}

export function markdownToBlocks(md, where = 'body') {
  const blocks = []
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  let para = []
  let list = null
  const flush = () => {
    if (para.length) blocks.push({ type: 'p', text: inlines(para.join(' ').trim()) })
    para = []
    if (list) blocks.push(list)
    list = null
  }
  for (const [n, raw] of lines.entries()) {
    const line = raw.trimEnd()
    const at = `${where}:${n + 1}`
    if (!line.trim()) {
      flush()
      continue
    }
    if (/^# /.test(line)) throw new Error(`${at}: "# " headings are not allowed (the article title is the page's H1)`)
    if (/^(!\[|<|>|\||```|    )/.test(line)) throw new Error(`${at}: unsupported Markdown (images, HTML, quotes, tables, code): ${line}`)
    const heading = line.match(/^(##|###) (.+)$/)
    if (heading) {
      flush()
      blocks.push({ type: heading[1] === '##' ? 'h2' : 'h3', text: inlines(heading[2].trim()) })
      continue
    }
    const bullet = line.match(/^\s*[-*] (.+)$/)
    const numbered = line.match(/^\s*\d+\. (.+)$/)
    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol'
      if (para.length) {
        blocks.push({ type: 'p', text: inlines(para.join(' ').trim()) })
        para = []
      }
      if (list && list.type !== type) {
        blocks.push(list)
        list = null
      }
      list ??= { type, items: [] }
      list.items.push(inlines((bullet ?? numbered)[1].trim()))
      continue
    }
    if (list) {
      blocks.push(list)
      list = null
    }
    para.push(line.trim())
  }
  flush()
  return blocks
}

export const bodyPath = (record) => path.join(REPO, record.content.bodySource)

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = {}
  for (const record of pageRecords) {
    const file = bodyPath(record)
    out[record.slug] = markdownToBlocks(fs.readFileSync(file, 'utf8'), record.content.bodySource)
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
  if (!process.argv.includes('--quiet')) console.log(`editorial-bodies.json: ${Object.keys(out).length} article bod${Object.keys(out).length === 1 ? 'y' : 'ies'}`)
}
