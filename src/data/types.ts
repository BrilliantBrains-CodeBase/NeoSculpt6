// Shape of one record in pages.json (written by scripts/generate-pages.mjs — do not edit pages.json by hand).

export type PageType = 'home' | 'about' | 'service' | 'technology' | 'hub' | 'doctor' | 'contact' | 'journal' | 'article' | 'legal' | 'thank-you' | 'assessment'

export interface Crumb {
  name: string
  path: string
}

export interface PageRecord {
  path: string
  type: PageType
  name: string
  /** Hub path this page sits under, e.g. "/cosmetic-surgery/". */
  section: string | null
  category: string
  title: string
  description: string
  h1: string
  robots: string
  canonical: string
  /** `image` is the page's 1200 × 630 share card; `photo` the page photo the card is drawn from (null: none). */
  og: { type: string; title: string; description: string; url: string; image: string; imageAlt: string; siteName: string; photo: string | null }
  twitter: { card: string; title: string; description: string; image: string }
  breadcrumbs: Crumb[]
  sources: { title: string; description: string }
  todo: string[]
  video: string | null
  lastmod: string | null
  /** Where this page's old content lives, for building the real templates later. Null for new pages. */
  oldSite: { url: string; status: number; title: string; description: string; dataJson: string; contentMd: string | null } | null
}

export interface RedirectRecord {
  path: string
  type: 'redirect'
  redirectTo: string
  title: string
  robots: string
  canonical: string
}

// An old-site theme-demo URL that is not rebuilt: .htaccess answers 410 Gone.
export interface GoneRecord {
  path: string
  type: 'gone'
  title: string
  status: 410
}

export type PagesFileEntry = PageRecord | RedirectRecord | GoneRecord

// routes.json: the slim runtime copy the app bundles. Canonical, og:* and twitter:* are derived in Seo.tsx
// (they mirror title/description), and breadcrumbs are stored as paths and resolved to names.
export interface RoutePage {
  path: string
  type: PageType
  name: string
  title: string
  description: string
  h1: string
  robots: string
  ogImage: string
  ogImageAlt?: string
  /** The page photo its share card is drawn from, for schema.org primaryImageOfPage. */
  photo?: string
  crumbs: string[]
  lastmod?: string
}

export interface RouteRedirect {
  path: string
  type: 'redirect'
  title: string
  redirectTo: string
}

export type RouteEntry = RoutePage | RouteRedirect
