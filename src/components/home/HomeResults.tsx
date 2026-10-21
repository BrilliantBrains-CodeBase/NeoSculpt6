import type { CSSProperties } from 'react'
import { results } from '../../data/home'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { BeforeAfter } from '../BeforeAfter'

// Home section 6: Rejuvita "Our Philosophy" (rejuvita-scrape/pages/home, container eba6704 > row 2d68ba9: text column
// 2fb7877 and before/after slider b74fcc6; styles from elementor/css/post-39758.css). In the theme the stats
// counters (8dcdccf) are this section's bottom row; ours are HomeStats, under the hero, by choice.
// Not in the theme: the disclaimer under the button and the optional caption under the slider (homepage.md §6).
// id="results" is the target of the header and footer "Results" links.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop, plus min-[1601px] for
// the theme's widescreen rules.

const delay = (ms: number) => ({ '--reveal-delay': `${ms}ms` }) as CSSProperties

export function HomeResults() {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  const buttonRef = useReveal<HTMLDivElement>()
  const disclaimerRef = useReveal<HTMLParagraphElement>()
  const sliderRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="results"
      aria-labelledby="results-heading"
      // Same file as the theme's 84-background-1-2.webp.
      style={{ backgroundImage: 'url(/images/home/stats-bg.webp)' }}
      className="relative isolate bg-cover bg-center bg-no-repeat px-5 py-20 md:px-[30px] md:py-[100px] xl:px-10 xl:py-[150px]"
    >
      {/* Theme overlay: radial vignette to `alternate` from 40%, 80% opacity. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(at_center,#0b0b0d00_0%,#0b0b0d_40%)] opacity-80" />

      {/* Row (2d68ba9): two equal columns on desktop, slider under the text below that. */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-[100px] xl:flex-row xl:items-stretch xl:gap-5 min-[1601px]:gap-0">
        {/* Text column (2fb7877) */}
        <div className="flex w-full flex-col items-start justify-center gap-[30px] xl:min-w-0 xl:flex-1 xl:pr-10 min-[1601px]:pr-[10%]">
          <p ref={eyebrowRef} data-reveal="up" className="text-h6 font-medium text-text uppercase">
            {results.eyebrow}
          </p>
          <h2
            id="results-heading"
            ref={titleRef}
            data-reveal="up"
            style={delay(150)}
            className="mb-5 font-heading text-h2 text-secondary uppercase"
          >
            {results.h2.map((line, i) => (
              <span key={i} className="block">
                {line.map((part) => (
                  <span key={part.text} className={part.gold ? 'text-tertiary' : undefined}>
                    {part.text}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <p ref={textRef} data-reveal="up" style={delay(300)} className="mb-5">
            {results.text}
          </p>
          <div ref={buttonRef} data-reveal="pop" style={delay(450)}>
            <SmartLink
              href={results.cta.href}
              className="inline-block rounded-[7px] bg-accent px-[35px] py-[14px] text-button font-semibold whitespace-nowrap text-secondary uppercase transition-colors duration-300 hover:bg-primary hover:text-background focus-visible:bg-primary focus-visible:text-background"
            >
              {results.cta.label}
            </SmartLink>
          </div>
          <p ref={disclaimerRef} data-reveal="up" style={delay(450)} className="text-small text-text/70">
            {results.disclaimer}
          </p>
        </div>

        {/* Before/after slider (b74fcc6): 600px wide below desktop, centred on tablet. */}
        <div ref={sliderRef} data-reveal="up" className="w-full max-w-[600px] xl:min-w-0 xl:max-w-none xl:flex-1">
          <BeforeAfter
            before={results.slider.before}
            after={results.slider.after}
            defaultOffset={results.slider.offset}
          />
          {results.slider.caption && (
            <p className="mt-[15px] text-center text-small text-text/70">{results.slider.caption}</p>
          )}
        </div>
      </div>
    </section>
  )
}
