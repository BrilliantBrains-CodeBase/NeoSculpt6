import type { Doctor } from '../../data/doctors'
import { publicQuote } from '../../data/doctors'
import { useReveal } from '../useReveal'
import { delay } from '../shared'
import { DoctorSectionHeader } from './DoctorSectionHeader'

// Doctor profile section 2: clinical philosophy. Title on the left, the record's paragraphs on the right (stacked on
// tablet and phones), and the doctor's quote under them only once it is approved (the About founder's quote style).
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

export function DoctorPhilosophy({ doctor }: { doctor: Doctor }) {
  const textRef = useReveal<HTMLDivElement>()
  const philosophy = doctor.philosophy
  if (!philosophy) return null
  const quote = publicQuote(doctor)

  return (
    <section id="doctor-philosophy" aria-labelledby="doctor-philosophy-heading" className="mb-20 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-[30px] xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-20">
        <DoctorSectionHeader id="doctor-philosophy-heading" label={philosophy.eyebrow} title={philosophy.heading} align="start" />
        <div ref={textRef} data-reveal="up" style={delay(150)} className="flex max-w-[760px] flex-col gap-5">
          {philosophy.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {quote && (
            <figure className="mt-5 border-l-2 border-tertiary pl-5">
              <blockquote className="font-accent-serif text-[20px] text-secondary italic md:text-[22px]">
                <p>“{quote}”</p>
              </blockquote>
              <figcaption className="mt-2.5 text-meta text-text">— {doctor.displayName}</figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  )
}
