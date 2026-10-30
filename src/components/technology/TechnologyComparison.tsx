import type { CSSProperties } from 'react'
import type { ArtasDetail } from '../../data/technology/types'
import { useReveal } from '../useReveal'
import { delay, h2 } from '../shared'

// ARTAS section 3: "How Is ARTAS Different From Traditional Hair Transplant Procedures?", the light reference site's
// 3-column icon-card grid (technology-international-patient.md, ARTAS §3): centred title and the doc's intro line,
// then one card per procedure in the doc's order (FUT, manual FUE, ARTAS iX). The doc asks for the ARTAS iX card to
// stand out: it takes the `alternate` fill and a gold border, the other two stay outlined. No badge or label is
// added, and every card keeps the doc's full text, including each method's limitations.
// Three per row on desktop, one per row below.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function TechnologyComparison({ comparison }: { comparison: ArtasDetail['comparison'] }) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const introRef = useReveal<HTMLParagraphElement>()
  const listRef = useReveal<HTMLUListElement>()

  return (
    <section
      id="technology-comparison"
      aria-labelledby="technology-comparison-heading"
      className="mx-auto mb-20 flex w-full max-w-[1400px] flex-col items-center max-md:items-start gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <h2 id="technology-comparison-heading" ref={titleRef} data-reveal="up" className={`${h2} max-w-[1080px] text-center max-md:text-left text-balance`}>
        {comparison.h2}
      </h2>
      <p ref={introRef} data-reveal="up" style={delay(150)} className="max-w-[860px] text-center max-md:text-left">
        {comparison.introLine}
      </p>
      <ul ref={listRef} data-reveal-stagger="" className="mt-5 grid w-full grid-cols-1 gap-5 md:mt-10 md:gap-[30px] xl:grid-cols-3">
        {comparison.cards.map((card, i) => (
          <li
            key={card.title}
            style={{ '--i': i } as CSSProperties}
            className={`flex flex-col gap-5 rounded-[20px] border px-[30px] py-10 md:px-10 md:py-[50px] ${
              i === comparison.highlight ? 'border-tertiary/60 bg-alternate' : 'border-border'
            }`}
          >
            <span aria-hidden="true" className="font-heading text-h5 text-tertiary">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-heading text-h4 text-secondary uppercase">{card.title}</h3>
            <p className="text-small">{card.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
