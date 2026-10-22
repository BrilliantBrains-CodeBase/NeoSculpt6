import type { TemplateProps } from '../components/PageShell'
import { reviews } from '../data/about'
import { AboutBanner } from '../components/about/AboutBanner'
import { AboutStory } from '../components/about/AboutStory'
import { AboutNumbers } from '../components/about/AboutNumbers'
import { AboutMission } from '../components/about/AboutMission'
import { AboutFounder } from '../components/about/AboutFounder'
import { AboutTeam } from '../components/about/AboutTeam'
import { AboutClinicTech } from '../components/about/AboutClinicTech'
import { AboutServices } from '../components/about/AboutServices'
import { TestimonialsSection } from '../components/home/HomeTestimonials'
import { AboutMemberships } from '../components/about/AboutMemberships'
import { AboutFaq } from '../components/about/AboutFaq'
import { AboutBooking } from '../components/about/AboutBooking'
import { InstagramStrip } from '../components/InstagramStrip'

// About page (/about-us/). Content and section order: content/about-us/about-us.md (template sections 1–7 with extras
// A–F in between); copy lives in src/data/about.ts. The footer (section 8) is the site-wide SiteFooter.
// `npm run verify` checks the section order against these ids.
export function AboutTemplate({ page }: TemplateProps) {
  return (
    <>
      <AboutBanner page={page} />
      <AboutStory />
      <AboutNumbers />
      <AboutMission />
      <AboutFounder />
      <AboutTeam />
      <AboutClinicTech />
      <AboutServices />
      <TestimonialsSection
        id="patient-reviews"
        h2={reviews.h2}
        reviews={reviews.items}
        rating={reviews.rating}
        practo={reviews.practo}
      />
      <AboutMemberships />
      <AboutFaq />
      <AboutBooking />
      <InstagramStrip />
    </>
  )
}
