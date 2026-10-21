import { HomeHero } from '../components/home/HomeHero'
import { HomeStats } from '../components/home/HomeStats'
import { HomeAbout } from '../components/home/HomeAbout'
import { HomePopular } from '../components/home/HomePopular'
import { HomePillars } from '../components/home/HomePillars'
import { HomeResults } from '../components/home/HomeResults'

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
    </>
  )
}
