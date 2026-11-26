import { useState } from 'react'
import { services } from '../../data/about'
import { useReveal } from '../useReveal'
import { useLoopCarousel } from '../useLoopCarousel'
import { SmartLink } from '../SmartLink'
import { CarouselControls } from '../CarouselControls'
import { Parts, delay, h2 } from '../shared'

// About section 4: Rejuvita "Our Services" carousel (rejuvita-scrape/pages/about-us; the theme's service cards, the
// same entry template as the home "Popular treatments", HomePopular). One card per speciality hub: the lead-doctor
// label, the hub name and "View Details". No service description is added (about-us.md gives none).
// Rebuilt without Swiper by useLoopCarousel (clones, loop, drag, autoplay that pauses on hover and focus and is off for
// reduced motion). Not in the theme, added for accessibility: previous/next, dots that show the position, a pause
// toggle, arrow keys and a polite announcement (CarouselControls).
// Breakpoints are the theme's: base = mobile (<=767, 1 per view), md = tablet (2), xl = desktop (4).

const { cards } = services
const COUNT = cards.length

export function AboutServices() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const sliderRef = useReveal<HTMLDivElement>()
  const [userPaused, setUserPaused] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const carousel = useLoopCarousel({ count: COUNT, userPaused })
  const { activeIndex } = carousel

  const show = (target: number) => {
    const i = ((target % COUNT) + COUNT) % COUNT
    carousel.goTo(i)
    setAnnouncement(`Speciality ${i + 1} of ${COUNT}: ${cards[i].title}`)
  }

  return (
    <section
      id="our-services"
      aria-labelledby="our-services-heading"
      className="flex flex-col items-center max-md:items-start gap-[60px] px-5 py-20 md:gap-[70px] md:px-0 md:py-[100px] xl:py-[150px]"
    >
      <h2 id="our-services-heading" ref={titleRef} data-reveal="up" className={`${h2} text-center max-md:text-left md:px-[30px] xl:px-10`}>
        <Parts parts={services.h2} />
      </h2>

      <div
        ref={sliderRef}
        data-reveal="up"
        style={delay(150)}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby="our-services-heading"
        onKeyDown={carousel.keyProps.onKeyDown}
        {...carousel.focusProps}
        className="w-full"
      >
        <div
          {...carousel.viewportProps}
          // overflow-x: clip (not hidden) so the browser cannot scroll the row when a card link takes focus.
          className={`w-full touch-pan-y overflow-x-clip select-none ${carousel.dragging ? 'cursor-grabbing' : ''}`}
        >
          <ul
            id="our-services-track"
            {...carousel.trackProps}
            className="flex gap-(--gap) [--cols:1] [--gap:30px] [--slide:calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols))] md:[--cols:2] xl:[--cols:4] xl:[--gap:40px] min-[1601px]:[--gap:80px]"
          >
            {[0, 1, 2].flatMap((copy) =>
              cards.map((card, i) => {
                const clone = copy !== 1
                return (
                  <li
                    key={`${copy}-${card.href}`}
                    data-slide={COUNT * copy + i}
                    aria-hidden={clone || undefined}
                    // React 18 has no `inert` prop; the empty string sets the attribute.
                    {...(clone ? { inert: '' } : { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} of ${COUNT}` })}
                    className="shrink-0 basis-(--slide)"
                  >
                    <ServiceCard card={card} />
                  </li>
                )
              }),
            )}
          </ul>
        </div>

        <CarouselControls
          noun="speciality"
          labels={cards.map((c) => c.title)}
          activeIndex={activeIndex}
          onShow={show}
          controls="our-services-track"
          announcement={announcement}
          pause={carousel.reducedMotion ? null : { paused: userPaused, toggle: () => setUserPaused((p) => !p) }}
          className="mt-10 px-5 md:mt-[50px]"
        />
      </div>
    </section>
  )
}

// The home PopularCard: photo with a 30% black overlay (60% on hover), label and title at the top, outline
// "View Details" at the bottom. The label is plain text here (it names a doctor, not a page).
function ServiceCard({ card }: { card: (typeof cards)[number] }) {
  return (
    <article className="group relative overflow-hidden rounded-[20px] pb-[120%] md:pb-[135%]">
      <img
        src={card.image}
        alt={card.alt}
        width={1024}
        height={1024}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 size-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/60" />

      <div className="absolute top-[30px] left-0 flex w-full flex-col items-start gap-[10px] px-[30px] md:top-10 md:px-10">
        <p className="text-button font-medium text-secondary uppercase">{card.label}</p>
        <h3 className="font-heading text-h4 text-secondary uppercase">
          <SmartLink href={card.href} className="transition-all duration-300 hover:text-primary focus-visible:text-primary">
            {card.title}
          </SmartLink>
        </h3>
      </div>

      <SmartLink
        href={card.href}
        aria-label={`View details: ${card.title}`}
        className="absolute bottom-[30px] left-[30px] rounded-[7px] border border-secondary px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-background focus-visible:border-primary focus-visible:bg-primary focus-visible:text-background md:bottom-10 md:left-10"
      >
        View Details
      </SmartLink>
    </article>
  )
}
