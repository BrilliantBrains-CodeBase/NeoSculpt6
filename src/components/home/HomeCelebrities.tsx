import { useState, type KeyboardEvent } from 'react'
import { celebrities } from '../../data/home'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { useLoopCarousel } from '../useLoopCarousel'
import { CarouselControls, carouselControl } from '../CarouselControls'
import { SmartLink } from '../SmartLink'
import { Parts, button, delay, eyebrow, h2 } from '../shared'

// Home extra: celebrity section (content/home-page/prompts/17-celebrity-section.md), after the ARTAS section. Layout
// after the Neo Follicle reference: one slide at a time, each a large photo card (name and role over a gradient at the
// bottom) with a text card overlapping it on the right, and previous / next arrows under it. The reference's card is
// light blue; ours is the theme's `secondary` cream with `background` text, the site's own light panel tone. On phones
// the text card stacks under the photo.
// The carousel is useLoopCarousel with CarouselControls, wired as HomeTestimonials is: three copies of the track (the
// outer two aria-hidden and inert), --slide / --gap, a polite announcement of moves the visitor made, a pause button,
// and no autoplay for reduced motion.
// These five were treated at the sister clinic Neo Follicle (Neo Group), and the copy says so. No quotes or results
// are attributed to anyone. Copy, photos and the sign-off list are `celebrities` (data/home.ts).
// No top padding: the space above is the ARTAS section's bottom padding.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const people = celebrities.people
const COUNT = people.length
const TRACK_ID = 'celebrities-track'

export function HomeCelebrities() {
  const { open: openBooking } = useBooking()
  const headRef = useReveal<HTMLDivElement>()
  const sliderRef = useReveal<HTMLDivElement>()
  const closingRef = useReveal<HTMLDivElement>()

  const [userPaused, setUserPaused] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const carousel = useLoopCarousel({ count: COUNT, userPaused, autoplay: 7000 })
  const { activeIndex } = carousel

  // Moves the visitor asked for are announced; autoplay moves are not.
  const show = (target: number) => {
    const i = ((target % COUNT) + COUNT) % COUNT
    carousel.goTo(i)
    setAnnouncement(`${i + 1} of ${COUNT}: ${people[i].name}, ${people[i].role}`)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    show(activeIndex + (e.key === 'ArrowLeft' ? -1 : 1))
  }

  return (
    <section
      id={celebrities.id}
      aria-labelledby="celebrities-heading"
      className="px-5 pb-20 md:px-[30px] md:pb-[100px] xl:px-10 xl:pb-[150px]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 max-md:items-start xl:gap-[60px]">
        <div ref={headRef} data-reveal="up" className="flex max-w-[820px] flex-col items-center gap-[25px] text-center max-md:items-start max-md:text-left">
          <p className={eyebrow}>{celebrities.eyebrow}</p>
          <h2 id="celebrities-heading" className={h2}>
            <Parts parts={celebrities.h2} />
          </h2>
          <p>{celebrities.intro}</p>
        </div>

        <div
          ref={sliderRef}
          data-reveal=""
          style={delay(150)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Public figures who chose Neo Group"
          tabIndex={0}
          onKeyDown={onKeyDown}
          {...carousel.focusProps}
          className={`w-full ${carouselControl}`}
        >
          <div
            {...carousel.viewportProps}
            // overflow-x: clip (not hidden) so the row never scrolls the page.
            className={`w-full touch-pan-y overflow-x-clip select-none ${carousel.dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            <ul id={TRACK_ID} {...carousel.trackProps} className="flex gap-(--gap) [--gap:40px] [--slide:100%]">
              {[0, 1, 2].flatMap((copy) =>
                people.map((person, i) => {
                  const clone = copy !== 1
                  return (
                    <li
                      key={`${copy}-${person.name}`}
                      data-slide={COUNT * copy + i}
                      aria-hidden={clone || undefined}
                      // React 18 has no `inert` prop; the empty string sets the attribute.
                      {...(clone ? { inert: '' } : { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} of ${COUNT}` })}
                      className="shrink-0 basis-(--slide)"
                    >
                      <CelebritySlide person={person} />
                    </li>
                  )
                }),
              )}
            </ul>
          </div>

          <CarouselControls
            noun="profile"
            labels={people.map((p) => p.name)}
            activeIndex={activeIndex}
            onShow={show}
            controls={TRACK_ID}
            announcement={announcement}
            pause={carousel.reducedMotion ? null : { paused: userPaused, toggle: () => setUserPaused((p) => !p) }}
            className="mt-[30px] max-md:justify-start xl:mt-10"
          />
        </div>

        <div ref={closingRef} data-reveal="up" className="flex flex-col items-center gap-[25px] text-center max-md:items-start max-md:text-left">
          <p className="font-accent-serif text-[18px] leading-[1.35] text-secondary italic md:text-[20px] xl:text-[22px]">{celebrities.closing}</p>
          <button type="button" onClick={openBooking} className={button}>
            {celebrities.bookingLabel}
            <span aria-hidden="true"> →</span>
          </button>
          <p className="max-w-[760px] text-meta text-text/70">{celebrities.footnote}</p>
        </div>
      </div>
    </section>
  )
}

// One slide: the photo card (name and role over a bottom gradient) and the cream text card. From md the card overlaps
// the photo's right edge, vertically centred; on phones it sits under the photo, overlapping it slightly.
function CelebritySlide({ person }: { person: (typeof people)[number] }) {
  return (
    <article className="relative flex flex-col md:flex-row md:items-center">
      <div className="relative w-full overflow-hidden rounded-[20px] md:w-[62%]">
        <img
          src={person.image.src}
          width={person.image.width}
          height={person.image.height}
          alt={person.image.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block aspect-[13/9] w-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 via-45% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 pb-10 md:p-[30px] xl:p-10">
          <h3 className="font-heading text-h4 text-secondary uppercase">{person.name}</h3>
          <p className="text-button font-semibold text-tertiary uppercase">{person.role}</p>
        </div>
      </div>

      <div className="relative z-10 mx-4 -mt-6 flex flex-col items-start gap-5 rounded-[20px] bg-secondary p-6 text-background shadow-[0_10px_40px_rgba(0,0,0,0.35)] md:mx-0 md:-ml-[8%] md:mt-0 md:w-[46%] md:p-8 xl:p-[50px]">
        <p className="font-accent-serif text-[19px] leading-[1.4] italic md:text-[20px] xl:text-[24px]">{person.text}</p>
        {person.link && (
          <SmartLink
            href={person.link.href}
            className="text-button font-semibold text-accent uppercase underline-offset-4 transition-colors duration-300 hover:underline focus-visible:underline"
          >
            {person.link.label}
            <span aria-hidden="true"> →</span>
          </SmartLink>
        )}
      </div>
    </article>
  )
}
