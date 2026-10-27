// Contact Us page copy (/contact-us/), one export per section. Source: content/contact/prompts/contact-us-page.md (there
// is no separate contact content doc yet; if one is approved, replace the copy here and keep the section order).
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

// 2. Contact details and immediate actions.
export const details = {
  h2: [{ text: 'Clinic ' }, { text: 'Details', gold: true }] as Part[],
  actionsHeading: 'Contact the Clinic',
  actions: {
    book: 'Request a Consultation',
    call: 'Call the Clinic',
    whatsapp: 'WhatsApp the Clinic',
    directions: 'Get Directions',
  },
}

// 3. Visit us / map (homepage.md section F).
export const visit = {
  h2: [{ text: 'Visit NeoSculpt6, ' }, { text: 'Whitefield', gold: true }] as Part[],
  mapTitle: 'Map showing NeoSculpt6 on Whitefield Main Road, Bangalore',
  mapText: 'The map loads from Google Maps when you choose to show it.',
  showMap: 'Show Map',
}

// 4. Consultation form. Heading and subline: `booking` in home.ts.
export const bookingEyebrow = 'Schedule Your Visit Online'

// 5. What happens after you contact us.
export const steps = {
  h2: [{ text: 'What Happens After ' }, { text: 'You Contact Us', gold: true }] as Part[],
  items: [
    { title: 'Tell Us Your Concern', text: 'Share what you would like to change, even if you do not know the treatment name.' },
    { title: 'Meet the Right Specialist', text: 'We route your enquiry to the doctor best suited to your concern.' },
    { title: 'Understand Your Options', text: 'Your consultation covers suitability, alternatives, recovery and cost.' },
    { title: 'Decide in Your Own Time', text: 'You receive a clear plan before choosing whether to proceed.' },
  ],
}

// 6. Speciality and doctor routing. Every href is a built page or a home section id.
export const routing = {
  h2: [{ text: 'Not Sure ' }, { text: 'Who to See?', gold: true }] as Part[],
  subline: 'Tell us what you would like to change and we will help you find the right consultation pathway.',
  cta: { label: 'Find My Treatment', href: '/#find-my-treatment' },
  links: [
    { label: 'Meet Dr Sandeep Mahapatra', href: '/about-dr-sandeep-mahapatra/' },
    { label: 'Meet Dr Saranya T', href: '/dr-saranya-t/' },
    { label: 'Explore Our Specialities', href: '/#specialities' },
    { label: 'Explore Our Technology', href: '/technology/' },
    { label: 'International Patients', href: '/international-patients/' },
  ],
}

// 7. Privacy and reassurance note. Not a privacy policy; no /privacy-policy/ link until that page exists.
export const privacy = {
  heading: 'Your Details Stay Private',
  text: 'Your details stay private. Consultation information is used to help the clinic respond to your enquiry and plan the appropriate next step. Patient photographs and records are not shared without written consent.',
}
