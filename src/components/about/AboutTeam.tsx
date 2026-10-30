import { team } from '../../data/about'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { DoctorCarousel, DoctorGrid } from '../home/HomeDoctors'
import { Parts, button, delay, eyebrow, h2 } from '../shared'

// About section 3: Rejuvita "Our Professional Team" (rejuvita-scrape/pages/about-us; the same doctor cards as the home
// "Meet our team", entry template 111). Uses the home DoctorCard and DoctorGrid, so the two pages share one card
// (profile link over the whole card, social icons once their URLs are set, initials until the portraits are in) and
// one layout: every published doctor, up to three centred at the theme's 3-column width, four or more in rows of four.
// The theme's "Meet the team" button becomes "Book a Consultation" (opens the popup).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function AboutTeam() {
  const { open: openBooking } = useBooking()
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const buttonRef = useReveal<HTMLDivElement>()

  return (
    <section id="our-team" aria-labelledby="our-team-heading" className="px-5 py-20 md:px-[30px] md:py-[100px] xl:px-10 xl:py-[150px]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center max-md:items-start gap-5 text-center max-md:text-left">
        <p ref={eyebrowRef} data-reveal="up" className={eyebrow}>
          {team.eyebrow}
        </p>
        <h2 id="our-team-heading" ref={titleRef} data-reveal="up" style={delay(150)} className={`${h2} mb-10 md:mb-[60px]`}>
          <Parts parts={team.h2} />
        </h2>

        {/* Phones: a carousel instead of the stack (DoctorCarousel); the list below is tablet up. */}
        <DoctorCarousel cards={team.cards} id="team-track" labelledBy="our-team-heading" />

        <DoctorGrid cards={team.cards} />

        <div ref={buttonRef} data-reveal="pop">
          <button type="button" onClick={openBooking} className={button}>
            {team.cta}
          </button>
        </div>
      </div>
    </section>
  )
}
