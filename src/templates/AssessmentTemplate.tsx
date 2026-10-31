import { useState } from 'react'
import type { TemplateProps } from '../components/PageShell'
import { AssessmentWizard } from '../components/assessment/AssessmentWizard'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { SparkleIcon } from '../components/icons'
import { useReveal } from '../components/useReveal'
import { button, delay, h2 } from '../components/shared'
import { intro } from '../data/assessment'

// /hair-assessment/: the free AI hair assessment, rebuilt from the sister site's page of the same name (copy in
// src/data/assessment.ts). The quiet `alternate` banner of the legal and thank-you pages, then one card: the intro
// (three steps and Start), which Start swaps for the step-by-step form (AssessmentWizard), as the sister site swaps in
// its chat. Nothing is sent until the last step. The mobile bar's "AI Analysis" opens this page.

export function AssessmentTemplate({ page }: TemplateProps) {
  const [started, setStarted] = useState(false)
  const eyebrowRef = useReveal<HTMLParagraphElement>()
  const titleRef = useReveal<HTMLHeadingElement>()
  const crumbsRef = useReveal<HTMLElement>()
  const cardRef = useReveal<HTMLDivElement>()

  return (
    <>
      <header className="bg-alternate pt-(--header-offset)">
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-6 px-5 py-[60px] text-center max-md:items-start max-md:text-left md:px-[30px] md:py-20 xl:py-[100px]">
          <p ref={eyebrowRef} data-reveal="up" className="text-h6 font-medium text-tertiary uppercase">
            {intro.eyebrow}
          </p>
          <h1 ref={titleRef} data-reveal="up" style={delay(150)} className="font-heading text-h1 text-balance text-secondary uppercase">
            {page.h1}
          </h1>
          <Breadcrumbs crumbs={page.crumbs} navRef={crumbsRef} reveal="up" style={delay(300)} />
        </div>
      </header>

      <section id="hair-assessment" aria-labelledby="hair-assessment-heading" className="px-5 py-[60px] md:px-[30px] md:py-20 xl:py-[100px]">
        <div ref={cardRef} data-reveal="up" className="mx-auto max-w-[860px] rounded-[20px] border border-border p-6 md:p-10">
          {/* The section heading stays for the outline once the form has replaced the intro. */}
          <h2 id="hair-assessment-heading" className={started ? 'sr-only' : `${h2} text-balance text-center max-md:text-left`}>
            {intro.heading}
          </h2>
          {started ? (
            <AssessmentWizard />
          ) : (
            <div className="mt-6 flex flex-col items-center gap-8 text-center max-md:items-start max-md:text-left">
              <p className="max-w-[60ch] text-secondary">{intro.lede}</p>
              <ol className="grid w-full grid-cols-1 gap-4 text-left md:grid-cols-3">
                {intro.steps.map((s, i) => (
                  <li key={s.title} className={`flex flex-col gap-2 rounded-[12px] border border-border p-5 ${i === 0 ? 'bg-border' : 'bg-alternate'}`}>
                    <span className="flex size-9 items-center justify-center rounded-full bg-background font-heading text-h6 text-tertiary" aria-hidden="true">
                      {i + 1}
                    </span>
                    <h3 className="text-[18px] leading-[1.4] font-medium text-secondary">{s.title}</h3>
                    <p className="text-small">{s.body}</p>
                  </li>
                ))}
              </ol>
              <button type="button" onClick={() => setStarted(true)} className={`${button} inline-flex items-center justify-center gap-2 max-md:w-full`}>
                <SparkleIcon />
                {intro.start}
              </button>
              <p className="text-meta">{intro.note}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
