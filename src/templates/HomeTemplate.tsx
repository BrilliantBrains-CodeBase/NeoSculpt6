import { HomeHero } from '../components/home/HomeHero'
import { HomeStats } from '../components/home/HomeStats'
import { HomeAbout } from '../components/home/HomeAbout'
import { HomePopular } from '../components/home/HomePopular'
import { HomePillars } from '../components/home/HomePillars'
import { HomeResults } from '../components/home/HomeResults'
import { HomeSignature } from '../components/home/HomeSignature'
import { HomeDoctors } from '../components/home/HomeDoctors'
import { HomeTestimonials } from '../components/home/HomeTestimonials'
import { HomeTechnology } from '../components/home/HomeTechnology'
import { HomeJournal } from '../components/home/HomeJournal'
import { HomeFindTreatment } from '../components/home/HomeFindTreatment'

// Home page. Content and section order: content/home-page/homepage.md. Sections are added below the hero in the
// doc's order; copy lives in src/data/home.ts. The stats band sits straight under the hero (in the doc its table
// follows the hero's).
export function HomeTemplate() {
  return (
    <>
      <HomeHero />
      <HomeStats />
      <HomeAbout />
      {/* Section A (Dr Sandeep spotlight) goes between About (which also holds section 3) and the pillars. */}
      <HomePillars />
      {/* Section B (concern chips) goes between the pillars and the popular carousel. */}
      <HomePopular />
      <HomeResults />
      {/* Section 7 (stats) sits under the hero. */}
      <HomeSignature />
      <HomeDoctors />
      {/* Section C (journey + promise) goes here. */}
      <HomeTestimonials />
      {/* Section 11 (HomePriceGuide) is hidden for now: no prices are approved yet. To show it again, import it
          from ../components/home/HomePriceGuide and render it here. */}
      {/* Then D (international) and E (FAQs). */}
      {/* Section 12 (HomeBooking, the full appointment form) is left out: the phone-only Find My Treatment strip
          below is the page's one lead form. The full form stays in the "Book a Consultation" popup. */}
      <HomeTechnology />
      <HomeJournal />
      <HomeFindTreatment />
      {/* Section F (visit us / map) goes here, before the footer. */}
    </>
  )
}
