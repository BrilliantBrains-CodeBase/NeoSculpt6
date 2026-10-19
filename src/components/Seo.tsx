import { Head } from 'vite-react-ssg'
import type { RoutePage } from '../data/types'
import { pageByPath } from '../data/entries'
import { SITE_URL, SITE_NAME, OG_LOCALE, DEFAULT_OG_IMAGE, clinic } from '../data/site'

const abs = (p: string) => (p.startsWith('http') ? p : SITE_URL + p)
const crumbName = (p: string) => (p === '/' ? 'Home' : (pageByPath.get(p)?.name ?? p))

function jsonLd(page: RoutePage, canonical: string) {
  const org = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: abs(DEFAULT_OG_IMAGE),
    ...(clinic.sameAs.length ? { sameAs: clinic.sameAs } : {}),
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
  const webpage = {
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
  if (page.type === 'home') {
    graph.push({
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
      // TODO: geo coordinates, Physician × 2 and FAQPage once the home content is built (homepage.md → Schema).
      ...(clinic.sameAs.length ? { sameAs: clinic.sameAs } : {}),
    })
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
