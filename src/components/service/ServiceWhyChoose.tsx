import type { CSSProperties } from 'react'
import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { delay, h2, italicLine } from '../shared'

// Service section 4: why choose NeoSculpt6. The doc's icon-card grid from the light reference site, drawn in the black
// template's quieter style: centred title and sub-line (as its section titles), then open columns separated by the
// theme's 1px border line, each with the doc's number in gold Aboreto, the title and the text. No boxes, so the page
// does not stack one card grid on another. Three per row on desktop with a short last row centred, two on tablet,
// one on mobile. Every card in the doc is shown, in order.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceWhyChoose({ whyChoose }: { whyChoose: ServiceContent['whyChoose'] }) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const listRef = useReveal<HTMLUListElement>()

  return (
    <section
      id="service-why-choose"
      aria-labelledby="service-why-choose-heading"
      className="mx-auto mb-20 flex w-full max-w-[1400px] flex-col items-center max-md:items-start gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <h2 id="service-why-choose-heading" ref={titleRef} data-reveal="up" className={`${h2} max-w-[1080px] text-center max-md:text-left text-balance`}>
        {whyChoose.h2}
      </h2>
      {whyChoose.subline && (
        <p ref={sublineRef} data-reveal="up" style={delay(150)} className={`${italicLine} max-w-[860px] text-center max-md:text-left text-secondary`}>
          {whyChoose.subline}
        </p>
      )}
      <ul
        ref={listRef}
        data-reveal-stagger=""
        className="mt-10 flex w-full flex-wrap justify-center max-md:justify-start gap-x-10 gap-y-[50px] md:mt-[60px] md:gap-x-[60px] md:gap-y-[60px]"
      >
        {whyChoose.cards.map((card, i) => (
          <li
            key={card.title}
            style={{ '--i': i } as CSSProperties}
            className="flex w-full flex-col gap-[15px] border-t border-border pt-[30px] md:w-[calc((100%-60px)/2)] xl:w-[calc((100%-120px)/3)]"
          >
            <span aria-hidden="true" className="font-heading text-h4 text-tertiary">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-heading text-h5 text-secondary uppercase">{card.title}</h3>
            <p className="text-small">{card.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
