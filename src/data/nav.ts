// Header menu. Source: content/home-page/homepage.md "Global elements" and section 4 (treatments per speciality).
// Every internal path must be a route in pages.json; scripts/verify-seo.mjs checks this after the build.
// Keep this file to erasable TypeScript only (verify-seo.mjs imports it with Node's type stripping).

export interface NavLink {
  label: string
  href: string
}

export interface MegaColumn extends NavLink {
  // The speciality's Treatment Pillars photo (public/images/pillars/), as on the home page tabs.
  image: string
  items: NavLink[]
}

export interface NavItem extends NavLink {
  children?: NavLink[]
  mega?: MegaColumn[]
}

export const specialities: MegaColumn[] = [
  {
    label: 'Hair Restoration',
    href: '/hair-transplant-restoration/',
    image: '/images/pillars/hair-transplant-restoration.webp',
    items: [
      { label: 'Neo Follicle Hair Transplant', href: '/hair-transplant-restoration/neo-follicle-hair-transplant-in-bangalore/' },
      { label: 'FUE Hair Transplant', href: '/hair-transplant-restoration/fue-hair-transplant-in-bangalore/' },
      { label: 'DHI Hair Transplant', href: '/hair-transplant-restoration/dhi-hair-transplant-in-bangalore/' },
      { label: 'Failed Transplant Repair', href: '/hair-transplant-restoration/failed-hair-transplant-repair-in-bangalore/' },
      { label: 'Beard & Moustache Transplant', href: '/hair-transplant-restoration/beard-moustache-transplant-in-bangalore/' },
    ],
  },
  {
    label: 'Body Contouring',
    href: '/slimming-body-contouring/',
    image: '/images/pillars/slimming-body-contouring.webp',
    items: [
      { label: 'Body Contouring', href: '/slimming-body-contouring/body-contouring-in-bangalore/' },
      { label: 'Cryolipolysis', href: '/slimming-body-contouring/cryolipolysis-treatment-in-bangalore/' },
      { label: 'GLP-1 Weight Loss', href: '/slimming-body-contouring/glp-1-weight-loss-program-in-bangalore/' },
      { label: 'Mounjaro Consultation', href: '/slimming-body-contouring/mounjaro-weight-loss-consultation-in-bangalore/' },
      { label: 'Post-Pregnancy Belly Correction', href: '/slimming-body-contouring/post-pregnancy-belly-correction-in-bangalore/' },
    ],
  },
  {
    label: 'Anti-Ageing',
    href: '/anti-aging-injectables/',
    image: '/images/pillars/anti-aging-injectables.webp',
    items: [
      { label: 'Botox', href: '/anti-aging-injectables/botox-treatment-in-bangalore/' },
      { label: 'Dermal Fillers', href: '/anti-aging-injectables/dermal-filler-treatment-in-bangalore/' },
      { label: 'Profhilo', href: '/anti-aging-injectables/profhilo-in-bangalore/' },
      { label: 'HIFU', href: '/anti-aging-injectables/hifu-treatment-in-bangalore/' },
      { label: 'RF Skin Tightening', href: '/anti-aging-injectables/rf-skin-tightening-treatment-in-bangalore/' },
    ],
  },
  {
    label: 'Laser & Skin',
    href: '/laser-skin-aesthetic/',
    image: '/images/pillars/laser-skin-aesthetic.webp',
    items: [
      { label: 'CO2 Fractional Laser', href: '/laser-skin-aesthetic/co2-fractional-laser-treatment-in-bangalore/' },
      { label: 'Acne Scar Laser', href: '/laser-skin-aesthetic/acne-scar-laser-treatment-in-bangalore/' },
      { label: 'Melasma Treatment', href: '/laser-skin-aesthetic/melasma-treatment-in-bangalore/' },
      { label: 'Full Body Laser Hair Removal', href: '/laser-skin-aesthetic/full-body-laser-hair-removal-in-bangalore/' },
      { label: 'Q-Switch Laser', href: '/laser-skin-aesthetic/q-switch-laser-treatment-in-bangalore/' },
    ],
  },
  {
    label: 'Cosmetic Surgery',
    href: '/cosmetic-surgery/',
    image: '/images/pillars/cosmetic-surgery.webp',
    items: [
      { label: 'Rhinoplasty', href: '/cosmetic-surgery/rhinoplasty-in-bangalore/' },
      { label: 'Facelift', href: '/cosmetic-surgery/facelift-surgery-in-bangalore/' },
      { label: 'Blepharoplasty', href: '/cosmetic-surgery/blepharoplasty-eyelid-surgery-in-bangalore/' },
      { label: 'Tummy Tuck', href: '/cosmetic-surgery/tummy-tuck-surgery-abdominoplasty-in-bangalore/' },
      { label: 'Gynaecomastia', href: '/cosmetic-surgery/gynecomastia-surgery-in-bangalore/' },
    ],
  },
  {
    label: 'Intimate Wellness',
    href: '/cosmetic-gynecology/',
    image: '/images/pillars/cosmetic-gynecology.webp',
    items: [
      { label: 'Labiaplasty', href: '/cosmetic-gynecology/labiaplasty-surgery-in-bangalore/' },
      { label: 'Laser Vaginal Tightening', href: '/cosmetic-gynecology/laser-vaginal-tightening-in-bangalore/' },
      { label: 'Vaginal Rejuvenation', href: '/cosmetic-gynecology/vaginal-rejuvenation-treatment-in-bangalore/' },
      { label: 'Intimate Pigmentation', href: '/cosmetic-gynecology/intimate-pigmentation-treatment-in-bangalore/' },
    ],
  },
]

// The home page section 15 strip ("Find My Treatment") will carry this id.
export const findMyTreatment: NavLink = { label: 'Find My Treatment', href: '/#find-my-treatment' }

export const primaryNav: NavItem[] = [
  { label: 'Specialities', href: '/#specialities', mega: specialities },
  {
    label: 'Technology',
    href: '/technology/',
    children: [
      { label: 'All Technology', href: '/technology/' },
      { label: 'AI Hair Analysis', href: '/technology/ai-integrated-hair-analysis/' },
      { label: 'AI Donor Assessment', href: '/technology/ai-integrated-donor-assessment/' },
      { label: 'ARTAS Robotic', href: '/technology/artas-robotic-hair-transplant/' },
      { label: 'Vaser Liposuction', href: '/technology/vaser-liposuction-technology/' },
      { label: 'Viora Reaction RF', href: '/technology/reaction-viora-rf-tightening/' },
      { label: 'CO2 Fractional Laser', href: '/technology/co2-fractional-laser/' },
      { label: 'Q-Switch Laser', href: '/technology/q-switch-laser/' },
      { label: 'Excimer Phototherapy', href: '/technology/excimer-laser-targeted-phototherapy/' },
      { label: 'Cryolipolysis', href: '/technology/body-contouring-cryolipolysis-platforms/' },
    ],
  },
  { label: 'Results', href: '/#results' },
  {
    label: 'About',
    href: '/about-dr-sandeep-mahapatra/',
    children: [
      { label: 'Dr Sandeep Mahapatra', href: '/about-dr-sandeep-mahapatra/' },
      { label: 'Dr Saranya T', href: '/dr-saranya-t/' },
      { label: 'International Patients', href: '/international-patients/' },
    ],
  },
  { label: 'Contact', href: '/contact-us/' },
]

// Booking form options (homepage.md section 12). The form's answers become a pre-filled WhatsApp message, so the
// intimate-care option uses a neutral label ("Private consultation", not the doc's "Intimate Wellness"): the chat
// never names an intimate concern (speciality-cosmetic-gynecology.md, privacy).
export const bookingServices = ['Hair', 'Face & Anti-Ageing', 'Skin & Laser', 'Body & Weight', 'Cosmetic Surgery', 'Private consultation', 'Not sure']
export const bookingDoctors = ['Dr Sandeep Mahapatra', 'Dr Saranya T', 'Not sure — suggest for me']
