import type { CSSProperties } from 'react'
import type { SpecialityHub } from '../../data/specialities/types'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { CtaButton } from '../service/CtaButton'
import { delay, h2, italicLine } from '../shared'

// Speciality hub: "Choose your starting point" (src/data/specialities/). Centred H2 and sub-line, then one card per
// concern: open 20px cards on the theme's 1px border (not filled, so they read differently from the treatment cards
// above), the number in gold Aboreto, the concern, a line about it, and the pages to start from as link chips (the
// International Patients chip style). The "not sure" card offers the booking popup instead. Three per row on desktop,
// two on tablet, one on mobile.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const chip =
  'inline-block rounded-full border border-border px-4 py-1.5 text-meta text-secondary transition-colors duration-300 outline-offset-4 outline-tertiary hover:border-primary hover:text-primary focus-visible:text-primary focus-visible:outline-2'

export function HubConcerns({ concerns }: { concerns: SpecialityHub['concerns'] }) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const listRef = useReveal<HTMLUListElement>()

  return (
    <section
      id="hub-concerns"
      aria-labelledby="hub-concerns-heading"
      className="mx-auto mb-20 flex w-full max-w-[1400px] flex-col items-center max-md:items-start gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <h2 id="hub-concerns-heading" ref={titleRef} data-reveal="up" className={`${h2} max-w-[1080px] text-center max-md:text-left text-balance`}>
        {concerns.h2}
      </h2>
      <p ref={sublineRef} data-reveal="up" style={delay(150)} className={`${italicLine} max-w-[860px] text-center max-md:text-left text-secondary`}>
        {concerns.subline}
      </p>

      <ul ref={listRef} data-reveal-stagger="" className="mt-10 grid w-full grid-cols-1 gap-5 md:mt-[60px] md:grid-cols-2 md:gap-[30px] xl:grid-cols-3">
        {concerns.cards.map((card, i) => (
          <li key={card.title} style={{ '--i': i } as CSSProperties}>
            <article className="flex h-full flex-col items-start gap-[15px] rounded-[20px] border border-border p-[30px] md:p-10">
              <span aria-hidden="true" className="font-heading text-h4 text-tertiary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 id={`hub-concern-${i}`} className="font-heading text-h5 text-secondary uppercase">
                {card.title}
              </h3>
              <p className="text-small">{card.text}</p>
              {card.links.length > 0 && (
                <ul aria-labelledby={`hub-concern-${i}`} className="mt-auto flex flex-wrap gap-2.5 pt-2.5">
                  {card.links.map((link) => (
                    <li key={link.href}>
                      <SmartLink href={link.href} className={chip}>
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              )}
              {card.cta && (
                <div className="mt-auto pt-2.5">
                  <CtaButton cta={card.cta} />
                </div>
              )}
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
