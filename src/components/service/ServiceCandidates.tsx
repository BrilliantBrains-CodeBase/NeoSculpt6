import type { CSSProperties } from 'react'
import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { TickIcon } from '../icons'
import { delay, h2 } from '../shared'

// Service section 6: Rejuvita "Candidates for procedure" (services__rhinoplasty, container 6b63071; post-38160.css):
// a row with a 120px gap (60px tablet, 50px mobile), the rounded photo at 48% and the text column at 52% with a
// 40px gap: H2, tick checklist, paragraph. Each tick item is the doc's checklist title with its supporting line
// underneath (the doc's benefit-card text), so the titles are not repeated in a second card grid. The paragraph under
// the checklist is the doc's suitability caveat and is never dropped. Ticks are decorative.
// Below xl the photo sits above the text.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceCandidates({ candidates }: { candidates: ServiceContent['candidates'] }) {
  const imageRef = useReveal<HTMLDivElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const listRef = useReveal<HTMLUListElement>()
  const noteRef = useReveal<HTMLParagraphElement>()

  return (
    <section
      id="service-candidates"
      aria-labelledby="service-candidates-heading"
      className="mx-auto mb-20 flex w-full max-w-[1400px] flex-col gap-[50px] px-5 md:mb-[100px] md:gap-[60px] md:px-[30px] xl:mb-[150px] xl:flex-row xl:items-center xl:gap-[120px] xl:px-10"
    >
      <div ref={imageRef} data-reveal="pop" className="w-full max-w-[640px] xl:w-[48%] xl:max-w-none xl:shrink-0">
        <img
          src={candidates.image.src}
          width={candidates.image.width}
          height={candidates.image.height}
          alt={candidates.image.alt}
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full rounded-[20px] object-cover"
        />
      </div>

      <div className="flex flex-col gap-10">
        <h2 id="service-candidates-heading" ref={titleRef} data-reveal="up" className={`${h2} text-balance`}>
          {candidates.h2}
        </h2>
        <ul ref={listRef} data-reveal-stagger="" className="flex flex-col gap-5">
          {candidates.cards.map((card, i) => (
            <li key={card.title} style={{ '--i': i } as CSSProperties} className="flex items-start gap-[15px]">
              <TickIcon className="mt-1 size-4 shrink-0 text-tertiary" />
              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-h5 text-secondary uppercase">{card.title}</h3>
                <p className="text-small">{card.text}</p>
              </div>
            </li>
          ))}
        </ul>
        {candidates.note && (
          <p ref={noteRef} data-reveal="up" style={delay(150)} className="border-t border-border pt-[30px]">
            {candidates.note}
          </p>
        )}
      </div>
    </section>
  )
}
