import { useState, type CSSProperties, type ReactNode } from 'react'
import { doctors, type DoctorSocial } from '../../data/home'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { useLoopCarousel } from '../useLoopCarousel'
import { CarouselControls } from '../CarouselControls'
import { SmartLink } from '../SmartLink'
import { FacebookIcon, InstagramIcon, LinkedInIcon, YoutubeIcon } from '../icons'

// Home section 9: Rejuvita "Meet our team" (rejuvita-scrape/pages/home, container 4dd6d69: heading f3b9601, advanced
// title dd59887, text 0faef18, doctors grid 1e73df0, button below; styles from elementor/css/post-39758.css). Each
// card is the theme's entry template 111 (container 4928523b; elementor/css/post-111.css).
// Changes from the theme:
// - One card per published doctor (src/data/doctors.json). Up to three sit centred at the theme's 3-column width, so
//   there is no empty column; four or more fill rows of four (DoctorGrid).
// - The theme's hover swaps in a background photo; ours keeps only its shadow change, plus a small lift.
// - One link per card ("Open Profile") stretched over the whole card, so the card is a single tab stop. Social icons
//   sit above it and only show once their URL is set in src/data/home.ts.
// - Portraits fall back to an initials circle until the clinic shoot is in.
// id="our-doctors" is the target of the About button and the footer "Our Doctors" link.
// As in the theme, the section has no top padding: the space above is the bottom margin of section 8.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180, card laid out as a row), xl = desktop.
// On phones the cards are a carousel (DoctorCarousel) instead of a stack.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

const networks: Record<DoctorSocial['network'], { label: string; icon: ReactNode }> = {
  instagram: { label: 'Instagram', icon: <InstagramIcon className="size-[15px]" /> },
  facebook: { label: 'Facebook', icon: <FacebookIcon className="size-[15px]" /> },
  youtube: { label: 'YouTube', icon: <YoutubeIcon className="size-[15px]" /> },
  linkedin: { label: 'LinkedIn', icon: <LinkedInIcon className="size-[15px]" /> },
}

export function HomeDoctors() {
  const { open: openBooking } = useBooking()
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const buttonRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="our-doctors"
      aria-labelledby="doctors-heading"
      className="mb-20 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center max-md:items-start gap-5 text-center max-md:text-left">
        <p ref={eyebrowRef} data-reveal="up" className="text-h6 font-medium text-text uppercase">
          {doctors.eyebrow}
        </p>
        <h2
          id="doctors-heading"
          ref={titleRef}
          data-reveal="up"
          style={delay(150)}
          className="font-heading text-h2 text-secondary uppercase"
        >
          {doctors.h2.map((line, i) => (
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
          style={delay(300)}
          className="mb-10 font-accent-serif text-[18px] leading-[1.35] text-secondary italic md:mb-[60px] md:text-[20px] xl:text-[22px]"
        >
          {doctors.subline}
        </p>

        {/* Phones: a carousel instead of the stack. */}
        <DoctorCarousel cards={doctors.cards} id="doctors-track" labelledBy="doctors-heading" />

        <DoctorGrid cards={doctors.cards} />

        <div ref={buttonRef} data-reveal="pop">
          <button
            type="button"
            onClick={openBooking}
            className="inline-block rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
          >
            {doctors.cta}
          </button>
        </div>
      </div>
    </section>
  )
}

type Card = (typeof doctors.cards)[number]

// Doctors grid (1e73df0), tablet up; also the About team's. Tablet: one card per row. Desktop: up to three cards at the
// theme's 3-column width (40px gap), centred, so two doctors leave no empty column; four or more wrap in rows of
// four. Cards in a row share row heights (subgrid), so a name that wraps doesn't push one portrait lower.
export function DoctorGrid({ cards }: { cards: Card[] }) {
  const columnWidth = cards.length > 3 ? 'calc((100% - 120px) / 4)' : 'calc((100% - 80px) / 3)'
  return (
    <ul
      style={{ '--doctor-col': columnWidth } as CSSProperties}
      className="mb-10 flex w-full flex-col max-md:hidden gap-5 text-left md:mb-[60px] md:gap-[30px] xl:grid xl:grid-cols-[repeat(auto-fit,var(--doctor-col))] xl:justify-center xl:gap-x-10 xl:gap-y-10"
    >
      {cards.map((card, i) => (
        <DoctorCard key={card.href} card={card} index={i % 4} />
      ))}
    </ul>
  )
}

// Phones only (md:hidden): the doctor cards as a looping, auto-playing carousel (useLoopCarousel: swipe, autoplay
// that pauses on focus, the pause toggle and for reduced motion) instead of a stack. One card per view with the next
// one peeking at the right edge. The section's tablet/desktop list is hidden below md (max-md:hidden), so those
// layouts don't change. Also used by the About page's team section (AboutTeam). `id` names the track.
export function DoctorCarousel({ cards, id, labelledBy }: { cards: Card[]; id: string; labelledBy: string }) {
  const count = cards.length
  const ref = useReveal<HTMLDivElement>()
  const [userPaused, setUserPaused] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const carousel = useLoopCarousel({ count, userPaused, align: 'start' })

  const show = (target: number) => {
    const i = ((target % count) + count) % count
    carousel.goTo(i)
    setAnnouncement(`Doctor ${i + 1} of ${count}: ${cards[i].name}`)
  }

  return (
    <div
      ref={ref}
      data-reveal="up"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={labelledBy}
      onKeyDown={carousel.keyProps.onKeyDown}
      {...carousel.focusProps}
      className="mb-10 w-full text-left md:hidden"
    >
      <div
        {...carousel.viewportProps}
        className={`w-full touch-pan-y overflow-x-clip select-none ${carousel.dragging ? 'cursor-grabbing' : ''}`}
      >
        <ul
          id={id}
          {...carousel.trackProps}
          className="flex gap-(--gap) [--gap:15px] [--slide:calc(100%-40px)]"
        >
          {[0, 1, 2].flatMap((copy) =>
            cards.map((card, i) => {
              const clone = copy !== 1
              return (
                <li
                  key={`${copy}-${card.href}`}
                  data-slide={count * copy + i}
                  aria-hidden={clone || undefined}
                  // React 18 has no `inert` prop; the empty string sets the attribute.
                  {...(clone ? { inert: '' } : { role: 'group', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} of ${count}` })}
                  className="shrink-0 basis-(--slide)"
                >
                  <DoctorCardBody card={card} eager />
                </li>
              )
            }),
          )}
        </ul>
      </div>

      <CarouselControls
        noun="doctor"
        labels={cards.map((c) => c.name)}
        activeIndex={carousel.activeIndex}
        onShow={show}
        controls={id}
        announcement={announcement}
        pause={carousel.reducedMotion ? null : { paused: userPaused, toggle: () => setUserPaused((p) => !p) }}
        className="mt-[30px]"
      />
    </div>
  )
}

// Also used by the About page's team section (AboutTeam).
export function DoctorCard({ card, index }: { card: Card; index: number }) {
  const ref = useReveal<HTMLLIElement>()

  return (
    <li ref={ref} data-reveal="up" style={delay(index * 150)} className="xl:row-span-3 xl:grid xl:grid-rows-subgrid xl:gap-y-0">
      <DoctorCardBody card={card} />
    </li>
  )
}

// `eager`: carousel slides load their portrait up front; a lazy image off to the side of the track would still be
// blank when it slides in.
function DoctorCardBody({ card, eager = false }: { card: Card; eager?: boolean }) {
  const social = card.social.filter((s) => s.href)

  return (
      // Card (4928523b). Below md and from xl: name, portrait, footer stacked. On tablet: portrait left, name right,
      // footer underneath.
      <article className="group relative grid h-full grid-cols-1 rounded-[20px] bg-alternate p-[30px] shadow-[0_5px_20px_0_#0000001a] transition duration-300 hover:shadow-[0_5px_20px_0_#00000026] motion-safe:hover:-translate-y-1 md:grid-cols-[260px_1fr] md:gap-x-[70px] md:p-10 xl:row-span-3 xl:grid-cols-1 xl:grid-rows-subgrid xl:gap-x-0 xl:gap-y-0">
        <div className="flex flex-col gap-[3px] md:col-start-2 md:row-start-1 md:self-center xl:col-start-auto xl:row-start-auto">
          <h3 className="font-heading text-h4 text-secondary uppercase transition-colors duration-300 group-hover:text-primary">
            {card.name}
          </h3>
          <p className="text-primary">{card.specialty}</p>
        </div>

        {/* Portrait (6f1b6f75 / 47d0636b): a circle, full width on mobile, 260px on tablet. */}
        <div className="mt-[27px] mb-[30px] md:col-start-1 md:row-start-1 md:my-0 xl:col-start-auto xl:row-start-auto xl:mt-[47px] xl:mb-[50px] xl:px-[30px]">
          {card.portrait ? (
            <img
              src={card.portrait.src}
              width={card.portrait.width}
              height={card.portrait.height}
              alt={card.portrait.alt}
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
              className="aspect-square w-full rounded-full object-cover object-top"
            />
          ) : (
            <div
              aria-hidden="true"
              className="grid aspect-square w-full place-items-center rounded-full bg-border font-heading text-h2 text-tertiary uppercase"
            >
              {card.initials}
            </div>
          )}
        </div>

        {/* Footer row (5a20e069): profile link left, social icons right. */}
        <div className="flex min-h-[60px] items-center justify-between gap-5 border-t border-border pt-[15px] md:col-span-2 md:mt-[50px] xl:col-span-1 xl:mt-0">
          <SmartLink
            href={card.href}
            className="text-button font-semibold text-secondary uppercase outline-hidden transition-colors duration-300 group-hover:text-primary after:absolute after:inset-0 after:rounded-[20px] after:content-[''] hover:text-primary focus-visible:text-primary focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-primary"
          >
            {doctors.profileLabel}
            <span className="sr-only">: {card.name}</span>
          </SmartLink>
          {social.length > 0 && (
            <ul className="relative z-10 flex gap-[5px]">
              {social.map((s) => (
                <li key={s.network}>
                  <SmartLink
                    href={s.href}
                    aria-label={`${card.name} on ${networks[s.network].label} (opens in a new tab)`}
                    className="grid size-[45px] place-items-center rounded-full bg-border text-secondary transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
                  >
                    {networks[s.network].icon}
                  </SmartLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
  )
}
