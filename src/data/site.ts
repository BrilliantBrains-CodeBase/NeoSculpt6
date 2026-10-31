// Clinic facts shared by the SEO layer, header and footer. Source: content/home-page/homepage.md.
// Imported by scripts/generate-pages.mjs too, so keep this file to erasable TypeScript only.

export const SITE_URL = 'https://neosculpt6.com'
export const SITE_NAME = 'NeoSculpt6'
// The clinic serves patients in India: Indian English for og:locale and schema.org inLanguage.
export const OG_LOCALE = 'en_IN'
export const LANGUAGE = 'en-IN'
// Share cards are made by scripts/build-og-cards.mjs (1200 × 630). The default card is for pages without a photo.
export const DEFAULT_OG_IMAGE = '/og/cards/default.jpg'
export const OG_SIZE = { width: 1200, height: 630 }
// Square logo for schema.org Organization.logo (made by scripts/build-og-cards.mjs from logo-stacked.webp).
export const LOGO_IMAGE = { src: '/logo-512.png', width: 512, height: 512 }

// og:type by page type: profile for doctors, article for journal articles, website for everything else.
export const ogTypeFor = (type: string) => (type === 'doctor' ? 'profile' : type === 'article' ? 'article' : 'website')

// Extra robots directives on every indexable page: allow large image previews and full snippets in search results.
export const robotsContent = (robots: string) =>
  robots.startsWith('index') ? `${robots}, max-image-preview:large, max-snippet:-1, max-video-preview:-1` : robots

// Local-search facts. Nothing here is published until it is filled in: every consumer checks for a value first, so
// a blank stays out of the page, the schema and llms.txt. TODO (client): all of these come from the clinic's Google
// Business Profile (create or claim it first), Search Console and Bing Webmaster Tools.
export const local = {
  // The Business Profile's map pin. Copy it from the profile (right-click the pin in Google Maps); never geocode the
  // address, the pin is what Google matches against.
  geo: null as { lat: number; lng: number } | null,
  google: {
    // The profile's public link, e.g. https://maps.app.goo.gl/… or https://g.page/…
    profileUrl: null as string | null,
    // Place ID (ChIJ…), from Google's Place ID Finder.
    placeId: null as string | null,
    // The numeric CID, from the profile's "?cid=" link.
    cid: null as string | null,
    // The profile's "Ask for reviews" link (https://g.page/r/…/review).
    reviewUrl: null as string | null,
    // The profile's "Share → Embed a map" iframe src (https://www.google.com/maps/embed?pb=…).
    mapEmbedSrc: null as string | null,
  },
  // Site verification meta tokens (the content="" value only).
  verification: { google: null as string | null, bing: null as string | null },
}

const ADDRESS_QUERY = 'NeoSculpt6, Sadaramangala, Whitefield Main Road, Bangalore 560066'
const q = encodeURIComponent(ADDRESS_QUERY)

// The clinic's map link for schema.org hasMap: the Business Profile, else its CID or place ID. Null until one is set.
export const googleMapUrl: string | null =
  local.google.profileUrl ??
  (local.google.cid ? `https://www.google.com/maps?cid=${local.google.cid}` : null) ??
  (local.google.placeId ? `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=${local.google.placeId}` : null)

export const clinic = {
  name: 'NeoSculpt6',
  // Legal entity behind NeoSculpt6 and the sister clinics (their shared privacy policy). TODO: client to confirm.
  legalEntity: 'NEOFOLLICLE AND NEOFERTILITY CLINIC LLP',
  // Set to true once the client confirms the LLP above runs NeoSculpt6; until then schema.org legalName is left out.
  legalEntityConfirmed: false as boolean,
  // The phone in E.164 form, for schema.org.
  phoneE164: '+919964060483',
  tagline: 'Doctor-Led Aesthetic Clinic · Part of Neo Group',
  phone: '+91 99640 60483',
  phoneHref: 'tel:+919964060483',
  whatsappHref: 'https://wa.me/919187401600',
  // The mobile bar's "AI Analysis": the free AI hair assessment page (src/templates/AssessmentTemplate.tsx). An
  // https:// URL here would open in a new tab instead; blank falls back to Find My Treatment.
  aiAnalysisHref: '/hair-assessment/',
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
  // "Directions" links (footer, menu, contact, doctor pages): the Business Profile once `local` has it, otherwise an
  // address search.
  mapsHref: googleMapUrl ?? `https://www.google.com/maps/search/?api=1&query=${q}`,
  // Contact page map (homepage.md section F), shown by default and lazy-loaded: the Business Profile's own embed once
  // `local` has it, otherwise Google's keyless embed for the address search.
  mapEmbedSrc: local.google.mapEmbedSrc ?? `https://www.google.com/maps?q=${q}&output=embed`,
  // homepage.md section F, "Nearby areas line".
  nearbyAreas: 'Convenient for patients from Whitefield, ITPL, Mahadevapura, Brookefield, KR Puram, Marathahalli and Hoskote.',
  // The same areas, for schema.org areaServed.
  areasServed: ['Whitefield', 'ITPL', 'Mahadevapura', 'Brookefield', 'KR Puram', 'Marathahalli', 'Hoskote'],
  // TODO (client): the real profile URLs. The footer and the mobile Follow sheet show an icon only once its URL is
  // filled in, and only filled-in URLs reach schema.org sameAs and llms.txt.
  social: { facebook: '', instagram: '', youtube: '', linkedin: '', x: '' },
  // TODO (client): directory listings such as Practo and Justdial (schema.org sameAs only, no footer icon).
  otherProfiles: [] as string[],
  // Footer row.
  sisterClinics: [
    { name: 'Neo Follicle Hair Transplant, Marathahalli', href: 'https://neofollicletransplant.com/' },
    { name: 'Derma Solutions', href: 'https://dermasolutions.co.in/' },
    { name: 'Neo Fertility', href: 'https://neofertility.co.in/' },
  ],
}

// schema.org sameAs: every filled-in profile URL, the Business Profile included.
export const sameAs: string[] = [...Object.values(clinic.social), local.google.profileUrl, ...clinic.otherProfiles].filter(
  (u): u is string => Boolean(u),
)

// The X handle for twitter:site, read from the X profile URL once it is set.
export const xHandle: string | null = clinic.social.x ? `@${clinic.social.x.replace(/\/+$/, '').split('/').pop()}` : null

// Footer links. The home anchors resolve once those home sections are built with these ids.
export const footerNav = [
  { label: 'About', href: '/about-dr-sandeep-mahapatra/' },
  { label: 'Specialities', href: '/#specialities' },
  { label: 'Our Doctors', href: '/#our-doctors' },
  { label: 'Results', href: '/#results' },
  { label: 'Journal', href: '/journal/' },
  { label: 'Contact', href: '/contact-us/' },
]

export const legalNav = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms of Use', href: '/terms-of-use/' },
]

export const medicalReviewLine =
  'Content written and medically reviewed under the guidance of Dr Sandeep Mahapatra, MD Dermatology. For patient education; it does not replace an in-person consultation.'

// Instagram strip above the footer (About section 7 and every service page). No live feed integration exists, so this
// is a curated set. Needs sign-off: the NeoSculpt6 handle (shown as a pending chip while `handle` is null) and its
// profile URL; tiles link to `href` (or their own post) only once one is set. Never use the theme's model tiles. Each `subject` is the photo the slot is for; the alt text describes
// what the current photo actually shows.
export const instagram = {
  // Site-wide switch: false hides the strip on every page (turned off for now, 2026-10-31). Set back to true to restore it.
  enabled: false as boolean,
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
