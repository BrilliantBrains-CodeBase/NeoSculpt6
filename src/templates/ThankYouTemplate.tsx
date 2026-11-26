import { useEffect, useState } from 'react'
import type { TemplateProps } from '../components/PageShell'
import { SmartLink } from '../components/SmartLink'
import { PhoneIcon, WhatsAppIcon } from '../components/icons'
import { button, eyebrow, outlineButton } from '../components/shared'
import { clinic } from '../data/site'
import { readThankYou, type ThankYouState } from '../lib/lead'

// /thank-you/: where BookingForm lands once the backend has the request (src/lib/lead.ts). noindex and out of the
// sitemap (scripts/generate-pages.mjs). The visitor's first name and "confirmation emailed" come from sessionStorage
// after load, so the prerendered page (and anyone opening the URL directly) gets the general wording.
// Same quiet banner as the legal pages: `alternate` band under the header, centred on tablet and desktop.

export function ThankYouTemplate({ page }: TemplateProps) {
  const [thanks, setThanks] = useState<ThankYouState | null>(null)
  useEffect(() => {
    window.scrollTo(0, 0)
    setThanks(readThankYou())
  }, [])

  return (
    <section aria-labelledby="thank-you-heading" className="bg-alternate pt-(--header-offset)">
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 px-5 py-[80px] text-center max-md:items-start max-md:text-left md:px-[30px] md:py-[120px] xl:py-[150px]">
        <p className={eyebrow}>Request received</p>
        <h1 id="thank-you-heading" className="font-heading text-h1 text-balance text-secondary uppercase">
          {page.h1}
          {thanks?.firstName && (
            <>
              , <span className="text-tertiary">{thanks.firstName}</span>
            </>
          )}
        </h1>
        <p className="text-secondary">
          Your consultation request has reached our team. We’ll call or WhatsApp you within working hours (
          {clinic.hours.label}) to confirm your doctor, date and time. Nothing is booked until we do.
        </p>
        {thanks?.emailed && <p>A confirmation is on its way to your inbox. If you can’t see it, please check your spam folder.</p>}
        <p>Need us sooner? Call or message the clinic directly.</p>
        <div className="flex flex-wrap justify-center gap-3 max-md:justify-start">
          <a href={clinic.phoneHref} className={`${button} inline-flex items-center gap-2`}>
            <PhoneIcon />
            Call {clinic.phone}
          </a>
          <SmartLink href={clinic.whatsappHref} className={`${outlineButton} inline-flex items-center gap-2`}>
            <WhatsAppIcon />
            WhatsApp Us<span className="sr-only"> (opens in a new tab)</span>
          </SmartLink>
        </div>
        <SmartLink
          href="/"
          className="text-button font-semibold text-primary uppercase underline-offset-4 transition-colors duration-300 hover:text-secondary hover:underline focus-visible:text-secondary focus-visible:underline"
        >
          Back to home
        </SmartLink>
      </div>
    </section>
  )
}
