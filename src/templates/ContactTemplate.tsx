import type { TemplateProps } from '../components/PageShell'
import { ContactBanner } from '../components/contact/ContactBanner'
import { ContactDetails } from '../components/contact/ContactDetails'
import { ContactVisit } from '../components/contact/ContactVisit'
import { ContactBooking } from '../components/contact/ContactBooking'
import { ContactSteps } from '../components/contact/ContactSteps'
import { ContactRouting } from '../components/contact/ContactRouting'
import { ContactPrivacy } from '../components/contact/ContactPrivacy'
import { InstagramStrip } from '../components/InstagramStrip'

// Contact Us (/contact-us/). Section order and copy: content/contact/prompts/contact-us-page.md, copy in
// src/data/contact.ts; clinic facts from src/data/site.ts. The footer is the site-wide SiteFooter.
// `npm run verify` checks the section order against these ids.
export function ContactTemplate({ page }: TemplateProps) {
  return (
    <>
      <ContactBanner page={page} />
      <ContactDetails />
      <ContactVisit />
      <ContactBooking />
      <ContactSteps />
      <ContactRouting />
      <ContactPrivacy />
      <InstagramStrip />
    </>
  )
}
