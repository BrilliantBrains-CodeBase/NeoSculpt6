import type { ReactNode } from 'react'
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon } from './icons'

// Previous / dots / next (and an optional autoplay toggle) under a useLoopCarousel slider, plus the polite live region
// that announces moves the visitor made. Not in the theme; added for accessibility. Used by the testimonials
// (HomeTestimonials, also on the About page) and the About services carousel. The dots keep the theme's Swiper bullet
// look on a 24px pitch so each one is a full-size target; `aria-current` marks the slide on show.
// `noun` names a slide in the labels ("Previous review", "Show review 2 of 5: …"); `labels` adds each slide's name.

export const carouselControl =
  'outline-offset-4 outline-tertiary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-solid'

interface Props {
  noun: string
  labels: string[]
  activeIndex: number
  onShow: (index: number) => void
  /** id of the track the buttons move. */
  controls: string
  announcement: string
  /** Autoplay toggle; leave out when the slider has no autoplay (or the visitor prefers reduced motion). */
  pause?: { paused: boolean; toggle: () => void } | null
  className?: string
}

export function CarouselControls({ noun, labels, activeIndex, onShow, controls, announcement, pause, className = '' }: Props) {
  const count = labels.length
  const arrow = (label: string, onClick: () => void, icon: ReactNode) => (
    <button
      type="button"
      aria-label={label}
      aria-controls={controls}
      onClick={onClick}
      className={`flex size-10 items-center justify-center rounded-full border border-tertiary/40 text-secondary hover:border-tertiary hover:text-tertiary ${carouselControl}`}
    >
      {icon}
    </button>
  )

  return (
    <>
      <div className={`flex items-center justify-center gap-5 ${className}`}>
        {arrow(`Previous ${noun}`, () => onShow(activeIndex - 1), <ArrowLeftIcon className="size-3.5 shrink-0" />)}

        <div className="flex items-center">
          {labels.map((label, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show ${noun} ${i + 1} of ${count}${label ? `: ${label}` : ''}`}
              aria-current={i === activeIndex ? 'true' : undefined}
              aria-controls={controls}
              onClick={() => onShow(i)}
              className={`group flex size-6 items-center justify-center rounded-full ${carouselControl}`}
            >
              <span
                className={`size-[9px] rounded-full border transition-colors duration-250 ${
                  i === activeIndex
                    ? 'border-tertiary bg-tertiary'
                    : 'border-tertiary/40 bg-transparent group-hover:border-tertiary group-hover:bg-tertiary'
                }`}
              />
            </button>
          ))}
        </div>

        {arrow(`Next ${noun}`, () => onShow(activeIndex + 1), <ArrowRightIcon className="size-3.5 shrink-0" />)}

        {pause && (
          <button
            type="button"
            aria-label={pause.paused ? `Start automatic ${noun} rotation` : `Stop automatic ${noun} rotation`}
            onClick={pause.toggle}
            className={`flex size-10 items-center justify-center rounded-full text-text/80 hover:text-tertiary ${carouselControl}`}
          >
            {pause.paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>

      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>
    </>
  )
}
