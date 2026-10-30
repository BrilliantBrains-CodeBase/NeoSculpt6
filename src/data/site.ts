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
  // TODO: external AI analysis tool URL. Until it's filled in, the mobile bar's "AI Analysis" opens Find My Treatment.
  aiAnalysisHref: '',
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
  // Contact page map (homepage.md section F). Google's keyless embed for the address search, shown by default and
  // lazy-loaded. TODO: swap for the Business Profile's own embed once it is approved.
  mapEmbedSrc:
    'https://www.google.com/maps?q=NeoSculpt6%2C+Sadaramangala%2C+Whitefield+Main+Road%2C+Bangalore+560066&output=embed',
  // homepage.md section F, "Nearby areas line".
  nearbyAreas: 'Convenient for patients from Whitefield, ITPL, Mahadevapura, Brookefield, KR Puram, Marathahalli and Hoskote.',
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
// profile URL; tiles link to `href` (or their own post) only once one is set. Never use the theme's model tiles. Each `subject` is the photo the slot is for; the alt text describes
// what the current photo actually shows.
export const instagram = {
  handle: null as string | null,
  href: null as string | null,
  // Tiles are NeoSculpt6 photos that are not a service page's hero and not on the About page, so no page shows one twice
  // (service pages skip the three service photos here: src/data/services/index.ts).
  tiles: [
    {
      subject: 'Dr Sandeep marking a hairline',
      src: '/images/services/hair-transplant-restoration/dhi-hair-transplant-in-bangalore-2.webp',
      width: 1200,
      height: 900,
      alt: 'A doctor marking a man’s hairline with a laser guide and measuring tool',
    },
    {
      subject: 'Reception',
      src: '/images/services/slimming-body-contouring/body-contouring-in-bangalore-2.webp',
      width: 1200,
      height: 900,
      alt: 'A doctor talking with a woman in a consultation room',
    },
    {
      subject: 'A consented result',
      src: '/images/home/hero-square.webp',
      width: 941,
      height: 941,
      alt: 'A smiling woman with glowing skin looking up in soft sunlight',
    },
    {
      subject: 'Dr Saranya in consultation',
      src: '/images/services/hair-transplant-restoration/fue-hair-transplant-in-bangalore-3.webp',
      width: 1200,
      height: 900,
      alt: 'A doctor talking with a woman about her hair loss, scalp images on the screen behind',
    },
    {
      subject: 'A technology device',
      src: '/images/home/about-inset.webp',
      width: 480,
      height: 640,
      alt: 'A white aesthetic treatment device on wheels',
    },
    {
      subject: 'The team',
      src: '/images/home/about.webp',
      width: 881,
      height: 1100,
      alt: 'A doctor treating a woman’s forehead with a skin-tightening handpiece, the device’s screen beside them',
    },
  ].map((t) => ({ ...t, href: null as string | null })),
}
