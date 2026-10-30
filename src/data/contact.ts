// Contact Us page copy (/contact-us/). Source: content/contact/prompts/contact-us-page.md (there is no separate contact
// content doc yet). The page is trimmed from the brief at the user's request: banner, form, map, then Instagram; the
// brief's details block, next steps, routing links and privacy box are left out so the form is the focus.
// Clinic facts (address, hours, phone, email, WhatsApp, maps link, nearby areas) are not copied here: they come from
// site.ts. The booking heading and subline come from home.ts and the form from BookingForm, as on every other page.
// Imports carry .ts: scripts/verify-seo.mjs loads this file in Node.

import { reception } from './services/index.ts'

type Part = { text: string; gold?: boolean }

// 1. Page banner. The H1 parts, joined, must equal the contact H1 in src/data/pages.json (checked by `npm run verify`).
export const banner = {
  eyebrow: 'Contact NeoSculpt6',
  h1: [{ text: 'Contact ' }, { text: 'Us', gold: true }] as Part[],
  subline: 'Start with your concern. We’ll connect you with the right doctor and help you understand the next step.',
  // Slot: NeoSculpt6 reception. The same old-site reception photo as the service pages' closing band.
  // TODO: confirm it shows the real reception, or replace it with an approved photo.
  image: reception,
}

// Contact actions (banner, form sidebar, map card).
export const actions = {
  book: 'Request a Consultation',
  call: 'Call the Clinic',
  whatsapp: 'WhatsApp the Clinic',
  directions: 'Get Directions',
}

// 2. Consultation form, the page's main block. Heading and subline: `booking` in home.ts. The privacy line sits under
// the form (the brief's privacy note; not a privacy policy, so no /privacy-policy/ link until that page exists).
export const bookingEyebrow = 'Schedule Your Visit Online'
export const sidebarHeading = 'Contact the Clinic'
export const privacyNote =
  'Consultation information is used to help the clinic respond to your enquiry and plan the appropriate next step. Patient photographs and records are not shared without written consent.'

// 3. Visit us / map (homepage.md section F).
export const visit = {
  h2: [{ text: 'Visit NeoSculpt6, ' }, { text: 'Whitefield', gold: true }] as Part[],
  mapTitle: 'Map showing NeoSculpt6 on Whitefield Main Road, Bangalore',
}
