// Clinic facts shared by the SEO layer, header and footer. Source: content/home-page/homepage.md.
// Imported by scripts/generate-pages.mjs too, so keep this file to erasable TypeScript only.

export const SITE_URL = 'https://neosculpt6.com'
export const SITE_NAME = 'NeoSculpt6'
export const OG_LOCALE = 'en_US'
export const DEFAULT_OG_IMAGE = '/og/default.png'

export const clinic = {
  name: 'NeoSculpt6',
  tagline: 'Doctor-Led Aesthetic Clinic · Part of Neo Group',
  phone: '+91 99640 60483',
  phoneHref: 'tel:+919964060483',
  whatsappHref: 'https://wa.me/919964060483',
  email: 'Support@neosculpt6.com',
  address: {
    streetAddress: '2nd floor, above Honda Big Wings, Sadaramangala Village, Whitefield Main Road',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    postalCode: '560066',
    addressCountry: 'IN',
    landmark: 'Beside BMW Deutsche Motoren',
  },
  hours: { label: 'Mon–Sat: 7am–7pm', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '07:00', closes: '19:00' },
  // TODO: swap for the Google Business Profile link once we have it.
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=NeoSculpt6%2C+Sadaramangala%2C+Whitefield+Main+Road%2C+Bangalore+560066',
  // TODO: add the real profile URLs. The footer shows an icon only once its URL is filled in.
  social: { facebook: '', instagram: '', youtube: '' },
  // TODO: add Google Business Profile and Practo URLs (schema only, no footer icon).
  otherProfiles: [] as string[],
  // Footer row.
  sisterClinics: [
    { name: 'Neo Follicle Hair Transplant, Marathahalli', href: 'https://neofollicletransplant.com/' },
    { name: 'Derma Solutions', href: 'https://dermasolutions.co.in/' },
    { name: 'Neo Fertility', href: 'https://neofertility.co.in/' },
  ],
}

// schema.org sameAs: every filled-in profile URL.
export const sameAs: string[] = [...Object.values(clinic.social), ...clinic.otherProfiles].filter(Boolean)

// Footer links. The home anchors resolve once those home sections are built with these ids;
// /privacy-policy/ and /terms/ 404 until those pages are added.
export const footerNav = [
  { label: 'About', href: '/about-dr-sandeep-mahapatra/' },
  { label: 'Specialities', href: '/#specialities' },
  { label: 'Our Doctors', href: '/#our-doctors' },
  { label: 'Results', href: '/#results' },
  { label: 'Journal', href: '/#journal' },
  { label: 'Contact', href: '/contact-us/' },
]

export const legalNav = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms', href: '/terms/' },
]

export const medicalReviewLine =
  'Content written and medically reviewed under the guidance of Dr Sandeep Mahapatra, MD Dermatology. For patient education; it does not replace an in-person consultation.'

// Instagram strip above the footer (About section 7 and every service page). No live feed integration exists, so this
// is a curated set. Needs sign-off: the NeoSculpt6 handle (shown as a pending chip while `handle` is null) and its
// profile URL; tiles link to `href` (or their own post) only once one is set. Never use the theme's model tiles. Each `subject` is the photo the slot is for; the placeholder's alt
// text describes what it actually shows.
export const instagram = {
  handle: null as string | null,
  href: null as string | null,
  tiles: [
    {
      subject: 'Dr Sandeep marking a hairline',
      src: '/og/hair-transplant-restoration__direct-hair-transplant-in-bangalore.jpg',
      alt: 'A surgeon in a mask and gloves working on a man’s scalp during a hair transplant',
    },
    {
      subject: 'Reception',
      src: '/og/anti-aging-injectables__body-fillers-in-bangalore.jpg',
      alt: 'A doctor and a patient seated in a bright consultation lounge with plants and a marble table',
    },
    {
      subject: 'A consented result',
      src: '/og/anti-aging-injectables__neck-tightening-treatment-in-bangalore.jpg',
      alt: 'A patient checking her face in a hand mirror while a doctor examines her jawline',
    },
    {
      subject: 'Dr Saranya in consultation',
      src: '/og/cosmetic-surgery__breast-reduction-surgery-in-bangalore.jpg',
      alt: 'A doctor taking notes on a tablet as a patient talks during a consultation',
    },
    {
      subject: 'A technology device',
      src: '/og/hair-transplant-restoration__low-level-laser-hair-therapy-lllt-in-bangalore.jpg',
      alt: 'A patient seated under a red-light hair therapy device with a clinician beside him',
    },
    {
      subject: 'The team',
      src: '/og/hair-transplant-restoration__crown-hair-transplant-in-bangalore.jpg',
      alt: 'A surgeon wearing loupes and a mask working on a patient’s crown in the procedure room',
    },
  ].map((t) => ({ ...t, width: 1024, height: 1024, href: null as string | null })),
}
