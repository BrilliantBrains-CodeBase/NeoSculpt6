// Journal posts: the one source for the home Journal section (section 14) and, later, the /journal/ pages.
// Imported by scripts/verify-seo.mjs too, so keep this file to erasable TypeScript only.
//
// Statuses:
// - 'published': written, medically reviewed and live at /journal/<slug>/. Every field is required, including the
//   review record. `npm run verify` fails if the post's page or image is missing, so build the post page before
//   switching a post to published.
// - 'planned': a topic only, with no article yet. The home section shows it as a "Coming soon" card, with no link,
//   until enough posts are published to fill the row.
// - 'draft': being written or reviewed. Never shown anywhere.
// Do not invent article copy, review details or dates here; fill them in only from the signed-off article.

export const specialities = {
  hair: { label: 'Hair Restoration', href: '/hair-transplant-restoration/' },
  body: { label: 'Body Contouring', href: '/slimming-body-contouring/' },
  laser: { label: 'Laser & Skin', href: '/laser-skin-aesthetic/' },
  injectables: { label: 'Anti-Ageing & Injectables', href: '/anti-aging-injectables/' },
  surgery: { label: 'Cosmetic Surgery', href: '/cosmetic-surgery/' },
  gynaecology: { label: 'Cosmetic Gynaecology', href: '/cosmetic-gynecology/' },
}

export type SpecialityKey = keyof typeof specialities

export interface PostImage {
  src: string
  width: number
  height: number
  /** Describe what the photo shows; don't repeat the post title. */
  alt: string
}

export interface PublishedPost {
  status: 'published'
  slug: string
  title: string
  speciality: SpecialityKey
  /** Publish date, YYYY-MM-DD. Newest posts show first. */
  date: string
  image: PostImage
  medicalReview: { by: string; date: string }
}

export interface PlannedPost {
  status: 'planned' | 'draft'
  title: string
  speciality: SpecialityKey
  image?: PostImage
}

export type Post = PublishedPost | PlannedPost

// TODO (editorial): none of these articles is written yet. Each needs writing and medical review by the lead doctor,
// its own featured image and a publish date before it can become 'published'. The images are the matching
// treatment-page photos, as stand-ins for the "Coming soon" cards.
export const posts: Post[] = [
  {
    status: 'planned',
    title: 'NFT vs FUE vs DHI: Which Hair Transplant Suits You?',
    speciality: 'hair',
    image: {
      src: '/og/hair-transplant-restoration__fue-hair-transplant-in-bangalore.jpg',
      width: 1024,
      height: 1024,
      alt: 'Surgeon wearing loupes harvesting grafts from the back of the scalp during an FUE hair transplant',
    },
  },
  {
    status: 'planned',
    title: 'GLP-1 Weight Loss in Bangalore: Who Is It For?',
    speciality: 'body',
    image: {
      src: '/og/slimming-body-contouring__glp-1-weight-loss-program-in-bangalore.jpg',
      width: 1024,
      height: 1024,
      alt: 'Doctor explaining a medically supervised GLP-1 weight loss plan to a patient on a tablet',
    },
  },
  {
    status: 'planned',
    title: 'Acne Scar Laser: How Many Sessions Will You Need?',
    speciality: 'laser',
    image: {
      src: '/og/laser-skin-aesthetic__acne-scar-laser-treatment-in-bangalore.jpg',
      width: 1024,
      height: 1024,
      alt: 'Dermatologist reviewing acne scar laser treatment options with a patient on a tablet',
    },
  },
]

export const postHref = (slug: string) => `/journal/${slug}/`

/** Published posts, newest first. */
export function latestPublished(n = Infinity): PublishedPost[] {
  return posts
    .filter((p): p is PublishedPost => p.status === 'published')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, n)
}

export type JournalCard = PublishedPost | (PlannedPost & { status: 'planned' })

/** The home Journal row: the latest published posts, topped up with planned topics while there are too few. */
export function journalCards(n = 3): JournalCard[] {
  const published = latestPublished(n)
  const titles = new Set(published.map((p) => p.title))
  const planned = posts.filter(
    (p): p is PlannedPost & { status: 'planned' } => p.status === 'planned' && !titles.has(p.title),
  )
  return [...published, ...planned].slice(0, n)
}
