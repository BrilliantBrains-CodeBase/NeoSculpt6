import { useId, type CSSProperties } from 'react'
import { findTreatment } from '../../data/home'
import { BookingForm } from '../booking/BookingForm'
import { useReveal } from '../useReveal'

// Home section 15: Find My Treatment, built on Rejuvita's newsletter band (rejuvita-scrape/pages/home, container
// aa694c8 with heading e818f2a and text 0f53c12; styles from elementor/css/post-39758.css).
// Full-width photo with a dark overlay and centred copy. The theme's one-field newsletter form is replaced by the
// full appointment form (the shared BookingForm, also used by the "Book a Consultation" popup), so this is the
// home page's one lead form. The theme's small logo icon above the heading is left out (no NeoSculpt6 equivalent).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomeFindTreatment() {
  const headingId = `${useId()}-heading`

  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const formRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="find-my-treatment"
      aria-labelledby={headingId}
      style={{ backgroundImage: `url(${findTreatment.image})` }}
      className="relative isolate bg-alternate bg-cover bg-center bg-no-repeat px-5 py-20 md:px-[30px] md:py-[100px] xl:px-10 xl:py-[150px]"
    >
      {/* Darker than the theme's 30% so the form labels stay readable over the photo. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/55" />

      <div className="mx-auto flex w-full max-w-[860px] flex-col items-center max-md:items-start gap-5 text-center max-md:text-left md:gap-[30px]">
        <h2 id={headingId} ref={titleRef} data-reveal="up" style={delay(300)} className="font-heading text-h2 text-balance text-secondary uppercase">
          {findTreatment.h2.map((line, i) => (
            <span key={i} className="block">
              {line.map((part) => (
                <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                  {part.text}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p
          ref={sublineRef}
          data-reveal="up"
          style={delay(450)}
          className="mb-[30px] font-accent-serif text-[18px] leading-[1.35] text-secondary italic md:text-[20px] xl:text-[22px]"
        >
          {findTreatment.subline}
        </p>

        <div ref={formRef} data-reveal="up" style={delay(600)} className="w-full max-w-[660px] text-left">
          <BookingForm source="home-find-treatment" />
        </div>
      </div>
    </section>
  )
}
