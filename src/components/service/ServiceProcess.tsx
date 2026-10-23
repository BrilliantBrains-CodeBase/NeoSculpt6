import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { Accordion } from '../Accordion'
import { delay, eyebrow } from '../shared'

// Service section 5: Rejuvita "How it Works" (services__rhinoplasty, container 0dfaad1; post-38160.css): a full-width
// row, min-height 830px, split 50/50. Left: the theme's 84-background-1-2 texture (/images/home/stats-bg.webp) under
// an `alternate` overlay at 80%, with the text 80px in from the sides; right: a photo filling the half.
// Changes from the theme: the doc's eyebrow ("OUR PROCESS") above the H2, and numbered steps; the first step starts
// open (the doc's pattern). Every step's text is in the HTML (Accordion). Below xl the photo sits under the text.
// The heading uses the H3 type size: the doc's 9-word H2 ran to six lines in the half-width column (the theme's is
// "How it Works").
// Technology pages set `id="how-it-works"`, the target of the hero's "Learn How It Works" button.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceProcess({ process, id = 'service-process' }: { process: ServiceContent['process']; id?: string }) {
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const listRef = useReveal<HTMLDivElement>()
  const imageRef = useReveal<HTMLDivElement>()

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="mb-20 flex flex-col md:mb-[100px] xl:mb-[150px] xl:min-h-[830px] xl:flex-row"
    >
      <div
        style={{ backgroundImage: 'url(/images/home/stats-bg.webp)' }}
        className="relative isolate flex flex-col justify-center gap-5 bg-cover bg-center px-5 py-20 md:px-[30px] md:py-[100px] xl:w-1/2 xl:px-20 xl:py-[120px]"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-alternate/80" />
        <p ref={eyebrowRef} data-reveal="up" className={eyebrow}>
          {process.eyebrow}
        </p>
        <h2 id={`${id}-heading`} ref={titleRef} data-reveal="up" style={delay(150)} className="mb-5 font-heading text-h3 text-balance text-secondary uppercase">
          {process.h2}
        </h2>
        <div ref={listRef} data-reveal="up" style={delay(300)} className="border-t border-border">
          <Accordion items={process.steps.map((step, i) => ({ title: `${String(i + 1).padStart(2, '0')}. ${step.title}`, body: step.text }))} />
        </div>
      </div>

      <div ref={imageRef} data-reveal="" className="relative h-[400px] md:h-[600px] xl:h-auto xl:w-1/2">
        <img
          src={process.image.src}
          width={process.image.width}
          height={process.image.height}
          alt={process.image.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </section>
  )
}
