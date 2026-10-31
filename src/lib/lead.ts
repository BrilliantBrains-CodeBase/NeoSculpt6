// Sends a booking request to the Google Apps Script web app (apps-script/Code.gs). The script saves it to the leads
// Sheet and emails the clinic (its visitor confirmation email is switched off). Every booking form on the site (popup,
// Find My Treatment, Contact, About, doctor profiles) is the shared BookingForm, which posts here. The hair assessment
// posts here too (submitAssessment, below).
// The web app's /exec URL. It is public by nature (visible in the browser). Redeploying with "Manage deployments →
// Edit → New version" keeps this URL; a "New deployment" makes a new one, which must be pasted here.
export const LEAD_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxBjdX6UYSCscN3MB8Ax26ipQ-S0XYSFELv2M3Qc9MHfuUurBSLSKuFZr3qpTBthYc/exec'

// Which form the request came from: the popup, a page's own form, or a doctor's profile (with their slug).
export type LeadSource = 'popup' | 'home-find-treatment' | 'home-booking' | 'contact' | 'about' | `doctor:${string}`

export type LeadResult = { ok: true; id: string; emailed: boolean } | { ok: false; error: string }

// Sent as text/plain so the browser posts straight away (no CORS preflight, which Apps Script can't answer).
// Apps Script answers through a redirect to googleusercontent.com, which allows any origin, so the JSON is readable.
export async function submitLead(payload: Record<string, unknown>): Promise<LeadResult> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 25000)
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (!res.ok) return { ok: false, error: `http_${res.status}` }
    const out = (await res.json()) as { ok?: boolean; id?: string; emailed?: boolean; error?: string }
    return out.ok ? { ok: true, id: out.id ?? '', emailed: Boolean(out.emailed) } : { ok: false, error: out.error ?? 'unknown' }
  } catch {
    return { ok: false, error: 'network' }
  } finally {
    window.clearTimeout(timer)
  }
}

// The free AI hair assessment (/hair-assessment/) posts to the same web app with kind "assessment"
// (apps-script/Assessment.gs). The script saves the answers and photos, has Claude grade the photos, emails the report
// and answers with it. That can take a minute, so the wait is longer than a booking's. "pending" means everything was
// saved but the AI step did not finish: the script retries it and the clinic team follows up.
export interface AssessmentOption {
  label: string
  href: string
  why: string
}

export interface AssessmentReport {
  scale: 'Norwood' | 'Ludwig' | 'Unclear'
  grade: string
  confidence: 'low' | 'medium' | 'high'
  summary: string
  pattern: string
  density: string
  donor: string
  options: AssessmentOption[]
  grafts: { min: number; max: number } | null
  cost: { min: number; max: number } | null
  nextSteps: string
  photoIssues: string[]
}

export type AssessmentResult =
  | { ok: true; id: string; status: 'done'; emailed: boolean; report: AssessmentReport }
  | { ok: true; id: string; status: 'pending' }
  | { ok: false; error: string }

export async function submitAssessment(payload: Record<string, unknown>): Promise<AssessmentResult> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 120000)
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...payload, kind: 'assessment' }),
      signal: controller.signal,
    })
    if (!res.ok) return { ok: false, error: `http_${res.status}` }
    const out = (await res.json()) as Partial<{ ok: boolean; id: string; status: string; emailed: boolean; report: AssessmentReport; error: string }>
    if (!out.ok) return { ok: false, error: out.error ?? 'unknown' }
    if (out.status === 'done' && out.report) return { ok: true, id: out.id ?? '', status: 'done', emailed: Boolean(out.emailed), report: out.report }
    return { ok: true, id: out.id ?? '', status: 'pending' }
  } catch (e) {
    // A timeout most likely means the script is still working (the AI step is the slow part), so it is not a failure.
    return { ok: false, error: e instanceof DOMException && e.name === 'AbortError' ? 'timeout' : 'network' }
  } finally {
    window.clearTimeout(timer)
  }
}

// What /thank-you/ shows: the visitor's first name and whether a confirmation email is on its way. Kept in
// sessionStorage, not the URL, so no personal details end up in the address bar, history or analytics.
const THANKS_KEY = 'ns6-thank-you'

export interface ThankYouState {
  firstName: string
  emailed: boolean
}

export function saveThankYou(state: ThankYouState) {
  try {
    sessionStorage.setItem(THANKS_KEY, JSON.stringify(state))
  } catch {
    // ignore: the page falls back to its general wording
  }
}

export function readThankYou(): ThankYouState | null {
  try {
    const raw = sessionStorage.getItem(THANKS_KEY)
    return raw ? (JSON.parse(raw) as ThankYouState) : null
  } catch {
    return null
  }
}
