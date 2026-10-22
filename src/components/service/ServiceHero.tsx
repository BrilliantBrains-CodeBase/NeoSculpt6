import type { RoutePage } from '../../data/types'
import type { ServiceContent } from '../../data/services/types'
import { clinic } from '../../data/site'
import { useReveal } from '../useReveal'
import { Breadcrumbs } from '../Breadcrumbs'
import { PhoneIcon } from '../icons'
import { delay } from '../shared'
import { CtaRow } from './CtaButton'

// Service section 1: the Rejuvita service hero card (rejuvita-scrape/pages/services__rhinoplasty, container 687ffed4;
// styles from elementor/css/post-101.css): a 1480px box, photo 35% at the left (radius 20/0/0/20), the `alternate`
// text panel 65% (padding 20/100px, 20px gap, min-height 720px). Tablet and mobile stack: photo on top (min-height
// 600 / 400px), panel padding 60px / 50px 20px.
// Changes from the theme: the gold category tag becomes the breadcrumb (Home › hub › page, service-page.md §1), and
// the panel adds the doc's buttons and phone strip under the excerpt. The H1 is page.h1 (pages.json), the page's only
// H1; service H1s run to 8–10 words (the theme's is one), so it uses the H2 type size to stay at 3–4 lines.
// The header is absolute, so the section pads its top by --header-offset first.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceHero({ page, hero }: { page: RoutePage; hero: ServiceContent['hero'] }) {
  const imageRef = useReveal<HTMLDivElement>()
  const crumbsRef = useReveal<HTMLElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const introRef = useReveal<HTMLParagraphElement>()
  const ctaRef = useReveal<HTMLDivElement>()
  const phoneRef = useReveal<HTMLParagraphElement>()

  return (
    <section id="service-hero" aria-labelledby="service-hero-heading" className="pt-(--header-offset)">
      <div className="mx-auto mt-10 mb-20 w-full max-w-[1480px] px-5 md:mt-[60px] md:mb-[100px] md:px-[30px] xl:mt-20 xl:mb-[150px] xl:px-10">
        <div className="flex flex-col overflow-hidden rounded-[20px] xl:min-h-[720px] xl:flex-row">
          <div ref={imageRef} data-reveal="" className="relative min-h-[400px] md:min-h-[600px] xl:min-h-0 xl:w-[35%] xl:shrink-0">
            <img
              src={hero.image.src}
              width={hero.image.width}
              height={hero.image.height}
              alt={hero.image.alt}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          <div className="flex flex-col items-start justify-center gap-5 bg-alternate px-5 py-[50px] md:p-[60px] xl:flex-1 xl:px-[100px] xl:py-20">
            <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="up" style={delay(150)} />
            <h1
              id="service-hero-heading"
              ref={titleRef}
              data-reveal="up"
              style={delay(300)}
              className="font-heading text-h2 text-balance text-secondary uppercase"
            >
              {page.h1}
            </h1>
            <p ref={introRef} data-reveal="up" style={delay(450)} className="max-w-[760px]">
              {hero.intro}
            </p>
            <div ref={ctaRef} data-reveal="up" style={delay(600)} className="mt-2.5">
              <CtaRow ctas={hero.ctas} />
            </div>
            <p ref={phoneRef} data-reveal="up" style={delay(750)} className="flex flex-wrap items-center gap-x-2.5 text-meta text-text">
              <PhoneIcon className="size-4 shrink-0 text-primary" />
              {hero.phoneLabel} ·{' '}
              <a
                href={clinic.phoneHref}
                className="text-secondary underline-offset-4 transition-colors duration-300 hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline"
              >
                {clinic.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
