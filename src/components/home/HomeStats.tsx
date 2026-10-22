import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { stats } from '../../data/home'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'

// Home stats counters, directly under the hero: Rejuvita counter row (rejuvita-scrape/pages/home, container 8dcdccf with counters ed21b60, e281254,
// f2cbdf8, 6e7d1d2; styles from elementor/css/post-39758.css and elementor/assets/css/widget-counter.min.css).
// In the theme this row is the bottom of the Philosophy section (eba6704); here it stands alone under the hero, with
// that section's background, overlay and padding.
// Bottom padding is trimmed (80/60/40px) because the About section follows on a matching background.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const DURATION = 2000 // ms, the theme's data-duration
// jQuery numerator's default `swing` easing, which Elementor's counter uses.
const swing = (p: number) => 0.5 - Math.cos(p * Math.PI) / 2

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomeStats() {
  return (
    <section
      aria-label="NeoSculpt6 in numbers"
      style={{ backgroundImage: 'url(/images/home/stats-bg.webp)' }}
      className="relative isolate bg-cover bg-center bg-no-repeat px-5 pt-20 pb-10 md:px-[30px] md:pt-[100px] md:pb-[60px] xl:px-10 xl:pt-[150px] xl:pb-20"
    >
      {/* Theme overlay: radial vignette to `alternate` from 40%, 80% opacity. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(at_center,#0b0b0d00_0%,#0b0b0d_40%)] opacity-80" />

      <div className="mx-auto w-full max-w-[1400px]">
        <dl className="flex flex-wrap gap-[25px] md:gap-[35px] xl:flex-nowrap xl:justify-between">
          {stats.items.map((item, i) => (
            <StatCounter key={item.label} {...item} index={i} />
          ))}
        </dl>
        <p className="mt-[50px] text-center text-small text-text/70">{stats.note}</p>
      </div>
    </section>
  )
}

interface CounterProps {
  value: number
  prefix?: string
  suffix?: string
  label: string
  /** Links the label to a page (the About page's "Patients from Outside India"). */
  href?: string
  index: number
  className?: string
}

// Elementor `counter`: label below the number (flex column-reverse), digits centred with the prefix and suffix
// hanging either side. Counts from 0 when it scrolls into view. The state starts at the final value, so the
// prerendered HTML has the real numbers. Also used by the About page's two rows of four (AboutNumbers), which sets its
// own widths through `className`.
export function StatCounter({
  value,
  prefix = '',
  suffix = '',
  label,
  href,
  index,
  className = 'w-full md:w-[calc(50%-20px)] xl:w-auto',
}: CounterProps) {
  const decimals = value.toString().split('.')[1]?.length ?? 0
  const format = (n: number) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n)
  const [display, setDisplay] = useState(() => format(value))
  const frame = useRef(0)
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const ref = useReveal<HTMLDivElement>(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1)
      setDisplay(format(value * swing(p)))
      if (p < 1) frame.current = requestAnimationFrame(tick)
    }
    setDisplay(format(0))
    frame.current = requestAnimationFrame(tick)
  })

  return (
    <div
      ref={ref}
      data-reveal="pop"
      style={delay(index * 100)}
      className={`flex flex-col-reverse ${className}`}
    >
      <dt className="flex justify-center font-heading text-[19px] leading-[2.5] text-secondary">
        {href ? (
          <SmartLink
            href={href}
            className="underline decoration-tertiary/50 underline-offset-[6px] transition-colors duration-300 hover:text-tertiary focus-visible:text-tertiary"
          >
            {label}
          </SmartLink>
        ) : (
          label
        )}
      </dt>
      <dd className="flex font-heading text-h3 text-secondary uppercase">
        <span className="sr-only">
          {prefix}
          {format(value)}
          {suffix}
        </span>
        <span aria-hidden="true" className="grow text-end whitespace-pre-wrap">
          {prefix}
        </span>
        <span aria-hidden="true">{display}</span>
        <span aria-hidden="true" className="grow text-start whitespace-pre-wrap">
          {suffix}
        </span>
      </dd>
    </div>
  )
}
