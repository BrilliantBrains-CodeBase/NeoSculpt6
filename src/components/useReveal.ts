import { useEffect, useRef } from 'react'

// Adds `is-revealed` to the element the first time it scrolls into view, which starts the
// fade-in defined for [data-reveal] / [data-reveal-stagger] in src/styles/index.css. `onReveal` runs once at that
// moment (the stats counters start counting there).
export function useReveal<T extends HTMLElement>(onReveal?: () => void) {
  const ref = useRef<T>(null)
  const callback = useRef(onReveal)
  callback.current = onReveal
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-revealed')
      callback.current?.()
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-revealed')
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
