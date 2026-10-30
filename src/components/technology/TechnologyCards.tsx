import type { CSSProperties } from 'react'
import type { TechnologyHub } from '../../data/technology/types'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon } from '../icons'
import { delay, h2, italicLine } from '../shared'

// Technology hub section 2: the nine technology cards, the black template's service-card grid (3 per row, image on
// top; technology-international-patient.md hub §2). Each card: photo, the doc's group ("Hair", "Body", "Skin") as a
// small tag, the title (the doc's H2), its small label, the complete first sentence of that page's banner (the doc
// replaces the live cards' cut-off text; never truncated here) and "Read More", whose accessible name adds the
// title. Information cards only: no prices, ratings, badges or cart controls. Cards come grouped Hair → Body → Skin
// (technology/index.ts). Three per row on desktop, two on tablet, one on mobile; photos keep a fixed 4:3 crop.
// Speciality hubs show a subset under their own centred H2 and sub-line (`heading`); the card titles are then H3s.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

// A short row (one or two cards, on a speciality hub) is centred at the three-column card width rather than left in a
// half-empty grid.
const GRID: Record<number, string> = {
  0: '',
  1: 'md:mx-auto md:max-w-[440px]',
  2: 'md:grid-cols-2 xl:mx-auto xl:max-w-[920px]',
  3: 'md:grid-cols-2 xl:grid-cols-3',
}

export function TechnologyCards({
  cards,
  id = 'technology-cards',
  heading,
}: {
  cards: TechnologyHub['cards']
  id?: string
  heading?: { h2: string; subline: string }
}) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const listRef = useReveal<HTMLUListElement>()
  const Title = heading ? 'h3' : 'h2'

  return (
    <section
      id={id}
      aria-labelledby={heading ? `${id}-heading` : undefined}
      className="mx-auto mb-20 w-full max-w-[1400px] px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      {heading && (
        <div className="mb-10 flex flex-col items-center max-md:items-start gap-5 md:mb-[60px]">
          <h2 id={`${id}-heading`} ref={titleRef} data-reveal="up" className={`${h2} max-w-[1080px] text-center max-md:text-left text-balance`}>
            {heading.h2}
          </h2>
          <p ref={sublineRef} data-reveal="up" style={delay(150)} className={`${italicLine} max-w-[860px] text-center max-md:text-left text-secondary`}>
            {heading.subline}
          </p>
        </div>
      )}
      <ul ref={listRef} data-reveal-stagger="" className={`grid grid-cols-1 gap-[30px] xl:gap-10 ${GRID[Math.min(cards.length, 3)]}`}>
        {cards.map((card, i) => (
          <li key={card.cta.href} style={{ '--i': i } as CSSProperties}>
            <article className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-alternate">
              <div className="overflow-hidden">
                <img
                  src={card.image.src}
                  width={card.image.width}
                  height={card.image.height}
                  alt={card.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col items-start gap-[15px] p-[30px] md:p-10">
                <p className="rounded-full border border-border px-4 py-1 text-meta text-tertiary">{card.group}</p>
                <Title className="font-heading text-h4 text-secondary uppercase">{card.title}</Title>
                <p className="text-meta text-primary">{card.label}</p>
                <p className="text-small">{card.text}</p>
                <SmartLink
                  href={card.cta.href}
                  className="mt-auto inline-flex items-center gap-2.5 border-t border-border pt-5 text-button font-semibold text-secondary uppercase transition-colors duration-300 outline-offset-4 outline-tertiary hover:text-primary focus-visible:text-primary focus-visible:outline-2"
                >
                  {card.cta.label}
                  <span className="sr-only">: {card.title}</span>
                  <ArrowRightIcon className="size-3 shrink-0" />
                </SmartLink>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
