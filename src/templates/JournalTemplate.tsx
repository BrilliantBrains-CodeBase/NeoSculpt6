import type { TemplateProps } from '../components/PageShell'
import { JournalBanner } from '../components/journal/JournalBanner'
import { JournalIntro, JournalListing } from '../components/journal/JournalListing'
import { ServiceCta } from '../components/service/ServiceCta'
import { InstagramStrip } from '../components/InstagramStrip'
import { journalHub } from '../data/editorial'

// Journal, Blogs & Media Coverage hub (/journal/). Brief: content/journal/prompts/journal-blogs-media-coverage-page.md.
// Every card comes from src/data/editorial.json through src/data/editorial.ts; adding an item is a data change only.
// Order: banner, editorial statement, filters + featured + grid + "Show more", consultation band, Instagram row (the
// footer is the site-wide SiteFooter). The page has no lead form, so "Book a Consultation" opens the booking popup.
export function JournalTemplate({ page }: TemplateProps) {
  return (
    <>
      <JournalBanner page={page} />
      <JournalIntro />
      <JournalListing />
      <ServiceCta closing={journalHub.closing} />
      <InstagramStrip />
    </>
  )
}
