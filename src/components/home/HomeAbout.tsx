import type { CSSProperties } from 'react'
import { about } from '../../data/home'
import { useReveal } from '../useReveal'
import { useParallax } from '../useParallax'
import { SmartLink } from '../SmartLink'
import { HomeCredentials } from './HomeCredentials'

// Home section 2: Rejuvita about intro (rejuvita-scrape/pages/home, container 9652eff > f250a0c: image box 7d73bd9
// with inset d9f208c, text column 7d8560e; styles from elementor/css/post-39758.css). Both images have the theme's
// vertical scroll effect (speed 1 and 2, desktop and tablet only), so the inset drifts past the large image.
// In the theme, 9652eff also holds the Credentials strip (862578e, section 3) under this row, with the theme's row gap
// (gap-20 below), so the two share one background.
// Top padding is trimmed from the theme's 150/100/80px because the stats band sits right above on a matching
// background; the two paddings stacked left too large a gap.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomeAbout() {
  const sectionTitleRef = useReveal<HTMLHeadingElement>()
  const imageRef = useReveal<HTMLDivElement>()
  const imageParallaxRef = useParallax<HTMLDivElement>(1)
  const insetRef = useParallax<HTMLDivElement>(2)
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  const buttonRef = useReveal<HTMLDivElement>()

  return (
    <section
      aria-labelledby="about-heading"
      // Same file as the theme's 84-background-1-2.webp.
      style={{ backgroundImage: 'url(/images/home/stats-bg.webp)' }}
      className="relative isolate bg-cover bg-center bg-no-repeat px-5 pt-10 pb-20 md:px-[30px] md:pt-[60px] md:pb-[100px] xl:px-10 xl:pt-20 xl:pb-[130px]"
    >
      {/* Theme overlay: radial vignette to `alternate` from 40%, 80% opacity. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(at_center,#0b0b0d00_0%,#0b0b0d_40%)] opacity-80" />

      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-20">
        {/* Section title, spaced like the pillars' (section 4) title. */}
        <div className="flex flex-col gap-10 md:gap-[60px] xl:gap-20">
          <h2
            id="about-heading"
            ref={sectionTitleRef}
            data-reveal="up"
            className="text-center max-md:text-left font-heading text-h2 text-secondary uppercase"
          >
            {about.h2.map((part) => (
              <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                {part.text}
              </span>
            ))}
          </h2>

          {/* Row (f250a0c): text above the image below desktop. */}
          <div className="flex flex-col-reverse gap-20 md:gap-[70px] xl:flex-row xl:gap-[230px]">
            {/* Image box (7d73bd9) */}
            <div
              ref={imageRef}
              data-reveal
              className="w-[90%] md:mb-[55px] md:w-[580px] xl:mb-[95px] xl:w-[49.65%]"
            >
              <div ref={imageParallaxRef} className="relative h-full min-h-[380px] md:min-h-[685px]">
                <img
                  src={about.image.src}
                  width={about.image.width}
                  height={about.image.height}
                  alt={about.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full rounded-[20px] object-cover"
                />
                {/* Inset image (d9f208c) */}
                <div
                  ref={insetRef}
                  className="absolute right-[-43px] bottom-[-44px] md:right-[-105px] md:bottom-[-75px] xl:right-[-80px] xl:bottom-[-95px]"
                >
                  <img
                    src={about.inset.src}
                    width={about.inset.width}
                    height={about.inset.height}
                    alt={about.inset.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-[120px] rounded-[20px] md:w-[260px]"
                  />
                </div>
              </div>
            </div>

            {/* Text column (7d8560e) */}
            <div className="flex w-full flex-col items-start justify-center gap-[30px] xl:w-[50.35%]">
              <p ref={eyebrowRef} data-reveal="up" style={delay(150)} className="text-h6 font-medium text-text uppercase">
                {about.eyebrow}
              </p>
              <h3
                ref={titleRef}
                data-reveal="up"
                style={delay(300)}
                className="font-heading text-h2 text-secondary uppercase"
              >
                {about.h3.map((part) => (
                  <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                    {part.text}
                  </span>
                ))}
              </h3>
              <p ref={textRef} data-reveal="up" style={delay(300)} className="xl:mb-5">
                {about.text}
              </p>
              <div ref={buttonRef} data-reveal="pop" style={delay(450)}>
                <SmartLink
                  href={about.cta.href}
                  className="inline-block rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
                >
                  {about.cta.label}
                </SmartLink>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials strip (862578e) */}
        <HomeCredentials />
      </div>
    </section>
  )
}
