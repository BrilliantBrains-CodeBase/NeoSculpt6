import { team } from '../../data/about'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { DoctorCard } from '../home/HomeDoctors'
import { Parts, button, delay, eyebrow, h2 } from '../shared'

// About section 3: Rejuvita "Our Professional Team" (rejuvita-scrape/pages/about-us; the same doctor cards as the home
// "Meet our team", entry template 111). Uses the home DoctorCard, so the two pages share one card (profile link over
// the whole card, social icons once their URLs are set, initials until the portraits are in). Two cards, centred at
// the theme's 3-column width. The theme's "Meet the team" button becomes "Book a Consultation" (opens the popup).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function AboutTeam() {
  const { open: openBooking } = useBooking()
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const buttonRef = useReveal<HTMLDivElement>()

  return (
    <section id="our-team" aria-labelledby="our-team-heading" className="px-5 py-20 md:px-[30px] md:py-[100px] xl:px-10 xl:py-[150px]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-5 text-center">
        <p ref={eyebrowRef} data-reveal="up" className={eyebrow}>
          {team.eyebrow}
        </p>
        <h2 id="our-team-heading" ref={titleRef} data-reveal="up" style={delay(150)} className={`${h2} mb-10 md:mb-[60px]`}>
          <Parts parts={team.h2} />
        </h2>

        <ul className="mb-10 flex w-full flex-col gap-5 text-left md:mb-[60px] md:gap-[30px] xl:grid xl:auto-cols-[calc((100%-80px)/3)] xl:grid-flow-col xl:grid-rows-[auto_auto_auto] xl:justify-center xl:gap-x-10 xl:gap-y-0">
          {team.cards.map((card, i) => (
            <DoctorCard key={card.href} card={card} index={i} />
          ))}
        </ul>

        <div ref={buttonRef} data-reveal="pop">
          <button type="button" onClick={openBooking} className={button}>
            {team.cta}
          </button>
        </div>
      </div>
    </section>
  )
}
