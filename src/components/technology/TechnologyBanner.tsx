import type { RoutePage } from '../../data/types'
import type { TechnologyBanner as Banner } from '../../data/technology/types'
import { useReveal } from '../useReveal'
import { Breadcrumbs } from '../Breadcrumbs'
import { delay, eyebrow } from '../shared'
import { CtaRow } from '../service/CtaButton'

// Technology section 1: the black template's page banner (technology-international-patient.md §1), drawn full bleed:
// the page's photo across the row under a dark overlay (strongest behind the text, so cream copy stays readable on
// any placeholder photo), then breadcrumb, the doc's eyebrow, the page's only H1 (page.h1), the intro and the doc's
// buttons (filled primary, light secondary). As on the About banner, the section first reserves the header's height
// (--header-offset) on the solid background, so the menu never sits on the photo. The photo has its size set and
// loads first; the copy holds the row's height, so nothing shifts when it arrives.
// Service-length H1s ("AI-Integrated Hair Analysis in Bangalore") use the H2 type size, as in ServiceHero.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function TechnologyBanner({ page, hero }: { page: RoutePage; hero: Banner }) {
  const imageRef = useReveal<HTMLDivElement>()
  const crumbsRef = useReveal<HTMLElement>()
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const introRef = useReveal<HTMLParagraphElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  return (
    <section id="technology-banner" aria-labelledby="technology-banner-heading" className="bg-background pt-(--header-offset)">
      <div className="relative isolate mb-20 overflow-hidden bg-alternate md:mb-[100px] xl:mb-[150px]">
        <div ref={imageRef} data-reveal="" className="absolute inset-0 -z-20">
          <img
            src={hero.image.src}
            width={hero.image.width}
            height={hero.image.height}
            alt={hero.image.alt}
            fetchPriority="high"
            decoding="async"
            className="size-full object-cover"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-alternate/80 xl:bg-transparent xl:bg-linear-to-r xl:from-alternate/95 xl:via-alternate/80 xl:to-alternate/30" />

        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start gap-5 px-5 py-20 md:min-h-[560px] md:justify-center md:px-[30px] md:py-[100px] xl:min-h-[680px] xl:px-10 xl:py-[120px]">
          <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="up" style={delay(150)} />
          <p ref={eyebrowRef} data-reveal="up" style={delay(300)} className={`${eyebrow} mt-5 text-tertiary`}>
            {hero.eyebrow}
          </p>
          <h1
            id="technology-banner-heading"
            ref={titleRef}
            data-reveal="up"
            style={delay(450)}
            className="max-w-[820px] font-heading text-h2 text-balance text-secondary uppercase"
          >
            {page.h1}
          </h1>
          <p ref={introRef} data-reveal="up" style={delay(600)} className="max-w-[680px] text-secondary">
            {hero.intro}
          </p>
          <div ref={ctaRef} data-reveal="up" style={delay(750)} className="mt-2.5">
            <CtaRow ctas={hero.ctas} />
          </div>
        </div>
      </div>
    </section>
  )
}
