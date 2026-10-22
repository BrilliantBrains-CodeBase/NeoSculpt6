import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { delay, h2 } from '../shared'

// Service section 2: the Rejuvita intro text block above "How it Works" (services__rhinoplasty, container 91d3020;
// post-38160.css): centred H2 and text, 1080px wide, 40px gap, side padding 40/30/20px. The doc's paragraphs keep
// their own boundaries.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceIntro({ intro }: { intro: ServiceContent['intro'] }) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLDivElement>()

  return (
    <section
      id="service-intro"
      aria-labelledby="service-intro-heading"
      className="mx-auto mb-20 flex w-full max-w-[1160px] flex-col items-center gap-10 px-5 text-center md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <h2 id="service-intro-heading" ref={titleRef} data-reveal="up" className={`${h2} text-balance`}>
        {intro.h2}
      </h2>
      <div ref={textRef} data-reveal="up" style={delay(150)} className="flex flex-col gap-5">
        {intro.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  )
}
