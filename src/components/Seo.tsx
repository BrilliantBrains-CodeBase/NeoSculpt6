import { Head } from 'vite-react-ssg'
import type { RoutePage } from '../data/types'
import { crumbName, pageByPath } from '../data/entries'
import {
  SITE_URL,
  SITE_NAME,
  OG_LOCALE,
  OG_SIZE,
  LANGUAGE,
  LOGO_IMAGE,
  clinic,
  local,
  googleMapUrl,
  ogTypeFor,
  robotsContent,
  sameAs,
  xHandle,
} from '../data/site'
import { faqs, physicians } from '../data/about'
import { hero as homeHero } from '../data/home'
import { servicesByPath } from '../data/services'
import { LIVE, technologyByPath } from '../data/technology'
import { specialityByPath, specialityHubs } from '../data/specialities'
import { approved, doctorByPath, portraitFor, publicSocialLinks } from '../data/doctors'
import type { Faq } from '../data/services/types'
import { cardHref, doctorFor, publicRecords, recordByPath } from '../data/editorial'
import { publishedDoctors } from '../data/doctors'

// A reviewer is recorded by name; match it to a published doctor (either name form) for the schema link.
const doctorByName = (name: string | null) =>
  publishedDoctors.find((d) => name && (d.displayName === name || d.name === name)) ?? null

const abs = (p: string) => (p.startsWith('http') ? p : SITE_URL + p)

const LOGO_ID = `${SITE_URL}/#logo`
const ORG_ID = `${SITE_URL}/#organization`
const CLINIC_ID = `${SITE_URL}/#clinic`

// The founder, linked to his profile page's Physician node.
const founderDoc = physicians.find((d) => d.href === '/about-dr-sandeep-mahapatra/')
const founder = founderDoc ? { '@type': 'Physician', '@id': `${abs(founderDoc.href)}#physician`, name: founderDoc.name, url: abs(founderDoc.href) } : null

const contactPoint = {
  '@type': 'ContactPoint',
  telephone: clinic.phoneE164,
  email: clinic.email,
  contactType: 'customer service',
  areaServed: 'IN',
  availableLanguage: ['English'],
}

// The brand. legalName appears once the client confirms the legal entity (site.ts legalEntityConfirmed).
function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', '@id': LOGO_ID, url: abs(LOGO_IMAGE.src), width: LOGO_IMAGE.width, height: LOGO_IMAGE.height, caption: SITE_NAME },
    image: { '@id': LOGO_ID },
    ...(clinic.legalEntityConfirmed ? { legalName: clinic.legalEntity } : {}),
    email: clinic.email,
    telephone: clinic.phoneE164,
    contactPoint,
    ...(founder ? { founder } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

// The clinic (a LocalBusiness), shared by the home, about, contact, service, technology, hub and doctor pages. Map pin,
// map link and profiles come from site.ts `local` and appear only once they are filled in; no rating or review markup.
function medicalClinic() {
  const { address } = clinic
  return {
    '@type': 'MedicalClinic',
    '@id': CLINIC_ID,
    name: clinic.name,
    url: `${SITE_URL}/`,
    logo: { '@id': LOGO_ID },
    image: [abs(homeHero.image), abs(LOGO_IMAGE.src)],
    telephone: clinic.phoneE164,
    email: clinic.email,
    parentOrganization: { '@id': ORG_ID },
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    ...(local.geo ? { geo: { '@type': 'GeoCoordinates', latitude: local.geo.lat, longitude: local.geo.lng } } : {}),
    ...(googleMapUrl ? { hasMap: googleMapUrl } : {}),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: clinic.hours.days,
        opens: clinic.hours.opens,
        closes: clinic.hours.closes,
      },
    ],
    areaServed: [{ '@type': 'City', name: 'Bangalore' }, ...clinic.areasServed.map((name) => ({ '@type': 'Place', name }))],
    medicalSpecialty: ['Dermatology', 'PlasticSurgery', 'Gynecologic'].map((s) => `https://schema.org/${s}`),
    // The six specialities, each linked to its hub page.
    availableService: specialityHubs.map((h) => ({ '@type': 'MedicalProcedure', name: pageByPath.get(h.path)?.name ?? h.path, url: abs(h.path) })),
    isAcceptingNewPatients: true,
    contactPoint,
    ...(founder ? { founder } : {}),
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
    worksFor: { '@id': CLINIC_ID },
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
  const org = organization()
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { '@id': ORG_ID },
    inLanguage: LANGUAGE,
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
    about: { '@id': ORG_ID },
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(page.photo ?? page.ogImage) },
    inLanguage: LANGUAGE,
    ...(page.lastmod ? { dateModified: page.lastmod } : {}),
  }
  const graph: object[] = [org, website, webpage, breadcrumb]
  if (page.type === 'home') {
    // homepage.md "Schema": MedicalClinic and the doctors the page shows (name, role and profile link only; credentials
    // live on the profile pages, where they are shown). No rating markup.
    graph.push(
      medicalClinic(),
      ...publishedDoctors.map((d) => ({
        '@type': 'Physician',
        '@id': `${abs(d.path)}#physician`,
        name: d.displayName,
        url: abs(d.path),
        jobTitle: d.role,
        medicalSpecialty: `https://schema.org/${d.schemaSpecialty}`,
        worksFor: { '@id': CLINIC_ID },
      })),
    )
  }
  if (page.type === 'about') {
    // about-us.md "Page SEO": AboutPage · MedicalClinic · Physician × 2 · FAQPage. The FAQ text is the same strings the
    // page shows (src/data/about.ts). No rating markup until the Google rating is verified.
    webpage['@type'] = ['WebPage', 'AboutPage']
    graph.push(medicalClinic(), ...physicians.map((doc) => physicianNode(doc)), faqPage(canonical, faqs.items))
  }
  if (page.type === 'contact') {
    // contact-us-page.md: ContactPage · MedicalClinic (name, address, phone, email, hours from site.ts). No map or
    // profile URL until the Google Business Profile is confirmed, and no rating markup.
    webpage['@type'] = ['WebPage', 'ContactPage']
    graph.push(medicalClinic())
  }
  const service = page.type === 'service' ? servicesByPath.get(page.path) : undefined
  if (service) {
    // service-page.md: FAQPage for the visible FAQs; a Physician for each doctor the page shows, without credentials
    // or memberships (the page's chips are pending sign-off and it shows no memberships). MedicalWebPage is a WebPage
    // subtype. No rating or review markup until the reviews are verified. A doctor not in `physicians` (Dr Lavanyaa M,
    // who has no profile page) gets name, the page's speciality line and the clinic only.
    webpage['@type'] = 'MedicalWebPage'
    // The treatment itself, which the page is about.
    const procedure = {
      '@type': 'MedicalProcedure',
      '@id': `${canonical}#procedure`,
      name: page.name,
      description: page.description,
      url: canonical,
      ...(page.photo ? { image: abs(page.photo) } : {}),
    }
    webpage.about = { '@id': procedure['@id'] }
    webpage.mainEntity = { '@id': procedure['@id'] }
    // The page's YouTube video, once it has the upload date Google requires (scripts/fetch-video-meta.mjs).
    const video = service.consultation.video
    if (video?.uploadDate) {
      graph.push({
        '@type': 'VideoObject',
        '@id': `${canonical}#video`,
        name: video.title,
        description: video.description ?? video.title,
        thumbnailUrl: video.thumbnail ? abs(video.thumbnail.src) : `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
        uploadDate: video.uploadDate,
        ...(video.duration ? { duration: video.duration } : {}),
        embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
        url: video.url,
        inLanguage: LANGUAGE,
      })
    }
    graph.push(
      procedure,
      medicalClinic(),
      ...service.doctors.cards.map((card) => {
        const known = physicians.find((d) => d.name === card.name)
        if (known) return physicianNode(known, { credentials: false })
        return {
          '@type': 'Physician',
          '@id': card.href ? `${abs(card.href)}#physician` : `${canonical}#physician-${card.initials.toLowerCase()}`,
          name: card.name,
          ...(card.href ? { url: abs(card.href) } : {}),
          jobTitle: card.specialty,
          worksFor: { '@id': CLINIC_ID },
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
  const hub = page.type === 'hub' ? specialityByPath.get(page.path) : undefined
  if (hub) {
    // Speciality hubs: a CollectionPage whose main entity lists every treatment card's page, in page order; the clinic;
    // a Physician for the doctor card without credentials (none are signed off). FAQPage only once the hub's drafted
    // FAQs are approved (`faqsApproved`). No rating or review markup until the reviews are verified.
    webpage['@type'] = 'CollectionPage'
    const items = hub.treatments.groups.flatMap((g) => g.items)
    webpage.mainEntity = {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.title, url: abs(item.href) })),
    }
    graph.push(
      medicalClinic(),
      ...hub.doctors.cards.flatMap((card) => {
        const known = physicians.find((d) => d.href === card.href)
        return known ? [physicianNode(known, { credentials: false })] : []
      }),
      ...(hub.faqsApproved ? [faqPage(canonical, hub.faqs.items)] : []),
    )
  }
  if (page.path === '/results/') {
    // Results gallery (src/data/results.ts): an ImageGallery page and the clinic. The patient photos get no
    // ImageObject markup of their own.
    webpage['@type'] = 'ImageGallery'
    graph.push(medicalClinic())
  }
  const doctor = page.type === 'doctor' ? doctorByPath.get(page.path) : undefined
  if (doctor) {
    // Doctor profiles (doctor-page-boilerplate.md): ProfilePage whose main entity is the Physician, plus the clinic.
    // Everything comes from the same doctors.json record the page renders, filtered to approved items: credentials,
    // memberships, portrait and social profiles appear only once signed off. No rating, review or statistics markup.
    webpage['@type'] = ['WebPage', 'ProfilePage']
    webpage.mainEntity = { '@id': `${canonical}#physician` }
    const portrait = portraitFor(doctor)
    const credentials = approved(doctor.qualifications)
    const memberships = approved(doctor.recognition)
    const social = publicSocialLinks(doctor)
    graph.push(medicalClinic(), {
      '@type': 'Physician',
      '@id': `${canonical}#physician`,
      name: doctor.displayName,
      url: canonical,
      jobTitle: doctor.role,
      medicalSpecialty: `https://schema.org/${doctor.schemaSpecialty}`,
      worksFor: { '@id': CLINIC_ID },
      ...(portrait ? { image: abs(portrait.src) } : {}),
      ...(credentials.length
        ? {
            hasCredential: credentials.map((q) => ({
              '@type': 'EducationalOccupationalCredential',
              name: q.title,
              ...(q.institution ? { recognizedBy: { '@type': 'Organization', name: q.institution } } : {}),
            })),
          }
        : {}),
      ...(memberships.length ? { memberOf: memberships.map((r) => ({ '@type': 'Organization', name: r.organisation })) } : {}),
      ...(social.length ? { sameAs: social.map((s) => s.href) } : {}),
    })
  }
  if (page.type === 'journal') {
    // Journal hub: a CollectionPage listing every public item, newest first, as on the page. Media items point at
    // the publication (or the hosted scan); they are not marked up as NeoSculpt6 articles.
    webpage['@type'] = ['WebPage', 'CollectionPage']
    webpage.mainEntity = {
      '@type': 'ItemList',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: publicRecords.length,
      itemListElement: publicRecords.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: r.title, url: abs(cardHref(r)) })),
    }
  }
  const article = page.type === 'article' ? recordByPath.get(page.path) : undefined
  if (article && article.status !== 'archived') {
    // Journal and blog articles: Article, from the record the page renders. Author and reviewer link to the doctor
    // profiles' Physician nodes; the reviewer appears only when the review is approved (and shown on the page).
    const author = doctorFor(article.author)
    const review = article.medicalReview?.status === 'approved' ? doctorByName(article.medicalReview.by) : null
    graph.push({
      '@type': 'Article',
      '@id': `${canonical}#article`,
      headline: article.title,
      description: page.description,
      mainEntityOfPage: { '@id': `${canonical}#webpage` },
      datePublished: article.date,
      ...(article.updatedDate ? { dateModified: article.updatedDate } : {}),
      ...(article.featuredImage ? { image: abs(article.featuredImage.src) } : {}),
      ...(author ? { author: { '@type': 'Physician', '@id': `${SITE_URL}${author.path}#physician`, name: author.displayName, url: abs(author.path) } } : {}),
      publisher: { '@id': ORG_ID },
      inLanguage: LANGUAGE,
    })
    if (review) {
      webpage.reviewedBy = { '@type': 'Physician', '@id': `${SITE_URL}${review.path}#physician`, name: review.displayName, url: abs(review.path) }
      webpage.lastReviewed = article.medicalReview?.date
    }
  }
  // Escape "<" so the JSON can never close the <script> tag early.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}

export function Seo({ page }: { page: RoutePage }) {
  const canonical = SITE_URL + page.path
  const image = abs(page.ogImage)
  const imageAlt = page.ogImageAlt ?? page.title
  return (
    <Head>
      <html lang="en-IN" />
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta name="robots" content={robotsContent(page.robots)} />
      <link rel="canonical" href={canonical} />

      <meta property="og:locale" content={OG_LOCALE} />
      <meta property="og:type" content={ogTypeFor(page.type)} />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content={String(OG_SIZE.width)} />
      <meta property="og:image:height" content={String(OG_SIZE.height)} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      {xHandle && <meta name="twitter:site" content={xHandle} />}
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* Location: region and city always; the map pin once site.ts `local.geo` is set. */}
      <meta name="geo.region" content="IN-KA" />
      <meta name="geo.placename" content={`${clinic.address.addressLocality}, ${clinic.address.addressRegion}`} />
      {local.geo && <meta name="geo.position" content={`${local.geo.lat};${local.geo.lng}`} />}
      {local.geo && <meta name="ICBM" content={`${local.geo.lat}, ${local.geo.lng}`} />}

      {local.verification.google && <meta name="google-site-verification" content={local.verification.google} />}
      {local.verification.bing && <meta name="msvalidate.01" content={local.verification.bing} />}

      <script type="application/ld+json">{jsonLd(page, canonical)}</script>
    </Head>
  )
}
