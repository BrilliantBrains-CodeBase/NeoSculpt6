// One pool of real Google reviews for every testimonials section on the site (home, About, hubs, service and
// technology pages). reviews.json holds each review word for word, from two of Dr Sandeep Mahapatra's clinics:
// Neo Follicle Hair Transplant and Derma Solutions Skin and Hair Clinic - Marathahalli. The client approved
// publishing these public reviews (2026-10-30), so every card counts as consented.
// Rules for reviews.json:
// - `quote` is the review exactly as posted (Google's <br> as a newline). Never edit, shorten or combine one.
// - Only reviews that already keep to the site's content rules are in it: none of the banned words ("best",
//   "painless", "permanent", "no side effects", …), no prices and no graft counts. A review that breaks a rule is left
//   out, not edited. `npm run verify` checks this.
// - `author` is first name + initial from the Google display name; `treatment` is what the reviewer had, so a
//   general review shown on another treatment's page still says what it was about.
// - `topics` say which pages a review suits; `general: true` marks reviews about the doctor's care in general,
//   used where no review mentions the page's treatment.
// - Derma Solutions entries keep Google's review id (`googleReviewId`) for the record.
import type { Testimonial } from './home.ts'
import pool from './reviews.json' with { type: 'json' }

export type PoolReview = {
  id: string
  author: string
  treatment: string
  topics: string[]
  general: boolean
  listing: 'Neo Follicle' | 'Derma Solutions'
  googleReviewId: string | null
  rating: number
  quote: string
}

export const REVIEWS = pool as PoolReview[]

const SOURCES: Record<PoolReview['listing'], string> = {
  'Neo Follicle': 'https://maps.google.com/maps?cid=1368765349301541274',
  'Derma Solutions': 'https://maps.google.com/maps?cid=12976301854266238109',
}

const byId = new Map(REVIEWS.map((r) => [r.id, r]))

export function toTestimonial(r: PoolReview): Testimonial {
  return { treatment: r.treatment, lookFor: '', quote: r.quote, author: r.author, consent: true, listing: r.listing, source: SOURCES[r.listing] }
}

/** Specific reviews by id (home and About choose theirs by hand). */
export function reviewsById(ids: string[]): Testimonial[] {
  return ids.map((id) => {
    const r = byId.get(id)
    if (!r) throw new Error(`reviews.json has no review "${id}"`)
    return toTestimonial(r)
  })
}

// Small, stable string hash, so each page starts at a different place in the pool and neighbouring pages don't all
// show the same reviews. The same page always gets the same reviews.
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}
const rotate = <T,>(list: T[], key: string) => {
  if (!list.length) return list
  const start = hash(key) % list.length
  return [...list.slice(start), ...list.slice(0, start)]
}

/**
 * Reviews for one page: those that share a topic with the page first (best match first), then general
 * reviews about the doctor's care to make up `count`.
 */
export function pickReviews({ topics, key, count = 3, avoid = [] }: { topics: string[]; key: string; count?: number; avoid?: string[] }): Testimonial[] {
  const skip = new Set(avoid)
  // A page lists its topics most important first, so earlier topics weigh more.
  const score = (r: PoolReview) => r.topics.reduce((sum, t) => sum + (topics.includes(t) ? topics.length - topics.indexOf(t) : 0), 0)
  const matched = rotate(REVIEWS.filter((r) => !skip.has(r.id) && score(r) > 0), key).sort((a, b) => score(b) - score(a))
  const chosen = matched.slice(0, count)
  if (chosen.length < count) {
    const taken = new Set(chosen.map((r) => r.id))
    chosen.push(...rotate(REVIEWS.filter((r) => r.general && !skip.has(r.id) && !taken.has(r.id)), key).slice(0, count - chosen.length))
  }
  return chosen.map(toTestimonial)
}

// Which review topics suit which page. A page with no entry (or an empty list) shows general reviews.
const HUB_TOPICS: Record<string, string[]> = {
  'hair-transplant-restoration': ['hair-transplant', 'nft', 'gfc', 'hair-loss'],
  'laser-skin-aesthetic': ['co2', 'chemical-peel', 'laser-hair-reduction', 'pigmentation', 'acne-scars'],
  'anti-aging-injectables': ['botox', 'fillers', 'under-eye', 'hifu'],
  'slimming-body-contouring': ['cellulite', 'skin-tightening'],
  'cosmetic-surgery': ['xanthelasma', 'vitiligo-excimer', 'scar'],
  'cosmetic-gynecology': [],
}

// Service pages by slug (the part after the speciality, without "-in-bangalore"). Unlisted hair-transplant pages
// fall back to `hair-transplant`; other unlisted pages show general reviews.
const SERVICE_TOPICS: Record<string, string[]> = {
  // Hair
  'beard-moustache-transplant': ['beard'],
  'eyebrow-hair-transplant': ['eyebrow'],
  'female-hair-transplant': ['female-hair', 'hair-transplant'],
  'unshaven-hair-transplant': ['unshaven', 'hair-transplant'],
  'neo-follicle-hair-transplant': ['nft', 'hair-transplant'],
  'direct-hair-transplant': ['nft', 'hair-transplant'],
  'dhi-hair-transplant': ['nft', 'hair-transplant'],
  'nri-hair-transplant-consultation': ['international', 'hair-transplant'],
  'exosome-hair-therapy': ['exosome', 'hair-loss'],
  'gfc-hair-treatment': ['gfc', 'hair-loss'],
  'prp-hair-treatment': ['prp', 'hair-loss'],
  'qr678-hair-regrowth-treatment': ['qr678', 'hair-loss'],
  'neo-follicle-stem-cell-therapy': ['stem-cell', 'hair-loss'],
  'low-level-laser-hair-therapy-lllt': ['hair-loss'],
  'hair-fillers-treatment': ['hair-loss'],
  'scalp-micropigmentation-smp': ['smp'],
  // Laser & skin
  'acne-scar-laser-treatment': ['acne-scars', 'co2', 'mnrf'],
  'acne-scar-treatment': ['acne-scars', 'chemical-peel'],
  'acne-treatment': ['acne'],
  'beard-shaping-laser': ['laser-hair-reduction'],
  'bikini-laser-hair-removal': ['laser-hair-reduction'],
  'facial-laser-hair-removal': ['laser-hair-reduction'],
  'full-body-laser-hair-removal': ['laser-hair-reduction'],
  'laser-hair-reduction': ['laser-hair-reduction'],
  'laser-hair-removal-for-men': ['laser-hair-reduction'],
  'underarm-laser-hair-removal': ['laser-hair-reduction'],
  'carbon-laser-peel': ['laser-toning', 'chemical-peel'],
  'chemical-peels': ['chemical-peel'],
  'co2-fractional-laser-treatment': ['co2'],
  'laser-skin-resurfacing': ['co2'],
  'dark-circle-treatment': ['under-eye', 'pigmentation'],
  'hydrafacial': ['hydrafacial'],
  'microdermabrasion-treatment': ['hydrafacial', 'chemical-peel'],
  'laser-birthmark-removal-treatment': ['pigmentation', 'laser-toning'],
  'laser-mole-removal': ['mole-wart-skin-tag'],
  'laser-skin-tag-removal': ['mole-wart-skin-tag'],
  'laser-wart-removal-treatment': ['mole-wart-skin-tag'],
  'laser-scar-revision': ['scar', 'acne-scars'],
  'laser-tattoo-removal': ['tattoo'],
  'melasma-treatment': ['melasma', 'pigmentation'],
  'microneedling-treatment': ['microneedling', 'mnrf'],
  'mnrf-treatment': ['mnrf', 'microneedling'],
  'open-pores-treatment': ['open-pores', 'co2'],
  'pigmentation-treatment': ['pigmentation'],
  'q-switch-laser-treatment': ['laser-toning', 'tattoo', 'pigmentation'],
  'skin-brightening-treatment': ['skin-brightening', 'laser-toning', 'pigmentation'],
  'tan-removal-treatment': ['pigmentation', 'laser-toning'],
  'stretch-mark-laser-treatment': ['scar'],
  'subcision-treatment': ['acne-scars'],
  // Injectables & anti-ageing
  'botox-treatment': ['botox'],
  'wrinkle-treatment': ['botox'],
  'fine-line-treatment': ['botox'],
  'anti-ageing-treatment': ['botox', 'fillers'],
  'facial-volume-restoration': ['fillers'],
  'dermal-filler-treatment': ['fillers'],
  'body-fillers': ['fillers'],
  'breast-volume-enhancement-fillers': ['fillers'],
  'buttock-volume-enhancement-fillers': ['fillers'],
  'cheek-fillers': ['fillers'],
  'chin-fillers': ['fillers'],
  'hand-rejuvenation-fillers': ['fillers'],
  'jawline-fillers': ['fillers'],
  'lip-fillers': ['fillers'],
  'nose-fillers': ['fillers'],
  'under-eye-fillers': ['under-eye', 'fillers'],
  'hifu-treatment': ['hifu'],
  'rf-skin-tightening-treatment': ['skin-tightening', 'hifu'],
  'skin-elasticity-treatment': ['skin-tightening', 'hifu'],
  'neck-tightening-treatment': ['skin-tightening', 'hifu'],
  'non-surgical-double-chin-tightening-treatment': ['skin-tightening', 'hifu'],
  'non-surgical-face-lift': ['skin-tightening', 'hifu'],
  'pdrn-treatment': ['pdrn', 'skin-boosters'],
  'salmon-dna-treatment': ['pdrn', 'skin-boosters'],
  'skin-boosters-treatment': ['skin-boosters', 'pdrn'],
  'profhilo': ['skin-boosters'],
  'skin-vive': ['skin-boosters'],
  'collagen-boosters': ['skin-boosters'],
  'collagen-stimulation-treatment': ['skin-boosters'],
  'skin-rejuvenation-treatment': ['skin-boosters'],
  // Body
  'anti-cellulite-therapy': ['cellulite'],
  'cellulite-reduction': ['cellulite'],
  'skin-tightening-treatment': ['skin-tightening', 'hifu'],
  'stretch-mark-treatment': ['scar'],
  // Surgery
  'xanthelasma-removal-treatment': ['xanthelasma'],
  'vitiligo-treatment': ['vitiligo-excimer'],
  'phototherapy-for-vitiligo': ['vitiligo-excimer'],
  'melanocyte-transfer-surgery': ['vitiligo-excimer'],
  'ncecs-treatment': ['vitiligo-excimer'],
  'scar-revision-surgery': ['scar'],
  'burn-scar-reconstruction-surgery': ['scar'],
}

const TECHNOLOGY_TOPICS: Record<string, string[]> = {
  'ai-integrated-hair-analysis': ['ai-analysis', 'hair-transplant'],
  'ai-integrated-donor-assessment': ['hair-transplant'],
  'artas-robotic-hair-transplant': ['hair-transplant'],
  'co2-fractional-laser': ['co2'],
  'excimer-laser-targeted-phototherapy': ['vitiligo-excimer'],
  'q-switch-laser': ['tattoo', 'pigmentation', 'laser-toning'],
  'reaction-viora-rf-tightening': ['skin-tightening', 'hifu'],
  'body-contouring-cryolipolysis-platforms': [],
  'vaser-liposuction-technology': [],
}

/** Review topics for a page path, e.g. "/laser-skin-aesthetic/chemical-peels-in-bangalore/". */
export function topicsForPath(path: string): string[] {
  const [section, page] = path.split('/').filter(Boolean)
  if (section === 'international-patients') return ['international']
  if (section === 'technology') return page ? (TECHNOLOGY_TOPICS[page] ?? []) : []
  if (!page) return HUB_TOPICS[section] ?? []
  const slug = page.replace(/-in-bangalore$/, '')
  return SERVICE_TOPICS[slug] ?? (section === 'hair-transplant-restoration' ? ['hair-transplant'] : [])
}

/** The usual three reviews for a page, chosen from its path. */
export const reviewsForPath = (path: string, count = 3) => pickReviews({ topics: topicsForPath(path), key: path, count })
