import type { CSSProperties } from 'react'
import type { Doctor } from '../../data/doctors'
import { useReveal } from '../useReveal'
import { delay } from '../shared'
import { DoctorSectionHeader } from './DoctorSectionHeader'

// Doctor profile section 6: the consultation process, numbered steps in the service "why choose" columns' style
// (gold number, title, text, a 1px rule above). The steps and copy are the record's; the layout is the same for
// every doctor. Four steps sit in one row on desktop, two on tablet, one on phones.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function DoctorProcess({ doctor }: { doctor: Doctor }) {
  const introRef = useReveal<HTMLParagraphElement>()
  const listRef = useReveal<HTMLOListElement>()
  const { process } = doctor

  return (
    <section id="doctor-process" aria-labelledby="doctor-process-heading" className="mb-20 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-5 max-md:items-start">
        <DoctorSectionHeader id="doctor-process-heading" label={process.eyebrow} title={process.heading} />
        {process.intro && (
          <p ref={introRef} data-reveal="up" style={delay(150)} className="max-w-[860px] text-center max-md:text-left">
            {process.intro}
          </p>
        )}
        <ol
          ref={listRef}
          data-reveal-stagger=""
          className="mt-10 grid w-full grid-cols-1 gap-x-10 gap-y-[50px] md:mt-[60px] md:grid-cols-2 md:gap-[60px] xl:grid-cols-4 xl:gap-10"
        >
          {process.steps.map((step, i) => (
            <li key={step.title} style={{ '--i': i } as CSSProperties} className="flex flex-col gap-[15px] border-t border-border pt-[30px]">
              <span aria-hidden="true" className="font-heading text-h4 text-tertiary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-h5 text-secondary uppercase">{step.title}</h3>
              <p className="text-small">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
