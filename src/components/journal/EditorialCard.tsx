import type { ReactNode } from 'react'
import {
  cardHref,
  coverageLabels,
  formatDate,
  languageLabels,
  specialities,
  typeLabels,
  type EditorialRecord,
} from '../../data/editorial'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon, ExternalIcon } from '../icons'

// One journal card, shared by the home Journal section, the /journal/ hub and the article pages' "related" row.
// Rejuvita entry template 59 (elementor/css/post-59.css; see HomeJournal): 280px image with 20px corners, rose label
// row, cream title over a rule, read-more with an arrow. On tablet the grid card is a row (image left, text right).
// One link per card: the title's link is stretched over the whole card, so a card is one tab stop and holds no nested
// interactive elements. The read-more line is part of that link's look, not a second link.
// Media cards open the publication (or the hosted scan, for print) in a new tab and say so to screen readers. Without
// a photo they show a typographic publication panel; publication logos are never used.

export const focusRing = 'outline-offset-4 outline-tertiary focus-visible:outline-2 focus-visible:outline-solid'

type Variant = 'grid' | 'featured'

export function EditorialCard({
  record,
  variant = 'grid',
}: {
  record: EditorialRecord
  variant?: Variant
}) {
  const media = record.type === 'media' ? record.media : null
  const external = record.type === 'media'
  const href = cardHref(record)
  const featured = variant === 'featured'
  const titleLang = media?.language ?? undefined
  const cta = !media ? 'Read Article' : media.clipping && !media.sourceUrl ? 'View the Clipping' : 'Read Coverage'

  const linkClass = `after:absolute after:inset-0 after:rounded-[20px] after:content-[''] ${focusRing} focus-visible:outline-none`
  const title = (
    <>
      <span lang={titleLang}>{record.title}</span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  )

  return (
    <article
      className={`group relative flex flex-col gap-5 rounded-[20px] outline-offset-8 outline-tertiary has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-solid ${
        featured
          ? 'md:gap-[30px] xl:flex-row xl:items-center xl:gap-[60px]'
          : 'md:flex-row md:gap-[30px] xl:flex-col xl:gap-5'
      }`}
    >
      <CardMedia record={record} featured={featured} />

      <div
        className={`flex min-w-0 flex-col items-start gap-[15px] ${
          featured ? 'xl:flex-1 xl:gap-5' : 'md:flex-1 md:justify-center xl:flex-none xl:justify-start xl:gap-5'
        }`}
      >
        <MetaRow record={record} />

        {featured ? (
          <h3 className="font-heading text-h3 break-words text-secondary uppercase transition-colors duration-300 group-hover:text-primary">
            <CardLink href={href} external={external} className={linkClass}>
              {title}
            </CardLink>
          </h3>
        ) : (
          <h3 className="w-full border-b border-border pb-10 font-heading text-h5 break-words text-secondary uppercase transition-colors duration-300 group-hover:text-primary md:pb-[15px] xl:pb-10">
            <CardLink href={href} external={external} className={linkClass}>
              {title}
            </CardLink>
          </h3>
        )}

        {featured && record.excerpt && <p className="max-w-[640px]">{record.excerpt}</p>}
        {media?.edition && <p className="text-meta text-text">{media.edition}</p>}
        {media && media.syndicated.length > 0 && (
          <p className="text-meta text-text">
            Also carried by {media.syndicated.slice(0, 3).map((s) => s.name).join(', ')}
            {media.syndicated.length > 3 ? ` and ${media.syndicated.length - 3} more outlets` : ''}
          </p>
        )}

        <p
          aria-hidden="true"
          className={`inline-flex items-center gap-[10px] text-button font-semibold text-secondary uppercase transition-colors duration-300 group-hover:text-primary ${
            featured ? 'w-full border-t border-border pt-5' : ''
          }`}
        >
          {cta}
          {external ? (
            <ExternalIcon className="size-3 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          ) : (
            <ArrowRightIcon className="size-3 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </p>
      </div>
    </article>
  )
}

function CardLink({
  href,
  external,
  className,
  children,
}: {
  href: string
  external: boolean
  className: string
  children: ReactNode
}) {
  // Media links are plain anchors: an external page, or a hosted scan (a file, not a route).
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <SmartLink href={href} className={className}>
      {children}
    </SmartLink>
  )
}

// Label rows: type and speciality (owned) or publication (media) on the first line; coverage type, date and
// language on the second, so a wrapped row never starts with a separator.
function MetaRow({ record }: { record: EditorialRecord }) {
  const media = record.type === 'media' ? record.media : null
  const details = [
    media ? coverageLabels[media.coverageType] : null,
    record.date ? formatDate(record.date, record.datePrecision) : null,
    media?.language ? languageLabels[media.language] : null,
  ].filter(Boolean) as string[]

  return (
    <div className="flex flex-col gap-1 text-button font-medium uppercase">
      <p className="flex flex-wrap items-center gap-x-2.5">
        <span className="text-tertiary">{typeLabels[record.type]}</span>
        <span aria-hidden="true" className="text-border">
          ·
        </span>
        <span className="text-primary">{media ? media.publication : specialities[record.speciality].label}</span>
      </p>
      {details.length > 0 && <p className="text-text">{details.join(' · ')}</p>}
    </div>
  )
}

// The card's picture: the featured image, the print scan, or a publication panel when there is neither.
function CardMedia({ record, featured }: { record: EditorialRecord; featured: boolean }) {
  const box = featured
    ? 'relative h-[280px] w-full shrink-0 overflow-hidden rounded-[20px] md:h-[400px] xl:h-[460px] xl:w-[55%]'
    : 'relative h-[280px] w-full shrink-0 overflow-hidden rounded-[20px] md:w-1/2 xl:w-full'
  const overlay = (
    <div aria-hidden="true" className="absolute inset-0 bg-[#0000003b] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  )
  const imgClass = 'absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'

  if (record.featuredImage) {
    const img = record.featuredImage
    return (
      <div className={box}>
        <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" className={imgClass} />
        {overlay}
      </div>
    )
  }
  const clip = record.media?.permissionConfirmed ? record.media.clipping : null
  if (clip) {
    return (
      <div className={`${box} bg-secondary`}>
        <img
          src={clip.thumb}
          alt={clip.alt}
          width={clip.thumbWidth}
          height={clip.thumbHeight}
          loading="lazy"
          decoding="async"
          className={`${imgClass} object-top`}
        />
        {overlay}
      </div>
    )
  }
  // Publication panel: decorative (the publication is named in the label row), so hidden from screen readers.
  return (
    <div aria-hidden="true" className={`${box} flex flex-col items-center justify-center gap-4 border border-border bg-alternate px-8 text-center`}>
      <span className="font-heading text-h4 break-words text-secondary uppercase transition-colors duration-300 group-hover:text-tertiary">
        {record.media?.publication ?? typeLabels[record.type]}
      </span>
      <span className="h-px w-10 bg-tertiary" />
      <span className="text-button font-medium text-primary uppercase">
        {record.media ? coverageLabels[record.media.coverageType] : specialities[record.speciality].label}
      </span>
    </div>
  )
}
