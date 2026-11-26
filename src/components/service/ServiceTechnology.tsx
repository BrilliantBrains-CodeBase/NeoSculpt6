import { useState } from 'react'
import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { useLoopCarousel } from '../useLoopCarousel'
import { CarouselControls } from '../CarouselControls'
import { delay, h2, italicLine } from '../shared'

// Service section 8: technology and infrastructure, the current site's card carousel (service-page.md §8; not in the
// black template). Drawn with the theme's card look (`alternate`, 20px radius, gold number) and the same loop
// carousel as the About services (useLoopCarousel: clones, drag, autoplay that pauses on hover and focus and is off
// for reduced motion). Text cards only: no approved equipment photos yet, and no prices or shop controls.
// Added for accessibility: previous/next, dots that show the position, a pause toggle, arrow keys and a polite
// announcement (CarouselControls). The row stays inside the 1400px container (three whole cards on desktop, none cut
// at the screen edge); overflow-x: clip keeps it from widening the page.
// Breakpoints are the theme's: base = mobile (<=767, 1 per view), md = tablet (2), xl = desktop (3).

export function ServiceTechnology({ technology }: { technology: ServiceContent['technology'] }) {
  const { cards } = technology
  const count = cards.length
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const sliderRef = useReveal<HTMLDivElement>()
  const [userPaused, setUserPaused] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const carousel = useLoopCarousel({ count, userPaused, align: 'start' })
  const { activeIndex } = carousel

  const show = (target: number) => {
    const i = ((target % count) + count) % count
    carousel.goTo(i)
    setAnnouncement(`Card ${i + 1} of ${count}: ${cards[i].title}`)
  }

  return (
    <section
      id="service-technology"
      aria-labelledby="service-technology-heading"
      className="mb-20 flex flex-col items-center max-md:items-start gap-5 md:mb-[100px] xl:mb-[150px]"
    >
      <h2
        id="service-technology-heading"
        ref={titleRef}
        data-reveal="up"
        className={`${h2} max-w-[1080px] px-5 text-center max-md:text-left text-balance md:px-[30px] xl:px-10`}
      >
        {technology.h2}
      </h2>
      {technology.subline && (
        <p
          ref={sublineRef}
          data-reveal="up"
          style={delay(150)}
          className={`${italicLine} max-w-[900px] px-5 text-center max-md:text-left text-secondary md:px-[30px] xl:px-10`}
        >
          {technology.subline}
        </p>
      )}

      <div
        ref={sliderRef}
        data-reveal="up"
        style={delay(300)}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby="service-technology-heading"
        onKeyDown={carousel.keyProps.onKeyDown}
        {...carousel.focusProps}
        className="mx-auto mt-5 w-full max-w-[1400px] px-5 md:mt-[30px] md:px-[30px] xl:px-10"
      >
        <div
          {...carousel.viewportProps}
          className={`w-full touch-pan-y overflow-x-clip select-none ${carousel.dragging ? 'cursor-grabbing' : ''}`}
        >
          <ul
            id="service-technology-track"
            {...carousel.trackProps}
            className="flex gap-(--gap) [--cols:1] [--gap:20px] [--slide:calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols))] md:[--cols:2] md:[--gap:30px] xl:[--cols:3] xl:[--gap:40px]"
          >
            {[0, 1, 2].flatMap((copy) =>
              cards.map((card, i) => {
                const clone = copy !== 1
                return (
                  <li
                    key={`${copy}-${card.title}`}
                    data-slide={count * copy + i}
                    aria-hidden={clone || undefined}
                    // React 18 has no `inert` prop; the empty string sets the attribute.
                    {...(clone ? { inert: '' } : { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} of ${count}` })}
                    className="shrink-0 basis-(--slide)"
                  >
                    <article className="flex h-full flex-col gap-[15px] rounded-[20px] border border-border bg-alternate p-[30px] md:p-10">
                      <span aria-hidden="true" className="font-heading text-h3 text-tertiary">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-heading text-h5 text-secondary uppercase">{card.title}</h3>
                      <p className="text-small">{card.text}</p>
                    </article>
                  </li>
                )
              }),
            )}
          </ul>
        </div>

        <CarouselControls
          noun="card"
          labels={cards.map((c) => c.title)}
          activeIndex={activeIndex}
          onShow={show}
          controls="service-technology-track"
          announcement={announcement}
          pause={carousel.reducedMotion ? null : { paused: userPaused, toggle: () => setUserPaused((p) => !p) }}
          className="mt-10 px-5 md:mt-[50px]"
        />
      </div>
    </section>
  )
}
