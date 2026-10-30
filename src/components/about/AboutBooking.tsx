import { booking } from '../../data/about'
import { useReveal } from '../useReveal'
import { BookingForm } from '../booking/BookingForm'
import { Parts, delay, eyebrow } from '../shared'

// About section 6: Rejuvita "Schedule your visit online" (rejuvita-scrape/pages/about-us: a centred `alternate` card
// with eyebrow, title and the appointment form; no photo, unlike the home booking block). The form is the shared
// BookingForm, so the fields, validation, WhatsApp hand-off and its honest status line are the same as everywhere
// else (nothing is booked until the clinic confirms). Copy: about-us.md §6, in data/about.ts.
// id="book-consultation" is an in-page target for booking links, as on the home page.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function AboutBooking() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const formRef = useReveal<HTMLDivElement>()

  return (
    <section id="book-consultation" aria-labelledby="book-consultation-heading" className="px-5 py-20 md:px-[30px] md:py-[100px] xl:px-10 xl:py-[150px]">
      <div className="mx-auto flex w-full max-w-[940px] flex-col items-center max-md:items-start gap-5 rounded-[20px] bg-alternate px-5 py-[60px] md:px-[60px] md:py-20 xl:px-20">
        <p ref={eyebrowRef} data-reveal="up" className={`${eyebrow} text-center max-md:text-left`}>
          {booking.eyebrow}
        </p>
        <h2
          id="book-consultation-heading"
          ref={titleRef}
          data-reveal="up"
          style={delay(150)}
          className="mb-5 text-center max-md:text-left font-heading text-h3 text-secondary uppercase text-balance md:mb-10"
        >
          {booking.h2.map((line, i) => (
            <span key={i} className="block">
              <Parts parts={line} />
            </span>
          ))}
        </h2>
        <div ref={formRef} data-reveal="up" style={delay(300)} className="w-full">
          <BookingForm />
        </div>
      </div>
    </section>
  )
}
