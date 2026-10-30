import type { CSSProperties } from 'react'
import { priceGuide } from '../../data/home'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { TickIcon } from '../icons'

// Home section 11: Rejuvita "Investment in Excellence" price guide (rejuvita-scrape/pages/home, container 88a7582:
// heading f205a93, advanced title ce99b19, text c515787, cards 212515e / b7072b1; styles from
// elementor/css/post-39758.css). Each card is the theme's: image panel + `alternate` content panel (H4, icon list of
// treatment / price rows with `border` dividers, transparent "View More" text button), 20px radius, image hidden on
// phones.
// Changes from the theme:
// - Six cards, one per speciality (data from `pillars`), at 3 / 2 / 1 columns, with the image on top: the theme's
//   phone layout of the card. The theme has two wide cards with the image on the left.
// - Card titles are H3 (set at the theme's H4 size) so headings stay in order under the section H2.
// - Rows link to their treatment pages; the card button goes to the speciality hub.
// - Prices show only once approved (src/data/home.ts); until then each row shows the pending label.
// - The theme's "Full price guide" button becomes Book a Consultation (opens the booking popup), with a disclaimer.
// id="price-guide" is an in-page target.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomePriceGuide() {
  const { open: openBooking } = useBooking()
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const cardsRef = useReveal<HTMLUListElement>()
  const footerRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="price-guide"
      aria-labelledby="price-guide-heading"
      className="mb-20 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center max-md:items-start gap-5 text-center max-md:text-left">
        <p ref={eyebrowRef} data-reveal="up" style={delay(150)} className="text-h6 font-medium text-text uppercase">
          {priceGuide.eyebrow}
        </p>
        <h2
          id="price-guide-heading"
          ref={titleRef}
          data-reveal="up"
          style={delay(300)}
          className="font-heading text-h2 text-secondary uppercase text-balance"
        >
          {priceGuide.h2.map((part) => (
            <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
              {part.text}
            </span>
          ))}
        </h2>
        <p ref={sublineRef} data-reveal="up" style={delay(450)} className="max-w-[700px]">
          {priceGuide.subline}
        </p>

        {/* Cards: 1 column on phones, 2 on tablet, 3 on desktop. They fade in one after another. */}
        <ul
          ref={cardsRef}
          data-reveal-stagger=""
          className="mt-10 grid w-full grid-cols-1 gap-5 text-left md:mt-[60px] md:grid-cols-2 xl:grid-cols-3 xl:gap-10"
        >
          {priceGuide.cards.map((card, i) => (
            <li
              key={card.cta.href}
              style={{ '--i': i } as CSSProperties}
              className="flex flex-col overflow-hidden rounded-[20px] bg-alternate"
            >
              {/* Image panel: hidden on phones, as in the theme. */}
              <img
                src={card.image}
                width={1024}
                height={1024}
                alt={card.imageAlt}
                loading="lazy"
                decoding="async"
                className="hidden h-[260px] w-full object-cover md:block"
              />
              {/* Content panel: 40px gap between title, list and button. */}
              <div className="flex flex-1 flex-col items-start gap-10 px-5 py-10 md:p-10 min-[1601px]:p-[50px]">
                <h3 className="font-heading text-h4 text-secondary uppercase">{card.title}</h3>
                <ul className="w-full divide-y divide-border">
                  {card.items.map((item) => {
                    const price = priceGuide.prices[item.href]
                    return (
                      <li
                        key={item.href}
                        className="flex flex-wrap items-center justify-between gap-x-[15px] gap-y-1 py-[12.5px] first:pt-0 last:pb-0"
                      >
                        <SmartLink
                          href={item.href}
                          className="group flex items-center gap-[15px] text-small text-text transition-colors duration-300 hover:text-primary focus-visible:text-primary"
                        >
                          <TickIcon className="size-[15px] shrink-0 text-tertiary transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary" />
                          {item.label}
                        </SmartLink>
                        {/* A price sits on the right, as in the theme; the longer pending label always takes its own
                            line under the name, so rows don't wrap unevenly. */}
                        {price ? (
                          <span className="ml-auto text-button font-medium text-text uppercase">{price}</span>
                        ) : (
                          <span className="w-full pl-[30px] text-button font-medium text-text/60 uppercase">
                            {priceGuide.pendingLabel}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
                {/* "View More" text button: `secondary`, `primary` on hover. */}
                <SmartLink
                  href={card.cta.href}
                  className="mt-auto text-button font-semibold text-secondary uppercase transition-colors duration-300 hover:text-primary focus-visible:text-primary"
                >
                  {card.cta.label}
                </SmartLink>
              </div>
            </li>
          ))}
        </ul>

        <div
          ref={footerRef}
          data-reveal="up"
          className="mt-5 flex flex-col items-center max-md:items-start gap-[30px] md:mt-10"
        >
          <p className="max-w-[700px] text-small text-text/70">{priceGuide.disclaimer}</p>
          <button
            type="button"
            onClick={openBooking}
            className="inline-block rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
          >
            {priceGuide.cta}
          </button>
        </div>
      </div>
    </section>
  )
}
