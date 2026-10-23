import type { CSSProperties } from 'react'
import type { TechnologyHub } from '../../data/technology/types'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon } from '../icons'

// Technology hub section 2: the nine technology cards, the black template's service-card grid (3 per row, image on
// top; technology-international-patient.md hub §2). Each card: photo, the doc's group ("Hair", "Body", "Skin") as a
// small tag, the title (the doc's H2), its small label, the complete first sentence of that page's banner (the doc
// replaces the live cards' cut-off text; never truncated here) and "Read More", whose accessible name adds the
// title. Information cards only: no prices, ratings, badges or cart controls. Cards come grouped Hair → Body → Skin
// (technology/index.ts). Three per row on desktop, two on tablet, one on mobile; photos keep a fixed 4:3 crop.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function TechnologyCards({ cards }: { cards: TechnologyHub['cards'] }) {
  const listRef = useReveal<HTMLUListElement>()

  return (
    <section id="technology-cards" className="mx-auto mb-20 w-full max-w-[1400px] px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10">
      <ul ref={listRef} data-reveal-stagger="" className="grid grid-cols-1 gap-[30px] md:grid-cols-2 xl:grid-cols-3 xl:gap-10">
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
                <h2 className="font-heading text-h4 text-secondary uppercase">{card.title}</h2>
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
