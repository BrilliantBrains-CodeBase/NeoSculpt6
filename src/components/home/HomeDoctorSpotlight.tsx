import type { CSSProperties } from 'react'
import { founder } from '../../data/about'
import { doctorSpotlight } from '../../data/home'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { TickIcon } from '../icons'
import { Parts, button, delay, eyebrow, h2, outlineButton } from '../shared'

// Home extra A: Dr Sandeep spotlight (content/home-page/prompts/04-doctor-spotlight-before-popular-treatments.md),
// between the pillars and the popular carousel. A two-column doctor profile: portrait left, text right, on an
// `alternate` panel (the dark stand-in for the reference's white card). Copy, checklist, portrait and profile link are
// the About page's `founder` (data/about.ts), with the same checklist markup as AboutFounder; home-only bits and the
// sign-off list are `doctorSpotlight` (data/home.ts). The later Meet Your Doctors section (id="our-doctors") stays as
// the compact team cards.
// No top padding: the space above is the pillars' bottom padding. The bottom padding is the space above the popular
// title, which has none of its own.
// Breakpoints are the theme's: base = mobile (<=767, portrait stacked on top), md = tablet (768-1180, two columns with a
// narrower portrait), xl = desktop.

export function HomeDoctorSpotlight() {
  const { open: openBooking } = useBooking()
  const imageRef = useReveal<HTMLDivElement>()
  const textRef = useReveal<HTMLDivElement>()
  const listRef = useReveal<HTMLUListElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  return (
    <section
      id={doctorSpotlight.id}
      aria-labelledby="spotlight-heading"
      className="px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10 xl:pb-[150px]"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 rounded-[20px] border border-border bg-alternate p-5 md:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] md:p-10 xl:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] xl:gap-20 xl:p-[60px]">
        {/* Portrait: 4:5 on mobile; from md it fills the column's height, cropped from the top so the face stays in. */}
        <div ref={imageRef} data-reveal="up" className="relative aspect-[4/5] w-full md:aspect-auto md:min-h-[460px]">
          <img
            src={founder.portrait.src}
            width={founder.portrait.width}
            height={founder.portrait.height}
            alt={founder.portrait.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full rounded-[24px] object-cover object-[50%_15%]"
          />
        </div>

        <div className="flex flex-col items-start justify-center gap-[25px]">
          <div ref={textRef} data-reveal="up" style={delay(150)} className="flex flex-col items-start gap-[25px]">
            <p className={eyebrow}>{founder.eyebrow}</p>
            <h2 id="spotlight-heading" className={h2}>
              <Parts parts={founder.h2} />
            </h2>
            <p className="text-primary">{founder.title}</p>
            <p>{founder.text}</p>
            {doctorSpotlight.experience.approved && <p className="text-secondary">{doctorSpotlight.experience.text}</p>}
          </div>

          <ul ref={listRef} data-reveal-stagger="" aria-label="Education and training" className="flex flex-col gap-[15px]">
            {founder.checklist.map((item, i) => (
              <li key={item.title} style={{ '--i': i } as CSSProperties} className="flex gap-[15px]">
                <TickIcon className="mt-1 size-4 shrink-0 text-tertiary" />
                <span>
                  <span className="text-secondary">{item.title}</span>
                  <span className="block text-small text-text/80">{item.place}</span>
                </span>
              </li>
            ))}
          </ul>

          <div ref={ctaRef} data-reveal="up" style={delay(150)} className="mt-[5px] flex flex-wrap gap-4">
            <SmartLink href={founder.cta.href} className={button}>
              {founder.cta.label}
            </SmartLink>
            <button type="button" onClick={openBooking} className={outlineButton}>
              {doctorSpotlight.bookingLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
