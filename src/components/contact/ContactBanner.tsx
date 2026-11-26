import type { RoutePage } from '../../data/types'
import { actions, banner } from '../../data/contact'
import { clinic } from '../../data/site'
import { useReveal } from '../useReveal'
import { Breadcrumbs } from '../Breadcrumbs'
import { PhoneIcon } from '../icons'
import { Parts, button, delay, italicLine } from '../shared'

// Contact section 1: Rejuvita contacts page-title banner (rejuvita-scrape/pages/contacts: photo filling the left side,
// title box on `alternate` at the right with "Book online" and a call link). Copy: data/contact.ts.
// As on the About banner, the section reserves the header's height (--header-offset) so the menu never sits on the
// photo, the H1 is the page's only H1 (it must match pages.json), and a breadcrumb sits under the subline. Below xl the
// photo sits under the text, full width. "Request a Consultation" jumps to the form further down the page.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ContactBanner({ page }: { page: RoutePage }) {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const sublineRef = useReveal<HTMLParagraphElement>()
  const actionsRef = useReveal<HTMLDivElement>()
  const crumbsRef = useReveal<HTMLElement>()
  const imageRef = useReveal<HTMLDivElement>()

  return (
    <section id="contact-banner" aria-labelledby="contact-banner-heading" className="bg-background pt-(--header-offset)">
      <div className="flex flex-col bg-alternate xl:min-h-[560px] xl:flex-row">
        {/* Title box */}
        <div className="flex flex-col justify-center gap-[30px] px-5 py-[60px] md:px-[30px] md:py-20 xl:w-[45%] xl:shrink-0 xl:px-20 xl:py-[100px]">
          <p ref={eyebrowRef} data-reveal="right" style={delay(150)} className="text-h6 font-medium text-tertiary uppercase">
            {banner.eyebrow}
          </p>
          <h1
            id="contact-banner-heading"
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
          <div ref={actionsRef} data-reveal="right" style={delay(600)} className="flex flex-wrap items-center gap-x-[30px] gap-y-5">
            <a href="#book-consultation" className={button}>
              {actions.book}
            </a>
            <a
              href={clinic.phoneHref}
              className="group inline-flex items-center gap-3 text-small font-medium text-secondary transition-colors duration-300 hover:text-primary focus-visible:text-primary"
            >
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center rounded-full bg-border transition-colors duration-300 group-hover:bg-primary group-hover:text-background group-focus-visible:bg-primary group-focus-visible:text-background"
              >
                <PhoneIcon />
              </span>
              <span>
                Call: <span className="whitespace-nowrap">{clinic.phone}</span>
              </span>
            </a>
          </div>
          <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="right" style={delay(750)} />
        </div>

        {/* Photo: fills the left side on desktop, full width under the text below that. */}
        <div ref={imageRef} data-reveal="" className="relative h-[360px] md:h-[520px] xl:order-first xl:h-auto xl:flex-1">
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
