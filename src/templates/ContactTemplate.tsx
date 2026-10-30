import type { TemplateProps } from '../components/PageShell'
import { ContactBanner } from '../components/contact/ContactBanner'
import { ContactBooking } from '../components/contact/ContactBooking'
import { ContactVisit } from '../components/contact/ContactVisit'
import { InstagramStrip } from '../components/InstagramStrip'

// Contact Us (/contact-us/). Copy: content/contact/prompts/contact-us-page.md, in src/data/contact.ts; clinic facts from
// src/data/site.ts. Trimmed from the brief at the user's request so the form is the focus: banner, form with a contact
// card, map, Instagram. The footer is the site-wide SiteFooter. `npm run verify` checks the order against these ids.
export function ContactTemplate({ page }: TemplateProps) {
  return (
    <>
      <ContactBanner page={page} />
      <ContactBooking />
      <ContactVisit />
      <InstagramStrip />
    </>
  )
}
