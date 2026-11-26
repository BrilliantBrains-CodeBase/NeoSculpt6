// Where a visitor came from, sent with their booking request (src/lib/lead.ts). The first page of the visit is kept
// in sessionStorage: its URL, the outside site that sent them (if any), and its ad tags (utm_*, gclid, fbclid), so a
// lead made a few pages later still credits the ad or search that brought them in. Nothing is sent until they submit.

const KEY = 'ns6-attribution'
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'] as const

export type Attribution = Partial<Record<(typeof PARAMS)[number] | 'landingUrl' | 'referrer', string>>

// Runs once per page load (SiteLayout). Only the first page of a visit is recorded.
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return
    const data: Attribution = { landingUrl: location.href }
    const ref = document.referrer
    if (ref && new URL(ref).host !== location.host) data.referrer = ref
    const params = new URLSearchParams(location.search)
    for (const k of PARAMS) {
      const v = params.get(k)
      if (v) data[k] = v
    }
    sessionStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // Storage blocked (private mode, strict settings): send without attribution.
  }
}

// The visit's first page and ad tags, plus the page the form is on now.
export function getAttribution(): Attribution & { pageUrl: string; pageTitle: string } {
  let stored: Attribution = {}
  try {
    stored = JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as Attribution
  } catch {
    // ignore
  }
  return { ...stored, pageUrl: location.href, pageTitle: document.title }
}
