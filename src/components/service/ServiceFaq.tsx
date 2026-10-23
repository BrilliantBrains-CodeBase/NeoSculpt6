import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { Accordion } from '../Accordion'
import { delay, eyebrow, h2 } from '../shared'
import { CtaButton } from './CtaButton'

// Service section 12: Rejuvita "Quick answers" (services__rhinoplasty, containers 1764da19 > 3632c3e8; post-101.css):
// a centred 980px `alternate` card, 20px radius, padding 100/80px (80/50 tablet, 60/20 mobile), 30px gap: eyebrow,
// title, the toggles, then the red "Make an Appointment" button. The title is the doc's H2 (the theme's is an H3).
// The same questions and answers are the page's FAQPage schema (Seo.tsx); every answer is in the HTML (Accordion).
// The button shows only when the doc gives one (technology pages have none).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceFaq({ faqs }: { faqs: ServiceContent['faqs'] }) {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const listRef = useReveal<HTMLDivElement>()
  const ctaRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="service-faqs"
      aria-labelledby="service-faqs-heading"
      className="mb-20 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <div className="mx-auto flex w-full max-w-[980px] flex-col gap-[30px] rounded-[20px] bg-alternate px-5 py-[60px] md:px-[50px] md:py-20 xl:px-20 xl:py-[100px]">
        <p ref={eyebrowRef} data-reveal="up" className={`${eyebrow} text-center`}>
          {faqs.eyebrow}
        </p>
        <h2 id="service-faqs-heading" ref={titleRef} data-reveal="up" style={delay(150)} className={`${h2} text-center text-balance`}>
          {faqs.h2}
        </h2>
        <div ref={listRef} data-reveal="up" style={delay(300)} className="border-t border-border">
          <Accordion items={faqs.items.map(({ q, a }) => ({ title: q, body: a }))} />
        </div>
        {faqs.cta && (
          <div ref={ctaRef} data-reveal="pop" style={delay(450)} className="mt-[30px] text-center">
            <CtaButton cta={faqs.cta} />
          </div>
        )}
      </div>
    </section>
  )
}
