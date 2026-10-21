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
  // TODO: theme stock image. Replace with a real NeoSculpt6 portrait shoot (consented model or patient) before launch.
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
  // TODO: theme stock images. Replace with Dr Sandeep Mahapatra and Dr Saranya T together in the clinic (large) and
  // the NeoSculpt6 reception or procedure room (inset) before launch. The alt text describes those photos.
  image: {
    src: '/images/home/about.webp',
    width: 580,
    height: 685,
    alt: 'Dr Sandeep Mahapatra and Dr Saranya T together at the NeoSculpt6 clinic in Whitefield, Bangalore',
  },
  inset: {
    src: '/images/home/about-inset.webp',
    width: 260,
    height: 290,
    alt: 'The NeoSculpt6 reception in Whitefield, Bangalore',
  },
}

// 4. Core Treatment Pillars (tabs). The theme has 3 tabs; we have one per speciality. Checklist items link to their
// existing pages (most match the mega-menu in src/data/nav.ts); `npm run verify` checks every href and image.
// Needs sign-off before launch (marked † in the doc): 10,000+ transplants, 4,000+ Botox and 2,000+ filler
// treatments, 50,000+ laser procedures, and a female clinician on request. The † marks are not shown on the page.
// TODO: the images are the old site's hub images. Replace them with NeoSculpt6 photography: covered, clinical shots
// for Body Contouring and Cosmetic Surgery, and a soft botanical image (never a body) for Intimate Wellness.
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
      image: '/og/hair-transplant-restoration__neo-follicle-hair-transplant-in-bangalore.jpg',
      imageAlt: 'Hair transplant and restoration at NeoSculpt6, Whitefield, Bangalore',
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
      image: '/og/slimming-body-contouring__body-contouring-in-bangalore.jpg',
      imageAlt: 'Slimming and body contouring at NeoSculpt6, Whitefield, Bangalore',
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
      image: '/og/anti-aging-injectables__botox-treatment-in-bangalore.jpg',
      imageAlt: 'Anti-ageing and injectable treatments at NeoSculpt6, Whitefield, Bangalore',
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
      image: '/og/laser-skin-aesthetic__co2-fractional-laser-treatment-in-bangalore.jpg',
      imageAlt: 'Laser and skin aesthetic treatments at NeoSculpt6, Whitefield, Bangalore',
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
      image: '/og/cosmetic-surgery__rhinoplasty-in-bangalore.jpg',
      imageAlt: 'Cosmetic surgery with Dr Saranya T at NeoSculpt6, Whitefield, Bangalore',
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
      image: '/og/cosmetic-gynecology__vaginal-rejuvenation-treatment-in-bangalore.jpg',
      imageAlt: 'Cosmetic gynaecology and intimate wellness at NeoSculpt6, Whitefield, Bangalore',
    },
  ],
}

// 5. Popular Treatments carousel. Each card: category label (links to its speciality hub), treatment name, page URL.
// GLP-1 links to the dedicated GLP-1 page (the doc says medical weight loss), as the header mega-menu does.
export const popular = {
  h2: [{ text: 'Our ' }, { text: 'Popular', gold: true }, { text: ' Treatments' }],
  cta: { label: 'View All Treatments', href: '/#specialities' }, // section 4 takes id="specialities"
  // TODO: old-site images (as in the header mega-menu). Replace with NeoSculpt6 photography before launch, and
  // update the alt text to match.
  cards: [
    {
      category: { label: 'Hair Restoration', href: '/hair-transplant-restoration/' },
      title: 'Neo Follicle Hair Transplant',
      href: '/hair-transplant-restoration/neo-follicle-hair-transplant-in-bangalore/',
      image: '/og/hair-transplant-restoration__neo-follicle-hair-transplant-in-bangalore.jpg',
      alt: 'Doctor examining a patient’s thinning crown with a scalp camera before a hair transplant in Whitefield, Bangalore',
    },
    {
      category: { label: 'Hair Restoration', href: '/hair-transplant-restoration/' },
      title: 'FUE Hair Transplant',
      href: '/hair-transplant-restoration/fue-hair-transplant-in-bangalore/',
      image: '/og/hair-transplant-restoration__fue-hair-transplant-in-bangalore.jpg',
      alt: 'Surgeon wearing loupes harvesting grafts from the back of the scalp during an FUE hair transplant',
    },
    {
      category: { label: 'Body Contouring', href: '/slimming-body-contouring/' },
      title: 'Body Contouring',
      href: '/slimming-body-contouring/body-contouring-in-bangalore/',
      image: '/og/slimming-body-contouring__body-contouring-in-bangalore.jpg',
      alt: 'Clinician treating a reclining patient with a non-surgical body contouring device',
    },
    {
      category: { label: 'Body Contouring', href: '/slimming-body-contouring/' },
      title: 'GLP-1 Weight Loss',
      href: '/slimming-body-contouring/glp-1-weight-loss-program-in-bangalore/',
      image: '/og/slimming-body-contouring__glp-1-weight-loss-program-in-bangalore.jpg',
      alt: 'Doctor explaining a medically supervised GLP-1 weight loss plan to a patient on a tablet',
    },
    {
      category: { label: 'Body Contouring', href: '/slimming-body-contouring/' },
      title: 'Post-Pregnancy Belly Correction',
      href: '/slimming-body-contouring/post-pregnancy-belly-correction-in-bangalore/',
      image: '/og/slimming-body-contouring__post-pregnancy-belly-correction-in-bangalore.jpg',
      alt: 'Doctor discussing post-pregnancy belly correction options with a patient in the consultation room',
    },
    {
      category: { label: 'Anti-Ageing', href: '/anti-aging-injectables/' },
      title: 'Botox & Dermal Fillers',
      href: '/anti-aging-injectables/',
      image: '/og/anti-aging-injectables__botox-treatment-in-bangalore.jpg',
      alt: 'Doctor assessing a patient’s face in a hand mirror before Botox and dermal filler treatment',
    },
    {
      category: { label: 'Laser & Skin', href: '/laser-skin-aesthetic/' },
      title: 'Acne Scar Laser',
      href: '/laser-skin-aesthetic/acne-scar-laser-treatment-in-bangalore/',
      image: '/og/laser-skin-aesthetic__acne-scar-laser-treatment-in-bangalore.jpg',
      alt: 'Dermatologist reviewing acne scar laser treatment options with a patient on a tablet',
    },
    {
      category: { label: 'Laser & Skin', href: '/laser-skin-aesthetic/' },
      title: 'Laser Hair Removal',
      href: '/laser-skin-aesthetic/full-body-laser-hair-removal-in-bangalore/',
      image: '/og/laser-skin-aesthetic__full-body-laser-hair-removal-in-bangalore.jpg',
      alt: 'Doctor explaining full body laser hair removal to a patient beside the laser platform',
    },
    {
      category: { label: 'Cosmetic Surgery', href: '/cosmetic-surgery/' },
      title: 'Rhinoplasty',
      href: '/cosmetic-surgery/rhinoplasty-in-bangalore/',
      image: '/og/cosmetic-surgery__rhinoplasty-in-bangalore.jpg',
      alt: 'Surgeon showing a patient a profile sketch of the planned nose shape during a rhinoplasty consultation',
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
