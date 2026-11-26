import { useEffect, useState } from 'react'

// Keeps a closing panel mounted for `ms` so it can animate out. `shown` flips one frame after mount so the
// entry transition runs. Both are false on the server, so closed panels never reach the prerendered HTML.
export function usePresence(open: boolean, ms: number) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
      return () => cancelAnimationFrame(raf)
    }
    setShown(false)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = window.setTimeout(() => setMounted(false), reduce ? 0 : ms)
    return () => window.clearTimeout(t)
  }, [open, ms])

  return { mounted, shown }
}
