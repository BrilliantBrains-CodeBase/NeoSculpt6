import { faqs } from '../../data/about'
import { useReveal } from '../useReveal'
import { Accordion } from '../Accordion'
import { Parts, h2 } from '../shared'

// About extra F: FAQs about the clinic (about-us.md §F), an accordion on the dark `alternate` background. The same
// questions and answers are the page's FAQPage schema (src/components/Seo.tsx), so the two never differ.
// The disclosure itself (every answer in the HTML, first item open) is the shared Accordion.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function AboutFaq() {
  const titleRef = useReveal<HTMLHeadingElement>()
  const listRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="clinic-faqs"
      aria-labelledby="clinic-faqs-heading"
      className="bg-alternate px-5 py-20 md:px-[30px] md:py-[100px] xl:px-10 xl:py-[150px]"
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 md:gap-[60px]">
        <h2 id="clinic-faqs-heading" ref={titleRef} data-reveal="up" className={`${h2} text-center max-md:text-left`}>
          <Parts parts={faqs.h2} />
        </h2>

        <div ref={listRef} data-reveal="up" className="border-t border-border">
          <Accordion items={faqs.items.map(({ q, a }) => ({ title: q, body: a }))} />
        </div>
      </div>
    </section>
  )
}
