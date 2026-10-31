import type { TemplateProps } from '../components/PageShell'
import { recordByPath, relatedTo, formatDate, specialities, typeLabels, doctorFor } from '../data/editorial'
import bodies from '../data/editorial-bodies.json'
import { medicalReviewLine } from '../data/site'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SmartLink } from '../components/SmartLink'
import { useReveal } from '../components/useReveal'
import { ServiceCta } from '../components/service/ServiceCta'
import { InstagramStrip } from '../components/InstagramStrip'
import { EditorialCard } from '../components/journal/EditorialCard'
import { delay } from '../components/shared'

// One template for every journal and blog article (/journal/<slug>/). The record comes from src/data/editorial.json
// and its body from content/journal/<slug>.md, converted at `npm run gen` by scripts/build-editorial.mjs into
// src/data/editorial-bodies.json (headings, paragraphs, lists, links, bold and italic). Nothing is written here:
// title, dates, author, review line, image and body are all the signed-off record's.
// Order: banner (H1, labels, dates, author, review line), featured image, body, medical disclaimer, speciality and
// booking band, related items, Instagram row. Archived articles keep their page with a note (and noindex).

type Inline = { text: string; bold?: boolean; italic?: boolean; href?: string }
type Block = { type: 'h2' | 'h3' | 'p'; text: Inline[] } | { type: 'ul' | 'ol'; items: Inline[][] }

const bodyBySlug = bodies as Record<string, Block[]>

function Inlines({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((p, i) => {
        let node: React.ReactNode = p.text
        if (p.italic) node = <em>{node}</em>
        if (p.bold) node = <strong className="font-semibold text-secondary">{node}</strong>
        if (p.href) {
          node = (
            <SmartLink href={p.href} className="text-primary underline underline-offset-4 hover:text-tertiary focus-visible:text-tertiary">
              {node}
            </SmartLink>
          )
        }
        return <span key={i}>{node}</span>
      })}
    </>
  )
}

function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b, i) => {
        if (b.type === 'h2')
          return (
            <h2 key={i} className="mt-6 font-heading text-h3 text-secondary uppercase">
              <Inlines parts={b.text} />
            </h2>
          )
        if (b.type === 'h3')
          return (
            <h3 key={i} className="mt-4 font-heading text-h4 text-secondary uppercase">
              <Inlines parts={b.text} />
            </h3>
          )
        if (b.type === 'p')
          return (
            <p key={i}>
              <Inlines parts={b.text} />
            </p>
          )
        if (b.type !== 'ul' && b.type !== 'ol') return null
        const List = b.type
        return (
          <List key={i} className={`flex flex-col gap-2 pl-6 ${b.type === 'ul' ? 'list-disc' : 'list-decimal'} marker:text-primary`}>
            {b.items.map((item, j) => (
              <li key={j}>
                <Inlines parts={item} />
              </li>
            ))}
          </List>
        )
      })}
    </div>
  )
}

export function JournalArticleTemplate({ page }: TemplateProps) {
  const record = recordByPath.get(page.path)
  const metaRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const bylineRef = useReveal<HTMLDivElement>()
  const crumbsRef = useReveal<HTMLElement>()
  const relatedRef = useReveal<HTMLUListElement>()
  if (!record) return null

  const speciality = specialities[record.speciality]
  const author = doctorFor(record.author)
  const review = record.medicalReview?.status === 'approved' ? record.medicalReview : null
  const blocks = bodyBySlug[record.slug] ?? []
  const related = relatedTo(record)
  const image = record.featuredImage

  return (
    <>
      <article aria-labelledby="article-heading">
        <header className="bg-alternate pt-(--header-offset)">
          <div className="mx-auto flex max-w-[960px] flex-col gap-6 px-5 py-[60px] md:px-[30px] md:py-20 xl:py-[100px]">
            {record.status === 'archived' && (
              <p className="rounded-[7px] border border-border px-4 py-3 text-meta text-tertiary">
                This article is archived and may be out of date. Please book a consultation for current advice.
              </p>
            )}
            <p ref={metaRef} data-reveal="up" className="flex flex-wrap gap-x-2.5 text-button font-medium uppercase">
              <span className="text-tertiary">{typeLabels[record.type]}</span>
              <span aria-hidden="true" className="text-border">
                ·
              </span>
              {speciality.href ? (
                <SmartLink href={speciality.href} className="text-primary hover:text-tertiary focus-visible:text-tertiary">
                  {speciality.label}
                </SmartLink>
              ) : (
                <span className="text-primary">{speciality.label}</span>
              )}
            </p>
            <h1 id="article-heading" ref={titleRef} data-reveal="up" style={delay(150)} className="font-heading text-h2 text-secondary uppercase">
              {page.h1}
            </h1>
            <div ref={bylineRef} data-reveal="up" style={delay(300)} className="flex flex-col gap-2 text-meta text-text">
              <p>
                {record.date && <>Published {formatDate(record.date)}</>}
                {record.updatedDate && <> · Updated {formatDate(record.updatedDate)}</>}
                {record.content?.readingTimeMinutes ? <> · {record.content.readingTimeMinutes} min read</> : null}
              </p>
              {author && (
                <p>
                  By{' '}
                  <SmartLink href={author.path} className="text-secondary underline underline-offset-4 hover:text-primary focus-visible:text-primary">
                    {author.displayName}
                  </SmartLink>
                  , {author.shortRole}
                </p>
              )}
              {review && review.by && review.date && (
                <p>
                  Medically reviewed by {review.by} on {formatDate(review.date)}
                </p>
              )}
            </div>
            <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="up" style={delay(450)} />
          </div>
        </header>

        <div className="mx-auto flex max-w-[960px] flex-col gap-10 px-5 py-[60px] md:px-[30px] md:py-20">
          {image && (
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              fetchPriority="high"
              decoding="async"
              className="h-auto w-full rounded-[20px] object-cover"
            />
          )}
          <ArticleBody blocks={blocks} />
          <p className="border-t border-border pt-6 text-small text-text/80">{medicalReviewLine}</p>
        </div>
      </article>

      <ServiceCta
        closing={{
          kicker: null,
          h2: speciality.href ? `Explore ${speciality.label}` : 'Talk to a Doctor',
          paragraph: 'An article is general. A consultation looks at your concern, your history and your options.',
          chips: [],
          ctas: [
            { label: 'Book a Consultation', action: 'book' },
            ...(speciality.href ? [{ label: `View ${speciality.label}`, href: speciality.href }] : []),
          ],
          image: null,
        }}
      />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mx-auto flex w-full max-w-[1480px] flex-col gap-10 px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10">
          <h2 id="related-heading" className="font-heading text-h3 text-secondary uppercase">
            More From the Journal
          </h2>
          <ul ref={relatedRef} data-reveal="up" className="grid grid-cols-1 gap-10 xl:grid-cols-3">
            {related.map((r) => (
              <li key={r.id} className="min-w-0">
                <EditorialCard record={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <InstagramStrip />
    </>
  )
}
