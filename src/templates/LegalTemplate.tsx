import type { TemplateProps } from '../components/PageShell'
import type { Block, Inline, LegalDoc } from '../data/legal'
import { privacy } from '../data/privacy'
import { terms } from '../data/terms'
import { formatDate } from '../data/editorial'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SmartLink } from '../components/SmartLink'
import { useReveal } from '../components/useReveal'
import { delay } from '../components/shared'

// Legal pages: /privacy-policy/ (src/data/privacy.ts) and /terms-of-use/ (src/data/terms.ts), picked by path. A quiet
// page: banner (H1, dates, intro, breadcrumb) on `alternate`, then an "In short" summary, a contents list and the
// numbered sections. Text styles follow the journal article body. No booking band or Instagram row.

const docs: Record<string, LegalDoc> = {
  '/privacy-policy/': privacy,
  '/terms-of-use/': terms,
}

const link = 'text-primary underline underline-offset-4 hover:text-tertiary focus-visible:text-tertiary'

function Text({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <span key={i}>{part}</span>
        ) : (
          <SmartLink key={i} href={part.href} className={link}>
            {part.text}
          </SmartLink>
        ),
      )}
    </>
  )
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'p')
          return (
            <p key={i}>
              <Text parts={b.text} />
            </p>
          )
        if (b.type === 'ul')
          return (
            <ul key={i} className="flex list-disc flex-col gap-2 pl-6 marker:text-primary">
              {b.items.map((item, j) => (
                <li key={j}>
                  <Text parts={item} />
                </li>
              ))}
            </ul>
          )
        if (b.type === 'contact')
          return (
            <dl key={i} className="grid grid-cols-1 gap-x-6 gap-y-1 rounded-[7px] border border-border px-5 py-4 md:grid-cols-[auto_1fr] md:gap-y-3">
              {b.rows.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="font-medium text-secondary max-md:mt-2 max-md:first:mt-0">{label}</dt>
                  <dd className="break-words">
                    <Text parts={value} />
                  </dd>
                </div>
              ))}
            </dl>
          )
        // Phones get a stacked list (a three-column table hides the policy links off-screen); tablet and up, the table.
        return (
          <div key={i}>
            <ul className="flex flex-col border-t border-border md:hidden">
              {b.rows.map(([service, where, policy]) => (
                <li key={service} className="flex flex-col gap-1 border-b border-border py-4 text-small">
                  <span className="font-medium text-secondary">{service}</span>
                  <span>{where}</span>
                  <span>
                    <Text parts={policy} />
                  </span>
                </li>
              ))}
            </ul>
            <table className="hidden w-full border-collapse text-left text-small md:table">
              <thead>
                <tr className="border-b border-border">
                  {b.head.map((h) => (
                    <th key={h} scope="col" className="py-3 pr-4 font-medium text-secondary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map(([service, where, policy]) => (
                  <tr key={service} className="border-b border-border align-top">
                    <th scope="row" className="py-3 pr-4 font-medium text-secondary">
                      {service}
                    </th>
                    <td className="py-3 pr-4">{where}</td>
                    <td className="py-3">
                      <Text parts={policy} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </>
  )
}

export function LegalTemplate({ page }: TemplateProps) {
  const doc = docs[page.path]
  const titleRef = useReveal<HTMLHeadingElement>()
  const datesRef = useReveal<HTMLParagraphElement>()
  const introRef = useReveal<HTMLParagraphElement>()
  const crumbsRef = useReveal<HTMLElement>()

  return (
    <article aria-labelledby="legal-heading">
      <header className="bg-alternate pt-(--header-offset)">
        <div className="mx-auto flex max-w-[960px] flex-col gap-6 px-5 py-[60px] md:px-[30px] md:py-20 xl:py-[100px]">
          <h1 id="legal-heading" ref={titleRef} data-reveal="up" className="font-heading text-h1 text-secondary uppercase">
            {page.h1}
          </h1>
          <p ref={datesRef} data-reveal="up" style={delay(150)} className="text-meta text-text">
            Effective {formatDate(doc.effectiveDate)} · Last updated {formatDate(doc.updatedDate)}
          </p>
          <p ref={introRef} data-reveal="up" style={delay(300)} className="max-w-[720px] text-secondary">
            <Text parts={doc.intro} />
          </p>
          <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="up" style={delay(450)} />
        </div>
      </header>

      <div className="mx-auto flex max-w-[960px] flex-col gap-12 px-5 py-[60px] md:px-[30px] md:py-20">
        <section aria-labelledby="summary-heading" className="flex flex-col gap-4 rounded-[20px] border border-border p-6 md:p-8">
          <h2 id="summary-heading" className="font-heading text-h4 text-secondary uppercase">
            {doc.summaryHeading}
          </h2>
          <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-primary">
            {doc.summary.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>

        <nav aria-labelledby="contents-heading" className="flex flex-col gap-4">
          <h2 id="contents-heading" className="text-h6 font-medium text-tertiary uppercase">
            Contents
          </h2>
          <ol className="grid list-decimal grid-cols-1 gap-x-10 gap-y-2 pl-6 marker:text-primary md:grid-cols-2">
            {doc.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-secondary underline-offset-4 hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline">
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {doc.sections.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`} className="flex scroll-mt-[calc(var(--header-offset)+1.5rem)] flex-col gap-5">
            <h2 id={`${s.id}-heading`} className="font-heading text-h3 text-secondary uppercase">
              <span className="text-primary">{i + 1}.</span> {s.heading}
            </h2>
            <Blocks blocks={s.blocks} />
          </section>
        ))}
      </div>
    </article>
  )
}
