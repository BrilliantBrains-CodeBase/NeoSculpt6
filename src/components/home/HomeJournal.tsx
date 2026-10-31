import type { CSSProperties } from 'react'
import { journal } from '../../data/home'
import { latest } from '../../data/editorial'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { EditorialCard } from '../journal/EditorialCard'

// Home section 14: Rejuvita "Our Blog" (rejuvita-scrape/pages/home, container acddbba: eyebrow 63b51e8, highlight
// title 6c24e8c, blog grid c7cb3dd, button c85a6b8; styles from elementor/css/post-39758.css). Each card is the
// theme's entry template 59 (elementor/css/post-59.css): image, category, title over a rule, "Read More".
// The theme's grid is 3 columns on desktop and 1 below; on tablet each card turns into a row (image left, text right).
// No slider, so no arrows or autoplay.
// Cards come from src/data/editorial.ts (`latest(3)`): the newest public items of any type, the same source as the
// /journal/ hub. Until the first article is published that means media coverage. Nothing unpublished is shown.
// Each card is the shared EditorialCard (one link per card; media cards open the publication in a new tab). The
// button goes to the hub (home.ts `journal.cta`).
// As in the theme, the section has no top padding: the space above is the bottom margin of section 13
// (HomeTechnology).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomeJournal() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const gridRef = useReveal<HTMLUListElement>()
  const buttonRef = useReveal<HTMLDivElement>()

  const cards = latest(3)
  if (!cards.length) return null

  return (
    <section
      id="journal"
      aria-labelledby="journal-heading"
      className="mb-20 flex flex-col items-center max-md:items-start gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <p ref={eyebrowRef} data-reveal="up" className="text-center max-md:text-left text-h6 font-medium text-text uppercase">
        {journal.eyebrow}
      </p>
      <h2
        id="journal-heading"
        ref={titleRef}
        data-reveal="up"
        style={delay(150)}
        className="mb-10 text-center max-md:text-left font-heading text-h2 text-secondary uppercase md:mb-[60px]"
      >
        {journal.h2.map((line, i) => (
          <span key={i} className="block">
            {line.map((part) => (
              <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                {part.text}
              </span>
            ))}
          </span>
        ))}
      </h2>

      {/* Blog grid (c7cb3dd) */}
      <ul
        ref={gridRef}
        data-reveal="up"
        style={delay(300)}
        className="grid w-full max-w-[1400px] grid-cols-1 gap-10 xl:grid-cols-3"
      >
        {cards.map((card) => (
          <li key={card.id} className="min-w-0">
            <EditorialCard record={card} />
          </li>
        ))}
      </ul>

      {/* Button (c85a6b8) */}
      {journal.cta && (
        <div ref={buttonRef} data-reveal="pop" className="mt-10 md:mt-[60px]">
          <SmartLink
            href={journal.cta.href}
            className="inline-block rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
          >
            {journal.cta.label}
          </SmartLink>
        </div>
      )}
    </section>
  )
}
