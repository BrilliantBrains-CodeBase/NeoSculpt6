import { booking } from '../../data/home'
import { bookingEyebrow } from '../../data/contact'
import { useReveal } from '../useReveal'
import { BookingForm } from '../booking/BookingForm'
import { Parts, delay, eyebrow, italicLine } from '../shared'

// Contact section 4: "Schedule your visit online", the same centred `alternate` card as the About booking section
// (AboutBooking), with the home booking heading and subline (homepage.md section 12, `booking` in data/home.ts). The
// form is the shared BookingForm: same fields, validation, WhatsApp hand-off and honest status line as everywhere
// else (nothing is booked until the clinic confirms; no file uploads). id="book-consultation" is the target of the
// page's "Request a Consultation" buttons.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ContactBooking() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const formRef = useReveal<HTMLDivElement>()

  return (
    <section id="book-consultation" aria-labelledby="book-consultation-heading" className="px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10 xl:pb-[150px]">
      <div className="mx-auto flex w-full max-w-[940px] flex-col items-center gap-5 rounded-[20px] bg-alternate px-5 py-[60px] md:px-[60px] md:py-20 xl:px-20">
        <p ref={eyebrowRef} data-reveal="up" className={`${eyebrow} text-center`}>
          {bookingEyebrow}
        </p>
        <h2
          id="book-consultation-heading"
          ref={titleRef}
          data-reveal="up"
          style={delay(150)}
          className="text-center font-heading text-h3 text-secondary uppercase text-balance"
        >
          {booking.h2.map((line, i) => (
            <span key={i} className="block">
              <Parts parts={line} />
            </span>
          ))}
        </h2>
        <p ref={sublineRef} data-reveal="up" style={delay(300)} className={`${italicLine} mb-5 max-w-[640px] text-center text-text md:mb-10`}>
          {booking.subline}
        </p>
        <div ref={formRef} data-reveal="up" style={delay(450)} className="w-full">
          <BookingForm />
        </div>
      </div>
    </section>
  )
}
