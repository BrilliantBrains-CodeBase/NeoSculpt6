import { approved, type Doctor } from '../../data/doctors'
import { StatCounter } from '../home/HomeStats'
import { DoctorSectionHeader } from './DoctorSectionHeader'

// Doctor profile section 5: experience figures, approved ones only; with none approved the section is left out (no
// unverified counts, years or outcomes are shown). Uses the home/About counters (StatCounter in a <dl>), which hold
// the final value in the prerendered HTML and only count up without reduced motion. A value the counter can't split
// into number + suffix ("20+", "10k+", "3,000+") is shown as written.
// Breakpoints are the theme's: base = mobile (<=767, two columns), md = tablet (two), xl = desktop (four).

function split(value: string) {
  const m = /^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/.exec(value)
  return m ? { prefix: m[1], value: Number(m[2].replace(/,/g, '')), suffix: m[3] } : null
}

export function DoctorMetrics({ doctor }: { doctor: Doctor }) {
  const metrics = approved(doctor.metrics)
  if (!metrics.length) return null

  return (
    <section id="doctor-metrics" aria-labelledby="doctor-metrics-heading" className="mb-20 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 md:gap-[60px]">
        <DoctorSectionHeader id="doctor-metrics-heading" label="Clinical Experience" title="Experience in Numbers" />
        <dl className="grid grid-cols-2 gap-x-5 gap-y-[35px] md:gap-x-[35px] xl:grid-cols-4 xl:gap-y-[50px]">
          {metrics.map((m, i) => {
            const parts = split(m.value)
            return parts ? (
              <StatCounter key={m.label} {...parts} label={m.label} index={i % 4} className="w-full" />
            ) : (
              <div key={m.label} className="flex flex-col-reverse">
                <dt className="font-heading text-[19px] leading-[2.5] text-secondary max-md:text-[13px]">{m.label}</dt>
                <dd className="font-heading text-h3 text-secondary uppercase">{m.value}</dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
