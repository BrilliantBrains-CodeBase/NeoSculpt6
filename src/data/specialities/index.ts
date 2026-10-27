// Speciality hubs, keyed by canonical path. HubTemplate renders each one here; a hub missing from this map keeps the
// placeholder. Each hub file holds its drafted copy; this module adds what is shared with other pages, so it never
// drifts from them:
// - treatment cards: each child page's name (without "in Bangalore") and the opening of its banner text
//   (service-page.md, parsed.json). Every service page under the hub must appear in exactly one group, and every
//   path in a group must be a service page or a technology page; the build stops otherwise.
// - technology cards: the technology hub's cards for the pages the hub names (technology/index.ts); none hides the
//   section.
// A group may also list a service page from another speciality (a cross-link, e.g. liposuction on the slimming hub).
// Keep this folder to erasable TypeScript only (verify-seo.mjs imports it with Node's type stripping).

import parsedJson from '../services/parsed.json' with { type: 'json' }
import { servicesByPath } from '../services/index.ts'
import { technologyByPath } from '../technology/index.ts'
import type { TechnologyHub } from '../technology/types.ts'
import type { HubSource, HubTreatment, SpecialityHub } from './types.ts'
import { hair } from './hair-transplant-restoration.ts'
import { cosmeticSurgery } from './cosmetic-surgery.ts'
import { slimming } from './slimming-body-contouring.ts'
import { laserSkin } from './laser-skin-aesthetic.ts'
import { antiAgeing } from './anti-aging-injectables.ts'
import { gynaecology } from './cosmetic-gynecology.ts'

const parsed = new Map((parsedJson as { path: string; name: string; hero: { intro: string } }[]).map((p) => [p.path, p]))
const hubPage = technologyByPath.get('/technology/')
if (hubPage?.kind !== 'technology-hub') throw new Error('specialities: no technology hub')
const techHub: TechnologyHub = hubPage

// The banner's opening, whole sentences only, long enough to say what the treatment is (some first sentences are a
// short hook, e.g. "The crown is more than an area to fill.").
function opening(text: string) {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z"“])/)
  let out = ''
  for (const s of sentences) {
    out = out ? `${out} ${s}` : s
    if (out.length >= 90) break
  }
  return out
}

function treatment(path: string): HubTreatment {
  const page = parsed.get(path)
  if (page && servicesByPath.has(path)) {
    return { title: page.name.replace(/\s+in Bangalore$/i, ''), text: opening(page.hero.intro), href: path }
  }
  const card = techHub.cards.find((c) => c.cta.href === path)
  if (card) return { title: card.title, text: card.text, href: path }
  throw new Error(`speciality hub lists ${path}, which is neither a service nor a technology page`)
}

function build(hub: HubSource): SpecialityHub {
  const groups = hub.treatments.groups.map(({ paths, ...g }) => ({ ...g, items: paths.map(treatment) }))
  const listed = groups.flatMap((g) => g.items.map((i) => i.href))
  const children = [...servicesByPath.keys()].filter((p) => p.startsWith(hub.path))
  const missing = children.filter((p) => !listed.includes(p))
  const twice = listed.filter((p, i) => listed.indexOf(p) !== i)
  if (missing.length) throw new Error(`${hub.path}: service pages missing from the treatment groups: ${missing.join(', ')}`)
  if (twice.length) throw new Error(`${hub.path}: listed twice: ${twice.join(', ')}`)

  const { paths, ...technology } = hub.technology
  const cards = paths.map((href) => {
    const card = techHub.cards.find((c) => c.cta.href === href)
    if (!card) throw new Error(`${hub.path}: no technology hub card for ${href}`)
    return card
  })
  if (hub.order.includes('hub-technology') !== cards.length > 0) throw new Error(`${hub.path}: hub-technology in order must match its cards`)
  return { ...hub, treatments: { ...hub.treatments, groups }, technology: { ...technology, cards } }
}

export const specialityHubs: SpecialityHub[] = [hair, cosmeticSurgery, slimming, laserSkin, antiAgeing, gynaecology].map(build)

export const specialityByPath = new Map(specialityHubs.map((h) => [h.path, h]))
