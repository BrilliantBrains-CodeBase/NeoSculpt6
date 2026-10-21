import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type TransitionEvent,
} from 'react'
import { popular } from '../../data/home'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'

// Home section 5: Rejuvita "Our popular treatments" (rejuvita-scrape/pages/home, container f873acc: highlight title
// 89c1bf4, blog slider aed8552, button 8d459a8; styles from elementor/css/post-39758.css). Each card is the theme's
// entry template 107 (container 155d2fa7; elementor/css/post-107.css).
// The theme's Swiper settings: carousel, centred slides, infinite loop, 4 / 2 / 1 per view, 40px gap (30px tablet and
// mobile, 80px from 1601px), autoplay 5000ms, speed 500ms, pause on hover; no arrows, dots or scrollbar. Rebuilt here
// without Swiper: the track holds three copies of the cards (the middle one is real; the clones are aria-hidden and
// inert) and jumps back a copy, unanimated, when a move ends outside the middle. Slide width and the centring offset
// are CSS, so the prerendered HTML already shows the first card centred with its neighbours peeking.
// As in the theme, the section has no top padding: the space above the title is the bottom padding of section 4
// (HomePillars).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const COUNT = popular.cards.length
const AUTOPLAY = 5000 // ms, the theme's slider_autoplay_speed
const SPEED = 500 // ms, the theme's slider_speed
const SHORT_SWIPE = 300 // ms; a flick shorter than this moves one card whatever its distance (Swiper's short swipe)

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
// Keeps an index inside the middle copy.
const wrap = (i: number) => COUNT + ((((i - COUNT) % COUNT) + COUNT) % COUNT)

export function HomePopular() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const sliderRef = useReveal<HTMLDivElement>()
  const buttonRef = useReveal<HTMLDivElement>()
  const trackRef = useRef<HTMLUListElement>(null)

  const [index, setIndex] = useState(COUNT)
  const [animate, setAnimate] = useState(true)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const drag = useRef<{ id: number; x: number; t: number; dx: number; active: boolean } | null>(null)
  const dragged = useRef(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    const visibility = () => setHidden(document.hidden)
    update()
    media.addEventListener('change', update)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      media.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  // Autoplay: one card every 5s, held while the carousel is hovered, focused, dragged or the tab is hidden.
  const paused = hovered || focused || dragging || hidden || reducedMotion
  useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => setIndex((i) => i + 1), AUTOPLAY)
    return () => clearTimeout(timer)
  }, [index, paused])

  // After an unanimated jump, turn the transition back on once the new position has been painted.
  useEffect(() => {
    if (animate) return
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setAnimate(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [animate])

  const onTransitionEnd = (e: TransitionEvent<HTMLUListElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
    if (index === wrap(index)) return
    setAnimate(false)
    setIndex(wrap(index))
  }

  // Mouse drag and touch swipe. The pointer is captured only once it has moved, so a tap still follows the link.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragged.current = false
    drag.current = { id: e.pointerId, x: e.clientX, t: performance.now(), dx: 0, active: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    d.dx = e.clientX - d.x
    if (!d.active && Math.abs(d.dx) > 5) {
      d.active = true
      e.currentTarget.setPointerCapture(e.pointerId)
      setDragging(true)
    }
    if (d.active) setDragX(d.dx)
  }
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (!d.active) return
    dragged.current = true
    setDragging(false)
    setDragX(0)
    const first = trackRef.current?.firstElementChild as HTMLElement | null
    const gap = trackRef.current ? parseFloat(getComputedStyle(trackRef.current).columnGap) || 0 : 0
    const step = (first?.offsetWidth ?? 1) + gap
    let moves = Math.round(-d.dx / step)
    if (moves === 0 && performance.now() - d.t < SHORT_SWIPE && Math.abs(d.dx) > 10) moves = d.dx < 0 ? 1 : -1
    moves = Math.max(-(COUNT - 1), Math.min(COUNT - 1, moves))
    if (moves) setIndex((i) => i + moves)
  }

  // Keyboard: a focused card slides to the centre, so focus never sits on a card that is off screen. Mouse focus
  // (pressing a link, maybe to drag) is ignored.
  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (!target.matches(':focus-visible')) return
    setFocused(true)
    const slide = target.closest<HTMLElement>('[data-slide]')
    if (slide) setIndex(Number(slide.dataset.slide))
  }
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
  }

  const trackStyle = {
    transform: `translateX(calc(50% - var(--slide) / 2 - ${index} * (var(--slide) + var(--gap)) + ${dragX}px))`,
    // Swiper's wrapper transition (timing function `initial` = ease). Off while dragging and for the loop jump.
    transition: animate && !dragging ? `transform ${SPEED}ms ease` : 'none',
  } as CSSProperties

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
        // Mouse only: a tap on a touch screen fires mouseenter with no mouseleave, which would pause autoplay for good.
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
        onFocus={onFocus}
        onBlur={onBlur}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={(e) => {
          if (!dragged.current) return
          dragged.current = false
          e.preventDefault()
          e.stopPropagation()
        }}
        onDragStart={(e) => e.preventDefault()}
        // overflow-x: clip (not hidden) so the browser cannot scroll the row when a card link takes focus.
        className={`w-full touch-pan-y overflow-x-clip select-none ${dragging ? 'cursor-grabbing' : ''}`}
      >
        <ul
          ref={trackRef}
          style={trackStyle}
          onTransitionEnd={onTransitionEnd}
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
