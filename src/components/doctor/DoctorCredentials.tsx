import type { CSSProperties } from 'react'
import { approved, type Doctor } from '../../data/doctors'
import { useReveal } from '../useReveal'
import { TickIcon } from '../icons'
import { delay } from '../shared'
import { DoctorSectionHeader } from './DoctorSectionHeader'

// Doctor profile section 4: qualifications and recognition, approved items only (pending ones stay in doctors.json
// and are listed by `npm run validate:doctors`). Two lists side by side from tablet: the qualifications checklist in
// the home spotlight's style, and memberships with their logo where the record has one. A list with no approved
// items is left out; the section is left out when both are empty.
// Breakpoints are the theme's: base = mobile (<=767), md = tablet (768-1180), xl = desktop.

const listTitle = 'font-heading text-h5 text-secondary uppercase'

export function DoctorCredentials({ doctor }: { doctor: Doctor }) {
  const qualRef = useReveal<HTMLDivElement>()
  const recRef = useReveal<HTMLDivElement>()
  // The list fades its items in one by one; it needs its own reveal ref, or the items stay hidden.
  const qualListRef = useReveal<HTMLUListElement>()
  const qualifications = approved(doctor.qualifications)
  const recognition = approved(doctor.recognition)
  if (!qualifications.length && !recognition.length) return null

  return (
    <section
      id="doctor-credentials"
      aria-labelledby="doctor-credentials-heading"
      className="bg-alternate px-5 py-20 mb-20 md:mb-[100px] md:px-[30px] md:py-[100px] xl:mb-[150px] xl:px-10 xl:py-[120px]"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 md:gap-[60px]">
        <DoctorSectionHeader id="doctor-credentials-heading" label="Training & Affiliations" title="Qualifications & Recognition" />
        <div className={`grid grid-cols-1 gap-[50px] ${qualifications.length && recognition.length ? 'md:grid-cols-2 md:gap-[60px] xl:gap-20' : 'mx-auto w-full max-w-[760px]'}`}>
          {qualifications.length > 0 && (
            <div ref={qualRef} data-reveal="up" className="flex flex-col gap-[25px] border-t border-border pt-[30px]">
              <h3 id="doctor-qualifications" className={listTitle}>
                Qualifications
              </h3>
              <ul ref={qualListRef} aria-labelledby="doctor-qualifications" data-reveal-stagger="" className="flex flex-col gap-5">
                {qualifications.map((q, i) => (
                  <li key={q.title} style={{ '--i': i } as CSSProperties} className="flex gap-[15px]">
                    <TickIcon className="mt-1 size-4 shrink-0 text-tertiary" />
                    <span>
                      <span className="text-secondary">{q.title}</span>
                      {q.institution && <span className="block text-small text-text/80">{q.institution}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recognition.length > 0 && (
            <div ref={recRef} data-reveal="up" style={delay(150)} className="flex flex-col gap-[25px] border-t border-border pt-[30px]">
              <h3 id="doctor-recognition" className={listTitle}>
                Memberships & Recognition
              </h3>
              <ul aria-labelledby="doctor-recognition" className="flex flex-col gap-5">
                {recognition.map((r) => (
                  <li key={r.organisation} className="flex items-center gap-5">
                    {r.logo ? (
                      // The logos are drawn for the dark theme (as in the home credentials strip): no plate behind them.
                      <span className="flex h-[50px] w-[110px] shrink-0 items-center">
                        <img
                          src={r.logo.src}
                          width={r.logo.width}
                          height={r.logo.height}
                          alt={r.logo.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-auto max-h-full w-auto max-w-full object-contain"
                        />
                      </span>
                    ) : (
                      <TickIcon className="size-4 shrink-0 text-tertiary" />
                    )}
                    <span>
                      <span className="text-secondary">{r.organisation}</span>
                      <span className="block text-small text-text/80">{r.title}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
