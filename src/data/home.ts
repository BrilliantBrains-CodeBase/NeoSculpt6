// Home page copy, one export per section. Source: content/home-page/homepage.md (section numbers match the doc).

import { portraitFor, publicSocialLinks, publishedDoctors } from './doctors.ts'

// 1. Hero + credential ticker.
export const hero = {
  eyebrow: 'NeoSculpt6 · Whitefield, Bangalore',
  // The page's only H1. Joined with spaces, the lines must equal the home H1 in src/data/pages.json
  // (checked by `npm run verify`). `gold` sets the theme's tertiary highlight.
  h1: [
    [{ text: 'Doctor-Led' }],
    [{ text: 'Aesthetic', gold: true }, { text: ' Clinic in' }],
    [{ text: 'Whitefield, Bangalore', gold: true }],
  ],
  subline:
    'Hair, face, skin and body, diagnosed, planned and treated by the same senior doctors who will stand behind your result.',
  primaryCta: 'Book a Consultation',
  secondaryCta: { label: 'Find My Treatment', href: '/#find-my-treatment' }, // the concern form in section 15
  // NeoSculpt6 clinic photo (doctor treating a patient, subject on the right; 1672×941), supplied 2026-10-28.
  // Unused alternatives: /images/home/hero.webp (the Rejuvita theme image) and hero-supplied.webp (earlier photo).
  image: '/images/home/hero-clinic.webp',
  // Needs sign-off before launch (marked † in the doc): years in practice, transplant count, MD Gold Medalist,
  // DHI certification, ISHRS membership. The † marks are not shown on the page.
  ticker: [
    '20+ Years in Practice',
    '10,000+ Hair Transplants',
    'MD Dermatology, Gold Medalist',
    'Certified DHI Specialist',
    'M.Ch Plastic Surgeon',
    'ISHRS Member',
  ],
}

// 3. Credentials logo strip. Logos are greyscale versions of each body's official logo, made by
// scripts/make_credential_logos.py (sources: content/brand/credentials/sources.md); width and height are the 1x
// display size the script prints. Needs sign-off before launch (marked † in the doc): ISHRS, AHRS, DHI Global; show a
// logo only once the membership is confirmed. The doc says IAHRS; AHRS is used because it matches the old site's
// badge and the doctor page, which the name must match exactly.
export const credentials = {
  label: 'Credentials you can trust:',
  logos: [
    { name: 'International Society of Hair Restoration Surgery (ISHRS)', src: '/images/home/credentials/ishrs.webp', width: 140, height: 80 },
    { name: 'Association of Hair Restoration Surgeons, India (AHRS)', src: '/images/home/credentials/ahrs.webp', width: 140, height: 80 },
    { name: 'Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)', src: '/images/home/credentials/iadvl.webp', width: 103, height: 100 },
    { name: 'Association of Cutaneous Surgeons of India (ACSI)', src: '/images/home/credentials/acsi.webp', width: 150, height: 60 },
    { name: 'International Society of Dermatology', src: '/images/home/credentials/isd.webp', width: 249, height: 60 },
    { name: 'DHI Global, Greece', src: '/images/home/credentials/dhi-global.webp', width: 163, height: 50 },
  ],
}

// Stats counters, directly under the hero. The theme has 4; the doc's optional 5th (4,000+ Botox Treatments) needs
// a 5th column. Needs sign-off before launch (all four are marked † in the doc). TODO: swap one counter for the real Google
// rating ("4.9 Verified Reviews" in the theme) once it is pulled from the NeoSculpt6 profile.
export const stats = {
  items: [
    { value: 20, suffix: '+', label: 'Years of Clinical Practice' },
    { value: 10000, suffix: '+', label: 'Hair Transplants Performed' },
    // Not in homepage.md (it lists 50,000+ Laser Procedures here); changed on request, needs the same sign-off.
    { value: 30000, suffix: '+', label: 'Cosmetic Surgeries Performed' },
    { value: 500, suffix: '+', label: 'Patients from Outside India' },
  ],
  note: "Figures reflect Dr Sandeep Mahapatra's cumulative clinical experience.",
}

// 2. About intro. `h2` is the centred section title (not in the theme or the doc; added to match the other
// sections). `h3` is the column heading, set at H2 size like the theme's; it wraps naturally, like its inline
// highlight title. It replaces the doc's "Six Specialities. One Doctor-Led Clinic." (client's wording, 2026-10-30).
export const about = {
  h2: [{ text: 'About ' }, { text: 'NeoSculpt6', gold: true }],
  eyebrow: 'Led by Doctors, Not by Packages',
  h3: [
    { text: 'Your ' },
    { text: 'A–Z', gold: true },
    { text: ' Destination for Cosmetic & ' },
    { text: 'Aesthetic Care', gold: true },
  ],
  text: 'At NeoSculpt6 you are not handed to a counsellor or a technician. Your concern is assessed, your plan is designed and your procedure is led by a senior specialist and the same doctor follows your recovery. Dermatology and plastic surgery, under one roof.',
  cta: { label: 'Meet Our Specialists', href: '/#our-doctors' }, // section 9 takes id="our-doctors"
  // NeoSculpt6 photos: the large one is scripts/import-photos.mjs's about/1.png; the inset is "Dual Medical Aesthetic
  // Devices on Black" (2026-10-28), resized by hand. about-inset.webp (about/2.png) stays as an Instagram tile.
  image: {
    src: '/images/home/about.webp',
    width: 881,
    height: 1100,
    alt: 'A doctor treating a woman’s forehead with a skin-tightening handpiece, the device’s screen beside them',
  },
  inset: {
    src: '/images/home/about-inset-devices.webp',
    width: 640,
    height: 800,
    alt: 'Two white aesthetic treatment devices side by side on a black background, one with a skin-scan screen',
  },
}

// 4. Core Treatment Pillars (tabs). The theme has 3 tabs; we have one per speciality. Checklist items link to their
// existing pages (most match the mega-menu in src/data/nav.ts); `npm run verify` checks every href and image.
// Needs sign-off before launch (marked † in the doc): 10,000+ transplants, 4,000+ Botox and 2,000+ filler
// treatments, 50,000+ laser procedures, and a female clinician on request. The † marks are not shown on the page.
// Images: NeoSculpt6's Treatment Pillars photos (public/images/pillars/, imported by scripts/import-photos.mjs), also used
// by the header mega-menu (src/data/nav.ts).
export const pillars = {
  h2: [{ text: 'Our ' }, { text: 'Core', gold: true }, { text: ' Specialities' }],
  tabs: [
    {
      label: 'Hair Restoration',
      title: 'Hair Transplant & Restoration',
      text: 'Natural hairlines planned around your donor area not a graft package. Led by Dr Sandeep, with 10,000+ transplants and NFT, DHI and ARTAS robotic options.',
      items: [
        { label: 'Neo Follicle Hair Transplant', href: '/hair-transplant-restoration/neo-follicle-hair-transplant-in-bangalore/' },
        { label: 'FUE Hair Transplant', href: '/hair-transplant-restoration/fue-hair-transplant-in-bangalore/' },
        { label: 'DHI Hair Transplant', href: '/hair-transplant-restoration/dhi-hair-transplant-in-bangalore/' },
        { label: 'Failed Transplant Repair', href: '/hair-transplant-restoration/failed-hair-transplant-repair-in-bangalore/' },
        { label: 'Beard & Eyebrow Transplant', href: '/hair-transplant-restoration/beard-moustache-transplant-in-bangalore/' },
        { label: 'PRP & GFC', href: '/hair-transplant-restoration/prp-hair-treatment-in-bangalore/' },
      ],
      cta: { label: 'Explore Hair Restoration', href: '/hair-transplant-restoration/' },
      image: '/images/pillars/hair-transplant-restoration.webp',
      imageAlt: 'A gloved clinician drawing a new hairline on a balding man’s scalp',
    },
    {
      label: 'Cosmetic Surgery',
      title: 'Cosmetic Surgery',
      text: 'Face, breast and body surgery planned around anatomy, safety and recovery, led by Dr Saranya T, M.Ch Plastic & Reconstructive Surgeon.',
      items: [
        { label: 'Rhinoplasty', href: '/cosmetic-surgery/rhinoplasty-in-bangalore/' },
        { label: 'Facelift', href: '/cosmetic-surgery/facelift-surgery-in-bangalore/' },
        { label: 'Blepharoplasty', href: '/cosmetic-surgery/blepharoplasty-eyelid-surgery-in-bangalore/' },
        { label: 'Tummy Tuck', href: '/cosmetic-surgery/tummy-tuck-surgery-abdominoplasty-in-bangalore/' },
        { label: 'Gynaecomastia', href: '/cosmetic-surgery/gynecomastia-surgery-in-bangalore/' },
        { label: 'Breast Surgery', href: '/cosmetic-surgery/breast-augmentation-surgery-in-bangalore/' },
      ],
      cta: { label: 'Explore Cosmetic Surgery', href: '/cosmetic-surgery/' },
      image: '/images/pillars/cosmetic-surgery.webp',
      imageAlt: 'Gloved hands framing a woman’s face and jaw during a surgical assessment',
    },
    {
      label: 'Body Contouring',
      title: 'Slimming & Body Contouring',
      text: 'Surgical, non-surgical and medical options for stubborn fat and body shape, in one plan, from Vaser liposuction and cryolipolysis to doctor-supervised GLP-1 programmes.',
      items: [
        { label: 'Body Contouring', href: '/slimming-body-contouring/body-contouring-in-bangalore/' },
        { label: 'Vaser Liposuction', href: '/technology/vaser-liposuction-technology/' },
        { label: 'Cryolipolysis', href: '/slimming-body-contouring/cryolipolysis-treatment-in-bangalore/' },
        { label: 'GLP-1 Weight Loss Programme', href: '/slimming-body-contouring/glp-1-weight-loss-program-in-bangalore/' },
        { label: 'Mounjaro Consultation', href: '/slimming-body-contouring/mounjaro-weight-loss-consultation-in-bangalore/' },
        { label: 'Post-Pregnancy Belly Correction', href: '/slimming-body-contouring/post-pregnancy-belly-correction-in-bangalore/' },
      ],
      cta: { label: 'Explore Body Contouring', href: '/slimming-body-contouring/' },
      image: '/images/pillars/slimming-body-contouring.webp',
      imageAlt: 'A clinician treating a woman’s abdomen with a body-contouring device',
    },
    {
      label: 'Anti-Ageing',
      title: 'Anti-Ageing & Injectables',
      text: 'Measured refreshment that keeps you looking like yourself, planned and performed by Dr Sandeep across 4,000+ Botox and 2,000+ filler treatments.',
      items: [
        { label: 'Botox', href: '/anti-aging-injectables/botox-treatment-in-bangalore/' },
        { label: 'Dermal Fillers', href: '/anti-aging-injectables/dermal-filler-treatment-in-bangalore/' },
        { label: 'Profhilo', href: '/anti-aging-injectables/profhilo-in-bangalore/' },
        { label: 'HIFU', href: '/anti-aging-injectables/hifu-treatment-in-bangalore/' },
        { label: 'Viora Reaction RF Tightening', href: '/anti-aging-injectables/rf-skin-tightening-treatment-in-bangalore/' },
      ],
      cta: { label: 'Explore Anti-Ageing', href: '/anti-aging-injectables/' },
      image: '/images/pillars/anti-aging-injectables.webp',
      imageAlt: 'A clinician giving a filler injection in a relaxed woman’s cheek',
    },
    {
      label: 'Laser & Skin',
      title: 'Laser & Skin Aesthetics',
      text: 'Acne scars, pigmentation and unwanted hair, treated by diagnosis and skin type — 50,000+ laser procedures on CO2, Q-Switch and excimer platforms.',
      items: [
        { label: 'CO2 Fractional Laser', href: '/laser-skin-aesthetic/co2-fractional-laser-treatment-in-bangalore/' },
        { label: 'Acne Scar Laser', href: '/laser-skin-aesthetic/acne-scar-laser-treatment-in-bangalore/' },
        { label: 'Melasma Treatment', href: '/laser-skin-aesthetic/melasma-treatment-in-bangalore/' },
        { label: 'Full Body Laser Hair Removal', href: '/laser-skin-aesthetic/full-body-laser-hair-removal-in-bangalore/' },
        { label: 'Q-Switch Laser', href: '/laser-skin-aesthetic/q-switch-laser-treatment-in-bangalore/' },
        { label: 'Excimer Phototherapy', href: '/cosmetic-surgery/phototherapy-for-vitiligo-in-bangalore/' },
      ],
      cta: { label: 'Explore Laser & Skin', href: '/laser-skin-aesthetic/' },
      image: '/images/pillars/laser-skin-aesthetic.webp',
      imageAlt: 'A clinician treating a woman’s face with a laser handpiece while she wears eye shields',
    },
    {
      label: 'Intimate Wellness',
      title: 'Cosmetic Gynaecology',
      text: 'Private, respectful care for intimate and post-pregnancy concerns, with a confidential one-to-one consultation and a female clinician on request.',
      items: [
        { label: 'Labiaplasty', href: '/cosmetic-gynecology/labiaplasty-surgery-in-bangalore/' },
        { label: 'Laser Vaginal Tightening', href: '/cosmetic-gynecology/laser-vaginal-tightening-in-bangalore/' },
        { label: 'Vaginal Rejuvenation', href: '/cosmetic-gynecology/vaginal-rejuvenation-treatment-in-bangalore/' },
        { label: 'Intimate Pigmentation', href: '/cosmetic-gynecology/intimate-pigmentation-treatment-in-bangalore/' },
      ],
      cta: { label: 'Explore Intimate Wellness', href: '/cosmetic-gynecology/' },
      image: '/images/pillars/cosmetic-gynecology.webp',
      imageAlt: 'A woman in soft loungewear making a heart shape with her hands over her stomach',
    },
  ],
}

// 5. Popular Treatments carousel. Each card: category label (links to its speciality hub), treatment name, page URL.
// GLP-1 links to the dedicated GLP-1 page (the doc says medical weight loss), as the header mega-menu does.
export const popular = {
  h2: [{ text: 'Our ' }, { text: 'Popular', gold: true }, { text: ' Treatments' }],
  cta: { label: 'View All Treatments', href: '/#specialities' }, // section 4 takes id="specialities"
  // Each card shows its page's first NeoSculpt6 photo (src/data/services/new-photos.json).
  cards: [
    {
      category: { label: 'Hair Restoration', href: '/hair-transplant-restoration/' },
      title: 'Neo Follicle Hair Transplant',
      href: '/hair-transplant-restoration/neo-follicle-hair-transplant-in-bangalore/',
      image: '/images/services/hair-transplant-restoration/neo-follicle-hair-transplant-in-bangalore-1.webp',
      alt: 'A doctor going over scalp photos on a monitor with a man at his desk',
    },
    {
      category: { label: 'Hair Restoration', href: '/hair-transplant-restoration/' },
      title: 'FUE Hair Transplant',
      href: '/hair-transplant-restoration/fue-hair-transplant-in-bangalore/',
      image: '/images/services/hair-transplant-restoration/fue-hair-transplant-in-bangalore-1.webp',
      alt: 'A surgeon wearing loupes extracting grafts from a man’s scalp',
    },
    {
      category: { label: 'Body Contouring', href: '/slimming-body-contouring/' },
      title: 'Body Contouring',
      href: '/slimming-body-contouring/body-contouring-in-bangalore/',
      image: '/images/services/slimming-body-contouring/body-contouring-in-bangalore-1.webp',
      alt: 'A doctor treating a patient’s abdomen with a body-contouring handpiece',
    },
    {
      category: { label: 'Body Contouring', href: '/slimming-body-contouring/' },
      title: 'GLP-1 Weight Loss',
      href: '/slimming-body-contouring/glp-1-weight-loss-program-in-bangalore/',
      image: '/images/services/slimming-body-contouring/glp-1-weight-loss-program-in-bangalore-1.webp',
      alt: 'A doctor taking notes while talking with a patient across a consultation desk',
    },
    {
      category: { label: 'Body Contouring', href: '/slimming-body-contouring/' },
      title: 'Post-Pregnancy Belly Correction',
      href: '/slimming-body-contouring/post-pregnancy-belly-correction-in-bangalore/',
      image: '/images/services/slimming-body-contouring/post-pregnancy-belly-correction-in-bangalore-1.webp',
      alt: 'A clinician measuring a woman’s waist with a tape measure',
    },
    {
      category: { label: 'Anti-Ageing', href: '/anti-aging-injectables/' },
      title: 'Botox & Dermal Fillers',
      href: '/anti-aging-injectables/',
      image: '/images/services/anti-aging-injectables/botox-treatment-in-bangalore-1.webp',
      alt: 'A doctor injecting Botox between a woman’s eyebrows',
    },
    {
      category: { label: 'Laser & Skin', href: '/laser-skin-aesthetic/' },
      title: 'Acne Scar Laser',
      href: '/laser-skin-aesthetic/acne-scar-laser-treatment-in-bangalore/',
      image: '/images/services/laser-skin-aesthetic/acne-scar-laser-treatment-in-bangalore-1.webp',
      alt: 'A clinician treating acne scars on a woman’s cheek with a laser handpiece while she wears eye shields',
    },
    {
      category: { label: 'Laser & Skin', href: '/laser-skin-aesthetic/' },
      title: 'Laser Hair Removal',
      href: '/laser-skin-aesthetic/full-body-laser-hair-removal-in-bangalore/',
      image: '/images/services/laser-skin-aesthetic/full-body-laser-hair-removal-in-bangalore-1.webp',
      alt: 'A clinician treating a woman’s legs with a laser hair-removal handpiece as she lies on the bed in towels',
    },
    {
      category: { label: 'Cosmetic Surgery', href: '/cosmetic-surgery/' },
      title: 'Rhinoplasty',
      href: '/cosmetic-surgery/rhinoplasty-in-bangalore/',
      image: '/images/services/cosmetic-surgery/rhinoplasty-in-bangalore-1.webp',
      alt: 'A surgeon examining the shape of a woman’s nose',
    },
  ],
}

// 6. Philosophy / results slider. In the theme, the stats counters are this section's bottom row; ours stay under
// the hero (agreed with the client). `h2` is three lines, as the doc sets them.
// TODO: theme stock images (a face, not hair). Replace with one consented hair transplant case before launch, and
// set `caption`, e.g. "8 months after FUE, 2,800 grafts · Dr Sandeep Mahapatra". The months and graft count need
// sign-off (marked † in the doc). The caption is not shown while it is null. The alt text describes the real case.
export const results = {
  eyebrow: 'Real Results',
  h2: [[{ text: 'Results That' }], [{ text: 'Look Like', gold: true }], [{ text: 'You.' }]] as { text: string; gold?: boolean }[][],
  text: "We aim for results that suit your face and body, not a template. If you don't need a procedure or need to wait, we'll tell you. Every case is shared with the patient's written consent.",
  cta: { label: 'View Full Results Gallery', href: '/results/' },
  disclaimer:
    'Individual results vary. Before-and-after images are shared for patient education and are not a promise of a specific outcome.',
  slider: {
    before: {
      src: '/images/home/results-before.webp',
      width: 600,
      height: 720,
      alt: 'Patient’s hairline before a hair transplant at NeoSculpt6, Whitefield, Bangalore',
    },
    after: {
      src: '/images/home/results-after.webp',
      width: 602,
      height: 720,
      alt: 'The same patient’s hairline after a hair transplant with Dr Sandeep Mahapatra',
    },
    offset: 65, // % from the left, the theme's default_offset
    caption: null as string | null,
  },
}

// 8. Signature hair expertise + technology ticker (the theme's hotspot section). The H2 is three lines, as the doc
// sets them. Hotspot `x`/`y` are % from the image's left/top edge; `side` puts the tooltip above or below the dot.
// The dots sit off faces and off the implanter tip.
// TODO: placeholder image, cropped from the old site's direct hair transplant photo (patient's face cropped out).
// Replace it with a consented photograph of Dr Sandeep marking a patient's hairline before launch, then move the
// hotspots to suit the new photo. The alt text already describes that photo.
// Needs sign-off before launch (marked † in the doc): 10,000+ procedures in the NFT tooltip. The † is not shown.
export const signature = {
  eyebrow: 'Signature Expertise',
  h2: [[{ text: 'Hair Restoration,' }], [{ text: 'Planned for the', gold: true }], [{ text: 'Next Ten Years' }]] as {
    text: string
    gold?: boolean
  }[][],
  text: 'A hairline should still look natural when you are older. Dr Sandeep plans every transplant around your donor reserve and future hair loss not graft numbers.',
  cta: { label: 'Get Your Hair Assessment', href: '/hair-transplant-restoration/' },
  image: {
    src: '/images/home/signature-hairline.webp',
    width: 644,
    height: 732,
    alt: 'Dr Sandeep Mahapatra marking a patient’s hairline before a hair transplant in Whitefield, Bangalore',
  },
  hotspots: [
    {
      title: 'Diagnosis before surgery',
      text: 'Early thinning often responds to PRP, GFC, exosomes or medication and you’ll be told so.',
      x: 24,
      y: 13,
      side: 'bottom',
    },
    {
      title: 'Neo Follicle Transplant (NFT)',
      text: 'Dr Sandeep’s own approach to graft handling and implantation, refined over 10,000+ procedures.',
      x: 30,
      y: 76,
      side: 'top',
    },
    {
      title: 'DHI and FUE, chosen per case',
      text: 'Methods matched to your hair, scalp and goal, not to a brand name.',
      x: 40,
      y: 38,
      side: 'bottom',
    },
    {
      title: 'ARTAS robotic assistance',
      text: 'Image-guided robotic harvesting where your donor area suits it.',
      x: 56,
      y: 89,
      side: 'top',
    },
    {
      title: 'Repair and complex cases',
      text: 'Unnatural hairlines, poor density and previous transplants elsewhere, assessed for correction.',
      x: 79,
      y: 68,
      side: 'top',
    },
  ] as { title: string; text: string; x: number; y: number; side: 'top' | 'bottom' }[],
  ticker: [
    'AI Hair Analysis',
    'AI Donor Assessment',
    'ARTAS Robotic',
    'Vaser Liposuction',
    'CO2 Fractional Laser',
    'Viora Reaction RF',
    'Q-Switch Laser',
    'Cryolipolysis',
  ],
}

// 9. Meet your doctors (homepage.md §9): one card per published doctor (src/data/doctors.json). Up to three cards sit
// centred at the theme's 3-column width; four or more fill rows of four (DoctorGrid). `specialty` is the record's
// shortRole. The H2 is two lines, as the doc sets them.
// Needs sign-off before launch (marked † in the doc): the sub-line's claim. The † is not shown.
// Portraits: each record's hero portrait (the same photo as its profile page), filling the card behind a gradient; a
// card shows its initials until the portrait is approved. Square photos are cropped at the sides. Dr Sandeep's is his
// clinic portrait, Dr Saranya's the studio photo the clinic sent on 2026-10-26, Dr Payal Mahapatra's her Neo Fertility
// portrait and Dr Thyagaraj's his Derma Solutions portrait (both sent by the clinic on 2026-10-30). TODO: the
// backgrounds differ (clinic room, white, grey wall); reshoot in the clinic with the same lighting if the clinic wants
// them to match. Dr Thyagaraj's is only 400px, so it looks soft at large sizes; ask for a larger original.
// Social icons show once a profile URL is approved in doctors.json.
export type DoctorSocial = { network: 'instagram' | 'facebook' | 'youtube' | 'linkedin'; href: string }
export type DoctorPortrait = { src: string; width: number; height: number; alt: string }

export const doctors = {
  eyebrow: 'Your Doctors',
  h2: [[{ text: 'The Doctors' }], [{ text: 'Behind Every Plan', gold: true }]] as { text: string; gold?: boolean }[][],
  subline: 'The specialist who plans your treatment leads it and reviews your recovery.',
  profileLabel: 'Open Profile',
  cta: 'Book a Consultation', // scrolls to the Find My Treatment form (useBooking)
  // One card per published doctor in src/data/doctors.json, in the file's order, so a new doctor appears here, on the
  // About team and in the header menu without other edits. Portrait: the record's hero portrait once approved (initials
  // until then); social icons: approved profile URLs only.
  cards: publishedDoctors.map((d) => ({
    name: d.displayName,
    specialty: d.shortRole,
    href: d.path,
    initials: d.initials,
    portrait: portraitFor(d) as DoctorPortrait | null,
    social: publicSocialLinks(d).map(({ network, href }) => ({ network, href })) as DoctorSocial[],
  })),
}

// Extra A: Dr Sandeep spotlight, placed between the pillars (4) and the popular carousel (5) as
// content/home-page/prompts/04-doctor-spotlight-before-popular-treatments.md sets it (homepage.md had it after 3).
// Eyebrow, name, title line, paragraph, education checklist, portrait and profile link are the About page's `founder`
// (src/data/about.ts, about-us.md §C), read by the component directly so the two pages can't drift. Only the
// home-only bits live here. The † marks are not shown; `pending` is what Dr Sandeep must confirm before launch, and
// `npm run verify` lists it. The experience line stays hidden until `approved` is set.
export const doctorSpotlight = {
  id: 'doctor-spotlight',
  bookingLabel: 'Book a Consultation', // scrolls to the Find My Treatment form (useBooking)
  experience: { text: '20+ years of clinical experience in skin, hair and aesthetic care', approved: false },
  pending: [
    'More than two decades in practice (†)',
    '10,000+ hair transplants performed (†)',
    '18+ surgeons trained (†)',
    '55+ specialists formed under his guidance (†)',
    'MBBS honours, gold medals in two subjects, MGM Medical College (†)',
    'MD Dermatology, Venereology & Leprosy, Gold Medalist, RIMS Ranchi (†)',
    'Certified DHI Specialist, DHI Global, Greece (†)',
    'Basic and advanced Botox and dermal filler certification, Allergan (†)',
    'Portrait: old-site clinic photo, not the new clinic shoot',
  ],
}

// Section 12: booking form (homepage.md §12). Shared by the home section (HomeBooking) and the popup (BookingDialog).
// The form's fields and microcopy live in components/booking/BookingForm.tsx.
export const booking = {
  h2: [[{ text: 'Start With a Conversation,' }], [{ text: 'Not a Commitment', gold: true }]] as { text: string; gold?: boolean }[][],
  subline:
    "Tell us what you'd like to change. You'll meet the right specialist, understand every option and receive a clear written plan, then decide in your own time.",
  // TODO: replace with a NeoSculpt6 clinic photo shot for this slot (same placeholder as the popup).
  image: {
    src: '/og/about-dr-sandeep-mahapatra.jpeg',
    alt: 'Dr Sandeep Mahapatra in the NeoSculpt6 clinic, Whitefield',
    width: 1122,
    height: 1402,
  },
}

// 10. Testimonials / Patient Stories. Real Google reviews, copied word for word: never write, edit, shorten or
// combine them, and never add an age. Line breaks are the reviewer's own (Google's <br>). A card shows its quote only
// when `quote`, `author` and `consent` are all set; until then it shows as pending. `author` is first name + initial
// from the Google display name ("Kunal M."); a single-word name stays as it is. `listing` is the Google profile the
// review was posted on (shown on the card); `source` is that profile's Maps link, kept for the record.
// Source (2026-10-30, client's instruction): the Neo Follicle Hair Transplant and Derma Solutions Skin and Hair
// Clinic - Marathahalli profiles, both Dr Sandeep Mahapatra's clinics. The client approved publishing these public
// reviews, so `consent` is true on that basis rather than a separate written permission from each patient.
// The doc's cards (Hair Transplant, Body Contouring, Acne Scar Laser, Botox & Fillers, Cosmetic Surgery) are adapted:
// neither profile has a body contouring or cosmetic surgery review, so the client chose two other treatments, and the
// labels name the treatment each reviewer actually had. Swap in a closer match if one is posted.
// Rating: Neo Follicle's public Google figure (4.8 from 1,042 reviews, read from Maps 2026-10-30), named in the line
// because it is not NeoSculpt6's own listing; update it when NeoSculpt6 has its own profile. Still needs sign-off:
// 2,054 Practo recommendations (marked † in the doc; the † is not shown). No AggregateRating or Review schema: the
// rating belongs to another listing. `npm run verify` lists whatever is still pending.
export type Testimonial = {
  treatment: string
  lookFor: string
  quote: string | null
  author: string | null
  consent: boolean
  listing?: string
  source: string | null
}

const NEO_FOLLICLE = { listing: 'Neo Follicle', source: 'https://maps.google.com/maps?cid=1368765349301541274' }
const DERMA_SOLUTIONS = { listing: 'Derma Solutions', source: 'https://maps.google.com/maps?cid=12976301854266238109' }

export const testimonials = {
  eyebrow: 'Patient Stories',
  h2: [{ text: 'Trusted by ' }, { text: 'Thousands', gold: true }, { text: ' of Patients' }] as {
    text: string
    gold?: boolean
  }[],
  rating: { value: '4.8' as string | null, count: 1042 as number | null, source: 'Neo Follicle' as string | undefined },
  practo: '2,054 Practo recommendations for Dr Sandeep',
  reviews: [
    {
      treatment: 'Hair Transplant',
      lookFor: 'Dr Sandeep and a natural hairline',
      quote:
        'I am extremely satisfied with my hair transplant experience with Dr. Sandeep. From the initial consultation to the procedure and follow-up, everything was handled professionally and with great care.\n\nDr. Sandeep was very patient, explained the entire process clearly, and made me feel comfortable throughout the procedure. The results have been really impressive, and I’m genuinely happy with the overall improvement in my hairline and appearance.\n\nA big thank you to Dr. Sandeep and the entire team for their professionalism, support, and excellent work. I would definitely recommend Dr. Sandeep to anyone considering a hair transplant.',
      author: 'Kunal M.',
      consent: true,
      ...NEO_FOLLICLE,
    },
    {
      treatment: 'Laser Hair Reduction',
      lookFor: 'the results after a few sessions',
      quote:
        'Hey there! I am happy to share my best experience with Dr. Sandeep sir\'s clinic where I have taken Laser Hair Reduction full body of 4 sessions. Awesome improvement. I never believed that in such few sessions can see good reduction of hairs and longer months it took for  the upcoming growth to see. I was worried about this procedure as I took many sessions in other clinics and salons where ended up with unsatisfaction and waste of money.\nDr. Sandeep introduced me with his advanced device Reveal Laser USFDA approved and so, I agreed for the same for not to get into any complications. I am happy with the results and have suggested for all of my friends. Worth of spending here ! Thanks for Derma solutions clinic. for a note, Iam already taken treatments with Neo fertility as well .',
      author: 'Chandana S.',
      consent: true,
      ...DERMA_SOLUTIONS,
    },
    {
      treatment: 'Acne & Scar Treatment',
      lookFor: 'honest advice',
      quote:
        '⭐️⭐️⭐️⭐️⭐️\nI\'ve been seeing Dr. Sandeep Mahapatra at derma solutions clinic for a while now, and I genuinely couldn’t be happier with the care I’ve received. From the very first appointment, they made me feel completely at ease — not rushed, not talked over, just really listened to. That alone sets them apart.\n\nI originally went in for acne  and scarring and the difference in my skin is night and day. Later I decided to go for a Botox and fillers ,and the result is really magic for me😍Dr.Mahapatra explained every step of the treatment plan and didn’t push unnecessary products or procedures. What I appreciated most was how practical and honest the advice was — no overpromises, just results.\n\nThe clinic itself is clean, professional, and runs on time (a rare find these days). The staff are friendly and responsive, and I’ve never had trouble getting a follow-up or asking questions between visit.\n\nIf you are looking for a dermatologist who is not only highly skilled but  also genuinely cares, I can\'t recommend Dr Mahapatra enough .',
      author: 'Rakshu M.',
      consent: true,
      ...DERMA_SOLUTIONS,
    },
    {
      treatment: 'Botox & PDRN',
      lookFor: 'still looking like themselves',
      quote:
        'I had an amazing experience with Dr. Sandeep Mahapatra for both Botox and PDRN treatments. He is incredibly knowledgeable, patient, and thorough in explaining the procedure and expected results. The clinic was clean, well-organized, and made me feel at ease from the moment I walked in.\n\nThe Botox results were very natural-looking, and I started noticing the effect within a few days. The PDRN treatment left my skin feeling much more hydrated, firmer, and glowing. I truly appreciate the care and precision Dr. Sandeep brings to his work. He has a very aesthetic eye and prioritizes what suits the face best.\n\nHighly recommend him if you’re looking for safe, effective, and subtle aesthetic enhancements!',
      author: 'Rajashekar',
      consent: true,
      ...DERMA_SOLUTIONS,
    },
    {
      treatment: 'CO2 Laser',
      lookFor: 'results from the first session',
      quote:
        'Got Co2 laser done under the guidance of Dr. Sandeep and Dr. Yogita. Saw difference in skin quality from 1st session itself. Highly recommend for co2 and other skin concerns.',
      author: 'Rima R.',
      consent: true,
      ...DERMA_SOLUTIONS,
    },
  ] as Testimonial[],
}

// 11. Price guide. homepage.md lists the section but gives no copy, and its sign-off list still has "Starting prices
// and EMI" open, so the section is consultation-first: every treatment row shows `pendingLabel` until its price is
// set in `prices`. Rules until prices are signed off:
// - Show only approved, current prices. Never a placeholder or an old figure (the old hair pages' "Rs.60 to Rs.100
//   per graft" is not approved for this page).
// - No "from" prices until "from" pricing is confirmed. No EMI or finance wording.
// - No priceRange or Offer schema (src/components/Seo.tsx) until prices are approved and shown here.
// Needs sign-off before launch: `eyebrow`, `h2`, `subline` and `disclaimer` are drafts. The H2 joins two phrases the
// doc already approves (Promise "One clear price"; Step 04 "the full cost, before you commit"). The subline is the
// Promise line word for word. The disclaimer follows the FAQ's cost answer.
// Cards are the six specialities from `pillars` (same treatments, links, images and hub buttons), so nothing is
// copied here; `npm run verify` already checks those links and images.
export const priceGuide = {
  eyebrow: 'Price Guide',
  h2: [{ text: 'One Clear Price, ' }, { text: 'Before You Commit', gold: true }] as { text: string; gold?: boolean }[],
  subline: 'You receive the full cost in your written plan before treatment. No surprises.',
  pendingLabel: 'Quoted after assessment',
  disclaimer:
    'Your exact cost depends on your assessment, treatment plan, technique and number of sessions, and is confirmed in writing before you begin.',
  cta: 'Book a Consultation',
  cards: pillars.tabs.map(({ title, items, cta, image, imageAlt }) => ({ title, items, cta, image, imageAlt })),
  // Approved price per treatment, keyed by the treatment's page URL (as in `pillars`), in ₹ exactly as signed off,
  // e.g. '₹45,000' or '₹40,000–60,000'. null = not approved yet (the row shows `pendingLabel`).
  prices: {} as Record<string, string | null>,
}

// 13. Our Technology (replaces the theme's Shop row). Each card: platform name, the doc's one line (in the theme's
// price slot) and a "Learn More" link to its technology page; `npm run verify` checks every link and image.
// `position` is the image's object-position, to keep the subject in the tall card crop; `bannerPosition` does the same
// for the wide banner on the technology page.
// Photos: AI Hair Analysis, CO2 and Q-Switch have a photo of their own (the ARTAS page's old photo was the same file as
// AI Hair Analysis). The other six are NeoSculpt6 service photos of the same treatment (src/data/services/new-photos.json).
// TODO: replace them with photos of each NeoSculpt6 platform when the clinic supplies them, and update the alt text.
// The home page shows `banner` in place of the card row (supplied 2026-10-28: "Advanced Aesthetic Technology Banner"),
// full width above Real Results and without the section's "Explore Our Technology" button;
// the cards stay here because the technology pages use them (their hero photos, src/data/technology/index.ts).
// The banner image carries its own headline; `h2` and `text` are the same words as live text, shown on phones (where
// the image is the devices-only crop and its lettering would be too small) and read by screen readers everywhere, so
// the image alt describes the devices only.
// TODO (sign-off): "targeted, visible and long-lasting results" is an outcome promise the content rules keep out
// ("permanent", guarantees); it is in the image itself, so changing it needs a new image.
export const technology = {
  banner: {
    h2: [[{ text: 'Advanced Technology.' }], [{ text: 'Expert-Led Treatments.', gold: true }]] as { text: string; gold?: boolean }[][],
    text: 'AI-driven hair analysis, Q-Switch laser and Viora Reaction RF for targeted, visible and long-lasting results.',
    image: { src: '/images/home/technology-banner.webp', width: 2103, height: 748 },
    mobileImage: { src: '/images/home/technology-banner-mobile.webp', width: 1045, height: 748 },
    alt: 'Three treatment platforms on a cream backdrop: an AI hair and scalp analysis station, a Q-Switch laser with its articulated arm, and a Viora Reaction RF unit',
  },
  cards: [
    {
      title: 'AI-Integrated Hair Analysis',
      text: 'Maps density and thinning to plan treatment precisely.',
      href: '/technology/ai-integrated-hair-analysis/',
      image: '/og/technology__ai-integrated-hair-analysis.webp',
      width: 1513,
      height: 1039,
      position: '62% center',
      alt: 'Doctor reviewing a magnified scalp scan on a screen while examining a patient’s hair',
    },
    {
      title: 'AI-Integrated Donor Assessment',
      text: 'Measures your donor reserve before any graft number is quoted.',
      href: '/technology/ai-integrated-donor-assessment/',
      image: '/images/services/hair-transplant-restoration/dhi-hair-transplant-in-bangalore-4.webp',
      width: 900,
      height: 1200,
      alt: 'A doctor examining a man’s crown with a lit dermatoscope, magnified hair images on the screen',
    },
    {
      title: 'ARTAS Robotic Hair Transplant',
      text: 'Image-guided robotic harvesting for suitable candidates.',
      href: '/technology/artas-robotic-hair-transplant/',
      image: '/images/services/hair-transplant-restoration/fue-hair-transplant-in-bangalore-1.webp',
      width: 961,
      height: 1200,
      alt: 'A surgeon wearing loupes extracting grafts from a man’s scalp',
    },
    {
      title: 'Vaser Liposuction',
      text: 'Ultrasound-assisted fat removal for refined body contouring.',
      href: '/technology/vaser-liposuction-technology/',
      image: '/images/services/cosmetic-surgery/liposuction-surgery-in-bangalore-1.webp',
      width: 900,
      height: 1200,
      bannerPosition: 'center 30%',
      alt: 'A surgeon marking a woman’s waist and hips before liposuction',
    },
    {
      title: 'Viora Reaction RF',
      text: 'Radiofrequency skin tightening for face and body.',
      href: '/technology/reaction-viora-rf-tightening/',
      image: '/images/services/anti-aging-injectables/rf-skin-tightening-treatment-in-bangalore-1.webp',
      width: 900,
      height: 1200,
      alt: 'A clinician treating a woman’s jaw with an RF tightening handpiece, the device behind them',
    },
    {
      title: 'CO2 Fractional Laser',
      text: 'Resurfacing for acne scars, texture and fine lines.',
      href: '/technology/co2-fractional-laser/',
      image: '/og/technology__co2-fractional-laser.jpg',
      width: 1024,
      height: 1024,
      alt: 'Doctor treating a patient’s face with a fractional laser handpiece, both wearing eye protection',
    },
    {
      title: 'Q-Switch Laser',
      text: 'Targeted treatment for pigmentation and tattoos.',
      href: '/technology/q-switch-laser/',
      image: '/og/technology__q-switch-laser.jpg',
      width: 1024,
      height: 1024,
      alt: 'Doctor treating the side of a patient’s face with a laser handpiece, both wearing eye protection',
    },
    {
      title: 'Excimer Laser & Phototherapy',
      text: 'Focused light therapy for vitiligo and selected skin conditions.',
      href: '/technology/excimer-laser-targeted-phototherapy/',
      image: '/images/services/cosmetic-surgery/phototherapy-for-vitiligo-in-bangalore-1.webp',
      width: 900,
      height: 1200,
      bannerPosition: 'center 25%',
      alt: 'A patient holding her forearm to a phototherapy cabinet while a clinician sets the controls',
    },
    {
      title: 'Cryolipolysis Platforms',
      text: 'Non-surgical fat reduction for localised areas.',
      href: '/technology/body-contouring-cryolipolysis-platforms/',
      image: '/images/services/slimming-body-contouring/cryolipolysis-treatment-in-bangalore-1.webp',
      width: 1200,
      height: 900,
      alt: 'A clinician fitting cryolipolysis applicators to a patient’s abdomen',
    },
  ] as { title: string; text: string; href: string; image: string; width: number; height: number; position?: string; bannerPosition?: string; alt: string }[],
}

// 14. Journal. The cards come from src/data/posts.ts (latest 3 published posts, topped up with "Coming soon"
// topics); this block is only the section copy. `h2` is two lines, as the doc sets them.
// TODO: the theme's "Read More Articles" button links to the blog index. Set `cta` to
// { label: 'Read More Articles', href: '/journal/' } once that page exists; the button is hidden while it is null.
export const journal = {
  eyebrow: 'Our Journal',
  h2: [[{ text: 'Insights', gold: true }], [{ text: 'From Our Doctors' }]] as { text: string; gold?: boolean }[][],
  cta: null as { label: string; href: string } | null,
}

// 15. Find My Treatment section (replaces the theme's newsletter band). Holds the full appointment form; submitting
// opens a WhatsApp chat with the clinic (no form backend). `id="find-my-treatment"` is the target of the hero's secondary CTA and the
// menus' "Find My Treatment" links. No offer or discount: the theme's 10% newsletter line is not used.
// TODO: theme stock image (the newsletter band's 84-home-1-11.webp). Replace with NeoSculpt6 photography before launch.
export const findTreatment = {
  h2: [[{ text: 'Not Sure What You Need?' }], [{ text: 'Start With What You’d Like to Change.', gold: true }]] as {
    text: string
    gold?: boolean
  }[][],
  subline: 'Tell us your concern and we’ll book you with the right doctor.',
  image: '/images/home/find-treatment-bg.webp',
  // The form is the shared BookingForm; its fields and microcopy live in components/booking/BookingForm.tsx.
}
