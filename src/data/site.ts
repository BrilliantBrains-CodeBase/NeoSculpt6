// Clinic facts shared by the SEO layer and (later) header/footer. Source: content/home-page/homepage.md.
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
  // TODO: add the real profile URLs (Google Business Profile, Practo, Instagram, YouTube, Facebook).
  sameAs: [] as string[],
}
