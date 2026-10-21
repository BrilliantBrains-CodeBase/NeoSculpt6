import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { technology } from '../../data/home'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowLeftIcon, ArrowRightIcon } from '../icons'

// Home section 13: Rejuvita "Our Shop" row, reused for technology (rejuvita-scrape/pages/home, container bad04e5:
// eyebrow cc0ba24, highlight title 4b4ea3a, italic sub-line d75f6c5, products c346910, button 9f0cc5d; styles from
// elementor/css/post-39758.css). Each card is the theme's product template 174 (elementor/css/post-174.css) without
// the shop parts: no sale or stock badge, price, rating or cart. The doc's one line sits in the price row and
// "Learn More" replaces "Add to cart". Copy: homepage.md §13, in data/home.ts.
// The theme shows 4 products in a 4 / 2 / 1 column grid with a 30px gap. Ours has 9, so the row scrolls: a native
// scroll-snap track (swipe on touch; Tab reaches every card, and the browser brings a focused card into view inside
// the track). Not in the theme, added for the extra cards: previous/next buttons and a polite "Showing 1–4 of 9"
// after a move. No autoplay.
// As in the theme, the section has no top padding: the space above is the bottom margin of the section before it (HomePriceGuide).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const COUNT = technology.cards.length

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

// Focus ring shared with the testimonials controls.
const control = 'outline-offset-4 outline-tertiary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-solid'

export function HomeTechnology() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const carouselRef = useReveal<HTMLDivElement>()
  const buttonRef = useReveal<HTMLDivElement>()
  const trackRef = useRef<HTMLUListElement>(null)

  // Prerendered state: at the start, more cards to the right.
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const announced = useRef(0)
  const frame = useRef(0)
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Card width + gap, and how many cards fit.
  const metrics = useCallback(() => {
    const track = trackRef.current!
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const card = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? track.clientWidth
    const step = card + gap
    return { gap, step, perView: Math.max(1, Math.round((track.clientWidth + gap) / step)) }
  }, [])

  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setAtStart(track.scrollLeft <= 1)
    setAtEnd(track.scrollLeft >= max - 1)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(track)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame.current)
      clearTimeout(settle.current)
    }
  }, [updateEdges])

  const onScroll = () => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(updateEdges)
    // Once scrolling has settled, say which cards are showing (only when that changed).
    clearTimeout(settle.current)
    settle.current = setTimeout(() => {
      const track = trackRef.current
      if (!track) return
      const { step, perView } = metrics()
      const first = Math.min(COUNT - perView, Math.round(track.scrollLeft / step))
      if (first === announced.current) return
      announced.current = first
      const last = Math.min(first + perView, COUNT)
      setAnnouncement(perView === 1 ? `Showing ${first + 1} of ${COUNT}` : `Showing ${first + 1}–${last} of ${COUNT}`)
    }, 150)
  }

  // One page of cards per press, on fixed page starts (0, 4, 8 … with 4 per view), so going back retraces going
  // forward. The last page ends flush with the last card.
  const page = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const { step, perView } = metrics()
    const first = Math.round(track.scrollLeft / step)
    const target =
      direction === 1
        ? Math.min(first + perView, COUNT - perView)
        : Math.max(0, (Math.ceil(first / perView) - 1) * perView)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({ left: target * step, behavior: reduce ? 'auto' : 'smooth' })
  }

  // aria-disabled (not disabled) so a button keeps focus when it reaches the end of the row.
  const arrow = (off: boolean) =>
    `flex size-10 items-center justify-center rounded-full border text-secondary ${control} ${
      off ? 'cursor-default border-tertiary/20 opacity-40' : 'border-tertiary/40 hover:border-tertiary hover:text-tertiary'
    }`

  return (
    <section
      aria-labelledby="technology-heading"
      className="mb-20 flex flex-col items-center gap-5 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <p ref={eyebrowRef} data-reveal="up" className="text-center text-h6 font-medium text-text uppercase">
        {technology.eyebrow}
      </p>
      <h2
        id="technology-heading"
        ref={titleRef}
        data-reveal="up"
        style={delay(150)}
        className="text-center font-heading text-h2 text-secondary uppercase"
      >
        {technology.h2.map((line, i) => (
          <span key={i} className="block">
            {line.map((part) => (
              <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                {part.text}
              </span>
            ))}
          </span>
        ))}
      </h2>
      <p
        ref={sublineRef}
        data-reveal="up"
        style={delay(300)}
        className="mb-10 text-center font-accent-serif text-[18px] leading-[1.35] italic md:mb-[60px] md:text-[20px] xl:text-[22px]"
      >
        {technology.subline}
      </p>

      {/* Products (c346910) */}
      <div
        ref={carouselRef}
        data-reveal="up"
        style={delay(150)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Our technology"
        className="mb-10 flex w-full max-w-[1400px] flex-col gap-[30px] md:mb-[60px]"
      >
        <ul
          id="technology-track"
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory gap-(--gap) overflow-x-auto overscroll-x-contain [--cols:1] [--gap:30px] [--slide:calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols))] [scrollbar-width:none] motion-safe:scroll-smooth md:[--cols:2] xl:[--cols:4] [&::-webkit-scrollbar]:hidden"
        >
          {technology.cards.map((card) => (
            <li key={card.href} className="shrink-0 basis-(--slide) snap-start">
              <TechnologyCard card={card} />
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-center gap-[15px]">
          <button
            type="button"
            aria-label="Previous technologies"
            aria-controls="technology-track"
            aria-disabled={atStart}
            onClick={() => !atStart && page(-1)}
            className={arrow(atStart)}
          >
            <ArrowLeftIcon className="size-3.5 shrink-0" />
          </button>
          <button
            type="button"
            aria-label="Next technologies"
            aria-controls="technology-track"
            aria-disabled={atEnd}
            onClick={() => !atEnd && page(1)}
            className={arrow(atEnd)}
          >
            <ArrowRightIcon className="size-3.5 shrink-0" />
          </button>
        </div>

        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </p>
      </div>

      {/* Button (9f0cc5d) */}
      <div ref={buttonRef} data-reveal="pop">
        <SmartLink
          href={technology.cta.href}
          className="inline-block rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
        >
          {technology.cta.label}
        </SmartLink>
      </div>
    </section>
  )
}

// Template 174: photo (20px radius, height from the theme's 128.25% spacer, 22% black overlay on hover), title,
// then the one line in the price row (meta type, rule underneath) and a plain "Learn More" text link.
// The link over the photo is for the mouse only (keyboard and screen reader users get the title and Learn More
// links); the photo itself stays outside it so its alt text is still read.
function TechnologyCard({ card }: { card: (typeof technology.cards)[number] }) {
  return (
    // Full slide height, with the one line taking the slack, so the rules and Learn More links line up across the row
    // when a title wraps to two lines on one card and not on the next.
    <article className="group flex h-full flex-col gap-[10px]">
      <div className="relative mb-[10px] overflow-hidden rounded-[20px] pb-[128.25%]">
        <img
          src={card.image}
          alt={card.alt}
          width={card.width}
          height={card.height}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={card.position ? { objectPosition: card.position } : undefined}
          className="absolute inset-0 size-full object-cover"
        />
        <SmartLink
          href={card.href}
          tabIndex={-1}
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[.22]"
        >
          <span className="sr-only">{card.title}</span>
        </SmartLink>
      </div>

      <h3 className="font-heading text-h5 text-secondary uppercase">
        <SmartLink href={card.href} className="transition-colors duration-300 hover:text-primary focus-visible:text-primary">
          {card.title}
        </SmartLink>
      </h3>
      <p className="mb-[5px] flex-1 border-b border-border pb-10 text-meta">{card.text}</p>
      <SmartLink
        href={card.href}
        aria-label={`Learn more about ${card.title}`}
        className="self-start text-button font-semibold text-secondary uppercase transition-colors duration-300 hover:text-primary focus-visible:text-primary"
      >
        Learn More
      </SmartLink>
    </article>
  )
}
