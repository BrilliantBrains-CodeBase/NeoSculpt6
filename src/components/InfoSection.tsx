import type { CSSProperties } from 'react'
import type { InfoBlock } from '../data/blocks'
import { useReveal } from './useReveal'
import { TickIcon } from './icons'
import { InfoTable } from './InfoTable'
import { delay, eyebrow as eyebrowClass, h2 as h2Class } from './shared'

// A generic section for doc copy with no dedicated component (src/data/blocks.ts): eyebrow, centred H2 and paragraphs
// as in ServiceIntro, then whichever of numbered cards, a list (ticks, numbers or bullets, each with an optional bold
// lead), a table (InfoTable) or side-by-side columns (Do / Avoid) the doc gives, then the paragraphs that follow.
// On an `alternate` panel when the doc asks for one. A block with no H2 continues the section above it.
// Phones are left-aligned, tablet up centres the heading block (the site's rule).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function InfoSection({ block }: { block: InfoBlock }) {
  const headRef = useReveal<HTMLDivElement>()
  const bodyRef = useReveal<HTMLDivElement>()
  const cardsRef = useReveal<HTMLUListElement>()
  const listRef = useReveal<HTMLElement>()
  const tableRef = useReveal<HTMLDivElement>()
  const columnsRef = useReveal<HTMLDivElement>()
  const afterRef = useReveal<HTMLDivElement>()
  const wide = Boolean(block.table || block.cards.length || block.columns.length)
  const headingId = `${block.id}-heading`
  const ListTag = block.list?.style === 'numbers' ? 'ol' : 'ul'

  const inner = (
    <div className={`mx-auto flex w-full flex-col items-center gap-10 max-md:items-start ${wide ? 'max-w-[1320px]' : 'max-w-[1080px]'}`}>
      {(block.h2 || block.eyebrow || block.paragraphs.length > 0) && (
        <div ref={headRef} data-reveal="up" className="flex max-w-[1080px] flex-col items-center gap-5 text-center max-md:items-start max-md:text-left">
          {block.eyebrow && <p className={`${eyebrowClass} text-tertiary`}>{block.eyebrow}</p>}
          {block.h2 && (
            <h2 id={headingId} className={`${h2Class} text-balance`}>
              {block.h2}
            </h2>
          )}
          {block.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}

      {block.cards.length > 0 && (
        <ul
          ref={cardsRef}
          data-reveal-stagger=""
          // Four cards (Medical Tourism's journey) sit in one row on desktop rather than three plus one.
          className={`grid w-full grid-cols-1 gap-[30px] text-left md:grid-cols-2 xl:gap-10 ${block.cards.length === 4 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'}`}
        >
          {block.cards.map((card, i) => (
            <li key={card.title} style={{ '--i': i } as CSSProperties} className="flex flex-col gap-2.5 border-t border-border pt-[25px]">
              <span aria-hidden="true" className="font-heading text-h5 text-tertiary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-h5 text-secondary uppercase">{card.title}</h3>
              {card.text && <p className="text-small">{card.text}</p>}
            </li>
          ))}
        </ul>
      )}

      {block.list && (
        <ListTag
          ref={listRef as never}
          data-reveal-stagger=""
          className={`grid w-full grid-cols-1 gap-x-10 gap-y-5 text-left ${block.list.items.length > 4 ? 'md:grid-cols-2' : 'max-w-[860px]'}`}
        >
          {block.list.items.map((item, i) => (
            <li key={item.text} style={{ '--i': i } as CSSProperties} className="flex items-start gap-[15px]">
              {block.list?.style === 'ticks' && <TickIcon className="mt-1.5 size-4 shrink-0 text-tertiary" />}
              {block.list?.style === 'numbers' && (
                <span aria-hidden="true" className="font-heading text-h5 leading-none text-tertiary">
                  {String(i + 1).padStart(2, '0')}.
                </span>
              )}
              {block.list?.style === 'bullets' && <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-tertiary" />}
              <p>
                {item.lead && <strong className="font-semibold text-secondary">{item.lead} </strong>}
                {item.text}
              </p>
            </li>
          ))}
        </ListTag>
      )}

      {block.table && (
        <div ref={tableRef} data-reveal="up" style={delay(150)} className="w-full">
          <InfoTable table={block.table} />
        </div>
      )}

      {block.columns.length > 0 && (
        <div ref={columnsRef} data-reveal="up" style={delay(150)} className={`grid w-full grid-cols-1 gap-5 text-left md:gap-[30px] ${block.columns.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {block.columns.map((col) => (
            <div key={col.heading} className={`flex flex-col gap-5 rounded-[20px] border px-[30px] py-10 md:px-10 ${col.tone === 'do' ? 'border-tertiary/60' : 'border-border'}`}>
              <h3 className={`font-heading text-h4 uppercase ${col.tone === 'do' ? 'text-tertiary' : 'text-secondary'}`}>{col.heading}</h3>
              <ul className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <li key={item} className="flex items-start gap-[15px]">
                    {col.tone === 'avoid' ? (
                      <span aria-hidden="true" className="mt-[0.3em] font-heading text-h6 leading-none text-primary">
                        ✕
                      </span>
                    ) : (
                      <TickIcon className="mt-1.5 size-4 shrink-0 text-tertiary" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {block.after.length > 0 && (
        <div ref={afterRef} data-reveal="up" style={delay(150)} className="flex max-w-[860px] flex-col gap-5 text-center max-md:text-left">
          {block.after.map((p) => (
            <p key={p} className="text-small">
              {p}
            </p>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <section
      id={block.id}
      aria-labelledby={block.h2 ? headingId : undefined}
      className="mx-auto mb-20 w-full max-w-[1400px] px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      {block.panel ? <div className="rounded-[20px] bg-alternate px-5 py-[60px] md:px-[50px] md:py-20 xl:px-20 xl:py-[100px]">{inner}</div> : inner}
    </section>
  )
}
