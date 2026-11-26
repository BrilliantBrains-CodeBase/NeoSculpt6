import type { CSSProperties } from 'react'
import type { Doctor } from '../../data/doctors'
import { useReveal } from '../useReveal'
import { SmartLink } from '../SmartLink'
import { ArrowRightIcon } from '../icons'
import { DoctorSectionHeader } from './DoctorSectionHeader'

// Doctor profile section 3: areas of expertise, as cards in the home doctor cards' style (`alternate`, radius 20).
// A card links only where the record gives an href, i.e. a page that already shows this doctor (validate-doctors.mjs
// checks it); the whole card is the link's hit area through one stretched link, so nothing interactive is nested.
// Breakpoints are the theme's: base = mobile (<=767, one column), md = tablet (two), xl = desktop (three).

export function DoctorExpertise({ doctor }: { doctor: Doctor }) {
  const listRef = useReveal<HTMLUListElement>()
  if (!doctor.expertise.length) return null

  return (
    <section id="doctor-expertise" aria-labelledby="doctor-expertise-heading" className="mb-20 px-5 md:mb-[100px] md:px-[30px] xl:mb-[150px] xl:px-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-10 md:gap-[60px]">
        <DoctorSectionHeader id="doctor-expertise-heading" label="Clinical Focus" title="Areas of Expertise" />
        <ul ref={listRef} data-reveal-stagger="" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {doctor.expertise.map((item, i) => (
            <li
              key={item.title}
              style={{ '--i': i } as CSSProperties}
              className={`group relative flex flex-col gap-[15px] rounded-[20px] bg-alternate p-[30px] transition duration-300 ${item.href ? 'motion-safe:hover:-translate-y-1' : ''}`}
            >
              {item.image && (
                <img
                  src={item.image.src}
                  width={item.image.width}
                  height={item.image.height}
                  alt={item.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/2] w-full rounded-[14px] object-cover"
                />
              )}
              <h3 className="font-heading text-h5 text-secondary uppercase">
                {item.href ? (
                  <SmartLink
                    href={item.href}
                    className="flex items-start justify-between gap-5 outline-hidden transition-colors duration-300 group-hover:text-primary after:absolute after:inset-0 after:rounded-[20px] after:content-[''] focus-visible:text-primary focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-primary"
                  >
                    {item.title}
                    <ArrowRightIcon className="mt-1 size-3.5 shrink-0 text-tertiary" />
                  </SmartLink>
                ) : (
                  item.title
                )}
              </h3>
              {item.description && <p className="text-small">{item.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
