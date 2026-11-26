import type { CSSProperties } from 'react'
import { artasSection } from '../../data/home'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { CameraIcon, DoctorIcon, RoboticArmIcon, ScalpIcon } from '../icons'
import { Parts, button, delay, eyebrow, h2, outlineButton } from '../shared'

// Home extra: ARTAS robotic hair restoration (content/home-page/prompts/16-artas-section.md), between the popular
// carousel and the celebrity section. Same two-column grid as HomeDoctorSpotlight, without its panel: photo left,
// eyebrow / heading / body, the four icon points (2×2 from md, stacked on phones), the buttons, then the small
// suitability note. Copy, image and the sign-off list are `artasSection` (data/home.ts). The photo is a stand-in until
// the clinic's own ARTAS photo arrives (see `artasSection.pending`).
// No top padding: the space above is the popular carousel's bottom padding.
// Breakpoints are the theme's: base = mobile (<=767, photo stacked on top), md = tablet (768-1180), xl = desktop.

// The primary label is long: it may wrap up to xl (at tablet width the text column is narrower than it), so the
// shared button's md:whitespace-nowrap becomes xl:.
const primaryButton = button.replace('md:whitespace-nowrap', 'xl:whitespace-nowrap')

const icons = { camera: CameraIcon, 'robotic-arm': RoboticArmIcon, scalp: ScalpIcon, doctor: DoctorIcon }

export function HomeArtas() {
  const { open: openBooking } = useBooking()
  const imageRef = useReveal<HTMLDivElement>()
  const textRef = useReveal<HTMLDivElement>()
  const listRef = useReveal<HTMLUListElement>()
  const ctaRef = useReveal<HTMLDivElement>()
  const { image } = artasSection

  return (
    <section
      id={artasSection.id}
      aria-labelledby="artas-heading"
      className="px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10 xl:pb-[150px]"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] xl:grid-cols-[minmax(0,44fr)_minmax(0,56fr)] xl:gap-20">
        {/* Photo: 4:5 on mobile; from md it fills the column's height. */}
        <div ref={imageRef} data-reveal="up" className="relative aspect-[4/5] w-full md:aspect-auto md:min-h-[460px]">
          <img
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full rounded-[24px] object-cover"
          />
        </div>

        <div className="flex flex-col items-start justify-center gap-[25px]">
          <div ref={textRef} data-reveal="up" style={delay(150)} className="flex flex-col items-start gap-[25px]">
            <p className={eyebrow}>{artasSection.eyebrow}</p>
            <h2 id="artas-heading" className={h2}>
              <Parts parts={artasSection.h2} />
            </h2>
            <p>{artasSection.body}</p>
          </div>

          <ul ref={listRef} data-reveal-stagger="" className="mt-[5px] grid w-full grid-cols-1 gap-x-10 gap-y-[25px] md:grid-cols-2">
            {artasSection.points.map((point, i) => {
              const Icon = icons[point.icon]
              return (
                <li key={point.label} style={{ '--i': i } as CSSProperties} className="flex gap-[15px]">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-tertiary/40 text-tertiary">
                    <Icon className="size-6 shrink-0" />
                  </span>
                  <span>
                    <span className="block text-secondary">{point.label}</span>
                    <span className="block text-small text-text/80">{point.text}</span>
                  </span>
                </li>
              )
            })}
          </ul>

          <div ref={ctaRef} data-reveal="up" style={delay(150)} className="mt-[5px] flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-4">
              <SmartLink href={artasSection.primary.href} className={primaryButton}>
                {artasSection.primary.label}
                <span aria-hidden="true"> →</span>
              </SmartLink>
              <button type="button" onClick={openBooking} className={outlineButton}>
                {artasSection.bookingLabel}
              </button>
            </div>
            <p className="text-small text-text/70">{artasSection.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
