import type { CSSProperties } from 'react'
import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { delay, h2 } from '../shared'

// Service section 2: the Rejuvita intro text block above "How it Works" (services__rhinoplasty, container 91d3020;
// post-38160.css): centred H2 and text, 1080px wide, 40px gap, side padding 40/30/20px. The doc's paragraphs keep
// their own boundaries. Where the doc adds point cards under the text (its "Extra" design block, e.g. the three
// chin-augmentation options), they sit below in one row: open columns under the 1px border line, as in section 4.
// Technology pages use the block twice (introduction, then results and expectations), so `id` is per instance.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceIntro({ intro, id = 'service-intro' }: { intro: ServiceContent['intro']; id?: string }) {
  const titleRef = useReveal<HTMLHeadingElement>()
  const textRef = useReveal<HTMLDivElement>()
  const pointsRef = useReveal<HTMLUListElement>()

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="mx-auto mb-20 flex w-full max-w-[1160px] flex-col items-center max-md:items-start gap-10 px-5 text-center max-md:text-left md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <h2 id={`${id}-heading`} ref={titleRef} data-reveal="up" className={`${h2} text-balance`}>
        {intro.h2}
      </h2>
      <div ref={textRef} data-reveal="up" style={delay(150)} className="flex flex-col gap-5">
        {intro.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {intro.points.length > 0 && (
        <ul
          ref={pointsRef}
          data-reveal-stagger=""
          className="mt-5 grid w-full grid-cols-1 gap-[30px] text-left md:grid-cols-2 xl:grid-cols-3 xl:gap-10"
        >
          {intro.points.map((point, i) => (
            <li key={point.title} style={{ '--i': i } as CSSProperties} className="flex flex-col gap-2.5 border-t border-border pt-[25px]">
              <span aria-hidden="true" className="font-heading text-h5 text-tertiary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-h5 text-secondary uppercase">{point.title}</h3>
              <p className="text-small">{point.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
