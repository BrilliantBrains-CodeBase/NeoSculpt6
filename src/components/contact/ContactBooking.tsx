import type { ReactNode } from 'react'
import { booking } from '../../data/home'
import { actions, bookingEyebrow, privacyNote, sidebarHeading } from '../../data/contact'
import { clinic } from '../../data/site'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { BookingForm } from '../booking/BookingForm'
import { ClinicFacts } from './ClinicFacts'
import { PhoneIcon, WhatsAppIcon } from '../icons'
import { Parts, delay, eyebrow, italicLine } from '../shared'

// Contact section 2, the page's main block: "Schedule your visit online". On desktop the form card (the About booking
// card: `alternate`, eyebrow, the home booking heading and subline from data/home.ts) takes the wide column and a slim
// contact card sits beside it (address, hours, phone, email from site.ts, then Call and WhatsApp). Below xl they stack,
// form first. The form is the shared BookingForm: same fields, validation, WhatsApp hand-off and honest status line as
// everywhere else (nothing is booked until the clinic confirms; no file uploads). The brief's privacy note is one line
// under the form. id="book-consultation" is the target of the banner's "Request a Consultation" button.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const actionLink =
  'flex min-h-[52px] w-full items-center gap-3 rounded-[7px] border border-border px-5 py-3 text-small font-medium text-secondary transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary'

function Action({ href, icon, children }: { href: string; icon: ReactNode; children: ReactNode }) {
  const external = /^https?:/.test(href)
  return (
    <li>
      <SmartLink href={href} className={actionLink}>
        <span aria-hidden="true" className="text-primary">
          {icon}
        </span>
        <span>
          {children}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </span>
      </SmartLink>
    </li>
  )
}

export function ContactBooking() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const formRef = useReveal<HTMLDivElement>()
  const cardRef = useReveal<HTMLElement>()

  return (
    <section
      id="book-consultation"
      aria-labelledby="book-consultation-heading"
      className="mx-auto grid max-w-site grid-cols-1 gap-[30px] px-5 py-20 md:px-[30px] md:py-[100px] xl:grid-cols-[1fr_380px] xl:px-10 xl:py-[120px]"
    >
      {/* Form card */}
      <div className="flex min-w-0 flex-col items-center gap-5 rounded-[20px] bg-alternate px-5 py-[60px] max-md:items-start md:px-[60px] md:py-20 xl:px-[70px]">
        <p ref={eyebrowRef} data-reveal="up" className={`${eyebrow} text-center max-md:text-left`}>
          {bookingEyebrow}
        </p>
        <h2
          id="book-consultation-heading"
          ref={titleRef}
          data-reveal="up"
          style={delay(150)}
          className="text-center font-heading text-h3 text-balance text-secondary uppercase max-md:text-left"
        >
          {booking.h2.map((line, i) => (
            <span key={i} className="block">
              <Parts parts={line} />
            </span>
          ))}
        </h2>
        <p
          ref={sublineRef}
          data-reveal="up"
          style={delay(300)}
          className={`${italicLine} mb-5 max-w-[640px] text-center text-text max-md:text-left md:mb-10`}
        >
          {booking.subline}
        </p>
        <div ref={formRef} data-reveal="up" style={delay(450)} className="w-full">
          <BookingForm />
          <p className="mt-5 border-t border-border pt-5 text-center text-meta text-text/80 max-md:text-left">{privacyNote}</p>
        </div>
      </div>

      {/* Contact card */}
      <aside
        ref={cardRef}
        data-reveal="up"
        style={delay(150)}
        aria-labelledby="contact-card-heading"
        className="flex min-w-0 flex-col gap-[30px] self-start rounded-[20px] border border-border px-5 py-10 md:p-[50px] xl:p-10"
      >
        <h2 id="contact-card-heading" className="font-heading text-h4 text-secondary uppercase">
          {sidebarHeading}
        </h2>
        <ClinicFacts show={['address', 'landmark', 'hours', 'phone', 'email']} columns={1} />
        <ul className="flex flex-col gap-[15px]">
          <Action href={clinic.phoneHref} icon={<PhoneIcon />}>
            {actions.call}
          </Action>
          <Action href={clinic.whatsappHref} icon={<WhatsAppIcon />}>
            {actions.whatsapp}
          </Action>
        </ul>
      </aside>
    </section>
  )
}
