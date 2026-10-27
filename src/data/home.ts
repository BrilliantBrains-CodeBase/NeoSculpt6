// Home page copy, one export per section. Source: content/home-page/homepage.md (section numbers match the doc).

// 1. Hero + credential ticker.
export const hero = {
  eyebrow: 'NeoSculpt6 · Whitefield, Bangalore',
  // The page's only H1. Joined with spaces, the lines must equal the home H1 in src/data/pages.json
  // (checked by `npm run verify`). `gold` sets the theme's tertiary highlight.
  h1: [
    [{ text: 'Doctor-Led' }],
    [{ text: 'Aesthetic', gold: true }, { text: ' Care in' }],
    [{ text: 'Whitefield, Bangalore', gold: true }],
  ],
  subline:
    'Hair, face, skin and body, diagnosed, planned and treated by the same senior doctors who will stand behind your result.',
  primaryCta: 'Book a Consultation',
  secondaryCta: { label: 'Find My Treatment', href: '/#find-my-treatment' }, // the concern form in section 15
  // NeoSculpt6 hero photo (scripts/import-photos.mjs). The face sits right of centre, so the crop keeps the right side.
  image: '/images/home/hero.webp',
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
    { value: 50000, suffix: '+', label: 'Laser Procedures' },
    { value: 500, suffix: '+', label: 'Patients from Outside India' },
  ],
  note: "Figures reflect Dr Sandeep Mahapatra's cumulative clinical experience.",
}

// 2. About intro. `h2` is the centred section title (not in the theme or the doc; added to match the other
// sections). `h3` is the doc's heading, set at H2 size like the theme's; it wraps naturally, like its inline
// highlight title.
export const about = {
  h2: [{ text: 'About ' }, { text: 'NeoSculpt6', gold: true }],
  eyebrow: 'Led by Doctors, Not by Packages',
  h3: [
    { text: 'Six ' },
    { text: 'Specialities.', gold: true },
    { text: ' One Doctor-Led ' },
    { text: 'Clinic.', gold: true },
  ],
  text: 'At NeoSculpt6 you are not handed to a counsellor or a technician. Your concern is assessed, your plan is designed and your procedure is led by a senior specialist and the same doctor follows your recovery. Dermatology and plastic surgery, under one roof.',
  cta: { label: 'Meet Our Specialists', href: '/#our-doctors' }, // section 9 takes id="our-doctors"
  // NeoSculpt6 photos (scripts/import-photos.mjs: about/1.png large, about/2.png inset).
  image: {
    src: '/images/home/about.webp',
    width: 881,
    height: 1100,
    alt: 'A doctor treating a woman’s forehead with a skin-tightening handpiece, the device’s screen beside them',
  },
  inset: {
    src: '/images/home/about-inset.webp',
    width: 480,
    height: 640,
    alt: 'A white aesthetic treatment device on wheels',
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

// 9. Meet your doctors. The theme has 3 cards; ours centres the 2 doctor cards (homepage.md §9). `specialty` is the
// pink line, copied from the doc as written. The H2 is two lines, as the doc sets them.
// Needs sign-off before launch (marked † in the doc): the sub-line's claim. The † is not shown.
// Portraits: square head-and-shoulders crops in /images/home/doctors/, shown as circles (a card shows an initials circle
// while `portrait` is null). Dr Sandeep's is cropped from his clinic portrait (/og/about-dr-sandeep-mahapatra.jpeg), Dr
// Saranya's from the studio photo the clinic sent on 2026-10-26. TODO: the two backgrounds differ (clinic room vs plain
// white); reshoot both in the clinic with the same lighting if the clinic wants them to match.
// TODO: add each doctor's real profile URLs. An icon shows only once its href is filled in (as in the footer).
export type DoctorSocial = { network: 'instagram' | 'youtube' | 'linkedin'; href: string }
export type DoctorPortrait = { src: string; width: number; height: number; alt: string }

export const doctors = {
  eyebrow: 'Your Doctors',
  h2: [[{ text: 'The Doctors' }], [{ text: 'Behind Every Plan', gold: true }]] as { text: string; gold?: boolean }[][],
  subline: 'The specialist who plans your treatment leads it and reviews your recovery.',
  profileLabel: 'Open Profile',
  cta: 'Book a Consultation', // opens the booking popup
  cards: [
    {
      name: 'Dr Sandeep Mahapatra',
      specialty: 'Dermatologist · Hair Transplant Surgeon',
      href: '/about-dr-sandeep-mahapatra/',
      initials: 'SM',
      portrait: {
        src: '/images/home/doctors/dr-sandeep-mahapatra.webp',
        width: 620,
        height: 620,
        alt: 'Dr Sandeep Mahapatra in a white coat, standing in a clinic room',
      } as DoctorPortrait | null,
      social: [
        { network: 'instagram', href: '' },
        { network: 'youtube', href: '' },
      ] as DoctorSocial[],
    },
    {
      name: 'Dr Saranya T',
      specialty: 'M.Ch Plastic & Reconstructive Surgeon',
      href: '/dr-saranya-t/',
      initials: 'ST',
      portrait: {
        src: '/images/home/doctors/dr-saranya-t.webp',
        width: 760,
        height: 760,
        alt: 'Dr Saranya T in a white coat against a plain white background',
      } as DoctorPortrait | null,
      social: [
        { network: 'instagram', href: '' },
        { network: 'linkedin', href: '' },
      ] as DoctorSocial[],
    },
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

// 10. Testimonials / Patient Stories. Copy real Google reviews word for word, with the patient's written permission;
// never write, edit, shorten or combine them, and never add an age. A card shows its quote only when `quote`,
// `author` and `consent` are all set; until then it shows as pending. `author` is first name + initial ("Priya S.");
// `source` is the review's Google link, kept for the record (not shown). `lookFor` is the doc's brief for each card.
// Needs sign-off before launch: the Google rating and review count (null = pending, shown as [x.x] / [nn]) and
// 2,054 Practo recommendations (marked † in the doc; the † is not shown). No AggregateRating schema until the rating
// is shown on the page and verified. `npm run verify` lists whatever is still pending.
export type Testimonial = {
  treatment: string
  lookFor: string
  quote: string | null
  author: string | null
  consent: boolean
  source: string | null
}

export const testimonials = {
  eyebrow: 'Patient Stories',
  h2: [{ text: 'Trusted by ' }, { text: 'Thousands', gold: true }, { text: ' of Patients' }] as {
    text: string
    gold?: boolean
  }[],
  rating: { value: null as string | null, count: null as number | null },
  practo: '2,054 Practo recommendations for Dr Sandeep',
  reviews: [
    {
      treatment: 'Hair Transplant',
      lookFor: 'Dr Sandeep and a natural hairline',
      quote: null,
      author: null,
      consent: false,
      source: null,
    },
    {
      treatment: 'Body Contouring',
      lookFor: 'the plan or the recovery',
      quote: null,
      author: null,
      consent: false,
      source: null,
    },
    {
      treatment: 'Acne Scar Laser',
      lookFor: 'honest advice on the number of sessions',
      quote: null,
      author: null,
      consent: false,
      source: null,
    },
    {
      treatment: 'Botox & Fillers',
      lookFor: 'still looking like themselves',
      quote: null,
      author: null,
      consent: false,
      source: null,
    },
    {
      treatment: 'Cosmetic Surgery',
      lookFor: 'Dr Saranya, safety or recovery',
      quote: null,
      author: null,
      consent: false,
      source: null,
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
export const technology = {
  eyebrow: 'Our Technology',
  h2: [[{ text: 'Advanced Platforms.' }], [{ text: 'Clinical Judgement First.', gold: true }]] as {
    text: string
    gold?: boolean
  }[][],
  subline: "Technology supports diagnosis and precision; it never replaces the doctor's decision.",
  cta: { label: 'Explore Our Technology', href: '/technology/' },
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
