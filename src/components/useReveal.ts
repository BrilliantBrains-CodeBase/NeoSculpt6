import { useEffect, useRef } from 'react'

// Adds `data-revealed` to the element the first time it scrolls into view, which starts the
// fade-in defined for [data-reveal] / [data-reveal-stagger] in src/styles/index.css. An attribute, not a class: React
// rewrites `className` whenever it changes (a carousel adding `cursor-grabbing` mid-drag), which would drop a class
// added here and hide the element again. `onReveal` runs once at that
// moment (the stats counters start counting there).
export function useReveal<T extends HTMLElement>(onReveal?: () => void) {
  const ref = useRef<T>(null)
  const callback = useRef(onReveal)
  callback.current = onReveal
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.setAttribute('data-revealed', '')
      callback.current?.()
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.setAttribute('data-revealed', '')
        observer.disconnect()
        callback.current?.()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}
