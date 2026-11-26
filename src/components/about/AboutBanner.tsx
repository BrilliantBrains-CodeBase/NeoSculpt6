import type { RoutePage } from '../../data/types'
import { banner } from '../../data/about'
import { useReveal } from '../useReveal'
import { Breadcrumbs } from '../Breadcrumbs'
import { Parts, delay, italicLine } from '../shared'

// About section 1: Rejuvita page-title banner (rejuvita-scrape/pages/about-us: title box on `alternate` at the left,
// wide photo filling the right side; screenshot-desktop.png / -mobile.png). Copy: about-us.md §1, in data/about.ts.
// Changes from the theme: the H1 holds the page's only H1 (it must match pages.json), and a breadcrumb replaces the
// old "Neo Home > Service" line. As on the theme's inner pages, the header sits on a solid `background` strip and the
// banner starts below it: the header is absolute (laid over the home hero), so this section reserves its height
// (--header-offset) before the banner row, and the menu never sits on the photo. Below xl the photo sits under the
// text, full width, as in the theme's mobile layout.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function AboutBanner({ page }: { page: RoutePage }) {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const crumbsRef = useReveal<HTMLElement>()
  const imageRef = useReveal<HTMLDivElement>()

  return (
    <section id="about-banner" aria-labelledby="about-banner-heading" className="bg-background pt-(--header-offset)">
      <div className="flex flex-col bg-alternate xl:min-h-[640px] xl:flex-row">
        {/* Title box */}
        <div className="flex flex-col justify-center gap-[30px] px-5 py-[60px] md:px-[30px] md:py-20 xl:w-[38%] xl:shrink-0 xl:px-10 xl:py-[100px]">
          <p ref={eyebrowRef} data-reveal="right" style={delay(150)} className="text-h6 font-medium text-tertiary uppercase">
            {banner.eyebrow}
          </p>
          <h1
            id="about-banner-heading"
            ref={titleRef}
            data-reveal="right"
            style={delay(300)}
            className="font-heading text-h1 text-secondary uppercase"
          >
            <Parts parts={banner.h1} />
          </h1>
          <p ref={sublineRef} data-reveal="right" style={delay(450)} className={`${italicLine} max-w-[520px] text-secondary`}>
            {banner.subline}
          </p>
          <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="right" style={delay(600)} />
        </div>

        {/* Photo: fills the right side on desktop, full width under the text below that. */}
        <div ref={imageRef} data-reveal="" className="relative h-[360px] md:h-[560px] xl:h-auto xl:flex-1">
          <img
            src={banner.image.src}
            width={banner.image.width}
            height={banner.image.height}
            alt={banner.image.alt}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
