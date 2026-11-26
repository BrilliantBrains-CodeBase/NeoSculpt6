import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { delay, h2, italicLine } from '../shared'
import { CtaRow } from './CtaButton'

// Service section 13: the current site's dark CTA band with the clinic reception photo (service-page.md §13), drawn
// like the home Find My Treatment band (HomeFindTreatment): full-width photo under a dark overlay, centred copy.
// Kicker (Arapey italic; technology pages have none), H2, paragraph, the doc's highlight chips where it has them, then its buttons. Without an approved photo the band is plain
// `alternate`. Sits directly above the Instagram row and the footer, with the theme's shorter gap before the row (as
// under its "Quick answers" card); no newsletter form.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceCta({ closing }: { closing: ServiceContent['closing'] }) {
  const kickerRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLParagraphElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="service-cta"
      aria-labelledby="service-cta-heading"
      className="relative isolate mb-[60px] overflow-hidden bg-alternate px-5 py-20 md:mb-20 md:px-[30px] md:py-[100px] xl:mb-[100px] xl:px-10 xl:py-[150px]"
    >
      {closing.image && (
        <>
          <img
            src={closing.image.src}
            width={closing.image.width}
            height={closing.image.height}
            alt={closing.image.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-20 size-full object-cover"
          />
          {/* Dark enough for cream text over a light reception photo. */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/70" />
        </>
      )}

      <div className="mx-auto flex w-full max-w-[860px] flex-col items-center max-md:items-start gap-5 text-center max-md:text-left md:gap-[30px]">
        {closing.kicker && (
          <p ref={kickerRef} data-reveal="up" className={`${italicLine} text-tertiary`}>
            {closing.kicker}
          </p>
        )}
        <h2 id="service-cta-heading" ref={titleRef} data-reveal="up" style={delay(150)} className={`${h2} text-balance`}>
          {closing.h2}
        </h2>
        <p ref={textRef} data-reveal="up" style={delay(300)} className="text-secondary">
          {closing.paragraph}
        </p>
        {closing.chips.length > 0 && (
          <ul aria-label="Highlights" className="flex flex-wrap justify-center max-md:justify-start gap-2.5">
            {closing.chips.map((chip) => (
              <li key={chip} className="rounded-full border border-secondary/30 px-4 py-1.5 text-meta text-secondary">
                {chip}
              </li>
            ))}
          </ul>
        )}
        <div ref={ctaRef} data-reveal="up" style={delay(450)}>
          <CtaRow ctas={closing.ctas} className="justify-center max-md:justify-start" />
        </div>
      </div>
    </section>
  )
}
