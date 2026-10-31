// Shared shape of the legal pages (/privacy-policy/, /terms-of-use/), rendered by src/templates/LegalTemplate.tsx.

export type Inline = string | { text: string; href: string }
export type Block =
  | { type: 'p'; text: Inline[] }
  | { type: 'ul'; items: Inline[][] }
  | { type: 'table'; head: [string, string, string]; rows: [string, string, Inline[]][] }
  | { type: 'contact'; rows: [string, Inline[]][] }

export interface Section {
  id: string
  heading: string
  blocks: Block[]
}

export interface LegalDoc {
  /** ISO dates shown under the H1. */
  effectiveDate: string
  updatedDate: string
  intro: Inline[]
  summaryHeading: string
  summary: string[]
  sections: Section[]
}

export const p = (...text: Inline[]): Block => ({ type: 'p', text })
export const ul = (...items: (Inline | Inline[])[]): Block => ({
  type: 'ul',
  items: items.map((i) => (Array.isArray(i) ? i : [i])),
})
