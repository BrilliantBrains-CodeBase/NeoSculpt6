// About page copy, one export per section. Source: content/about-us/about-us.md (template sections numbered 1–8,
// extras lettered A–F, as in the doc). Shared facts are not copied here: the doctor cards and credential logos come from
// home.ts, clinic details from site.ts and the booking dropdowns from nav.ts.
//
// Sign-off (marked † in the doc): every † claim needs Dr Sandeep's confirmation before launch. As on the home page the
// † is not shown and the claim is listed in comments here and by `npm run verify`. Three items the doc says must not be
// published unconfirmed stay hidden until their `signedOff` flag is set: the founder quote, the Neo Follicle crossing
// date, and the ISHRS / AHRS / DHI Global logos (see `memberships.confirmed`).
//
// Images: NeoSculpt6 service photos (public/images/services/), picked for the slot noted beside each, none of them in the
// Instagram row (src/data/site.ts). TODO: Dr Sandeep's portrait is still the old-site photo; the clinic has not supplied
// reception or portrait photos yet.
// Imports carry .ts: scripts/verify-seo.mjs loads this file in Node.

import { credentials, doctors, pillars, signature, testimonials, type DoctorPortrait, type Testimonial } from './home.ts'
import { clinic } from './site.ts'

type Part = { text: string; gold?: boolean }
type Image = { src: string; width: number; height: number; alt: string }

// 1. Page title banner. The H1 parts, joined, must equal the about H1 in src/data/pages.json (checked by `npm run verify`).
export const banner = {
  eyebrow: 'About NeoSculpt6 · Whitefield, Bangalore',
  h1: [{ text: 'Care Planned ' }, { text: 'Around You', gold: true }] as Part[],
  subline: 'A doctor-led clinic for hair, face, skin, body and intimate wellness. Part of Neo Group.',
  // Slot: wide shot of the NeoSculpt6 reception or consultation room.
  image: {
    src: '/images/services/hair-transplant-restoration/fue-hair-transplant-in-bangalore-2.webp',
    width: 1200,
    height: 1200,
    alt: 'A doctor explaining hair-loss diagrams to a man across a desk',
  } as Image,
}

// 2. Our Story. Needs sign-off (†): "more than two decades", and the founding story as a whole (Dr Sandeep to confirm the
// wording; no opening year is shown until he adds one).
export const story = {
  eyebrow: 'Our Story',
  h2: [{ text: 'One Place for ' }, { text: 'Considered', gold: true }, { text: ' Aesthetic Care' }] as Part[],
  text: 'NeoSculpt6 was founded by Dr Sandeep Mahapatra after more than two decades of treating hair, skin and ageing concerns. The idea was simple: one clinic in Whitefield where every concern is diagnosed by a senior doctor before any treatment is offered. Today it brings dermatology and plastic surgery under one roof.',
  images: {
    // Slot: a clean, real procedure room.
    procedure: {
      src: '/images/services/hair-transplant-restoration/neo-follicle-hair-transplant-in-bangalore-2.webp',
      width: 1200,
      height: 1200,
      alt: 'A surgeon wearing loupes implanting grafts along a man’s hairline in the operating room',
    } as Image,
    // Slot: doctor and patient in consultation.
    consultation: {
      src: '/images/services/cosmetic-surgery/mommy-makeover-surgery-in-bangalore-1.webp',
      width: 900,
      height: 1200,
      alt: 'A surgeon explaining body diagrams to a woman across a consultation desk',
    } as Image,
    // Slot: tall portrait of Dr Sandeep consulting a patient.
    tall: {
      src: '/images/services/hair-transplant-restoration/dhi-hair-transplant-in-bangalore-1.webp',
      width: 900,
      height: 1200,
      alt: 'A doctor discussing a hairline plan with a balding man in the clinic',
    } as Image,
  },
}

// A. Clinic in numbers, two rows of four. Needs sign-off (all †): every figure, and whether 10,000+ transplants and
// 6M+ follicles are Dr Sandeep's own cases or the Neo Follicle clinic total. Must match the home page, his profile,
// Neo Follicle, Practo and Google. `href` links a label to its page (the doc asks for an /international-patients/ link).
export const numbers = {
  label: 'NeoSculpt6 in numbers',
  items: [
    { value: 20, suffix: '+', label: 'Years of Clinical Practice' },
    { value: 10000, suffix: '+', label: 'Hair Transplants' },
    { value: 6, suffix: 'M+', label: 'Follicles Restored' },
    { value: 50000, suffix: '+', label: 'Laser Procedures' },
    { value: 100000, suffix: '+', label: 'PRP Sessions' },
    { value: 40000, suffix: '+', label: 'Chemical Peels' },
    { value: 3000, suffix: '+', label: 'Vitiligo Cases Treated' },
    { value: 500, suffix: '+', label: 'Patients from Outside India', href: '/international-patients/' },
  ] as { value: number; suffix: string; label: string; href?: string }[],
  note: "Figures reflect Dr Sandeep Mahapatra's cumulative clinical experience.",
}

// B. Mission, values and process. The AI tools in step 2 support the doctor's examination; they never replace it.
export const mission = {
  cards: [
    {
      title: 'Our Mission',
      text: 'To diagnose before we treat, and to recommend only what each patient needs — even when that means no procedure.',
    },
    {
      title: 'Our Vision',
      text: 'A clinic where every aesthetic decision starts with an honest medical opinion and ends with a natural result.',
    },
  ],
  valuesH2: [{ text: 'Care That Values Clarity, ' }, { text: 'Privacy and Time', gold: true }] as Part[],
  values: [
    {
      title: 'Clear Conversations',
      text: 'Unhurried consultations that cover options, limitations, recovery and cost before anything is planned.',
    },
    {
      title: 'Respectful Privacy',
      text: 'Sensitive concerns are discussed one-to-one; your photographs are never shared without written consent.',
    },
    {
      title: 'Coordinated Care',
      text: "Dermatology and plastic surgery work together, so your plan is never limited to one specialist's offer.",
    },
  ],
  processH2: [{ text: 'A Clear Process Before Any ' }, { text: 'Treatment Decision', gold: true }] as Part[],
  steps: [
    {
      title: 'Begin With Your Concern',
      text: "Call, WhatsApp or book online and describe what you'd like to change.",
    },
    {
      title: 'Assess Suitability',
      text: 'Your doctor examines you and, where relevant, uses AI hair or donor analysis, skin or body-composition assessment.',
    },
    {
      title: 'Discuss the Right Options',
      text: 'The recommended option, alternatives, sessions or grafts, recovery time and full cost, in a written plan.',
    },
    {
      title: 'Move Forward With Clarity',
      text: 'Decide in your own time; if you go ahead, the same doctor leads your treatment and follow-up.',
    },
  ],
}

// C. Founder spotlight. Needs sign-off (†): two decades, 10,000+ transplants, 18+ surgeons trained, 55+ specialists,
// MBBS honours, MD Gold Medal, DHI Global and Allergan certifications, and the 7 published papers in the ticker.
// The quote is shown only once Dr Sandeep approves it in his own words (`signedOff`).
export const founder = {
  eyebrow: 'Founder & Lead Doctor',
  h2: [{ text: 'Dr Sandeep ' }, { text: 'Mahapatra', gold: true }] as Part[],
  title: 'Founder · Senior Consultant Dermatologist · Cosmetic Expert · Hair Transplant Surgeon',
  text: 'For more than two decades Dr Sandeep has treated hair loss, skin and ageing concerns as medical problems first and cosmetic ones second. He developed the Neo Follicle Transplant (NFT) approach to graft handling and implantation, has performed 10,000+ hair transplants, and has trained 18+ surgeons — with 55+ specialists formed under his guidance.',
  quote: {
    text: 'The right plan sometimes means a transplant, sometimes a treatment, and sometimes waiting. My job is to tell you which — honestly.',
    signedOff: false,
  },
  cta: { label: "Read Dr Sandeep's Full Profile", href: '/about-dr-sandeep-mahapatra/' },
  checklist: [
    { title: 'MBBS (honours, gold medals in two subjects)', place: 'MGM Medical College, Jamshedpur' },
    { title: 'MD Dermatology, Venereology & Leprosy (Gold Medalist)', place: 'RIMS, Ranchi' },
    { title: 'Certified DHI Specialist', place: 'DHI Global, Greece' },
    { title: 'Basic and advanced Botox and dermal filler certification', place: 'Allergan' },
  ],
  ticker: [
    'Invited faculty: ISHRS World Congress, Denver 2024',
    'EADV Congress, Geneva 2017 & Milan 2019',
    'HAIRCON 2019 & 2025',
    'DERMACON 2016–2025',
    'World Congress of Cosmetic Dermatology',
    '7 published papers on hair transplantation, FUE and PRF',
  ],
  // Slot: Dr Sandeep's portrait (large) and a procedure room (inset).
  portrait: {
    src: '/og/about-dr-sandeep-mahapatra.jpeg',
    width: 1122,
    height: 1402,
    alt: 'Dr Sandeep Mahapatra in a white coat, standing in a clinic room',
  } as Image,
  inset: {
    src: '/images/services/hair-transplant-restoration/dhi-hair-transplant-in-bangalore-4.webp',
    width: 900,
    height: 1200,
    alt: 'A doctor examining a man’s crown with a lit dermatoscope, magnified hair images on the screen',
  } as Image,
}

// C (continued). Dr Saranya T, the shorter mirrored block. Her portrait shows initials until the clinic shoot is in
// (same rule as the home doctor cards).
export const saranya = {
  name: 'Dr Saranya T',
  title: 'Consultant Plastic & Reconstructive Surgeon',
  qualifications: [
    'MBBS (Madras Medical College)',
    'DNB General Surgery (Sundaram Medical Foundation)',
    'M.Ch Plastic & Reconstructive Surgery (Kilpauk Government Medical College, Chennai)',
  ],
  text: "Dr Saranya leads NeoSculpt6's surgical care — face, breast and body. Her training spans aesthetic and reconstructive surgery, liposuction, abdominoplasty, gynaecomastia, rhinoplasty and breast surgery, so every surgical plan starts with anatomy, safety and a realistic picture of recovery.",
  chips: [
    'Rhinoplasty',
    'Facelift & eyelid surgery',
    'Liposuction',
    'Tummy tuck',
    'Gynaecomastia',
    'Breast surgery',
    'Post-pregnancy body',
  ],
  cta: { label: 'Meet Dr Saranya', href: '/dr-saranya-t/' },
  initials: 'ST',
  portrait: null as DoctorPortrait | null,
}

// 3. Our Professional Team. The cards are the home page's (`doctors.cards`: every published doctor), laid out by DoctorGrid.
export const team = {
  eyebrow: 'Meet Our Doctors',
  h2: [{ text: 'Expertise Matched to the ' }, { text: 'Right Concern', gold: true }] as Part[],
  cards: doctors.cards,
  cta: 'Book a Consultation', // scrolls to the page's booking form (useBooking)
}

// D. Clinic and technology. The ticker is the home ticker plus Excimer Phototherapy, in the doc's order.
export const clinicTech = {
  eyebrow: 'Inside NeoSculpt6',
  h2: [{ text: 'Technology Is Part of the Plan, ' }, { text: 'Not the Whole Plan', gold: true }] as Part[],
  text: 'Our Whitefield clinic has private consultation rooms and procedure rooms with sterile protocols. Every platform supports diagnosis and precision — the decision always stays with your doctor.',
  cta: { label: 'Explore Our Technology', href: '/technology/' },
  // Slot: a procedure room or a device in use.
  image: {
    src: '/images/services/slimming-body-contouring/cryolipolysis-treatment-in-bangalore-3.webp',
    width: 1024,
    height: 765,
    alt: 'A clinician setting up a cryolipolysis applicator for a patient lying on the treatment bed',
  } as Image,
  ticker: signature.ticker.flatMap((t) => (t === 'Cryolipolysis' ? ['Excimer Phototherapy', t] : [t])),
}

// 4. Our Services carousel. The small label names the lead doctor. Images and alt text are the home pillars' for the
// same hub, so no image path is repeated here.
const pillarFor = (href: string) => pillars.tabs.find((t) => t.cta.href === href)!
export const services = {
  h2: [{ text: 'Six Areas of ' }, { text: 'Specialist', gold: true }, { text: ' Care' }] as Part[],
  cards: [
    { label: 'Led by Dr Sandeep', title: 'Hair Transplant & Restoration', href: '/hair-transplant-restoration/' },
    { label: 'Led by Dr Saranya', title: 'Cosmetic Surgery', href: '/cosmetic-surgery/' },
    { label: 'Surgical & non-surgical', title: 'Slimming & Body Contouring', href: '/slimming-body-contouring/' },
    { label: 'Led by Dr Sandeep', title: 'Laser & Skin Aesthetics', href: '/laser-skin-aesthetic/' },
    { label: 'Led by Dr Sandeep', title: 'Anti-Ageing & Injectables', href: '/anti-aging-injectables/' },
    { label: 'Private consultation', title: 'Cosmetic Gynaecology', href: '/cosmetic-gynecology/' },
  ].map((card) => ({ ...card, image: pillarFor(card.href).image, alt: pillarFor(card.href).imageAlt })),
}

// 5. What Our Patients Say. Same rules as the home testimonials (src/data/home.ts): real Google reviews word for word,
// with written permission, never edited or combined, no ages; a card shows its quote only once `quote`, `author` and
// `consent` are set. Pick reviews that differ from the home page's. `treatment` is filled in with the chosen review.
// The rating, review count and Practo line are the home page's (pending sign-off); no rating schema until verified.
export const reviews = {
  h2: [{ text: 'What Our ' }, { text: 'Patients', gold: true }, { text: ' Say' }] as Part[],
  rating: testimonials.rating,
  practo: testimonials.practo,
  items: [
    { treatment: '', lookFor: 'the time given in the consultation', quote: null, author: null, consent: false, source: null },
    { treatment: '', lookFor: 'honest advice, including being told a procedure wasn’t needed', quote: null, author: null, consent: false, source: null },
    { treatment: '', lookFor: 'privacy and being put at ease', quote: null, author: null, consent: false, source: null },
    { treatment: '', lookFor: 'Dr Sandeep or Dr Saranya by name', quote: null, author: null, consent: false, source: null },
  ] as Testimonial[],
}

// E. Memberships, teaching and Neo Group. The logos are the home strip's; About shows only the memberships in
// `confirmed`. ISHRS, AHRS (the doc says "IAHRS / AHRS"; the old site and doctor page use AHRS, India) and DHI Global
// are † and are added here once Dr Sandeep confirms them. The same list feeds the Physician `memberOf` schema.
// The Neo Follicle crossing date is † and is shown only once `signedOff`.
const neoFollicle = clinic.sisterClinics.find((c) => c.name.startsWith('Neo Follicle'))!
const neoFertility = clinic.sisterClinics.find((c) => c.name === 'Neo Fertility')!
export const memberships = {
  label: 'Memberships & Recognition',
  confirmed: [
    'Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)',
    'Association of Cutaneous Surgeons of India (ACSI)',
    'International Society of Dermatology',
  ],
  pending: [
    'International Society of Hair Restoration Surgery (ISHRS)',
    'Association of Hair Restoration Surgeons, India (AHRS)',
    'DHI Global, Greece',
  ],
  h3: [{ text: 'Part of ' }, { text: 'Neo Group', gold: true }] as Part[],
  group: [
    {
      name: neoFollicle.name,
      text: "Dr Sandeep's dedicated hair transplant clinic",
      claim: { text: 'crossed 10,000 hair transplants in June 2026', signedOff: false },
      href: neoFollicle.href,
    },
    { name: neoFertility.name, text: "The group's fertility clinic", claim: null, href: neoFertility.href },
  ] as { name: string; text: string; claim: { text: string; signedOff: boolean } | null; href: string }[],
}
export const confirmedLogos = credentials.logos.filter((l) => memberships.confirmed.includes(l.name))

// F. FAQs about the clinic. Shown in the HTML and, word for word, in the FAQPage schema (src/components/Seo.tsx).
// Needs sign-off (†): "20+ years" (Q1) and "who also reviews your recovery" holding for every speciality (Q3).
export const faqs = {
  h2: [{ text: 'About NeoSculpt6: ' }, { text: 'Common Questions', gold: true }] as Part[],
  items: [
    {
      q: 'Who founded NeoSculpt6?',
      a: 'NeoSculpt6 was founded by Dr Sandeep Mahapatra, MD Dermatology, a senior consultant dermatologist and hair transplant surgeon with 20+ years in practice.',
    },
    {
      q: 'Who are the doctors at NeoSculpt6?',
      a: 'Dr Sandeep Mahapatra leads hair, skin, laser and injectable care; Dr Saranya T, M.Ch Plastic & Reconstructive Surgeon, leads cosmetic surgery.',
    },
    {
      q: 'Will I meet the doctor or a counsellor?',
      a: 'You meet the doctor. Your consultation, plan and treatment are led by the specialist for your concern, who also reviews your recovery.',
    },
    {
      q: 'Is NeoSculpt6 related to Neo Follicle?',
      a: 'Yes. Both are part of Neo Group and led by Dr Sandeep Mahapatra; Neo Follicle in Marathahalli focuses on hair transplants, while NeoSculpt6 in Whitefield covers six specialities.',
    },
    {
      q: 'Do you offer online consultations?',
      a: 'Yes. A video consultation can confirm your plan, cost and recovery time; some treatments still need an in-person examination first.',
    },
    {
      q: 'Where is NeoSculpt6 and when is it open?',
      a: '2nd floor, above Honda Big Wings, Sadaramangala, Whitefield Main Road, Bangalore 560066, beside BMW Deutsche Motoren. Open Monday to Saturday, 7am to 7pm.',
    },
  ],
}

// 6. Schedule an appointment. The form is the shared BookingForm (fields, button and microcopy already match the doc).
export const booking = {
  eyebrow: 'Schedule Your Visit Online',
  h2: [[{ text: 'Start With a Conversation' }], [{ text: 'That Is ' }, { text: 'About You', gold: true }]] as Part[][],
}

// 7. Instagram feed: the site-wide strip, shared with the service pages; data in site.ts.
export { instagram } from './site.ts'

// Schema (src/components/Seo.tsx). Credentials are listed only once verified; Dr Sandeep's degrees and certifications
// are all † and stay out of the schema until signed off. Dr Saranya's are not marked † in the doc.
export const physicians = [
  {
    name: 'Dr Sandeep Mahapatra',
    href: '/about-dr-sandeep-mahapatra/',
    specialty: 'Dermatology',
    jobTitle: 'Senior Consultant Dermatologist and Hair Transplant Surgeon',
    credentials: [] as string[],
    memberOf: memberships.confirmed,
  },
  {
    name: 'Dr Saranya T',
    href: '/dr-saranya-t/',
    specialty: 'PlasticSurgery',
    jobTitle: 'Consultant Plastic & Reconstructive Surgeon',
    credentials: saranya.qualifications,
    memberOf: [] as string[],
  },
]
