import type { ReactNode } from 'react'
import { details } from '../../data/contact'
import { clinic } from '../../data/site'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ClinicFacts } from './ClinicFacts'
import { MapPinIcon, PhoneIcon, WhatsAppIcon } from '../icons'
import { Parts, button, delay } from '../shared'

// Contact section 2: clinic details and immediate actions (Rejuvita contacts "Contact information": heading and the
// labelled ADDRESS / OPEN columns on the left; here the right column is an `alternate` action card instead of the
// theme's map, which has its own section below). Facts from site.ts, labels from data/contact.ts.
// The consultation button is the filled one; call, WhatsApp and directions are quieter outlined links so they are easy
// to find without competing with it. No social icons until the profile URLs are confirmed.
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

export function ContactDetails() {
  const textRef = useReveal<HTMLDivElement>()
  const cardRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="contact-details"
      aria-labelledby="contact-details-heading"
      className="mx-auto grid max-w-site grid-cols-1 gap-[50px] px-5 py-20 md:px-[30px] md:py-[100px] xl:grid-cols-[1fr_440px] xl:gap-20 xl:px-10 xl:py-[120px]"
    >
      <div ref={textRef} data-reveal="up" className="flex min-w-0 flex-col gap-[30px]">
        <h2 id="contact-details-heading" className="font-heading text-h2 text-secondary uppercase">
          <Parts parts={details.h2} />
        </h2>
        <div>
          <p className="font-heading text-h5 text-secondary uppercase">{clinic.name}</p>
          <p className="mt-1 text-h6 font-medium text-tertiary uppercase">{clinic.tagline}</p>
        </div>
        <ClinicFacts show={['address', 'landmark', 'hours', 'phone', 'email']} />
      </div>

      <div ref={cardRef} data-reveal="up" style={delay(150)} className="min-w-0 rounded-[20px] bg-alternate px-5 py-10 md:p-[50px] xl:p-10">
        <h3 className="mb-[25px] font-heading text-h4 text-secondary uppercase">{details.actionsHeading}</h3>
        <a href="#book-consultation" className={`${button} w-full`}>
          {details.actions.book}
        </a>
        <ul className="mt-[15px] flex flex-col gap-[15px]">
          <Action href={clinic.phoneHref} icon={<PhoneIcon />}>
            {details.actions.call}: <span className="whitespace-nowrap">{clinic.phone}</span>
          </Action>
          <Action href={clinic.whatsappHref} icon={<WhatsAppIcon />}>
            {details.actions.whatsapp}
          </Action>
          <Action href={clinic.mapsHref} icon={<MapPinIcon />}>
            {details.actions.directions}
            <span className="sr-only"> to {clinic.name} on Google Maps</span>
          </Action>
        </ul>
      </div>
    </section>
  )
}
