import type { Doctor } from '../../data/doctors'
import { bookingDoctors } from '../../data/nav'
import { clinic } from '../../data/site'
import { useReveal } from '../useReveal'
import { BookingForm } from '../booking/BookingForm'
import { MapPinIcon, PhoneIcon, WhatsAppIcon } from '../icons'
import { delay, eyebrow } from '../shared'

// Doctor profile section 7: booking and contact. The shared BookingForm (same fields, validation, local dates and
// sending as everywhere; its status line says nothing is booked until the clinic confirms), with this
// doctor pre-selected when they are in the form's list, beside the clinic's phone, WhatsApp and address (site.ts).
// The form asks for contact details and a preferred time only, no medical history or photos.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop (two columns).

const contactLink =
  'text-secondary underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline'

export function DoctorBooking({ doctor }: { doctor: Doctor }) {
  const textRef = useReveal<HTMLDivElement>()
  const formRef = useReveal<HTMLDivElement>()
  const { address } = clinic

  return (
    <section id="doctor-booking" aria-labelledby="doctor-booking-heading" className="mb-20 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 rounded-[20px] bg-alternate px-5 py-[60px] md:px-[60px] md:py-20 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-20 xl:p-20">
        <div ref={textRef} data-reveal="up" className="flex flex-col items-start gap-5">
          <p className={eyebrow}>{doctor.ctas.bookingEyebrow}</p>
          <h2 id="doctor-booking-heading" className="font-heading text-h3 text-balance text-secondary uppercase">
            {doctor.ctas.bookingHeading}
          </h2>
          <ul className="mt-5 flex flex-col gap-[15px]">
            <li className="flex items-center gap-[15px]">
              <PhoneIcon className="size-[18px] shrink-0 text-primary" />
              <a href={clinic.phoneHref} className={contactLink}>
                Call {clinic.phone}
              </a>
            </li>
            <li className="flex items-center gap-[15px]">
              <WhatsAppIcon className="size-[18px] shrink-0 text-primary" />
              <a href={clinic.whatsappHref} target="_blank" rel="noopener noreferrer" className={contactLink}>
                Message us on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li className="flex items-start gap-[15px]">
              <MapPinIcon className="mt-1 size-[18px] shrink-0 text-primary" />
              <span>
                {clinic.name}, {address.streetAddress}, {address.addressLocality} {address.postalCode}.{' '}
                <a href={clinic.mapsHref} target="_blank" rel="noopener noreferrer" className={`${contactLink} underline`}>
                  Get directions<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </span>
            </li>
          </ul>
          <p className="text-small text-text/80">{clinic.hours.label}</p>
        </div>
        <div ref={formRef} data-reveal="up" style={delay(150)} className="min-w-0">
          <BookingForm source={`doctor:${doctor.slug}`} defaultDoctor={bookingDoctors.includes(doctor.displayName) ? doctor.displayName : undefined} />
        </div>
      </div>
    </section>
  )
}
