import { Head } from 'vite-react-ssg'
import type { RoutePage } from '../data/types'
import { pageByPath } from '../data/entries'
import { SITE_URL, SITE_NAME, OG_LOCALE, DEFAULT_OG_IMAGE, clinic, sameAs } from '../data/site'
import { faqs, physicians } from '../data/about'
import { servicesByPath } from '../data/services'
import { LIVE, technologyByPath } from '../data/technology'
import type { Faq } from '../data/services/types'

const abs = (p: string) => (p.startsWith('http') ? p : SITE_URL + p)
const crumbName = (p: string) => (p === '/' ? 'Home' : (pageByPath.get(p)?.name ?? p))

// The clinic, shared by the home and about pages.
function medicalClinic() {
  return {
    '@type': 'MedicalClinic',
    '@id': `${SITE_URL}/#clinic`,
    name: clinic.name,
    url: `${SITE_URL}/`,
    image: abs(DEFAULT_OG_IMAGE),
    telephone: clinic.phone,
    email: clinic.email,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    address: {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.streetAddress,
      addressLocality: clinic.address.addressLocality,
      addressRegion: clinic.address.addressRegion,
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.addressCountry,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: clinic.hours.days,
      opens: clinic.hours.opens,
      closes: clinic.hours.closes,
    },
    // TODO: geo coordinates, Physician × 2 and FAQPage on the home page once the home content is built (homepage.md → Schema).
    ...(sameAs.length ? { sameAs } : {}),
  }
}

// A doctor named on the page. Only signed-off credentials and memberships are listed (see `physicians` in
// src/data/about.ts), and only on pages that show them (`credentials: false` leaves both out).
function physicianNode(doc: (typeof physicians)[number], { credentials = true } = {}) {
  return {
    '@type': 'Physician',
    '@id': `${abs(doc.href)}#physician`,
    name: doc.name,
    url: abs(doc.href),
    jobTitle: doc.jobTitle,
    medicalSpecialty: `https://schema.org/${doc.specialty}`,
    worksFor: { '@id': `${SITE_URL}/#clinic` },
    ...(credentials && doc.credentials.length
      ? { hasCredential: doc.credentials.map((name) => ({ '@type': 'EducationalOccupationalCredential', name })) }
      : {}),
    ...(credentials && doc.memberOf.length ? { memberOf: doc.memberOf.map((name) => ({ '@type': 'Organization', name })) } : {}),
  }
}

// FAQPage from the same strings the page shows.
function faqPage(canonical: string, items: Faq[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${canonical}#faq`,
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

function jsonLd(page: RoutePage, canonical: string) {
  const org = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: abs(DEFAULT_OG_IMAGE),
    ...(sameAs.length ? { sameAs } : {}),
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-US',
  }
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: page.crumbs.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: crumbName(p), item: abs(p) })),
  }
  const webpage: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: page.title,
    description: page.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(page.ogImage) },
    inLanguage: 'en-US',
    ...(page.lastmod ? { dateModified: page.lastmod } : {}),
  }
  const graph: object[] = [org, website, webpage, breadcrumb]
  if (page.type === 'home') graph.push(medicalClinic())
  if (page.type === 'about') {
    // about-us.md "Page SEO": AboutPage · MedicalClinic · Physician × 2 · FAQPage. The FAQ text is the same strings the
    // page shows (src/data/about.ts). No rating markup until the Google rating is verified.
    webpage['@type'] = ['WebPage', 'AboutPage']
    graph.push(medicalClinic(), ...physicians.map((doc) => physicianNode(doc)), faqPage(canonical, faqs.items))
  }
  const service = page.type === 'service' ? servicesByPath.get(page.path) : undefined
  if (service) {
    // service-page.md: FAQPage for the visible FAQs; a Physician for each doctor the page shows, without credentials
    // or memberships (the page's chips are pending sign-off and it shows no memberships). MedicalWebPage is a WebPage
    // subtype. No rating or review markup until the reviews are verified. A doctor not in `physicians` (Dr Lavanyaa M)
    // gets name, profile, the page's speciality line and the clinic only.
    webpage['@type'] = 'MedicalWebPage'
    graph.push(
      medicalClinic(),
      ...service.doctors.cards.map((card) => {
        const known = physicians.find((d) => d.name === card.name)
        if (known) return physicianNode(known, { credentials: false })
        return {
          '@type': 'Physician',
          '@id': `${abs(card.href)}#physician`,
          name: card.name,
          url: abs(card.href),
          jobTitle: card.specialty,
          worksFor: { '@id': `${SITE_URL}/#clinic` },
        }
      }),
      faqPage(canonical, service.faqs.items),
    )
  }
  const tech = LIVE.has(page.path) ? technologyByPath.get(page.path) : undefined
  if (tech) {
    // As on the service pages: a Physician for each doctor card without credentials (the cards' chips are the doc's,
    // not the signed-off list) and FAQPage for the visible FAQs (the same strings, technology/index.ts). Technology
    // pages are MedicalWebPage; the hub and International Patients (no FAQs on the hub) stay WebPage. No rating or
    // review markup until the reviews are verified.
    if (tech.kind === 'technology-detail' || tech.kind === 'artas-detail') webpage['@type'] = 'MedicalWebPage'
    graph.push(
      medicalClinic(),
      ...tech.doctors.cards.flatMap((card) => {
        const known = physicians.find((d) => d.href === card.href)
        return known ? [physicianNode(known, { credentials: false })] : []
      }),
      ...('faqs' in tech ? [faqPage(canonical, tech.faqs.items)] : []),
    )
  }
  // Escape "<" so the JSON can never close the <script> tag early.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}

export function Seo({ page }: { page: RoutePage }) {
  const canonical = SITE_URL + page.path
  const image = abs(page.ogImage)
  return (
    <Head>
      <html lang="en" />
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta name="robots" content={page.robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:locale" content={OG_LOCALE} />
      <meta property="og:type" content={page.type === 'home' ? 'website' : 'article'} />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={page.ogImageAlt ?? page.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={image} />

      {page.type !== 'legacy-demo' && <script type="application/ld+json">{jsonLd(page, canonical)}</script>}
    </Head>
  )
}
