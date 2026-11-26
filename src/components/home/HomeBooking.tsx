import type { CSSProperties } from 'react'
import { booking } from '../../data/home'
import { useReveal } from '../useReveal'
import { BookingForm } from '../booking/BookingForm'

// Home section 12: Rejuvita "Begin Your Transformation" appointment block (rejuvita-scrape/pages/home, container
// a7c25b6: photo column 953a709 and form column f5d9017; styles from elementor/css/post-39758.css). The form is
// the shared BookingForm (also used by the "Book a Consultation" popup). Copy: homepage.md §12, in data/home.ts.
// Theme layout: desktop = photo left, form right, 50/50, min-height 700; tablet = form above the photo
// (column-reverse) with a rounded form panel; mobile = no photo, 20px side padding.
// id="book-consultation" is an in-page target for booking links.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomeBooking() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  const formRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="book-consultation"
      aria-labelledby="booking-heading"
      className="mb-20 flex flex-col-reverse px-5 md:mb-[100px] md:px-0 xl:mb-[150px] xl:min-h-[700px] xl:flex-row"
    >
      {/* Photo column (953a709): hidden on phones, 600px tall under the form on tablet. */}
      <div className="hidden md:block md:h-[600px] xl:h-auto xl:w-1/2">
        <img
          src={booking.image.src}
          alt={booking.image.alt}
          width={booking.image.width}
          height={booking.image.height}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      </div>

      {/* Form column (f5d9017): `alternate` with the theme's background photo and a top-left vignette. */}
      <div
        style={{ backgroundImage: 'url(/images/home/stats-bg.webp)' }}
        className="relative isolate flex min-w-0 flex-col items-center max-md:items-start justify-center gap-5 overflow-hidden rounded-[20px] bg-alternate bg-cover bg-center bg-no-repeat px-5 py-20 md:px-[30px] xl:w-1/2 xl:rounded-none xl:px-20 xl:py-[150px]"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(at_top_left,#0b0b0d00_0%,#0b0b0d_40%)] opacity-80" />
        <h2
          id="booking-heading"
          ref={titleRef}
          data-reveal="up"
          style={delay(150)}
          className="w-full max-w-[660px] text-center max-md:text-left font-heading text-h3 text-secondary uppercase text-balance"
        >
          {booking.h2.map((line, i) => (
            <span key={i} className="block">
              {line.map((part) => (
                <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                  {part.text}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p
          ref={textRef}
          data-reveal="up"
          style={delay(300)}
          className="mb-5 w-full max-w-[660px] text-center max-md:text-left font-accent-serif text-[18px] leading-[1.35] text-secondary italic md:text-[20px] xl:mb-10 xl:text-[22px]"
        >
          {booking.subline}
        </p>
        <div ref={formRef} data-reveal="up" style={delay(450)} className="w-full max-w-[660px]">
          <BookingForm source="home-booking" />
        </div>
      </div>
    </section>
  )
}
