import { resultsPage as copy } from '../../data/results'
import { useReveal } from '../useReveal'
import { Parts, delay, h2 } from '../shared'

// /results/ section 2: the results philosophy (results-page.md §2). A short centred block on the page background, set
// apart from the banner above and the gallery below by a hairline in the theme's `border` colour.
// Centred from tablet up; phones are left-aligned like the rest of the site.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ResultsIntro() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()

  return (
    <section id="results-intro" aria-labelledby="results-intro-heading" className="px-5 pt-20 md:px-[30px] md:pt-[100px] xl:px-10 xl:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[860px] flex-col items-center gap-5 border-b border-border pb-[50px] text-center max-md:items-start max-md:text-left md:gap-[30px] md:pb-[60px] xl:pb-20">
        <h2 id="results-intro-heading" ref={titleRef} data-reveal="up" className={`${h2} text-balance`}>
          <Parts parts={copy.intro.h2} />
        </h2>
        <p ref={textRef} data-reveal="up" style={delay(150)}>
          {copy.intro.text}
        </p>
      </div>
    </section>
  )
}
