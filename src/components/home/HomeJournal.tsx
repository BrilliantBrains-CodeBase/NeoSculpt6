import type { CSSProperties } from 'react'
import { journal } from '../../data/home'
import { journalCards, postHref, specialities, type JournalCard, type PostImage } from '../../data/posts'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon } from '../icons'

// Home section 14: Rejuvita "Our Blog" (rejuvita-scrape/pages/home, container acddbba: eyebrow 63b51e8, highlight
// title 6c24e8c, blog grid c7cb3dd, button c85a6b8; styles from elementor/css/post-39758.css). Each card is the
// theme's entry template 59 (elementor/css/post-59.css): image, category, title over a rule, "Read More".
// The theme's grid is 3 columns on desktop and 1 below; on tablet each card turns into a row (image left, text right).
// No slider, so no arrows or autoplay.
// Cards come from src/data/posts.ts: the latest 3 published posts, topped up with planned topics shown as
// "Coming soon" cards (no links) while there are too few.
// Differences from the theme: the image is not a link (a link named by the photo's description would mislead
// screen-reader users and add a third tab stop per card), and the "Read More Articles" button waits for the
// /journal/ index (home.ts `journal.cta`).
// id="journal" is the target of the footer "Journal" link.
// As in the theme, the section has no top padding: the space above is the bottom margin of section 13
// (HomeTechnology).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

// Focus ring shared with the testimonials and technology controls.
const focusRing = 'outline-offset-4 outline-tertiary focus-visible:outline-2 focus-visible:outline-solid'

export function HomeJournal() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const gridRef = useReveal<HTMLUListElement>()
  const buttonRef = useReveal<HTMLDivElement>()

  const cards = journalCards(3)
  if (!cards.length) return null

  return (
    <section
      id="journal"
      aria-labelledby="journal-heading"
      className="mb-20 flex flex-col items-center gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <p ref={eyebrowRef} data-reveal="up" className="text-center text-h6 font-medium text-text uppercase">
        {journal.eyebrow}
      </p>
      <h2
        id="journal-heading"
        ref={titleRef}
        data-reveal="up"
        style={delay(150)}
        className="mb-10 text-center font-heading text-h2 text-secondary uppercase md:mb-[60px]"
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
          <li key={card.status === 'published' ? card.slug : card.title} className="min-w-0">
            <JournalCardView card={card} />
          </li>
        ))}
      </ul>

      {/* Button (c85a6b8), once the journal index exists */}
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

// Entry template 59. Published posts link their category (to the speciality hub), title and "Read More"; planned
// topics show the same layout as plain text with "Coming soon" in the button slot.
function JournalCardView({ card }: { card: JournalCard }) {
  const speciality = specialities[card.speciality]
  const live = card.status === 'published'

  return (
    <article className="group flex flex-col gap-5 md:flex-row md:gap-[30px] xl:flex-col xl:gap-5">
      {card.image && <CardImage image={card.image} hover={live} />}

      <div className="flex min-w-0 flex-col items-start gap-[15px] md:flex-1 md:justify-center xl:flex-none xl:justify-start xl:gap-5">
        {/* Category: the theme's taxonomy type (Manrope 500, 13 / 12 / 11px, uppercase, 2px tracking). */}
        {live ? (
          <SmartLink
            href={speciality.href}
            className={`text-button font-medium text-primary uppercase transition-colors duration-300 hover:text-tertiary focus-visible:text-tertiary ${focusRing}`}
          >
            {speciality.label}
          </SmartLink>
        ) : (
          <p className="text-button font-medium text-primary uppercase">{speciality.label}</p>
        )}

        <h3 className="w-full border-b border-border pb-10 font-heading text-h5 break-words text-secondary uppercase md:pb-[15px] xl:pb-10">
          {live ? (
            <SmartLink
              href={postHref(card.slug)}
              className={`transition-colors duration-300 hover:text-primary focus-visible:text-primary ${focusRing}`}
            >
              {card.title}
            </SmartLink>
          ) : (
            card.title
          )}
        </h3>

        {live ? (
          <SmartLink
            href={postHref(card.slug)}
            aria-label={`Read more: ${card.title}`}
            className={`inline-flex items-center gap-[10px] text-button font-semibold text-secondary uppercase transition-colors duration-300 hover:text-primary focus-visible:text-primary ${focusRing}`}
          >
            Read More
            <ArrowRightIcon className="size-3 shrink-0" />
          </SmartLink>
        ) : (
          <p className="text-button font-semibold text-text/70 uppercase">Coming soon</p>
        )}
      </div>
    </article>
  )
}

// Image block (42263464): 280px tall, 20px corners, a 23% black overlay on hover (published cards only).
function CardImage({ image, hover }: { image: PostImage; hover: boolean }) {
  return (
    <div className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-[20px] md:w-1/2 xl:w-full">
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      {hover && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#0000003b] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </div>
  )
}
