import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type TransitionEvent,
} from 'react'

// Infinite, centred carousel in the style of the theme's Swiper sliders (carousel, centredSlides, loop, one slide
// per move, autoplay with pause on hover), without Swiper. Used by HomePopular and HomeTestimonials.
//
// The track holds three copies of the slides: the middle copy is real, the other two are clones (render them
// aria-hidden and inert). When a move ends outside the middle copy, the track jumps back one copy, unanimated.
// Slide width and the centring offset are CSS (the track needs --slide and --gap), so the prerendered HTML already
// shows the first slide centred with its neighbours peeking.
//
// Autoplay pauses while the slider is hovered (mouse only), keyboard focus is inside it, it is being dragged, the
// tab is hidden, the user turned it off (`userPaused`), or the visitor prefers reduced motion. Reduced motion also
// turns the slide transition off.

const SHORT_SWIPE = 300 // ms; a flick shorter than this moves one slide whatever its distance (Swiper's short swipe)

type Options = {
  count: number
  autoplay?: number // ms between moves, the theme's slider_autoplay_speed
  speed?: number // ms per move, the theme's slider_speed
  userPaused?: boolean
  // 'center' (the theme's centredSlides) puts the current slide in the middle; 'start' puts it at the left edge, so a
  // row of whole cards opens on the first one (the service technology cards).
  align?: 'center' | 'start'
}

export function useLoopCarousel({ count, autoplay = 5000, speed = 500, userPaused = false, align = 'center' }: Options) {
  // Keeps an index inside the middle copy.
  const wrap = useCallback((i: number) => count + ((((i - count) % count) + count) % count), [count])
  // Moves never leave the clones, even when buttons are pressed faster than a move takes.
  const clamp = useCallback((i: number) => Math.max(1, Math.min(3 * count - 2, i)), [count])

  const trackRef = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(count)
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

  const paused = hovered || focused || dragging || hidden || reducedMotion || userPaused
  useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => setIndex((i) => clamp(i + 1)), autoplay)
    return () => clearTimeout(timer)
  }, [index, paused, autoplay, clamp])

  // After an unanimated jump, turn the transition back on once the new position has been painted.
  useEffect(() => {
    if (animate) return
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setAnimate(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [animate])

  // With no transition there is no transitionend, so jump back to the middle copy straight away.
  useEffect(() => {
    if (!reducedMotion || dragging || index === wrap(index)) return
    setAnimate(false)
    setIndex(wrap(index))
  }, [index, reducedMotion, dragging, wrap])

  const onTransitionEnd = (e: TransitionEvent<HTMLUListElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
    if (index === wrap(index)) return
    setAnimate(false)
    setIndex(wrap(index))
  }

  const activeIndex = wrap(index) - count
  const move = useCallback((by: number) => setIndex((i) => clamp(i + by)), [clamp])
  const next = useCallback(() => move(1), [move])
  const prev = useCallback(() => move(-1), [move])
  // Goes to a real slide (0..count-1) the short way round.
  const goTo = useCallback(
    (target: number) => {
      let delta = (((target - activeIndex) % count) + count) % count
      if (delta > count / 2) delta -= count
      if (delta) move(delta)
    },
    [activeIndex, count, move],
  )

  // Mouse drag and touch swipe. The pointer is captured only once it has moved, so a tap still follows a link.
  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragged.current = false
    drag.current = { id: e.pointerId, x: e.clientX, t: performance.now(), dx: 0, active: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
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
  const onPointerEnd = (e: PointerEvent<HTMLElement>) => {
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
    moves = Math.max(-(count - 1), Math.min(count - 1, moves))
    if (moves) move(moves)
  }

  // Keyboard focus (not mouse focus, which may be the start of a drag) holds autoplay, and a focused slide slides to
  // the centre (or the left edge) so focus never sits off screen. Put these on the element that wraps the slider and its controls.
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    const target = e.target as HTMLElement
    if (!target.matches(':focus-visible')) return
    setFocused(true)
    const slide = target.closest<HTMLElement>('[data-slide]')
    if (slide) setIndex(Number(slide.dataset.slide))
  }
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
  }
  // Left/Right arrows move one slide.
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    if (e.key === 'ArrowLeft') prev()
    else next()
  }

  const trackStyle = {
    transform: `translateX(calc(${align === 'center' ? '50% - var(--slide) / 2 - ' : '-1 * '}${index} * (var(--slide) + var(--gap)) + ${dragX}px))`,
    // Swiper's wrapper transition (timing function `initial` = ease). Off while dragging, for the loop jump and for
    // reduced motion.
    transition: animate && !dragging && !reducedMotion ? `transform ${speed}ms ease` : 'none',
  } as CSSProperties

  return {
    activeIndex,
    dragging,
    reducedMotion,
    next,
    prev,
    goTo,
    // Spread on the element that clips the track.
    viewportProps: {
      // Mouse only: a tap on a touch screen fires pointerenter with no pointerleave, which would pause for good.
      onPointerEnter: (e: PointerEvent<HTMLElement>) => e.pointerType === 'mouse' && setHovered(true),
      onPointerLeave: (e: PointerEvent<HTMLElement>) => e.pointerType === 'mouse' && setHovered(false),
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onClickCapture: (e: MouseEvent<HTMLElement>) => {
        if (!dragged.current) return
        dragged.current = false
        e.preventDefault()
        e.stopPropagation()
      },
      onDragStart: (e: MouseEvent<HTMLElement>) => e.preventDefault(),
    },
    // Spread on the element around the slider (and its controls, if any).
    focusProps: { onFocus, onBlur },
    keyProps: { onKeyDown },
    // Spread on the track (<ul>).
    trackProps: { ref: trackRef, style: trackStyle, onTransitionEnd },
  }
}
