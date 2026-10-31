import type { RoutePage } from '../../data/types'
import type { Cta } from '../../data/services/types'
import { resultsComingSoon as copy } from '../../data/results'
import { useReveal } from '../useReveal'
import { Breadcrumbs } from '../Breadcrumbs'
import { delay, eyebrow } from '../shared'
import { CtaRow } from '../service/CtaButton'

// /results/ until the before/after gallery is built: one full-height banner on the home Results section's background
// (stats-bg.webp under the theme's radial vignette), with breadcrumb, eyebrow, the page's only H1 (page.h1), a gold
// "Coming soon" line, a short note and two buttons (book: the booking popup, as the page has no lead form).
// As on the other page banners, the section first reserves the header's height (--header-offset).
// Centred from tablet up; phones are left-aligned like the rest of the site.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ResultsComingSoon({ page }: { page: RoutePage }) {
  const crumbsRef = useReveal<HTMLElement>()
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const statusRef = useReveal<HTMLParagraphElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="results-coming-soon"
      aria-labelledby="results-coming-soon-heading"
      style={{ backgroundImage: 'url(/images/home/stats-bg.webp)' }}
      className="relative isolate bg-cover bg-center bg-no-repeat pt-(--header-offset)"
    >
      {/* Theme overlay: radial vignette to `alternate` from 40%, 80% opacity. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(at_center,#0b0b0d00_0%,#0b0b0d_40%)] opacity-80" />

      <div className="mx-auto flex min-h-[560px] w-full max-w-[900px] flex-col items-center justify-center gap-5 px-5 py-20 text-center max-md:items-start max-md:text-left md:min-h-[640px] md:px-[30px] md:py-[100px] xl:min-h-[720px] xl:px-10 xl:py-[150px]">
        <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="up" />
        <p ref={eyebrowRef} data-reveal="up" style={delay(150)} className={`${eyebrow} mt-5 text-tertiary`}>
          {copy.eyebrow}
        </p>
        <h1
          id="results-coming-soon-heading"
          ref={titleRef}
          data-reveal="up"
          style={delay(300)}
          className="font-heading text-h2 text-balance text-secondary uppercase"
        >
          {page.h1}
        </h1>
        <p ref={statusRef} data-reveal="up" style={delay(450)} className="font-heading text-h4 text-tertiary uppercase">
          {copy.status}
        </p>
        <p ref={textRef} data-reveal="up" style={delay(600)} className="max-w-[680px]">
          {copy.text}
        </p>
        <div ref={ctaRef} data-reveal="up" style={delay(750)} className="mt-5">
          <CtaRow ctas={copy.ctas as Cta[]} className="md:justify-center" />
        </div>
      </div>
    </section>
  )
}
