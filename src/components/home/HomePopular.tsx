import type { CSSProperties } from 'react'
import { popular } from '../../data/home'
import { useReveal } from '../useReveal'
import { useLoopCarousel } from '../useLoopCarousel'
import { SmartLink } from '../SmartLink'

// Home section 5: Rejuvita "Our popular treatments" (rejuvita-scrape/pages/home, container f873acc: highlight title
// 89c1bf4, blog slider aed8552, button 8d459a8; styles from elementor/css/post-39758.css). Each card is the theme's
// entry template 107 (container 155d2fa7; elementor/css/post-107.css).
// The theme's Swiper settings: carousel, centred slides, infinite loop, 4 / 2 / 1 per view, 40px gap (30px tablet and
// mobile, 80px from 1601px), autoplay 5000ms, speed 500ms, pause on hover; no arrows, dots or scrollbar. Rebuilt
// without Swiper by useLoopCarousel (clones, loop jump, drag, autoplay).
// As in the theme, the section has no top padding: the space above the title is the bottom padding of section 4
// (HomePillars).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const COUNT = popular.cards.length

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomePopular() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const sliderRef = useReveal<HTMLDivElement>()
  const buttonRef = useReveal<HTMLDivElement>()
  const carousel = useLoopCarousel({ count: COUNT })

  return (
    <section
      aria-labelledby="popular-heading"
      className="flex flex-col items-center gap-[60px] px-5 pb-20 md:gap-[70px] md:px-0 md:pb-[100px] xl:pb-[150px]"
    >
      <h2
        id="popular-heading"
        ref={titleRef}
        data-reveal="up"
        className="text-center font-heading text-h2 text-secondary uppercase md:px-[30px] xl:px-10"
      >
        {popular.h2.map((part) => (
          <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
            {part.text}
          </span>
        ))}
      </h2>

      {/* Slider (aed8552) */}
      <div
        ref={sliderRef}
        data-reveal="up"
        style={delay(150)}
        {...carousel.viewportProps}
        {...carousel.focusProps}
        // overflow-x: clip (not hidden) so the browser cannot scroll the row when a card link takes focus.
        className={`w-full touch-pan-y overflow-x-clip select-none ${carousel.dragging ? 'cursor-grabbing' : ''}`}
      >
        <ul
          {...carousel.trackProps}
          className="flex gap-(--gap) [--cols:1] [--gap:30px] [--slide:calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols))] md:[--cols:2] xl:[--cols:4] xl:[--gap:40px] min-[1601px]:[--gap:80px]"
        >
          {[0, 1, 2].flatMap((copy) =>
            popular.cards.map((card, i) => {
              const clone = copy !== 1
              return (
                <li
                  key={`${copy}-${card.href}`}
                  data-slide={COUNT * copy + i}
                  aria-hidden={clone || undefined}
                  // React 18 has no `inert` prop; the empty string sets the attribute.
                  {...(clone ? { inert: '' } : {})}
                  className="shrink-0 basis-(--slide)"
                >
                  <PopularCard card={card} />
                </li>
              )
            }),
          )}
        </ul>
      </div>

      {/* Button (8d459a8) */}
      <div ref={buttonRef} data-reveal="pop" style={delay(300)}>
        <SmartLink
          href={popular.cta.href}
          className="inline-block rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
        >
          {popular.cta.label}
        </SmartLink>
      </div>
    </section>
  )
}

// Entry template 107: photo with a 30% black overlay (60% on hover), category and title at the top, outline
// "View Details" button at the bottom. Height comes from the theme's padding-bottom (135%, 120% on mobile).
function PopularCard({ card }: { card: (typeof popular.cards)[number] }) {
  return (
    <article className="group relative overflow-hidden rounded-[20px] pb-[120%] md:pb-[135%]">
      <img
        src={card.image}
        alt={card.alt}
        width={1024}
        height={1024}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/60" />

      <div className="absolute top-[30px] left-0 flex w-full flex-col items-start gap-[10px] px-[30px] md:top-10 md:px-10">
        <SmartLink
          href={card.category.href}
          className="text-button font-medium text-secondary uppercase transition-colors duration-300 hover:text-tertiary focus-visible:text-tertiary"
        >
          {card.category.label}
        </SmartLink>
        <h3 className="font-heading text-h4 text-secondary uppercase">
          <SmartLink
            href={card.href}
            className="transition-all duration-300 hover:text-primary focus-visible:text-primary"
          >
            {card.title}
          </SmartLink>
        </h3>
      </div>

      <SmartLink
        href={card.href}
        aria-label={`View details: ${card.title}`}
        className="absolute bottom-[30px] left-[30px] rounded-[7px] border border-secondary px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-background focus-visible:border-primary focus-visible:bg-primary focus-visible:text-background md:bottom-10 md:left-10"
      >
        View Details
      </SmartLink>
    </article>
  )
}
