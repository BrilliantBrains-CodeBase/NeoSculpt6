import { useId, useRef, useState, type KeyboardEvent } from 'react'
import type { InternationalPatients } from '../../data/technology/types'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { delay, h2 } from '../shared'
import { CtaButton } from '../service/CtaButton'

// International Patients section 4: "One Place. Six Clinical Pathways.", the current site's numbered tabs
// (technology-international-patient.md, International Patients §4). Each tab shows the doc's "01 / 06" and the
// pathway's name; its panel holds the H3, the paragraph, the treatment links (real links, styled as chips) and the
// button. ARIA tabs pattern: tablist / tab / tabpanel, aria-selected and aria-controls, roving tabindex, arrow keys
// (wrapping), Home and End move and select; each panel has a button, so the panel itself is not a tab stop. Every panel is in the prerendered HTML; inactive ones carry `hidden`, the
// active one is never hidden from assistive technology. A pathway without links (Fertility Care, pending a decision)
// shows none: no link is invented. The tabs wrap into a grid (2 per row on mobile, 3 on tablet, 6 on desktop), so the
// row never scrolls sideways.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const chip =
  'inline-block rounded-full border border-border px-4 py-1.5 text-meta text-secondary transition-colors duration-300 outline-offset-4 outline-tertiary hover:border-primary hover:text-primary focus-visible:text-primary focus-visible:outline-2'

export function TechnologyPathways({ pathways }: { pathways: InternationalPatients['pathways'] }) {
  const uid = useId()
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const titleRef = useReveal<HTMLHeadingElement>()
  const tabsRef = useReveal<HTMLDivElement>()
  const last = pathways.tabs.length - 1

  const onKey = (e: KeyboardEvent) => {
    const next = { ArrowRight: active === last ? 0 : active + 1, ArrowLeft: active === 0 ? last : active - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    tabRefs.current[next]?.focus()
    setActive(next)
  }

  return (
    <section
      id="technology-pathways"
      aria-labelledby="technology-pathways-heading"
      className="mx-auto mb-20 flex w-full max-w-[1400px] flex-col items-center gap-10 px-5 md:mb-[100px] md:gap-[60px] md:px-[30px] xl:mb-[150px] xl:px-10"
    >
      <h2 id="technology-pathways-heading" ref={titleRef} data-reveal="up" className={`${h2} text-center text-balance`}>
        {pathways.h2}
      </h2>

      <div ref={tabsRef} data-reveal="up" style={delay(150)} className="flex w-full flex-col gap-[30px]">
        <div
          role="tablist"
          aria-labelledby="technology-pathways-heading"
          onKeyDown={onKey}
          className="grid grid-cols-2 gap-[5px] md:grid-cols-3 xl:grid-cols-6"
        >
          {pathways.tabs.map((tab, i) => (
            <button
              key={tab.tab}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={active === i}
              aria-controls={`${uid}-panel-${i}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`flex flex-col items-start gap-1.5 rounded-[7px] px-5 py-[18px] text-left transition-colors duration-300 outline-offset-2 outline-tertiary hover:bg-primary hover:text-background focus-visible:outline-2 ${
                active === i ? 'bg-primary text-background' : 'bg-alternate text-secondary'
              }`}
            >
              <span className="text-meta font-semibold tracking-[2px]">{tab.tab}</span>{' '}
              <span className="font-heading text-[15px] leading-[1.3] uppercase md:text-[16px]">{tab.h3}</span>
            </button>
          ))}
        </div>

        {pathways.tabs.map((tab, i) => (
          <div
            key={tab.tab}
            id={`${uid}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${i}`}
            hidden={active !== i}
            className="rounded-[20px] bg-alternate px-[30px] py-10 md:px-[50px] md:py-[60px] xl:px-20 xl:py-20"
          >
            <div className="flex max-w-[860px] flex-col items-start gap-5">
              <h3 id={`${uid}-title-${i}`} className="font-heading text-h3 text-secondary uppercase">
                {tab.h3}
              </h3>
              <p>{tab.paragraph}</p>
              {tab.chips.length > 0 && (
                <ul aria-labelledby={`${uid}-title-${i}`} className="flex flex-wrap gap-2.5">
                  {tab.chips.map((link) => (
                    <li key={link.href}>
                      <SmartLink href={link.href} className={chip}>
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2.5">
                <CtaButton cta={tab.cta} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
