import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

// Rejuvita `cmsmasters-marquee`: a row of items with an icon after each, scrolling left without end. The theme moves
// it by `speed × 30` px/s (speed 2 = 60px/s) and starts on page load. Copies of the row are added until they cover
// the viewport; the track then moves one copy (plus the gap) and loops. Spacing comes from two CSS variables set by
// the caller: --marquee-item-gap (between items) and --marquee-gap (between copies). Keyframe: src/styles/index.css.
// `pausable` (not in the theme) stops the row while it is hovered or focused; the row takes keyboard focus so
// keyboard users can pause it too. Give it a `label` then, as screen readers announce it on focus.

const SPEED = 60 // px per second

interface Props {
  items: string[]
  separator: ReactNode
  className?: string
  itemClassName?: string
  separatorClassName?: string
  pausable?: boolean
  label?: string
}

export function Marquee({
  items,
  separator,
  className = '',
  itemClassName = '',
  separatorClassName = '',
  pausable = false,
  label,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [copies, setCopies] = useState(2)
  const [loop, setLoop] = useState<{ distance: number; duration: number } | null>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const track = trackRef.current
    const first = track?.firstElementChild as HTMLElement | null
    if (!wrapper || !track || !first) return
    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      const distance = first.offsetWidth + gap
      if (!distance) return
      setCopies(Math.max(2, Math.ceil(wrapper.offsetWidth / distance) + 1))
      setLoop({ distance, duration: distance / SPEED })
    }
    measure()
    // Re-measure when the viewport changes and when the web fonts swap in (the row's width changes).
    const observer = new ResizeObserver(measure)
    observer.observe(wrapper)
    observer.observe(first)
    return () => observer.disconnect()
  }, [])

  const style = loop
    ? ({ '--marquee-distance': `${loop.distance}px`, '--marquee-duration': `${loop.duration}s` } as CSSProperties)
    : undefined

  return (
    <div
      ref={wrapperRef}
      tabIndex={pausable ? 0 : undefined}
      aria-label={label}
      role={label ? 'region' : undefined}
      className={`w-full overflow-hidden whitespace-nowrap ${pausable ? 'marquee-pausable outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tertiary' : ''} ${className}`}
    >
      <div ref={trackRef} style={style} className={`inline-flex items-center gap-(--marquee-gap) ${loop ? 'marquee-track' : ''}`}>
        {Array.from({ length: copies }, (_, copy) => (
          <div key={copy} aria-hidden={copy > 0 || undefined} className="inline-flex shrink-0 items-center gap-(--marquee-item-gap)">
            {items.map((item) => (
              <Fragment key={item}>
                <span className={itemClassName}>{item}</span>
                <span aria-hidden="true" className={separatorClassName}>
                  {separator}
                </span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
