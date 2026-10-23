import type { CSSProperties } from 'react'
import type { TechnologyDetail } from '../../data/technology/types'
import { useReveal } from '../useReveal'
import { FlowerIcon } from '../icons'
import { delay, h2 } from '../shared'

// Technology section 5: "Potential Benefits of a Planned Approach", the light reference site's 2 × 2 icon-card grid
// (technology-international-patient.md §5), in the black template's card style: centred title and sub-line, then
// one quiet `alternate` card (20px radius) per benefit with the theme's flower mark standing in for the doc's "◆"
// (decorative, hidden from screen readers) and the title. The live cards are titles only, so no text is added; where
// the doc gives text (ARTAS) it sits under the title, and the doc's small print goes under the grid.
// Two per row from tablet, one on mobile.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function TechnologyBenefits({ benefits }: { benefits: TechnologyDetail['benefits'] }) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const listRef = useReveal<HTMLUListElement>()
  const printRef = useReveal<HTMLParagraphElement>()

  return (
    <section
      id="technology-benefits"
      aria-labelledby="technology-benefits-heading"
      className="mx-auto mb-20 flex w-full max-w-[1160px] flex-col items-center gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <h2 id="technology-benefits-heading" ref={titleRef} data-reveal="up" className={`${h2} text-center text-balance`}>
        {benefits.h2}
      </h2>
      {benefits.subline && (
        <p ref={sublineRef} data-reveal="up" style={delay(150)} className="max-w-[760px] text-center">
          {benefits.subline}
        </p>
      )}
      <ul ref={listRef} data-reveal-stagger="" className="mt-5 grid w-full grid-cols-1 gap-5 md:mt-10 md:grid-cols-2 md:gap-[30px]">
        {benefits.cards.map((card, i) => (
          <li
            key={card.title}
            style={{ '--i': i } as CSSProperties}
            className="flex items-start gap-5 rounded-[20px] border border-border bg-alternate px-[30px] py-[35px] md:px-10 md:py-[45px]"
          >
            <FlowerIcon className="mt-0.5 size-[26px] shrink-0 text-tertiary" />
            <div className="flex flex-col gap-2.5">
              <h3 className="font-heading text-h5 text-secondary uppercase">{card.title}</h3>
              {card.text && <p className="text-small">{card.text}</p>}
            </div>
          </li>
        ))}
      </ul>
      {benefits.smallPrint && (
        <p ref={printRef} data-reveal="up" className="mt-5 text-center text-meta">
          {benefits.smallPrint}
        </p>
      )}
    </section>
  )
}
