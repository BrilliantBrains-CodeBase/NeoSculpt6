import { useState, type CSSProperties, type KeyboardEvent } from 'react'
import { testimonials, type Testimonial } from '../../data/home'
import { useReveal } from '../useReveal'
import { useLoopCarousel } from '../useLoopCarousel'
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon, StarIcon } from '../icons'

// Home section 10: Rejuvita "The Rejuvita Experience" testimonials (rejuvita-scrape/pages/home, container 8273e3d:
// eyebrow e39ad11, advanced title fbb50dc, sub-line 97346a6, testimonials slider b1ffd89; styles from
// elementor/css/post-39758.css). Copy: content/home-page/homepage.md §10; data and sign-off rules in src/data/home.ts.
// The theme's Swiper settings: carousel, centred slides, infinite loop, 4 / 2 / 1 per view, 60px gap (20px mobile,
// 100px from 1601px), autoplay 5000ms, speed 500ms, pause on hover, bullets 95px (60px tablet/mobile) under the
// slides. Each slide is plain centred text (no card box): stars, quote, author name, treatment.
// Not in the theme, added for accessibility: previous/next buttons, a pause button (autoplay moves text), arrow-key
// support, and a polite announcement after a move the visitor made. The dots keep the theme's look on a 24px pitch
// so each one is a full-size target.
// The theme's author line shows an age; ours never does. No Review/AggregateRating markup (homepage.md: only once a
// verified rating shows on the page).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const { reviews } = testimonials
const COUNT = reviews.length

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties
const isApproved = (r: Testimonial) => Boolean(r.quote && r.author && r.consent)

export function HomeTestimonials() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const sliderRef = useReveal<HTMLDivElement>()

  const [userPaused, setUserPaused] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const carousel = useLoopCarousel({ count: COUNT, userPaused })
  const { activeIndex } = carousel

  // Moves the visitor asked for are announced; autoplay moves are not.
  const show = (target: number) => {
    const i = ((target % COUNT) + COUNT) % COUNT
    carousel.goTo(i)
    setAnnouncement(`Review ${i + 1} of ${COUNT}: ${reviews[i].treatment}`)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    show(activeIndex + (e.key === 'ArrowLeft' ? -1 : 1))
  }

  const control =
    'outline-offset-4 outline-tertiary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-solid'

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      // Same file as the theme's 84-background-1-2.webp.
      style={{ backgroundImage: 'url(/images/home/stats-bg.webp)' }}
      className="relative isolate mb-20 flex flex-col items-center gap-[30px] bg-cover bg-center bg-no-repeat px-5 pt-20 pb-[65px] md:mb-[100px] md:px-0 md:pt-[100px] md:pb-[90px] xl:mb-[150px] xl:pt-[150px] xl:pb-[140px]"
    >
      {/* Theme overlay: radial vignette to `alternate` from 40%, 80% opacity. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(at_center,#0b0b0d00_0%,#0b0b0d_40%)] opacity-80" />

      {/* Eyebrow (e39ad11) */}
      <p ref={eyebrowRef} data-reveal="up" style={delay(150)} className="text-center text-h6 font-medium text-text uppercase">
        {testimonials.eyebrow}
      </p>

      {/* Title (fbb50dc) */}
      <h2
        id="testimonials-heading"
        ref={titleRef}
        data-reveal="up"
        style={delay(300)}
        className="text-center font-heading text-h2 text-secondary uppercase md:px-[30px] xl:px-10"
      >
        {testimonials.h2.map((part) => (
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
        Rated <Pending value={testimonials.rating.value} placeholder="x.x" /> on Google from{' '}
        <Pending value={testimonials.rating.count?.toLocaleString('en-IN') ?? null} placeholder="nn" /> reviews ·{' '}
        {testimonials.practo}
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
        className={`w-full ${control}`}
      >
        <div
          {...carousel.viewportProps}
          // overflow-x: clip (not hidden) so the row never scrolls the page.
          className={`w-full touch-pan-y overflow-x-clip select-none ${carousel.dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          <ul
            id="testimonials-track"
            {...carousel.trackProps}
            className="flex gap-(--gap) [--cols:1] [--gap:20px] [--slide:calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols))] md:[--cols:2] md:[--gap:60px] xl:[--cols:4] min-[1601px]:[--gap:100px]"
          >
            {[0, 1, 2].flatMap((copy) =>
              reviews.map((review, i) => {
                const clone = copy !== 1
                return (
                  <li
                    key={`${copy}-${review.treatment}`}
                    data-slide={COUNT * copy + i}
                    aria-hidden={clone || undefined}
                    // React 18 has no `inert` prop; the empty string sets the attribute.
                    {...(clone ? { inert: '' } : { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} of ${COUNT}` })}
                    className="shrink-0 basis-(--slide)"
                  >
                    <TestimonialCard review={review} />
                  </li>
                )
              }),
            )}
          </ul>
        </div>

        {/* Controls. The dots sit where the theme's do: 95px (60px tablet/mobile) under the slides. */}
        <div className="mt-[35px] flex items-center justify-center gap-5 xl:mt-[70px]">
          <button
            type="button"
            aria-label="Previous review"
            aria-controls="testimonials-track"
            onClick={() => show(activeIndex - 1)}
            className={`flex size-10 items-center justify-center rounded-full border border-tertiary/40 text-secondary hover:border-tertiary hover:text-tertiary ${control}`}
          >
            <ArrowLeftIcon className="size-3.5 shrink-0" />
          </button>

          <div className="flex items-center">
            {reviews.map((review, i) => (
              <button
                key={review.treatment}
                type="button"
                aria-label={`Show review ${i + 1} of ${COUNT}: ${review.treatment}`}
                aria-current={i === activeIndex ? 'true' : undefined}
                aria-controls="testimonials-track"
                onClick={() => show(i)}
                className={`group flex size-6 items-center justify-center rounded-full ${control}`}
              >
                <span
                  className={`size-[9px] rounded-full border transition-colors duration-250 ${
                    i === activeIndex
                      ? 'border-tertiary bg-tertiary'
                      : 'border-tertiary/40 bg-transparent group-hover:border-tertiary group-hover:bg-tertiary'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next review"
            aria-controls="testimonials-track"
            onClick={() => show(activeIndex + 1)}
            className={`flex size-10 items-center justify-center rounded-full border border-tertiary/40 text-secondary hover:border-tertiary hover:text-tertiary ${control}`}
          >
            <ArrowRightIcon className="size-3.5 shrink-0" />
          </button>

          {/* Autoplay is off for reduced motion, so the toggle is not needed then. */}
          {!carousel.reducedMotion && (
            <button
              type="button"
              aria-label={userPaused ? 'Start automatic review rotation' : 'Stop automatic review rotation'}
              onClick={() => setUserPaused((p) => !p)}
              className={`flex size-10 items-center justify-center rounded-full text-text/80 hover:text-tertiary ${control}`}
            >
              {userPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
          )}
        </div>

        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </p>
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
        <span className="text-small text-text">{review.treatment}</span>
      </figcaption>
    </figure>
  )
}

// A figure that needs sign-off: shows the real value once set, otherwise a dashed "[placeholder]" chip that says
// it is pending, so it never reads as a fact.
function Pending({ value, placeholder }: { value: string | null; placeholder: string }) {
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
