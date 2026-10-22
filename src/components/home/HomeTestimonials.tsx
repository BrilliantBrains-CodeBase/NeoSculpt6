import { useState, type CSSProperties, type KeyboardEvent } from 'react'
import { testimonials, type Testimonial } from '../../data/home'
import { useReveal } from '../useReveal'
import { useLoopCarousel } from '../useLoopCarousel'
import { CarouselControls, carouselControl } from '../CarouselControls'
import { StarIcon } from '../icons'

// Home section 10: Rejuvita "The Rejuvita Experience" testimonials (rejuvita-scrape/pages/home, container 8273e3d:
// eyebrow e39ad11, advanced title fbb50dc, sub-line 97346a6, testimonials slider b1ffd89; styles from
// elementor/css/post-39758.css). Copy: content/home-page/homepage.md §10; data and sign-off rules in src/data/home.ts.
// The theme's Swiper settings: carousel, centred slides, infinite loop, 4 / 2 / 1 per view, 60px gap (20px mobile,
// 100px from 1601px), autoplay 5000ms, speed 500ms, pause on hover, bullets 95px (60px tablet/mobile) under the
// slides. Each slide is plain centred text (no card box): stars, quote, author name, treatment.
// Not in the theme, added for accessibility: previous/next buttons, a pause button (autoplay moves text), arrow-key
// support, and a polite announcement after a move the visitor made (CarouselControls).
// The theme's author line shows an age; ours never does. No Review/AggregateRating markup (homepage.md: only once a
// verified rating shows on the page).
// TestimonialsSection is the section itself; the About page uses it too ("What Our Patients Say", about-us.md §5),
// with its own heading and reviews, no eyebrow, and the same rating line; so do the service pages ("Success Stories",
// service-page.md §11), without the Practo line.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
const isApproved = (r: Testimonial) => Boolean(r.quote && r.author && r.consent)

export function HomeTestimonials() {
  return (
    <TestimonialsSection
      id="testimonials"
      eyebrow={testimonials.eyebrow}
      h2={testimonials.h2}
      reviews={testimonials.reviews}
      rating={testimonials.rating}
      practo={testimonials.practo}
    />
  )
}

interface SectionProps {
  /** Section id; the heading and track ids are derived from it. */
  id: string
  eyebrow?: string
  h2: { text: string; gold?: boolean }[]
  reviews: Testimonial[]
  rating: { value: string | null; count: number | null }
  /** Added after the Google line; service pages leave it out (their doc's sub-line is the Google line only). */
  practo?: string
}

export function TestimonialsSection({ id, eyebrow, h2, reviews, rating, practo }: SectionProps) {
  const count = reviews.length
  const headingId = `${id}-heading`
  const trackId = `${id}-track`
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const sliderRef = useReveal<HTMLDivElement>()

  const [userPaused, setUserPaused] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const carousel = useLoopCarousel({ count, userPaused })
  const { activeIndex } = carousel

  // Moves the visitor asked for are announced; autoplay moves are not.
  const show = (target: number) => {
    const i = ((target % count) + count) % count
    carousel.goTo(i)
    setAnnouncement(`Review ${i + 1} of ${count}${reviews[i].treatment ? `: ${reviews[i].treatment}` : ''}`)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    show(activeIndex + (e.key === 'ArrowLeft' ? -1 : 1))
  }

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      // Same file as the theme's 84-background-1-2.webp.
      style={{ backgroundImage: 'url(/images/home/stats-bg.webp)' }}
      className="relative isolate mb-20 flex flex-col items-center gap-[30px] bg-cover bg-center bg-no-repeat px-5 pt-20 pb-[65px] md:mb-[100px] md:px-0 md:pt-[100px] md:pb-[90px] xl:mb-[150px] xl:pt-[150px] xl:pb-[140px]"
    >
      {/* Theme overlay: radial vignette to `alternate` from 40%, 80% opacity. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(at_center,#0b0b0d00_0%,#0b0b0d_40%)] opacity-80" />

      {/* Eyebrow (e39ad11) */}
      {eyebrow && (
        <p ref={eyebrowRef} data-reveal="up" style={delay(150)} className="text-center text-h6 font-medium text-text uppercase">
          {eyebrow}
        </p>
      )}

      {/* Title (fbb50dc) */}
      <h2
        id={headingId}
        ref={titleRef}
        data-reveal="up"
        style={delay(300)}
        className="text-center font-heading text-h2 text-secondary uppercase md:px-[30px] xl:px-10"
      >
        {h2.map((part) => (
          <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
            {part.text}
          </span>
        ))}
      </h2>

      {/* Sub-line (97346a6): Arapey italic 22/20/18px. */}
      <p
        ref={sublineRef}
        data-reveal="up"
        style={delay(450)}
        className="mb-5 text-center font-accent-serif text-[18px] leading-[1.35] text-text italic md:mb-10 md:px-[30px] md:text-[20px] xl:mb-[50px] xl:px-10 xl:text-[22px]"
      >
        Rated <Pending value={rating.value} placeholder="x.x" /> on Google from{' '}
        <Pending value={rating.count?.toLocaleString('en-IN') ?? null} placeholder="nn" /> reviews
        {practo && <> · {practo}</>}
      </p>

      {/* Slider (b1ffd89) and its controls */}
      <div
        ref={sliderRef}
        data-reveal=""
        style={delay(600)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Patient reviews"
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
          <ul
            id={trackId}
            {...carousel.trackProps}
            className="flex gap-(--gap) [--cols:1] [--gap:20px] [--slide:calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols))] md:[--cols:2] md:[--gap:60px] xl:[--cols:4] min-[1601px]:[--gap:100px]"
          >
            {[0, 1, 2].flatMap((copy) =>
              reviews.map((review, i) => {
                const clone = copy !== 1
                return (
                  <li
                    key={`${copy}-${i}`}
                    data-slide={count * copy + i}
                    aria-hidden={clone || undefined}
                    // React 18 has no `inert` prop; the empty string sets the attribute.
                    {...(clone ? { inert: '' } : { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} of ${count}` })}
                    className="shrink-0 basis-(--slide)"
                  >
                    <TestimonialCard review={review} />
                  </li>
                )
              }),
            )}
          </ul>
        </div>

        {/* Controls. The dots sit where the theme's do: 95px (60px tablet/mobile) under the slides. Autoplay is off for
            reduced motion, so the pause toggle is not needed then. */}
        <CarouselControls
          noun="review"
          labels={reviews.map((r) => r.treatment)}
          activeIndex={activeIndex}
          onShow={show}
          controls={trackId}
          announcement={announcement}
          pause={carousel.reducedMotion ? null : { paused: userPaused, toggle: () => setUserPaused((p) => !p) }}
          className="mt-[35px] xl:mt-[70px]"
        />
      </div>
    </section>
  )
}

// One slide: five stars, the quote, then the author and treatment (theme layout "bottom", rating in content).
// Until a review is approved (quote, author and consent all set) it shows a pending notice instead of any text.
function TestimonialCard({ review }: { review: Testimonial }) {
  const approved = isApproved(review)
  return (
    <figure className="flex flex-col items-center gap-[30px] text-center">
      {approved ? (
        <p role="img" aria-label="Rated 5 out of 5" className="flex gap-[5px] text-primary">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} />
          ))}
        </p>
      ) : (
        <p aria-hidden="true" className="flex gap-[5px] text-border">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} />
          ))}
        </p>
      )}

      {approved ? (
        <blockquote className="type-text text-secondary">
          <p>“{review.quote}”</p>
        </blockquote>
      ) : (
        <div className="w-full rounded-[7px] border border-dashed border-tertiary/50 px-5 py-4 text-small text-text">
          <p className="mb-1 text-button font-semibold text-tertiary uppercase">Review pending sign-off</p>
          <p>
            A Google review mentioning {review.lookFor}, to be copied word for word with the patient’s permission.
          </p>
        </div>
      )}

      <figcaption className="flex flex-col items-center">
        <span
          className={`font-accent-serif text-[18px] leading-[1.35] italic md:text-[20px] xl:text-[22px] ${
            approved ? 'text-secondary' : 'text-text/60'
          }`}
        >
          {approved ? review.author : 'Name pending'}
        </span>
        {/* The About page's reviews get their treatment label once the review is chosen. */}
        <span className={`text-small ${review.treatment ? 'text-text' : 'text-text/60'}`}>{review.treatment || 'Treatment pending'}</span>
      </figcaption>
    </figure>
  )
}

// A figure that needs sign-off: shows the real value once set, otherwise a dashed "[placeholder]" chip that says
// it is pending, so it never reads as a fact. Also used for the About page's Instagram handle.
export function Pending({ value, placeholder }: { value: string | null; placeholder: string }) {
  if (value) return <>{value}</>
  return (
    <span
      title="Pending sign-off"
      className="inline-block rounded-[4px] border border-dashed border-tertiary/60 px-1.5 font-body text-[0.75em] leading-[1.6] text-tertiary not-italic"
    >
      [{placeholder}]<span className="sr-only"> (pending sign-off)</span>
    </span>
  )
}
