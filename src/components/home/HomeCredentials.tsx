import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type TransitionEvent } from 'react'
import { credentials } from '../../data/home'
import { useReveal } from '../useReveal'

// Home section 3: Rejuvita credentials strip (rejuvita-scrape/pages/home, container 862578e: heading 673d05f, image
// carousel f477042; styles from elementor/css/post-39758.css and elementor/assets/css/widget-image-carousel.min.css).
// In the theme it is the bottom row of the About section (9652eff), so HomeAbout renders it under its own row and the
// two share one background.
// The theme's Swiper settings: infinite loop, 6 / 4 / 2 per view, 70 / 40 / 20px gap, autoplay with a 1000ms delay
// after each move, speed 3500ms, pause on hover, stop for good once the user swipes (pause_on_interaction); no arrows
// or dots. Slides are centred and the logos keep their natural size. Rebuilt here without Swiper, the same way as
// HomePopular: three copies of the logos (the middle one is real; the clones are aria-hidden and inert), and an
// unanimated jump back a copy when a move ends outside the middle.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const DELAY = 1000 // ms, the theme's autoplay_speed: the pause between moves
const SPEED = 3500 // ms, the theme's speed: how long one move takes
const SHORT_SWIPE = 300 // ms; a flick shorter than this moves one logo whatever its distance (Swiper's short swipe)

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
type Logo = (typeof credentials.logos)[number]

// The carousel shows 6 logos per view on desktop; with fewer, the loop would show the same logo twice side by side,
// so a shorter list is a static, centred row instead.
const CAROUSEL_MIN = 6

// `label` and `logos` default to the home strip; the About page passes its own label and only the confirmed logos.
export function HomeCredentials({ label = credentials.label, logos = credentials.logos }: { label?: string; logos?: Logo[] }) {
  const labelRef = useReveal<HTMLParagraphElement>()
  const carousel = logos.length >= CAROUSEL_MIN

  return (
    <div className="flex flex-col gap-5 md:gap-[30px]">
      <p
        id="credentials-label"
        ref={labelRef}
        data-reveal="right"
        className={`text-center max-md:text-left text-h6 font-medium text-text uppercase ${carousel ? 'md:text-left' : ''}`}
      >
        {label}
      </p>
      {carousel ? <LogoCarousel logos={logos} /> : <LogoRow logos={logos} />}
    </div>
  )
}

function LogoImage({ logo }: { logo: Logo }) {
  return (
    <img
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={logo.name}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="inline-block h-auto max-w-full"
    />
  )
}

function LogoRow({ logos }: { logos: Logo[] }) {
  const ref = useReveal<HTMLUListElement>()
  return (
    <ul
      ref={ref}
      data-reveal="up"
      style={delay(100)}
      aria-labelledby="credentials-label"
      className="flex flex-wrap items-center justify-center max-md:justify-start gap-x-10 gap-y-5 md:gap-x-[70px]"
    >
      {logos.map((logo) => (
        <li key={logo.src} className="max-w-[calc(50%-20px)] text-center max-md:text-left md:max-w-none">
          <LogoImage logo={logo} />
        </li>
      ))}
    </ul>
  )
}

function LogoCarousel({ logos }: { logos: Logo[] }) {
  const count = logos.length
  // Keeps an index inside the middle copy.
  const wrap = (i: number) => count + ((((i - count) % count) + count) % count)
  const sliderRef = useReveal<HTMLDivElement>()
  const trackRef = useRef<HTMLUListElement>(null)

  const [index, setIndex] = useState(count)
  const [animate, setAnimate] = useState(true)
  const [moving, setMoving] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const drag = useRef<{ id: number; x: number; t: number; dx: number; active: boolean } | null>(null)

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

  // Autoplay: wait 1s, move one logo over 3.5s, repeat. Held while hovered, dragged or the tab is hidden; off for
  // good after a swipe.
  const paused = hovered || dragging || hidden || stopped || reducedMotion
  useEffect(() => {
    if (paused || moving) return
    const timer = setTimeout(() => {
      setMoving(true)
      setIndex((i) => i + 1)
    }, DELAY)
    return () => clearTimeout(timer)
  }, [paused, moving])

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
    setMoving(false)
    if (index === wrap(index)) return
    setAnimate(false)
    setIndex(wrap(index))
  }

  // Mouse drag and touch swipe. The pointer is captured only once it has moved.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
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
      setStopped(true)
    }
    if (d.active) setDragX(d.dx)
  }
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    if (!d.active) return
    setDragging(false)
    setDragX(0)
    const first = trackRef.current?.firstElementChild as HTMLElement | null
    const gap = trackRef.current ? parseFloat(getComputedStyle(trackRef.current).columnGap) || 0 : 0
    const step = (first?.offsetWidth ?? 1) + gap
    let moves = Math.round(-d.dx / step)
    if (moves === 0 && performance.now() - d.t < SHORT_SWIPE && Math.abs(d.dx) > 10) moves = d.dx < 0 ? 1 : -1
    moves = Math.max(-(count - 1), Math.min(count - 1, moves))
    if (moves) setIndex((i) => i + moves)
  }

  const trackStyle = {
    transform: `translateX(calc(${-index} * (var(--slide) + var(--gap)) + ${dragX}px))`,
    // Swiper's wrapper transition (timing function `initial` = ease). Off while dragging and for the loop jump.
    transition: animate && !dragging ? `transform ${SPEED}ms ease` : 'none',
  } as CSSProperties

  return (
    <>
      {/* Carousel (f477042) */}
      <div
        ref={sliderRef}
        data-reveal="up"
        style={delay(100)}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby="credentials-label"
        // Mouse only: a tap on a touch screen fires mouseenter with no mouseleave, which would pause autoplay for good.
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onDragStart={(e) => e.preventDefault()}
        className={`w-full touch-pan-y overflow-x-clip select-none ${dragging ? 'cursor-grabbing' : ''}`}
      >
        <ul
          ref={trackRef}
          style={trackStyle}
          onTransitionEnd={onTransitionEnd}
          className="flex items-center gap-(--gap) [--cols:2] [--gap:20px] [--slide:calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols))] md:[--cols:4] md:[--gap:40px] xl:[--cols:6] xl:[--gap:70px]"
        >
          {[0, 1, 2].flatMap((copy) =>
            logos.map((logo) => {
              const clone = copy !== 1
              return (
                <li
                  key={`${copy}-${logo.src}`}
                  aria-hidden={clone || undefined}
                  // React 18 has no `inert` prop; the empty string sets the attribute.
                  {...(clone ? { inert: '' } : {})}
                  className="shrink-0 basis-(--slide) text-center max-md:text-left"
                >
                  <LogoImage logo={logo} />
                </li>
              )
            }),
          )}
        </ul>
      </div>
    </>
  )
}
