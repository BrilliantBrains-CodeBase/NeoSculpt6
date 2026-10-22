import type { CSSProperties } from 'react'
import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { delay } from '../shared'
import { CtaRow } from './CtaButton'

// Service section 9: cost and consultation, the current site's cost-factor panel (service-page.md §9; not in the black
// template), drawn like the theme's "Quick answers" card: one `alternate` 20px panel, the H2 and the doc's intro at the
// left (H3 type size, to fit the narrower column), the numbered factors as a ruled list at the right (gold number,
// then the title over its explanation, which fits short session names and long factors alike), so no cards sit inside
// the panel. Only what the doc gives: no prices, starting prices, discounts or EMI lines are ever added here, and the
// button row shows only if the doc has one. id="cost" is the target of the hero's cost button.
// Below xl the list sits under the heading.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceCost({ cost }: { cost: ServiceContent['cost'] }) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const introRef = useReveal<HTMLParagraphElement>()
  const listRef = useReveal<HTMLOListElement>()

  return (
    <section
      id="cost"
      aria-labelledby="cost-heading"
      className="mx-auto mb-20 w-full max-w-[1400px] scroll-mt-10 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <div className="grid grid-cols-1 gap-10 rounded-[20px] bg-alternate px-5 py-[60px] md:gap-[50px] md:px-[50px] md:py-20 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-[80px] xl:px-20 xl:py-[100px]">
        <div className="flex flex-col items-start gap-5">
          <h2 id="cost-heading" ref={titleRef} data-reveal="up" className="font-heading text-h3 text-balance text-secondary uppercase">
            {cost.h2}
          </h2>
          <p ref={introRef} data-reveal="up" style={delay(150)}>
            {cost.intro}
          </p>
          <CtaRow ctas={cost.ctas} className="mt-5" />
        </div>

        <ol ref={listRef} data-reveal-stagger="" className="flex flex-col border-t border-border">
          {cost.factors.map((factor, i) => (
            <li
              key={factor.title}
              style={{ '--i': i } as CSSProperties}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 gap-y-1.5 border-b border-border py-5 md:gap-x-[30px] md:py-[25px]"
            >
              <span aria-hidden="true" className="font-heading text-h5 text-tertiary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-h5 text-secondary uppercase">{factor.title}</h3>
              <p className="col-start-2 text-small">{factor.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
