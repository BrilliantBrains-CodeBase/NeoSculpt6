import type { ServiceContent } from '../../data/services/types'
import { useReveal } from '../useReveal'
import { delay } from '../shared'
import { CtaButton } from './CtaButton'

// Service section 10 (10a, 10b, …): the current site's slim CTA strip (service-page.md §10), between cost and success
// stories. Rendered only for the strips the doc has; a page without section 10 gets none. ServiceTemplate sets them
// side by side (two per row from tablet); each is an open column under a gold rule, the black template's plain
// title + text + button, with no box or coloured edge so it reads as content, not a notice.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function ServiceStrip({ strip, index }: { strip: ServiceContent['strips'][number]; index: number }) {
  const ref = useReveal<HTMLDivElement>()
  const id = `service-strip-${index + 1}`

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="flex">
      <div
        ref={ref}
        data-reveal="up"
        style={delay(index * 150)}
        className="flex flex-col items-start gap-5 border-t-2 border-tertiary/60 pt-[30px]"
      >
        <h2 id={`${id}-heading`} className="font-heading text-h4 text-secondary uppercase">
          {strip.heading}
        </h2>
        <p>{strip.text}</p>
        {strip.cta && (
          <div className="mt-auto pt-2.5">
            <CtaButton cta={strip.cta} />
          </div>
        )}
      </div>
    </section>
  )
}
