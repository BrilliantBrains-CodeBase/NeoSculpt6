// Info blocks: a generic page section for copy that has no dedicated component (a comparison table, a timeline, a
// do/avoid list, a ticked list with bold leads, numbered cards). Used by the ARTAS and Medical Tourism pages
// (content/technology/technology-international-patient.md) and by service pages' `extras` (clean supplement docs such
// as content/service/microblading.md). A doc writes one as a section titled "Info: …" (format in
// scripts/lib/info-blocks.mjs); InfoSection (src/components/InfoSection.tsx) draws it.
// Keep this file to erasable TypeScript only (verify-seo.mjs imports the records with Node's type stripping).

/** A list item: an optional bold lead ("Doctor-led diagnosis.") and the rest of the line. */
export interface InfoListItem {
  lead: string | null
  text: string
}

/** A table cell: plain text, or a run of links (a link without `href` is shown as plain text). */
export type InfoCell = string | { label: string; href: string | null }[]

export interface InfoBlock {
  /** The section's id on the page (`npm run verify` checks the order by it). */
  id: string
  eyebrow: string | null
  /** Null for a block that continues the section above it (no heading of its own). */
  h2: string | null
  paragraphs: string[]
  /** Numbered open columns (title + text), as in the service pages' why-choose row. */
  cards: { title: string; text: string }[]
  list: { style: 'ticks' | 'numbers' | 'bullets'; items: InfoListItem[] } | null
  table: { head: string[]; rows: InfoCell[][] } | null
  /** Side-by-side columns, e.g. aftercare "Do" and "Avoid". */
  columns: { heading: string; tone: 'do' | 'avoid' | 'plain'; items: string[] }[]
  /** Paragraphs under the list, cards or table. */
  after: string[]
  /** Draw the block on the `alternate` panel. */
  panel: boolean
}

/** A block the doc holds back until the clinic confirms it ("**Held:** reason"): not rendered, listed for sign-off. */
export interface HeldBlock {
  id: string
  h2: string | null
  reason: string
}
