import type { RoutePage } from '../../data/types'
import { journalHub } from '../../data/editorial'
import { useReveal } from '../useReveal'
import { Breadcrumbs } from '../Breadcrumbs'
import { delay, italicLine } from '../shared'

// Journal hub section 1: page banner, drawn like the Contact banner (Rejuvita contacts page-title: photo on one side,
// title box on `alternate` on the other). The H1 is the page's only H1 and comes from pages.json (`npm run verify`
// checks it). Breadcrumb Home › Journal sits under the subline. Below xl the photo sits under the text, full width.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function JournalBanner({ page }: { page: RoutePage }) {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const crumbsRef = useReveal<HTMLElement>()
  const imageRef = useReveal<HTMLDivElement>()
  const { eyebrow, subline, image } = journalHub.banner

  return (
    <section id="journal-banner" aria-labelledby="journal-banner-heading" className="bg-background pt-(--header-offset)">
      <div className="flex flex-col bg-alternate xl:min-h-[520px] xl:flex-row">
        <div className="flex flex-col justify-center gap-[30px] px-5 py-[60px] md:px-[30px] md:py-20 xl:w-[50%] xl:shrink-0 xl:px-20 xl:py-[100px]">
          <p ref={eyebrowRef} data-reveal="right" style={delay(150)} className="text-h6 font-medium text-tertiary uppercase">
            {eyebrow}
          </p>
          <h1
            id="journal-banner-heading"
            ref={titleRef}
            data-reveal="right"
            style={delay(300)}
            className="font-heading text-h1 text-secondary uppercase"
          >
            {page.h1}
          </h1>
          <p ref={sublineRef} data-reveal="right" style={delay(450)} className={`${italicLine} max-w-[560px] text-secondary`}>
            {subline}
          </p>
          <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="right" style={delay(600)} />
        </div>

        <div ref={imageRef} data-reveal="" className="relative h-[320px] md:h-[460px] xl:order-first xl:h-auto xl:flex-1">
          <img
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
