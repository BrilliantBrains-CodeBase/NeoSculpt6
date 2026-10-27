import { Fragment, type CSSProperties } from 'react'
import { hero } from '../../data/home'
import { useBooking } from '../booking/BookingContext'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { Marquee } from '../Marquee'

// Home section 1: Rejuvita home hero (rejuvita-scrape/pages/home, containers 1e2c282 > 9d3b25b > a57980f / e4b5279
// and marquee 5f2d7fb; styles from elementor/css/post-39758.css). The header sits over it (absolute), so the top
// padding is the theme's, not --header-offset.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop, and 1601+ (wide desktop).
// The H1 is ~15% under the theme's size so our 7-word SEO heading still sits on three lines (homepage.md, fit note).

const button =
  'inline-block rounded-[7px] px-[35px] py-[14px] text-button font-semibold whitespace-nowrap uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background'

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomeHero() {
  const { open: openBooking } = useBooking()
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const secondaryRef = useReveal<HTMLDivElement>()
  const primaryRef = useReveal<HTMLDivElement>()

  return (
    <section
      style={{ backgroundImage: `url(${hero.image})` }}
      className="relative isolate flex min-h-[680px] flex-col justify-end gap-10 overflow-hidden bg-cover bg-[position:70%_top] bg-no-repeat md:min-h-[1024px] xl:min-h-screen xl:justify-between xl:gap-5 xl:bg-center min-[1601px]:gap-0"
    >
      {/* Theme overlay: radial vignette to `alternate`, 80% opacity. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(at_center,#0000_0%,#0b0b0d_100%)] opacity-80" />

      <div className="flex w-full flex-col items-center gap-[30px] px-5 pt-[200px] md:gap-10 md:px-0 md:pt-20 xl:items-end xl:justify-between xl:pt-[235px] xl:pb-[50px] min-[1601px]:min-h-[calc(100vh-65px)] min-[1601px]:pt-[250px] min-[1601px]:pb-[130px]">
        {/* Title box (a57980f) */}
        <div className="mt-[60px] flex w-full flex-col items-center gap-[15px] text-center md:mt-0 md:mb-[120px] md:gap-[30px] md:px-[30px] xl:mb-0 xl:w-[730px] xl:items-start xl:gap-10 xl:self-start xl:pr-0 xl:pl-10 xl:text-left min-[1601px]:w-[calc(5%+700px)] min-[1601px]:pl-[5%]">
          <p ref={eyebrowRef} data-reveal="right" style={delay(150)} className="text-h6 font-medium text-text uppercase">
            {hero.eyebrow}
          </p>
          <h1
            ref={titleRef}
            data-reveal="right"
            style={delay(300)}
            className="font-heading text-[length:calc(var(--fs-h1)*0.85)] leading-[1.1] tracking-[-1px] text-secondary uppercase"
          >
            {hero.h1.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && ' '}
                <span className="block">
                  {line.map((part) => (
                    <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                      {part.text}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </h1>
        </div>

        {/* Sub-line and buttons (e4b5279) */}
        <div className="mt-[60px] flex w-full flex-col items-center gap-[15px] md:mt-0 md:w-[620px] md:gap-[30px] md:px-[30px] xl:w-[600px] xl:items-stretch xl:gap-2.5 xl:self-end xl:pr-10 xl:pl-0 min-[1601px]:w-[700px] min-[1601px]:pr-[5%]">
          <p
            ref={sublineRef}
            data-reveal="left"
            style={delay(450)}
            className="text-center font-accent-serif text-[18px] leading-[1.35] text-secondary italic md:text-[20px] xl:mb-[30px] xl:text-left xl:text-[22px]"
          >
            {hero.subline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-[25px] gap-y-[15px] xl:justify-start min-[1601px]:flex-nowrap">
            <div ref={primaryRef} data-reveal="left" style={delay(750)}>
              <button type="button" onClick={openBooking} className={`${button} bg-accent text-secondary`}>
                {hero.primaryCta}
              </button>
            </div>
            <div ref={secondaryRef} data-reveal="left" style={delay(600)}>
              <SmartLink href={hero.secondaryCta.href} className={`${button} bg-text text-background`}>
                {hero.secondaryCta.label}
              </SmartLink>
            </div>
          </div>
        </div>
      </div>

      {/* Credential ticker (5f2d7fb) */}
      <Marquee
        items={hero.ticker}
        separator="✦"
        className="mb-[30px] [--marquee-gap:80px] [--marquee-item-gap:60px] md:[--marquee-item-gap:80px]"
        itemClassName="font-heading text-h5 text-white/90 uppercase"
        separatorClassName="text-[35px] leading-none text-secondary"
      />
    </section>
  )
}
