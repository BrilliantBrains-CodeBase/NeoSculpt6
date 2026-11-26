import { useEffect, useRef } from 'react'

// Rejuvita's vertical scroll effect (CMSMasters `Scroll` handler, cmsmasters-elementor-addon frontend.min.js, range
// "viewport", direction "default", linear timing). The element moves from +50·speed px to −50·speed px while it
// crosses the viewport: from its top reaching the bottom of the screen to its bottom leaving the top. As in the
// theme it only runs on desktop and tablet (768px and up), and not at all with reduced motion. It sets `translate`,
// not `transform`, so it composes with the [data-reveal] keyframes.
export function useParallax<T extends HTMLElement>(speed: number) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const media = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    const range = 50 * speed
    let offset = 0
    let frame = 0

    const update = () => {
      frame = 0
      if (!media.matches) {
        offset = 0
        el.style.translate = ''
        return
      }
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const top = rect.top - offset // position without our own translate
      const progress = Math.min(Math.max((vh - top) / (vh + rect.height), 0), 1)
      offset = range * (1 - 2 * progress)
      el.style.translate = `0 ${offset}px`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    media.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      media.removeEventListener('change', schedule)
      el.style.translate = ''
    }
  }, [speed])
  return ref
}
